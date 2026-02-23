import { BlogPostLayout } from "~/components/blog/blog-post-layout";
import { Text } from "~/components/misc/text";
import { Spacer } from "~/components/misc/spacer";
import type { BlogPostMeta } from "~/lib/blog/blog-types";

export const blogMeta = {
  title: "David Ogilvy on Advertising",
  publishedAt: "2026-02-23",
  lastUpdated: "2026-02-23",
  preview:
    "A collection of lines from David Ogilvy that I keep coming back to — from Ogilvy on Advertising, Confessions of an Advertising Man, and everywhere else.",
  slug: "david-ogilvy-on-advertising",
  status: "published",
} satisfies BlogPostMeta;

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-primary pl-6 my-8">
      <Text as="p" variant="body-lg" className="italic">
        {children}
      </Text>
    </div>
  );
}

export default function DavidOgilvyOnAdvertising() {
  return (
    <BlogPostLayout meta={blogMeta}>
      <Text as="p" variant="body" className="text-muted-foreground">
        A running collection of David Ogilvy quotes and thoughts on marketing — pulled from his books, interviews, and
        writing. Updated semi-regularly as I come across more.
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

    </BlogPostLayout>
  );
}
