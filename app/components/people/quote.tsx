import { Text } from "~/components/misc/text";

export type QuoteProps = { children: React.ReactNode; note?: React.ReactNode };

export function Quote({ children, note }: QuoteProps) {
  return (
    <div className="border-l-4 border-primary pl-6 my-12">
      <Text as="p" variant="body-lg" className="italic font-normal">
        {children}
      </Text>
      {note && (
        <Text as="p" variant="body-sm" className="text-muted-foreground mt-3">
          {note}
        </Text>
      )}
    </div>
  );
}
