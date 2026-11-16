"use client";

import { type CSSProperties } from "react";
import Link from "next/link";

import { type NavLink } from "@/content/types";
import { useActiveSection } from "@/lib/hooks/use-active-section";
import { cn } from "@/lib/utils/cn";

/** Stagger for the nav links: a short, even cascade from the first item. */
const navDelay = (index: number) =>
  ({ "--rz-enter-delay": `${120 + index * 60}ms` }) as CSSProperties;

interface SiteNavigationProps {
  items: NavLink[];
}

export function SiteNavigation({ items }: SiteNavigationProps) {
  const activeHref = useActiveSection(items);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="hidden items-center gap-5 min-[991px]:flex min-[1050px]:gap-7"
    >
      {items.map((item, index) => {
        const isActive = item.href === activeHref;
        return (
          <Link
            key={item.href}
            style={navDelay(index)}
            href={item.href}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rz-enter rz-enter-down text-base font-medium transition-colors hover:text-white",
              isActive ? "text-[var(--color-primary)]" : "text-[#f4f0e6]/75",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
