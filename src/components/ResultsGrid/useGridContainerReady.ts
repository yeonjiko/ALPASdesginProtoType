import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

export function useGridContainerReady(): {
  gridHostRef: RefObject<HTMLDivElement | null>;
  isGridReady: boolean;
} {
  const gridHostRef = useRef<HTMLDivElement>(null);
  const [isGridReady, setIsGridReady] = useState(false);

  useEffect(() => {
    const host = gridHostRef.current;
    if (!host) return;

    // Dockview dimensions can remain positive while an ancestor is hidden.
    // Wait for the real container, then keep the grid mounted to retain its state.
    const observer = new ResizeObserver((entries) => {
      const size = entries[0]?.contentRect;
      if (!host.isConnected || !size || size.width <= 0 || size.height <= 0) return;
      setIsGridReady(true);
      observer.disconnect();
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return { gridHostRef, isGridReady };
}
