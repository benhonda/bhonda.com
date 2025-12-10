import type { LoaderFunctionArgs } from "react-router";
import { Text } from "~/components/misc/text";
import { PageHeader } from "~/components/misc/page-header";

export async function loader({}: LoaderFunctionArgs) {
  return {};
}

export default function Other() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="w-full">
        {/* Other Content */}
        <Text as="h2" variant="heading-md" className="mb-6">
          Other
        </Text>
        <Text as="p" variant="body" className="text-muted-foreground">
          Coming soon...
        </Text>
      </div>
    </div>
  );
}
