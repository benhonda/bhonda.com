import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import { List, ListItem } from "~/components/misc/list";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2026-W02",
  titleText: "SEO, Vectors, and Cookie Carnage",
  previewText: "Shipped SEO infrastructure, migrated to pgvector for unified embeddings, crushed cookie banners with AdGuard filters, and leveled up content discovery across the stack.",
  publishedAt: "2026-01-11",
  week: 2,
  year: 2026,
  status: "published",
  projectTags: ["bhonda-com", "inspiration-index", "agentic-editor", "autoscroll-recorder", "postgresdk"],
} satisfies ShiplogMeta;

export default function Shiplog2026W02() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="bhonda-com" />
      </Text>

      <Text as="p" variant="body">
        Added proper SEO infrastructure with robots.txt and dynamic sitemap generation. The site is now ready for search engine indexing with clean, standards-compliant metadata.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        The pipeline migrated from Pinecone to pgvector, consolidating all vector storage in PostgreSQL.
      </Text>

      <List>
        <ListItem>Dual embedding architecture—one for semantic search, one for visual similarity—dramatically improves frame discovery accuracy</ListItem>
        <ListItem>Frame analysis now uses Gemini with context caching for faster processing</ListItem>
        <ListItem>Enforces minimum 3-frame spacing to capture diverse moments</ListItem>
        <ListItem>Robust retry logic with attempt-based tracking and comprehensive metadata schemas for styling and taxonomy</ListItem>
      </List>

      <Text as="p" variant="body">
        The app migrated search to the new pgvector backend with dual embeddings. Tag components and video preview support added for richer browsing. Expanded container widths and a cleaned-up review workflow UI round it out.
      </Text>

      <List>
        <ListItem>Soft 404 detection in the link scraper</ListItem>
        <ListItem>Client-side redirect detection and language root redirect patterns</ListItem>
        <ListItem>Timeout protection</ListItem>
        <ListItem>URL liveness tracking and rich page metadata fetching</ListItem>
        <ListItem>Expanded page taxonomy for better content classification</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="agentic-editor" />
      </Text>

      <Text as="p" variant="body">
        Added the ability to manually resolve non-Claude comments, fixing a UX gap where human feedback got stuck in the review flow. Squashed multiple activity sidebar and iframe-bridge bugs that were degrading the editing experience.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="autoscroll-recorder" />
      </Text>

      <List>
        <ListItem>Integrated comprehensive cookie banner blocking using AdGuard filters—no more consent popups ruining captures</ListItem>
        <ListItem>Cross-region S3 distribution support for multi-region deployments with improved metadata sanitization</ListItem>
        <ListItem>Batch retry functionality for failed recording jobs makes recovery from transient failures seamless</ListItem>
        <ListItem>Optional AWS region configuration for S3 destinations on the web side</ListItem>
      </List>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="postgresdk" />
      </Text>

      <Text as="p" variant="body">
        Documented the 1000-record pagination limit and shipped v0.15.6 with cleaner auth strategy inference—no more explicit auth fields, it just works from your config.
      </Text>
    </ShiplogLayout>
  );
}
