import type { LoaderFunctionArgs } from "react-router";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import { fetchCommitsForDateRange } from "~/lib/shiplog/github-service.server";
import { synthesizeShiplog } from "~/lib/shiplog/claude-service.server";
import { uploadShiplogToS3 } from "~/lib/shiplog/s3-service.server";
import { getDateRangeFromISOWeek, getISOWeekNumber, getISOWeekYear } from "~/lib/shiplog/date-utils.server";
import { insertShiplogRecord } from "~/lib/shiplog/db-service.server";
import { upsertProjects, linkShiplogToProjects } from "~/lib/shiplog/project-db-service.server";

/**
 * Vercel Cron handler for weekly shiplog generation
 * Triggered every Friday at 2pm ET (6pm UTC)
 *
 * Query params:
 * - week: ISO week number (e.g., ?week=49) - for testing/manual generation
 * - year: ISO year (e.g., ?year=2025) - defaults to current year if not specified
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const startTime = Date.now();
  console.log("[Shiplog Cron] Starting weekly shiplog generation");

  try {
    // 1. Verify Vercel cron authentication (skip in development)
    const isDevelopment = process.env.NODE_ENV === "development";

    if (!isDevelopment) {
      const authHeader = request.headers.get("authorization");
      const expectedAuth = `Bearer ${shiplogEnv.CRON_SECRET}`;

      if (authHeader !== expectedAuth) {
        console.error("[Shiplog Cron] Unauthorized request");
        return new Response("Unauthorized", { status: 401 });
      }

      console.log("[Shiplog Cron] Authentication verified");
    } else {
      console.log("[Shiplog Cron] Running in development mode, skipping auth");
    }

    // 2. Calculate date range and env override
    const url = new URL(request.url);
    const weekParam = url.searchParams.get("week");
    const yearParam = url.searchParams.get("year");
    const envParam = url.searchParams.get("env");

    // Validate env override (development only)
    let envOverride: "staging" | "production" | undefined;
    if (isDevelopment && envParam) {
      if (envParam !== "staging" && envParam !== "production") {
        return new Response(
          JSON.stringify({ success: false, error: "env param must be 'staging' or 'production'" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      envOverride = envParam;
      console.log(`[Shiplog Cron] Environment override: ${envOverride}`);
    }

    let startDate: Date;
    let endDate: Date;
    let isoWeek: number;
    let isoYear: number;

    if (weekParam) {
      // Manual week specification for testing
      const week = parseInt(weekParam, 10);
      const now = new Date();
      const year = yearParam ? parseInt(yearParam, 10) : getISOWeekYear(now);

      const dateRange = getDateRangeFromISOWeek(year, week);
      startDate = dateRange.start;
      endDate = dateRange.end;
      isoWeek = week;
      isoYear = year;

      console.log(`[Shiplog Cron] Manual week mode: ${year}-W${week}`);
    } else {
      // Normal mode: ISO week range (Monday-Sunday)
      const now = new Date();
      isoWeek = getISOWeekNumber(now);
      isoYear = getISOWeekYear(now);

      const dateRange = getDateRangeFromISOWeek(isoYear, isoWeek);
      startDate = dateRange.start; // Monday
      endDate = dateRange.end; // Sunday

      console.log("[Shiplog Cron] Auto mode: ISO week range (Monday-Sunday)");
    }

    console.log(
      `[Shiplog Cron] Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`
    );

    // 3. Fetch commits from GitHub
    const authorEmail = "bhonda89@gmail.com";
    const repoCommits = await fetchCommitsForDateRange(authorEmail, startDate, endDate);

    if (repoCommits.length === 0) {
      console.log("[Shiplog Cron] No commits found for date range");
      return new Response(
        JSON.stringify({
          success: true,
          message: "No commits found for the specified date range",
          week: `${isoYear}-W${isoWeek}`,
          repos: 0,
          commits: 0,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 4. Synthesize shiplog with Claude
    const { content: shiplogContent, metadata: synthesisMetadata } = await synthesizeShiplog({
      repoCommits,
      startDate,
      endDate,
    });

    // 5. Upload to S3
    const { publicKeyRelative, internalKeyRelative } = await uploadShiplogToS3({
      shiplogContent,
      synthesisMetadata,
      repoCommits,
      executionDate: endDate,
      isoWeek,
      isoYear,
      envOverride,
    });

    // 6. Insert database record
    const totalCommits = repoCommits.reduce((sum, r) => sum + r.commits.length, 0);
    const { id: shiplogId } = await insertShiplogRecord({
      slug: `${isoYear}-W${isoWeek.toString().padStart(2, "0")}`,
      titleText: shiplogContent.titleText,
      previewText: shiplogContent.previewText,
      introText: shiplogContent.introText,
      publishedAt: endDate.toISOString().split("T")[0],
      week: isoWeek,
      year: isoYear,
      s3PublicKeyRelative: publicKeyRelative,
      s3InternalKeyRelative: internalKeyRelative,
      statsRepos: repoCommits.length,
      statsCommits: totalCommits,
    });

    // 7. Upsert projects and link to shiplog
    const upsertedProjects = await upsertProjects(repoCommits.map((r) => r.repo));
    await linkShiplogToProjects(shiplogId, upsertedProjects.map((p) => p.id));

    // 8. Calculate summary stats
    const duration = Date.now() - startTime;

    console.log(`[Shiplog Cron] Successfully completed in ${duration}ms`);

    // 8. Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Weekly shiplog generated successfully",
        stats: {
          repos: repoCommits.length,
          commits: totalCommits,
          duration: `${duration}ms`,
        },
        s3Keys: {
          public: publicKeyRelative,
          internal: internalKeyRelative,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Shiplog Cron] Failed after ${duration}ms:`, error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: `${duration}ms`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
