import { Text } from "~/components/misc/text";
import GithubSvg from "~/components/svgs/GithubSvg";
import { LinkedInSvg } from "~/components/svgs/LinkedInSvg";
import { ColorSchemeToggle } from "~/components/misc/theme-toggle";
import { AnalyticsConsentDialog } from "~/components/misc/analytics-consent-dialog";

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Text as="p" variant="body-sm" className="text-muted-foreground">
              © 2026 bhonda.com
            </Text>
            <Text as="span" variant="body-sm">
              <AnalyticsConsentDialog />
            </Text>
          </div>
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

            <a
              href="https://www.linkedin.com/in/benhonda/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedInSvg />
            </a>

            <ColorSchemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
