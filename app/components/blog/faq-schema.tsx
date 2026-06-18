/**
 * Emits FAQPage JSON-LD so AI search engines (ChatGPT, Perplexity, Google AI
 * Overviews) and rich-result snippets can extract each Q&A as a standalone answer.
 *
 * `answer` is plain text and MUST faithfully mirror the visible accordion answer —
 * Google's structured-data policy requires the markup to match on-page content.
 */
export type FaqItem = { question: string; answer: string };

export function FaqSchema({ items }: { items: readonly FaqItem[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }),
      }}
    />
  );
}
