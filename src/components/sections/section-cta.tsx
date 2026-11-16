import { withBase } from "@/lib/base-path";
import { type ReactNode } from "react";

/** Shared destination for the "ناقش مشروعك" CTAs: the booking section
 *  on the homepage (`/#book` also works from other pages). */
export const DISCUSS_PRACTICE_HREF = "/#book";

/** Points the legacy "/contact" destination at the on-page booking section. */
export function bookingHref(href: string | undefined): string {
  return !href || href === "/contact" ? DISCUSS_PRACTICE_HREF : href;
}

type Tone = "light" | "dark";

interface SectionCtaProps {
  href: string;
  children: ReactNode;
  /** `primary` is the orange pill; `quiet` is an underlined text link. */
  variant?: "primary" | "quiet";
  /** Surface the CTA sits on, for contrast and focus-ring offset. */
  tone?: Tone;
  className?: string;
}

const ARROW = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/**
 * Contextual in-section CTA. Both variants keep a 44px minimum hit area.
 * `primary` mirrors the Hero's primary pill (orange, `rz-cta-glow`);
 * `quiet` is for secondary navigation such as "Explore Our Approach".
 */
export function SectionCta({
  href,
  children,
  variant = "primary",
  tone = "light",
  className = "",
}: SectionCtaProps) {
  if (variant === "quiet") {
    const colour =
      tone === "dark"
        ? "text-[#f4f0e6] decoration-[#f4f0e6]/30 hover:decoration-[#f4f0e6] focus-visible:ring-white/50"
        : "text-[#14110d] decoration-[#14110d]/30 hover:decoration-[#14110d] focus-visible:ring-[#14110d]/40";
    return (
      <a
        href={withBase(href)}
        className={`group inline-flex min-h-[44px] items-center gap-2 text-base font-semibold underline underline-offset-[6px] transition focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-none ${colour} ${className}`}
      >
        {children}
        {ARROW}
      </a>
    );
  }
  return (
    <a
      href={withBase(href)}
      className={`group rz-cta-glow inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-base font-semibold whitespace-nowrap text-[var(--color-primary-foreground)] transition hover:brightness-110 sm:w-auto ${className}`}
    >
      {children}
      {ARROW}
    </a>
  );
}
