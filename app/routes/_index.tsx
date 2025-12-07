import type { LoaderFunctionArgs } from "react-router";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Text } from "~/components/misc/text";

export async function loader({}: LoaderFunctionArgs) {
  return {};
}

export const action = action_handler;

export default function Index() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Text as="h1" variant="display-xs" className="mb-2">
        bhonda.com
      </Text>
      <Text as="p" variant="body" className="text-muted-foreground mb-8">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Text>

      {/* Tabs */}
      <Tabs defaultValue="latest" className="w-full">
        <TabsList className="bg-transparent p-0 h-auto gap-0">
          <TabsTrigger
            value="latest"
            className="rounded-none bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
          >
            latest
          </TabsTrigger>
          <TabsTrigger
            value="ships"
            className="rounded-none bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
          >
            ships
          </TabsTrigger>
          <TabsTrigger
            value="other"
            className="rounded-none bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
          >
            other
          </TabsTrigger>
        </TabsList>

        <TabsContent value="latest">
          <Text as="h2" variant="heading-md" className="mb-6 mt-6">
            Latest
          </Text>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
          </div>
        </TabsContent>

        <TabsContent value="ships">
          <Text as="h2" variant="heading-md" className="mb-6 mt-6">
            Ships
          </Text>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
          </div>
        </TabsContent>

        <TabsContent value="other">
          <Text as="h2" variant="heading-md" className="mb-6 mt-6">
            Other
          </Text>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
            <div className="bg-muted h-48"></div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
