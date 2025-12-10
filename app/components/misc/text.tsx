import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

export const text = cva("", {
  variants: {
    variant: {
      // Display styles (display font)
      "display-xl": "font-display text-4.5xl sm:text-6xl font-normal tracking-tight",
      "display-lg": "font-display text-3.5xl sm:text-5xl font-normal tracking-tight",
      "display-md": "font-display text-2.5xl sm:text-3.5xl font-normal tracking-tight",
      "display-sm": "font-display text-2xl sm:text-3xl font-normal tracking-tight",
      "display-xs": "font-display text-1.5xl sm:text-2.5xl font-normal tracking-tight",

      // Heading styles (body font)
      "heading-md": "font-display text-1.5xl sm:text-2xl font-normal tracking-tight",
      "heading-sm": "font-display text-md-lg sm:text-lg font-normal tracking-tight",
      "heading-xs": "font-display text-base sm:text-md-lg font-normal tracking-tight",

      // Body styles (DM Sans font)
      "body-lg": "font-body text-lg sm:text-xl font-normal tracking-tight",
      body: "font-body text-base sm:text-md-lg font-normal tracking-normal",
      "body-sm": "font-body text-sm sm:text-sm-md font-normal tracking-normal",

      // Button styles (body font)
      "button-md": "font-mono text-sm sm:text-sm-md font-semibold tracking-tight",
      "button-sm": "font-mono text-sm font-semibold tracking-tight",

      // Utility styles
      microcopy: "font-body text-xs font-normal tracking-normal",
      overline: "font-body text-xs font-semibold uppercase tracking-widest",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export type TextProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  variant: NonNullable<VariantProps<typeof text>["variant"]>;
  className?: string;
  children: React.ReactNode;
};

export function Text({ as: Component = "p", variant, className, children, ...props }: TextProps) {
  return (
    <Component className={cn(text({ variant }), className)} {...props}>
      {children}
    </Component>
  );
}
