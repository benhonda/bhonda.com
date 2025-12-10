import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";
import { text } from "~/components/misc/text";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    "font-mono font-normal"
  ),
  {
    variants: {
      variant: {
        // Primary variants
        "primary-filled": "bg-primary text-primary-foreground hover:bg-primary/90",
        "primary-outline": "border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        "primary-link": "text-primary underline-offset-4 hover:underline",

        // Secondary variants
        "secondary-filled": "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        "secondary-outline": "border border-secondary-foreground text-secondary-foreground hover:opacity-80",
        "secondary-link": "text-secondary-foreground underline-offset-4 hover:underline",

        // Knockout variants (light buttons for dark backgrounds)
        "knockout-filled": "bg-background text-foreground hover:bg-background/90",
        "knockout-outline": "border border-background text-background hover:bg-background hover:text-foreground",
        "knockout-link": "text-background underline-offset-4 hover:underline",
      },
      size: {
        sm: cn("h-9 px-3", text({ variant: "button-sm" })),
        lg: cn("h-11 px-4", text({ variant: "button-md" })),
      },
    },
    compoundVariants: [
      // Remove padding for link variants
      {
        variant: ["primary-link", "secondary-link", "knockout-link"],
        className: "h-auto px-0",
      },
    ],
    defaultVariants: {
      variant: "primary-filled",
      size: "lg",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Custom enhancements from default shadcn/ui:
 * - Custom color system with primary/secondary/knockout variants instead of default/destructive
 * - Each color has three styles: filled, outline, link
 * - Only two sizes (sm and lg) instead of default/sm/lg/icon
 * - Default size changed from md to lg
 * - Compound variants to remove padding for link styles
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
