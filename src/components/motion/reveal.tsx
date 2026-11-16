"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Reveal — the shared scroll-reveal primitive for Rozavio sections.
 *
 * Wraps any server-rendered content and fades it up into place once it
 * enters the viewport. Timing and easing come from the `--rz-motion-*`
 * tokens in `globals.css`, so every section moves with the same language.
 *
 * Progressive enhancement: content renders visible on the server and
 * stays visible without JavaScript. It is only hidden after mount, and
 * only when the visitor has not requested reduced motion. The CSS also
 * guards the hidden state behind `prefers-reduced-motion: no-preference`.
 *
 * Use `delay` (ms) to stagger siblings, e.g. `delay={index * 120}`.
 */
export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /**
   * "rise" (default) fades up. "frame" is for visuals: the block slides in
   * from the side, scales up and sharpens, and the parts inside it
   * (children of `.rz-mock`) settle in one after another.
   */
  variant?: "rise" | "frame";
  /** For "frame": horizontal start offset in px (negative = from the left). */
  offsetX?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
  offsetX = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setArmed(true);
    // When the page loads with this block already on screen (a refresh while
    // standing at the section), the observer reports it at once. Revealing it
    // in the same frame would skip the hidden state and show no transition,
    // so wait two frames to let the hidden state paint first.
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();
          frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => setShown(true));
          });
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const state = armed && !shown ? "pending" : "shown";
  const style = {
    "--rz-reveal-delay": `${delay}ms`,
    "--rz-frame-x": `${offsetX}px`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      data-reveal={state}
      data-variant={variant}
      style={style}
      className={cn("rz-reveal", className)}
    >
      {children}
    </div>
  );
}
