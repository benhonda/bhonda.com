import type { ReactNode } from "react";

type TranscriptLineProps = {
  speaker: string;
  children: ReactNode;
};

/** A single speaker turn in a transcript. */
export function TranscriptLine({ speaker, children }: TranscriptLineProps) {
  return (
    <p>
      <span className="font-semibold">{speaker}:</span> {children}
    </p>
  );
}
