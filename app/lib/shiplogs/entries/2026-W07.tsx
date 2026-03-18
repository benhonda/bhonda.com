import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W07",
  titleText: "Analytics Overhaul, Smarter Crawling, and a Big Migration Week",
  previewText: "A massive week across the stack: a full React Router 7 migration, a redesigned analytics reporting system, smarter link discovery, and a wave of recorder reliability improvements.",
  publishedAt: "2026-02-15",
  week: 7,
  year: 2026,
  status: "published",
  projectTags: ["silo-cdp", "inspiration-index", "autoscroll-recorder"],
} satisfies ShiplogMeta;

export default function Shiplog2026W07() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="silo-cdp" />
      </Text>

      <Text as="p" variant="body">
        The biggest change this week was a full migration to React Router 7 with comprehensive type-safety improvements—a significant architectural upgrade that modernizes the foundation of the platform. The analytics reporting system got a major overhaul with new password-protected analytics reports using an outcomes-first template, v2 and v3 report generation with enhanced SQL, comparison support, and improved data collection, plus several new analytics report configurations. Dark mode got a proper overhaul with custom typography, a cleaner theme system, and consistent component styling. CDN paths centralized, dashboard restructured, server-side bundling issues resolved, Node.js upgraded to v24 LTS, and environment variables split into service-specific modules.
      </Text>

      <Text as="p" variant="body">
        IP enrichment caching dramatically improved throughput—batch sizes increased to leverage the cache. Batch size was tuned for cold cache scenarios to prevent overload on startup. Database push safety script made interactive and team enrichment made idempotent.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Four new link sources added (including a design-focused source), with advisory-locked parallel discovery and dry-run testing. Round-robin source selection replaced time-based sorting with Fisher-Yates shuffling for more uniform distribution. Domain-based rate limiting implemented with run locks and temporary-down propagation. Tristate URL liveness tracking added with improved dead/temporary detection. Per-device recorder submission system introduced with a dedicated tracking table, and the recorder now skips fully-submitted websites to avoid redundant work.
      </Text>

      <Text as="p" variant="body">
        Gemini 2.5 Flash Lite adopted for frame analysis—faster and more cost-efficient. Transient 503 errors from the Google Files API now handled gracefully with retries. Video quality validation added before MediaConvert processing. Timeout protection and retry logic added to the video frame analysis step. Debug URLs surfaced in error handling and Step Functions state for easier debugging. Technology filtering added to the Discover view for browsing by tech stack.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <Text as="p" variant="body">
        Broken page detection added—recordings now abort immediately when a broken page is detected rather than completing a bad job. Mobile experience improved with device-aware scroll distance. GPU task failover enabled across multiple availability zones for better resilience. Service token race conditions fixed. Lambda runtime upgraded to Node.js 24. Cost estimation tooling added and bot detection improved.
      </Text>

      <Text as="p" variant="body">
        Batch job cancellation added for active jobs—a major workflow improvement for admins. CloudWatch logs access added for admin users, with the button now visible even without a task ARN. Job status polling now updates all job fields, not just distributions. Admin debugging tools relocated to the job details section for a cleaner UX.
      </Text>
    </ShiplogLayout>
  );
}
