import Markdown from "react-markdown";
import { Text } from "./text";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <Markdown
      components={{
        h1: ({ children }) => (
          <Text as="h1" variant="display-xs" className="mb-4 mt-8">
            {children}
          </Text>
        ),
        h2: ({ children }) => (
          <Text as="h2" variant="heading-md" className="mb-3 mt-6">
            {children}
          </Text>
        ),
        h3: ({ children }) => (
          <Text as="h3" variant="heading-xs" className="mb-2 mt-4 font-mono font-normal text-primary">
            {children}
          </Text>
        ),
        h4: ({ children }) => (
          <Text as="h4" variant="body-lg" className="mb-2 mt-3">
            {children}
          </Text>
        ),
        p: ({ children }) => (
          <Text as="p" variant="body" className="mb-4 text-muted-foreground">
            {children}
          </Text>
        ),
        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
        li: ({ children }) => (
          <Text as="li" variant="body" className="text-muted-foreground ml-4 list-outside">
            {children}
          </Text>
        ),
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>;
          }
          return (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm font-mono">{children}</code>
            </pre>
          );
        },
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-primary underline hover:no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text as="span" variant="button-md" className="underline hover:no-underline">
              {children}
            </Text>
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4">{children}</blockquote>
        ),
        hr: () => <hr className="my-4 border-border" />,
      }}
    >
      {content}
    </Markdown>
  );
}
