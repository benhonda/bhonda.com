import { cn } from "~/lib/utils";
import { Text } from "./text";

export type ListProps = {
  as?: "ul" | "ol";
  className?: string;
  children: React.ReactNode;
};

/** Unordered or ordered list. Children should be `<ListItem>` elements. */
export function List({ as = "ul", className, children }: ListProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "pl-5 space-y-1",
        Component === "ul" ? "list-disc" : "list-decimal",
        className
      )}
    >
      {children}
    </Component>
  );
}

export type ListItemProps = {
  className?: string;
  children: React.ReactNode;
};

/** List item — use inside `<List>`. */
export function ListItem({ className, children }: ListItemProps) {
  return (
    <Text as="li" variant="body" className={className}>
      {children}
    </Text>
  );
}
