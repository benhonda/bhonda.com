import type { LoaderFunctionArgs } from "react-router";
import { useLocation } from "react-router";
import { Text } from "~/components/misc/text";
import { Link } from "~/lib/router/routes";
import GithubSvg from "~/components/svgs/GithubSvg";

export async function loader({}: LoaderFunctionArgs) {
  return {};
}

export default function Other() {
  const location = useLocation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <Text as="h1" variant="display-xs">
          bhonda.com
        </Text>
        <a
          href="https://github.com/benhonda"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-muted-foreground transition-colors"
        >
          <GithubSvg className="w-6 h-6" />
        </a>
      </div>
      <Text as="p" variant="body" className="text-muted-foreground mb-8">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </Text>

      {/* Navigation Tabs */}
      <div className="w-full">
        <div className="flex gap-0 mb-6">
          <Link
            to="/"
            className={`font-mono rounded-none px-4 py-2 ${
              location.pathname === "/"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/70 transition-colors"
            }`}
          >
            latest
          </Link>
          <Link
            to="/ships"
            className={`font-mono rounded-none px-4 py-2 ${
              location.pathname === "/ships"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/70 transition-colors"
            }`}
          >
            ships
          </Link>
          <Link
            to="/other"
            className={`font-mono rounded-none px-4 py-2 ${
              location.pathname === "/other"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/70 transition-colors"
            }`}
          >
            other
          </Link>
        </div>

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
