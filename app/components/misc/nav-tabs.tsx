import { useLocation } from "react-router";
import { Link } from "~/lib/router/routes";
import { Text } from "~/components/misc/text";
import { isSamePath, type LinkTo } from "~/lib/router/router-utils";

type Tab = {
  label: string;
  to: LinkTo;
};

type NavTabsProps = {
  tabs: Tab[];
};

export function NavTabs({ tabs }: NavTabsProps) {
  const location = useLocation();

  return (
    <div className="flex gap-0 mb-6">
      {tabs.map((tab) => {
        const isActive = isSamePath(location.pathname, tab.to);

        return (
          <Link
            key={JSON.stringify(tab.to)}
            {...tab.to}
            className={`font-mono rounded-none px-4 py-2 ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/70 transition-colors"
            }`}
          >
            <Text as="span" variant="button-sm">
              {tab.label}
            </Text>
          </Link>
        );
      })}
    </div>
  );
}
