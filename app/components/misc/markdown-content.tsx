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
          <Text as="h3" variant="heading-md" className="mb-2 mt-4">
            {children}
          </Text>
        ),
        h4: ({ children }) => (
          <Text as="h4" variant="heading-sm" className="mb-2 mt-3">
            {children}
          </Text>
        ),
        p: ({ children }) => (
          <Text as="p" variant="body" className="mb-4">
            {children}
          </Text>
        ),
        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
        li: ({ children }) => (
          <li className="font-body text-base sm:text-md-lg font-normal tracking-normal">
            {children}
          </li>
        ),
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>
            );
          }
          return (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm font-mono">{children}</code>
            </pre>
          );
        },
        a: ({ children, href }) => (
          <a href={href} className="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </Markdown>
  );
}
