import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W25",
  titleText: "Search, Screenshots, and Smart Prompts: Building the Inspiration Index",
  previewText: "A week of rapid iteration on the Inspiration Index: authentication, smart search, screenshot processing workflows, and AI-powered content descriptions powered by Gemini.",
  publishedAt: "2025-06-22",
  week: 25,
  year: 2025,
  status: "published",
  projectTags: ["inspiration-index", "adpharm-shad"],
} satisfies ShiplogMeta;

export default function Shiplog2025W25() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="inspiration-index" />
      </Text>

      <Text as="p" variant="body">
        Shipped an authentication system to secure the app and built initial search functionality with a raw Pinecone results viewer for debugging, plus autocomplete on forms for faster content entry. On the screenshot processing side, a new UI handles folders waiting to be processed, with a display dialog for screenshots and their descriptions, the ability to mark screenshots for deletion during processing, and separated reprocessing logic from initial processing backed by a comprehensive event log. Gemini was integrated for generating screenshot descriptions, with multiple rounds of prompt engineering and improved fallback JSON parsing when model output isn't perfectly formatted. MP4 upload support also landed with video frame extraction configured at 3 frames every 2 seconds.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="adpharm-shad" />
      </Text>

      <Text as="p" variant="body">
        Added an alert component and a dialog sheet component to the registry. Layout actions were improved using the fetcher pattern instead of forms, a whitespace rendering bug was fixed, and search params handling and routing utilities were refined.
      </Text>
    </ShiplogLayout>
  );
}
