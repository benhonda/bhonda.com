import { useEffect, useState } from "react";
import { Text } from "~/components/misc/text";

export type AudioPlayerProps = {
  /** Path relative to CDN root, e.g. "blog/2026-03-18-gpu-research/file.m4a" */
  cdnPath: string;
  title?: string;
};

/**
 * Simple audio player that resolves the full CDN URL client-side.
 * Uses useState/useEffect to avoid SSR hydration mismatch — window.env is not
 * available on the server, so the src is empty until hydration completes.
 */
export function AudioPlayer({ cdnPath, title }: AudioPlayerProps) {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    const base = window.env?.PUBLIC_CDN_URL ?? "";
    setSrc(`${base}/${cdnPath}`);
  }, [cdnPath]);

  return (
    <div className="sticky top-4 z-10 rounded-lg border border-border bg-muted/40 p-4 backdrop-blur-sm">
      {title && (
        <Text as="p" variant="body-sm" className="font-medium text-muted-foreground mb-3">{title}</Text>
      )}
      <audio
        controls
        src={src || undefined}
        aria-label={title ?? "Audio player"}
        className="w-full"
        preload="metadata"
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
