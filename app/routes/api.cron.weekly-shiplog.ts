import type { LoaderFunctionArgs } from "react-router";
import { shiplogEnv } from "~/lib/env/shiplog-env.server";
import { fetchCommitsForDateRange } from "~/lib/shiplog/github-service.server";
import { synthesizeShiplog } from "~/lib/shiplog/claude-service.server";
import { uploadShiplogToS3 } from "~/lib/shiplog/s3-service.server";
import { getDateRangeFromISOWeek, getISOWeekNumber, getISOWeekYear } from "~/lib/shiplog/date-utils.server";

/**
 * Vercel Cron handler for weekly shiplog generation
 * Triggered every Friday at 2pm ET (6pm UTC)
 *
 * Query params:
 * - week: ISO week number (e.g., ?week=49) - for testing/manual generation
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

    // 2. Calculate date range
    const url = new URL(request.url);
    const weekParam = url.searchParams.get("week");

    let startDate: Date;
    let endDate: Date;
    let isoWeek: number;
    let isoYear: number;

    if (weekParam) {
      // Manual week specification for testing
      const week = parseInt(weekParam, 10);
      const now = new Date();
      const year = getISOWeekYear(now);

      const dateRange = getDateRangeFromISOWeek(year, week);
      startDate = dateRange.start;
      endDate = dateRange.end;
      isoWeek = week;
      isoYear = year;

      console.log(`[Shiplog Cron] Manual week mode: ${year}-W${week}`);
    } else {
      // Normal mode: past 7 days
      endDate = new Date();
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 7);
      isoWeek = getISOWeekNumber(endDate);
      isoYear = getISOWeekYear(endDate);

      console.log("[Shiplog Cron] Auto mode: past 7 days");
    }

    console.log(
      `[Shiplog Cron] Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`
    );
    console.log(`[Shiplog Cron] ISO week: ${isoYear}-W${isoWeek}`);

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
    const shiplogContent = await synthesizeShiplog(repoCommits, startDate, endDate);

    // 5. Upload to S3
    const { publicKey, internalKey } = await uploadShiplogToS3(shiplogContent, repoCommits, endDate, isoWeek, isoYear);

    // 6. Calculate summary stats
    const totalCommits = repoCommits.reduce((sum, r) => sum + r.commits.length, 0);
    const duration = Date.now() - startTime;

    console.log(`[Shiplog Cron] Successfully completed in ${duration}ms`);
    console.log(`[Shiplog Cron] Total repos: ${repoCommits.length}`);
    console.log(`[Shiplog Cron] Total commits: ${totalCommits}`);

    // 7. Return success response
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
          public: publicKey,
          internal: internalKey,
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
