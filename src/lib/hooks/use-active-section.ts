"use client";

import { useEffect, useState } from "react";

import { type NavLink } from "@/content/types";

/** "/#approach" -> "approach" (null when the link is not an in-page anchor). */
function anchorId(href: string): string | null {
  const i = href.indexOf("#");
  return i === -1 ? null : href.slice(i + 1) || null;
}

/**
 * Scroll-spy for the single-page nav: returns the href of the nav link
 * whose section currently crosses the middle band of the viewport.
 */
export function useActiveSection(items: NavLink[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = items
      .map((item) => {
        const id = anchorId(item.href);
        const el = id ? document.getElementById(id) : null;
        return el ? { href: item.href, el } : null;
      })
      .filter((t): t is { href: string; el: HTMLElement } => t !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const hit = targets.find((t) => t.el === entry.target);
          if (!hit) continue;
          if (entry.isIntersecting) setActive(hit.href);
          else setActive((cur) => (cur === hit.href ? null : cur));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    targets.forEach((t) => observer.observe(t.el));
    return () => observer.disconnect();
  }, [items]);

  return active;
}
