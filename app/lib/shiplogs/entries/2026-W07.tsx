import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
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

      <List>
        <ListItem>Full migration to React Router 7 with comprehensive type-safety improvements</ListItem>
        <ListItem>Analytics reporting system overhauled: password-protected reports, outcomes-first template, v2/v3 report generation with enhanced SQL and comparison support</ListItem>
        <ListItem>Dark mode overhaul with custom typography, cleaner theme system, and consistent component styling</ListItem>
        <ListItem>CDN paths centralized, dashboard restructured, server-side bundling issues resolved</ListItem>
        <ListItem>Node.js upgraded to v24 LTS; environment variables split into service-specific modules</ListItem>
      </List>

      <List>
        <ListItem>IP enrichment caching dramatically improved throughput—batch sizes increased to leverage the cache</ListItem>
        <ListItem>Batch size tuned for cold cache scenarios to prevent overload on startup</ListItem>
        <ListItem>Database push safety script made interactive; team enrichment made idempotent</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <List>
        <ListItem>Four new link sources added (including a design-focused source), with advisory-locked parallel discovery and dry-run testing</ListItem>
        <ListItem>Round-robin source selection replaced time-based sorting with Fisher-Yates shuffling for more uniform distribution</ListItem>
        <ListItem>Domain-based rate limiting with run locks and temporary-down propagation</ListItem>
        <ListItem>Tristate URL liveness tracking with improved dead/temporary detection</ListItem>
        <ListItem>Per-device recorder submission system with a dedicated tracking table; recorder now skips fully-submitted websites</ListItem>
      </List>

      <List>
        <ListItem>Gemini 2.5 Flash Lite adopted for frame analysis—faster and more cost-efficient</ListItem>
        <ListItem>Transient 503 errors from the Google Files API now handled gracefully with retries</ListItem>
        <ListItem>Video quality validation added before MediaConvert processing</ListItem>
        <ListItem>Timeout protection and retry logic added to the video frame analysis step</ListItem>
        <ListItem>Debug URLs surfaced in error handling and Step Functions state for easier debugging</ListItem>
        <ListItem>Technology filtering added to the Discover view for browsing by tech stack</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <List>
        <ListItem>Broken page detection—recordings now abort immediately when a broken page is detected</ListItem>
        <ListItem>Mobile experience improved with device-aware scroll distance</ListItem>
        <ListItem>GPU task failover enabled across multiple availability zones for better resilience</ListItem>
        <ListItem>Service token race conditions fixed</ListItem>
        <ListItem>Lambda runtime upgraded to Node.js 24</ListItem>
        <ListItem>Cost estimation tooling added and bot detection improved</ListItem>
      </List>

      <List>
        <ListItem>Batch job cancellation for active jobs—a major workflow improvement for admins</ListItem>
        <ListItem>CloudWatch logs access added for admin users, visible even without a task ARN</ListItem>
        <ListItem>Job status polling now updates all job fields, not just distributions</ListItem>
        <ListItem>Admin debugging tools relocated to the job details section for a cleaner UX</ListItem>
      </List>
    </ShiplogLayout>
  );
}
