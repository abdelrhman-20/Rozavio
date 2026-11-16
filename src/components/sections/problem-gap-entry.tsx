"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

interface ProblemGapEntryProps {
  number: string;
  children: ReactNode;
}

/**
 * One entry on the Digital Gap timeline: a numbered circular marker beside
 * the entry's content.
 *
 * Each entry reveals independently the first time it scrolls into view —
 * a short fade up (16px, ~550ms) — and its marker settles into an "active"
 * state (filled orange tint). It never replays on scroll-up, never
 * intercepts scrolling, and is fully visible without JavaScript or with
 * reduced motion: content is only hidden after mount, and only when the
 * visitor hasn't asked for reduced motion.
 */
export function ProblemGapEntry({ number, children }: ProblemGapEntryProps) {
  const ref = useRef<HTMLLIElement>(null);
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
      // Trigger a little after the entry crosses the bottom edge so the
      // reveal is actually seen, not finished off-screen.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const hidden = armed && !shown;

  return (
    <li
      ref={ref}
      className="relative grid grid-cols-1 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-7"
    >
      <div className="relative z-10 hidden sm:block">
        <span
          aria-hidden="true"
          data-ripple={armed && shown ? "true" : undefined}
          className={cn(
            "rz-marker font-display relative flex h-12 w-12 items-center justify-center rounded-full border text-[15px] font-semibold transition-colors duration-500 sm:h-14 sm:w-14 sm:text-base",
            // The marker's solid ground also masks the timeline line
            // behind it.
            hidden
              ? "border-[#EA4E1A]/35 bg-[rgb(248,245,238)] text-[#EA4E1A]/60"
              : "border-[#EA4E1A] bg-[#EA4E1A] text-white",
          )}
        >
          {number}
        </span>
      </div>

      <div
        className={cn(
          "min-w-0 transition-[opacity,transform] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          hidden ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        {children}
      </div>
    </li>
  );
}
