import type { LoaderFunctionArgs } from "react-router";
import { action_handler } from "~/lib/actions/_core/action-runner.server";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";

export async function loader({}: LoaderFunctionArgs) {
  return {};
}

export const action = action_handler;

export default function Index() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-2">bhonda.com</h1>
      <p className="text-muted-foreground mb-8">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>

      {/* Tabs */}
      <Tabs defaultValue="latest" className="w-full">
        <TabsList>
          <TabsTrigger value="latest">latest</TabsTrigger>
          <TabsTrigger value="ships">ships</TabsTrigger>
          <TabsTrigger value="other">other</TabsTrigger>
        </TabsList>

        <TabsContent value="latest">
          <h2 className="text-xl font-semibold mb-6 mt-6">Latest</h2>
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
          <h2 className="text-xl font-semibold mb-6 mt-6">Ships</h2>
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
          <h2 className="text-xl font-semibold mb-6 mt-6">Other</h2>
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
