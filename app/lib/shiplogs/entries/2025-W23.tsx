import { ShiplogLayout } from "~/components/shiplogs/shiplog-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import { Tag } from "~/components/misc/tag";
import type { ShiplogMeta } from "~/lib/shiplogs/shiplog-types";

export const shiplogMeta = {
  slug: "2025-W23",
  titleText: "New Clients & GTM Infrastructure Updates",
  previewText: "Onboarded two new ADAPTS clients and refined the GTM proxy infrastructure with environment configuration improvements.",
  publishedAt: "2025-06-08",
  week: 23,
  year: 2025,
  status: "published",
  projectTags: ["adapts", "gtm-proxy"],
} satisfies ShiplogMeta;

export default function Shiplog2025W23() {
  return (
    <ShiplogLayout meta={shiplogMeta}>
      <Text as="h2" variant="heading-sm">
        <Tag project="adapts" />
      </Text>

      <Text as="p" variant="body">
        Two new clients joined the platform this week. OncoBridge was onboarded and configured, and Daiichi Sankyo was integrated and readied for deployment.
      </Text>

      <Spacer size="sm" />

      <Text as="h2" variant="heading-sm">
        <Tag project="gtm-proxy" />
      </Text>

      <Text as="p" variant="body">
        Refined the infrastructure deployment with improvements to environment configuration and the landing page experience. These changes streamline the setup process and improve clarity for users landing on the proxy endpoints.
      </Text>
    </ShiplogLayout>
  );
}
