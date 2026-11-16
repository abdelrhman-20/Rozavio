"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

interface ProblemIntroProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper for the Digital Gap headline panel. When the panel first scrolls
 * into view it sets `data-shown`, which starts the staggered entrance
 * defined in `globals.css` (`.rz-intro-*`): the eyebrow rule draws, the
 * headline lines flip open, then the paragraph and scroll hint rise in.
 *
 * Progressive enhancement: content is visible by default (server HTML, no
 * JavaScript, reduced motion). It is only hidden — `data-armed` — after
 * mount, and only when the visitor hasn't asked for reduced motion. The
 * entrance plays once.
 */
export function ProblemIntro({ children, className }: ProblemIntroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Arm on the next frame (not synchronously in the effect body).
    const frame = requestAnimationFrame(() => setArmed(true));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-armed={armed ? "true" : undefined}
      data-shown={shown ? "true" : undefined}
    >
      {children}
    </div>
  );
}
