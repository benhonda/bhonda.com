import { cn } from "~/lib/utils";

export type InlineCodeProps = {
  children: React.ReactNode;
  className?: string;
};

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code className={cn("font-mono text-[0.8em] bg-muted px-1 py-0.5 rounded-sm", className)}>
      {children}
    </code>
  );
}
