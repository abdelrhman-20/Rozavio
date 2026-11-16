"use client";

import { scrollToTop } from "@/components/motion/smooth-scroll";

interface BackToTopProps {
  label: string;
}

/** Footer control that glides the page back to the top. */
export function BackToTop({ label }: BackToTopProps) {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group inline-flex min-h-[44px] cursor-pointer items-center gap-3 text-sm font-semibold text-[#f4f0e6]/75 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none sm:min-h-0"
    >
      {label}
      <span
        aria-hidden="true"
        className="grid h-10 w-10 place-items-center rounded-full border border-[#f4f0e6]/25 bg-[#f4f0e6]/[0.04] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#EA4E1A] group-hover:bg-[#EA4E1A] group-hover:text-white group-focus-visible:ring-2 group-focus-visible:ring-[#EA4E1A] group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#14101c] motion-reduce:transition-none"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </span>
    </button>
  );
}
