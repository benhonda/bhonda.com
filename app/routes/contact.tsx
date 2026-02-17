import type { LoaderFunctionArgs } from "react-router";
import { Text } from "~/components/misc/text";
import { PageHeader } from "~/components/misc/page-header";
import { LinkedInSvg } from "~/components/svgs/LinkedInSvg";
import GithubSvg from "~/components/svgs/GithubSvg";

export async function loader({}: LoaderFunctionArgs) {
  return {};
}

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <div className="w-full">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative size-40 shrink-0">
            <img
              src="/images/ben-1-expanded-tight.png"
              alt="Ben Honda"
              className="size-40 rounded-full object-cover"
            />
            <div className="absolute inset-0 rounded-full bg-yellow-200/30 mix-blend-multiply" />
          </div>
          <Text as="h2" variant="heading-md">
            Contact
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <a
            href="https://www.linkedin.com/in/benhonda/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <LinkedInSvg className="w-6 h-6 shrink-0" />
            <Text as="span" variant="body">
              linkedin.com/in/benhonda
            </Text>
          </a>

          <a
            href="https://github.com/benhonda"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <GithubSvg className="w-6 h-6 shrink-0" />
            <Text as="span" variant="body">
              github.com/benhonda
            </Text>
          </a>
        </div>
      </div>
    </div>
  );
}
