"use client";

import { type CSSProperties, type PointerEvent, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Card with a soft orange spotlight that follows the pointer. The pointer
 * position is written to CSS variables on the card, so tracking never
 * re-renders React. On touch devices (no hover) the glow simply stays off.
 */
export function SpotlightCard({
  children,
  className = "",
  style,
}: SpotlightCardProps) {
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      onPointerMove={onPointerMove}
      style={style}
      className={`group relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 0%), rgba(234,78,26,0.2), transparent 65%)",
        }}
      />
      {children}
    </div>
  );
}
