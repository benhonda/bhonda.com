import { PersonLayout } from "~/components/people/person-layout";
import { Quote } from "~/components/people/quote";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import type { PersonMeta } from "~/lib/people/people-types";

export const personMeta = {
  name: "David Ogilvy",
  slug: "david-ogilvy",
  preview: "Lines from Ogilvy I keep coming back to.",
  status: "published",
  lastUpdated: "2026-02-23",
} satisfies PersonMeta;

export default function DavidOgilvy() {
  return (
    <PersonLayout meta={personMeta}>
      <Text as="p" variant="body" className="text-muted-foreground">
        From <em>Ogilvy on Advertising</em> and <em>Confessions of an Advertising Man</em>.
      </Text>

      <Spacer size="sm" />

      <Quote>
        "The consumer isn't a moron. She is your wife. You insult her intelligence if you assume that a mere slogan and
        a few vapid adjectives will persuade her to buy anything."
      </Quote>

      <Quote>
        "When people read your copy, they are alone. Pretend you are writing each of them a letter on behalf of your
        client. One human being to another, second person singular."
      </Quote>

      <Quote>
        "You cannot bore people into buying your product. You can only interest them in buying it."
      </Quote>

      <Quote>
        "Whenever you can, make the product itself the hero of your advertising. If you think the product too dull, I
        have news for you: there are no dull products, only dull writers."
      </Quote>

      <Quote>
        "In the modern world of business, it is useless to be a creative, original thinker, unless you can also sell
        what you create."
      </Quote>

      <Quote>
        "Committees can criticize advertisements, but they should never be allowed to create them."
      </Quote>
    </PersonLayout>
  );
}
