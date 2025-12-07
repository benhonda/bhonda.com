import { useEffect, useRef, useState } from "react";

export function ClientOnly({ fallback, children }: { fallback: React.ReactNode; children: React.ReactNode }) {
  const [content, setContent] = useState<React.ReactNode>(fallback);

  //
  // ref to ensure the content is only rendered once
  //
  const hasRendered = useRef<boolean>(false);

  useEffect(() => {
    console.log("useEffect to render client only");
    if (hasRendered.current) return;

    setContent(children);
    hasRendered.current = true;
  }, [children]);

  return content;
}
