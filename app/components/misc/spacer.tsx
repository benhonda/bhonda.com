import { cn } from "~/lib/utils";
import { match } from "ts-pattern";

type SpacerProps = {
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "header-height";
  divider?: "top" | "bottom" | "middle";
  className?: string;
};

export function Spacer({ size, divider, className }: SpacerProps) {
  return (
    <div className={cn("h-px w-full relative", getSpacerSize(size), className)}>
      {!!divider && <div className={cn("h-px w-full bg-gray-200 absolute left-0", getDividerPosition(divider))} />}
    </div>
  );
}

function getSpacerSize(size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "header-height") {
  return match(size)
    .with("xs", () => "h-1.5 xl:h-2")
    .with("sm", () => "h-3 xl:h-3.5")
    .with("md", () => "h-4 sm:h-6 xl:h-8")
    .with("lg", () => "h-8 sm:h-10 xl:h-12")
    .with("xl", () => "h-10 sm:h-12 xl:h-16")
    .with("2xl", () => "h-12 sm:h-16 xl:h-20")
    .with("3xl", () => "h-20 sm:h-24 xl:h-28")
    .with("4xl", () => "h-24 sm:h-32 xl:h-36")
    .with("5xl", () => "h-28 sm:h-40 xl:h-48")
    .with("header-height", () => "h-[var(--header-height)]")
    .exhaustive();
}

function getDividerPosition(divider: "top" | "bottom" | "middle") {
  return match(divider)
    .with("top", () => "top-0")
    .with("bottom", () => "bottom-0")
    .with("middle", () => "top-1/2 -translate-y-1/2")
    .exhaustive();
}
