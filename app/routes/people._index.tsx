import type { MetaFunction } from "react-router";
import { mergeMeta } from "~/lib/meta-utils";
import { PageHeader } from "~/components/misc/page-header";
import { Text } from "~/components/misc/text";
import { Link } from "~/lib/router/routes";
import { publishedPeople } from "~/lib/people/people-registry";

export const meta: MetaFunction = ({ matches }) =>
  mergeMeta(matches, [
    { title: "People | Ben Honda" },
    { name: "description", content: "Quotable individuals." },
    { tagName: "link", rel: "canonical", href: "https://www.bhonda.com/people" },
    { property: "og:title", content: "People | Ben Honda" },
    { property: "og:description", content: "Quotable individuals." },
    { property: "og:url", content: "https://www.bhonda.com/people" },
  ]);

const people = publishedPeople;

export default function PeopleIndex() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader />

      <Text as="h2" variant="heading-md" className="mb-1">
        People
      </Text>
      <Text as="p" variant="body-sm" className="text-muted-foreground mb-6">
        Quotable individuals.
      </Text>

      {people.length === 0 ? (
        <Text as="p" variant="body" className="text-muted-foreground">
          No profiles yet.
        </Text>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {people.map((person) => (
            <Link
              key={person.slug}
              to="/people/:slug"
              params={{ slug: person.slug }}
              className="flex flex-col border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
            >
              <Text as="h3" variant="heading-sm" className="mb-1">
                {person.name}
              </Text>
              <Text as="p" variant="body-sm" className="text-muted-foreground mb-4">
                {person.preview}
              </Text>
              {person.lastUpdated && (
                <div className="mt-auto">
                  <time dateTime={person.lastUpdated} className="text-xs text-muted-foreground">
                    Last updated {person.lastUpdated}
                  </time>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
