import type { ReactNode } from "react";
import { Text } from "~/components/misc/text";

export type TranscriptLineProps = {
  speaker: string;
  children: ReactNode;
};

/** A single speaker turn in a transcript. */
export function TranscriptLine({ speaker, children }: TranscriptLineProps) {
  return (
    <Text as="p" variant="body-sm">
      <span className="font-semibold">{speaker}:</span> {children}
    </Text>
  );
}
