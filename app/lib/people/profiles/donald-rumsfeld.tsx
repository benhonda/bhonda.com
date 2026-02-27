import { PersonLayout } from "~/components/people/person-layout";
import { Quote } from "~/components/people/quote";
import { Link } from "~/lib/router/routes";
import type { PersonMeta } from "~/lib/people/people-types";

export const personMeta = {
  name: "Donald Rumsfeld",
  slug: "donald-rumsfeld",
  preview: "Rumsfeld's rules on hiring, clarity, and organizations.",
  metaDescription: "Quotes from Donald Rumsfeld on hiring, simplicity, and the efficiency of organizations.",
  status: "published",
  lastUpdated: "2026-02-27",
} satisfies PersonMeta;

export default function DonaldRumsfeld() {
  return (
    <PersonLayout meta={personMeta}>
      <Quote>"A's hire A's. B's hire C's."</Quote>

      <Quote>"Complexity is easy; simplicity is hard."</Quote>

      <Quote
        note={
          <>
            Same thinking as{" "}
            <Link to="/people/:slug" params={{ slug: "david-ogilvy" }} className="underline">
              David Ogilvy
            </Link>{" "}
            on committees.
          </>
        }
      >
        "The efficiency of a committee is inversely proportional to the number of people on it."
      </Quote>
    </PersonLayout>
  );
}
