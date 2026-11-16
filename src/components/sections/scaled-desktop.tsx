"use client";

import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface ScaledDesktopProps {
  children: ReactNode;
  /** Width in px the content is laid out at before being scaled down. */
  designWidth?: number;
}

// useLayoutEffect warns during server rendering; the effect only matters
// in the browser, so fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Lays its children out at a fixed desktop width and scales the whole
 * thing down to fit when the available space is narrower. Used for the
 * website mockups, whose layout reflows on the width of their own frame:
 * on a phone they would otherwise switch to their stacked mobile layout,
 * but here they keep the desktop composition and simply get smaller.
 *
 * When the space is at least `designWidth` wide the content renders at its
 * natural size, unscaled. The content is hidden until the first
 * measurement so there is no flash of the wrong layout. Purely visual:
 * mockups using it are decorative and `aria-hidden`.
 */
export function ScaledDesktop({
  children,
  designWidth = 600,
}: ScaledDesktopProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ scale: number; height: number } | null>(
    null,
  );

  useIsomorphicLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const scale = Math.min(1, outer.clientWidth / designWidth);
      setState({ scale, height: inner.offsetHeight * scale });
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [designWidth]);

  const scale = state?.scale ?? 1;

  return (
    <div
      ref={outerRef}
      className="relative w-full"
      style={{ height: state ? state.height : undefined }}
    >
      <div
        ref={innerRef}
        dir="rtl"
        className={state ? undefined : "invisible"}
        style={{
          position: state ? "absolute" : "relative",
          top: 0,
          right: 0,
          width: scale < 1 ? designWidth : "100%",
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top right",
        }}
      >
        {children}
      </div>
    </div>
  );
}
