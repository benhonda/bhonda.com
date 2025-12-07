import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "~/lib/utils"

/**
 * Custom enhancements from default shadcn/ui:
 * - Changed line height from leading-none to leading-normal
 * - Added FormLabel export with error state styling
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        // Custom styles: override leading-none from base shadcn with leading-normal
        "leading-normal",
        className
      )}
      {...props}
    />
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <Label
      data-slot="form-label"
      className={cn("data-[error=true]:text-destructive", className)}
      {...props}
    />
  )
}

export { Label, FormLabel }
