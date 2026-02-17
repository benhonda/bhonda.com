import { Text } from "~/components/misc/text";
import GithubSvg from "~/components/svgs/GithubSvg";
import { NavTabs } from "~/components/misc/nav-tabs";
import { Spacer } from "./spacer";

type PageHeaderProps = {
  description?: string;
};

export function PageHeader({ description }: PageHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <Text as="h1" variant="display-sm">
          bhonda.com
        </Text>
        <a
          href="https://github.com/benhonda/bhonda.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-muted-foreground transition-colors"
        >
          <GithubSvg className="w-6 h-6" />
        </a>
      </div>

      {description && (
        <Text as="p" variant="body" className="text-muted-foreground mb-8">
          {description}
        </Text>
      )}

      <Spacer size="sm" />

      {/* Navigation Tabs */}
      <NavTabs
        tabs={[
          { label: "latest", to: { to: "/" } },
          { label: "ships", to: { to: "/ships" } },
          { label: "projects", to: { to: "/projects" } },
          { label: "contact", to: { to: "/contact" } },
        ]}
      />
    </>
  );
}
