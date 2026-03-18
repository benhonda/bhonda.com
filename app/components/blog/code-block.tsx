import { highlight } from "sugar-high";
import { cn } from "~/lib/utils";

export type CodeBlockProps = {
  children: string;
  language?: string;
  filename?: string;
  className?: string;
};

/** Shared label style for filename and language header labels. */
const labelClass = "font-mono text-xs text-muted-foreground";

export function CodeBlock({ children, language, filename, className }: CodeBlockProps) {
  const highlighted = highlight(children.trim());

  return (
    <div className={cn("my-4 rounded-lg border border-border bg-muted overflow-hidden", className)}>
      {(filename || language) && (
        <div className="flex items-center px-4 py-2 border-b border-border">
          {filename && <span className={labelClass}>{filename}</span>}
          {language && <span className={cn(labelClass, "ml-auto")}>{language}</span>}
        </div>
      )}
      <pre className="overflow-x-auto p-4">
        <code
          className="font-mono text-sm leading-relaxed [&_.sh-keyword]:text-primary [&_.sh-string]:text-muted-foreground [&_.sh-comment]:text-muted-foreground/60 [&_.sh-jsxliterals]:text-foreground"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
