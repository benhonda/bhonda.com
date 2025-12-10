import { Text } from "~/components/misc/text";
import GithubSvg from "~/components/svgs/GithubSvg";
import { ColorSchemeToggle } from "~/components/misc/theme-toggle";

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Text as="p" variant="body-sm" className="text-muted-foreground">
            © 2026 bhonda.com
          </Text>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/benhonda/bhonda.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <GithubSvg />
            </a>

            <ColorSchemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
