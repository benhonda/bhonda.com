import { PersonLayout } from "~/components/people/person-layout";
import { Quote } from "~/components/people/quote";
import type { PersonMeta } from "~/lib/people/people-types";

export const personMeta = {
  name: "Jim Carrey",
  slug: "jim-carrey",
  preview: "Jim Carrey on wanting, working, and letting go.",
  metaDescription:
    "A quote from Jim Carrey's 2014 commencement address at Maharishi International University of Management.",
  status: "published",
  lastUpdated: "2026-03-18",
} satisfies PersonMeta;

export default function JimCarrey() {
  return (
    <PersonLayout meta={personMeta}>
      <Quote note="2014 Commencement Address, Maharishi International University of Management">
        "As far as I can tell it's just about letting the universe know what you want, and working towards it, while letting go of how it comes to pass"
      </Quote>
    </PersonLayout>
  );
}
