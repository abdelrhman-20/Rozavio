"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";

import { setScrollLocked } from "@/components/motion/smooth-scroll";
import { type NavLink } from "@/content/types";
import { useActiveSection } from "@/lib/hooks/use-active-section";
import { cn } from "@/lib/utils/cn";

interface MobileNavProps {
  items: NavLink[];
  cta: NavLink;
}

/**
 * Mobile navigation: a full-screen dark panel under the floating header.
 * The CTA closes the list as a primary pill, mirroring the desktop CTA.
 *
 * Accessible behaviour: the trigger exposes aria-expanded/controls, Escape
 * closes the panel and returns focus to the trigger, choosing a link
 * closes it, and page scrolling is locked while it is open.
 */
export function MobileNav({ items, cta }: MobileNavProps) {
  const activeHref = useActiveSection(items);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    return () => setScrollLocked(false);
  }, [open]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <div className="min-[991px]:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="relative z-[70] inline-flex h-10 w-10 items-center justify-center rounded-md text-[#f4f0e6] transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav
        ref={panelRef}
        id={panelId}
        aria-label="قائمة الموبايل"
        aria-hidden={!open}
        data-open={open}
        tabIndex={-1}
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 75% 0%, color-mix(in srgb, var(--color-primary) 28%, transparent), transparent 65%), radial-gradient(ellipse 70% 70% at 10% 100%, rgba(255,217,168,0.10), transparent 65%), linear-gradient(160deg, rgba(30,20,51,0.88) 0%, rgba(10,8,16,0.92) 65%)",
        }}
        className="rz-mnav fixed inset-0 z-[60] flex flex-col overflow-y-auto px-8 pt-28 pb-10 backdrop-blur-2xl focus:outline-none"
      >
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={item.href}
              className="rz-mnav-item"
              style={{ "--i": index } as CSSProperties}
            >
              <Link
                href={item.href}
                aria-current={item.href === activeHref ? "true" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "font-display block rounded-lg px-3 py-2.5 text-3xl font-semibold transition-colors hover:text-white",
                  item.href === activeHref
                    ? "text-[var(--color-primary)]"
                    : "text-[#f4f0e6]/75",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li
            className="rz-mnav-item"
            style={{ "--i": items.length } as CSSProperties}
          >
            <Link
              href={cta.href}
              onClick={() => setOpen(false)}
              className="rz-cta-glow mt-6 block rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-center text-base font-semibold text-[var(--color-primary-foreground)] transition-colors hover:brightness-110"
            >
              {cta.label}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M3 5h14M3 10h14M3 15h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}
