"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { setScrollLocked } from "@/components/motion/smooth-scroll";

export interface SiteDialogImage {
  /** Screenshot shown while the live site loads. */
  src: string;
  url: string;
  label: string;
}

interface SiteDialogProps {
  image: SiteDialogImage;
  closeLabel: string;
  newTabLabel: string;
  onClose: () => void;
}

/** Full-screen dialog hosting the live client site in an iframe. */
export function SiteDialog({
  image,
  closeLabel,
  newTabLabel,
  onClose,
}: SiteDialogProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    setScrollLocked(true);
    closeRef.current?.focus();
    return () => setScrollLocked(false);
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0810]/80 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex h-full max-h-[920px] w-full max-w-[1280px] flex-col overflow-hidden rounded-2xl bg-[#14101c] shadow-[0_40px_120px_-20px_rgba(234,78,26,0.45)] ring-1 ring-white/15"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          dir="ltr"
          className="flex items-center gap-3 bg-[#1e1b26] px-4 py-2.5"
        >
          <span className="hidden gap-1.5 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span
            id={titleId}
            className="min-w-0 flex-1 truncate rounded-md bg-black/30 px-3 py-1 text-center font-mono text-xs text-[#f4f0e6]/70"
          >
            {image.url}
          </span>
          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-[#f4f0e6] transition-colors hover:border-[#EA4E1A] hover:text-white"
          >
            {newTabLabel} ↗
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-[#f4f0e6] transition-colors hover:bg-[#EA4E1A] focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="relative flex-1 bg-white">
          {/* Screenshot shows while the live site loads. */}
          {!loaded ? (
            <img
              src={image.src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-top opacity-60"
            />
          ) : null}
          <iframe
            src={image.url}
            title={image.label}
            onLoad={() => setLoaded(true)}
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            className="absolute inset-0 h-full w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
