"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { bookingHref } from "@/components/sections/section-cta";
import { SiteDialog } from "@/components/sections/site-dialog";
import { type ClientProofData } from "@/content/types";
import { cn } from "@/lib/utils/cn";

type Work = ClientProofData["works"][number];

interface ClientProofShowcaseProps {
  data: ClientProofData;
}

/**
 * The "Our Work" showcase: a browser frame showing the selected client
 * site (top of the page), with the other two sites stacked behind it in
 * 3D. A picker switches the front site, and pressing the frame opens the
 * live website in a dialog (iframe), so a prospect can verify the work.
 */
export function ClientProofShowcase({ data }: ClientProofShowcaseProps) {
  const { eyebrow, heading, description, works, labels } = data;
  const [selected, setSelected] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    openerRef.current = document.activeElement as HTMLElement | null;
    setDialogOpen(true);
  }, []);
  const close = useCallback(() => {
    setDialogOpen(false);
    openerRef.current?.focus();
  }, []);

  const front = works[selected]!;
  // The other works fill the two depth layers behind the front frame.
  const behind = works.filter((_, i) => i !== selected).slice(0, 2);

  return (
    <div className="relative container mx-auto flex flex-col items-stretch justify-between gap-12 py-16 min-[991px]:flex-row min-[991px]:items-center min-[991px]:gap-12 sm:pt-20 sm:pb-24 lg:gap-20 lg:pt-28 lg:pb-32">
      {/* Visual: the real client website. */}
      <div className="relative z-10 order-2 min-w-0 min-[991px]:order-1 min-[991px]:flex-[1.1]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -start-10 -z-10 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: "#EA4E1A2e" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 -bottom-7 -z-10 hidden h-8 rounded-[100%] bg-[#14110d]/25 blur-xl min-[991px]:block"
        />

        <div className="-mx-3 min-[991px]:mx-0 min-[991px]:pt-16 min-[991px]:ps-14 min-[991px]:[perspective:1800px] sm:-mx-4">
          <div className="relative transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none min-[991px]:[transform:rotateY(-7deg)_rotateX(3deg)] min-[991px]:[transform-style:preserve-3d] min-[991px]:hover:[transform:rotateY(-2deg)_rotateX(1deg)]">
            {behind[1] ? (
              <div className="pointer-events-none absolute inset-0 hidden min-[991px]:block min-[991px]:[transform:translate3d(-36px,-34px,-80px)]">
                <DepthPage work={behind[1]} />
              </div>
            ) : null}
            {behind[0] ? (
              <div className="pointer-events-none absolute inset-0 hidden min-[991px]:block min-[991px]:[transform:translate3d(-18px,-17px,-40px)]">
                <DepthPage work={behind[0]} />
              </div>
            ) : null}

            <Reveal delay={120}>
              <div className="overflow-hidden rounded-[18px] border border-[#14110d]/10 bg-white shadow-[0_30px_70px_-35px_rgba(20,17,13,0.35)]">
                <BrowserBar address={front.host} live={labels.live} />
                <button
                  type="button"
                  onClick={open}
                  aria-haspopup="dialog"
                  aria-label={`${labels.visit}: ${front.host}`}
                  className="group relative block aspect-video w-full cursor-pointer overflow-hidden bg-[#0a0810] outline-none focus-visible:ring-2 focus-visible:ring-[#EA4E1A] focus-visible:ring-inset"
                >
                  {works.map((work, i) => (
                    <img
                      key={work.id}
                      src={work.imageSrc}
                      alt={i === selected ? work.imageAlt : ""}
                      loading={i === 0 ? "eager" : "lazy"}
                      draggable={false}
                      className={cn(
                        "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 motion-reduce:transition-none",
                        i === selected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  ))}
                  <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#14110d]/0 to-transparent pb-5 transition-colors duration-500 group-hover:from-[#14110d]/35 group-focus-visible:from-[#14110d]/35">
                    <span
                      aria-hidden="true"
                      className="translate-y-2 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-[#14110d] opacity-0 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
                    >
                      {labels.visit} ↗
                    </span>
                  </span>
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Content: claim, client identity, actions. */}
      <div className="relative z-10 order-1 flex min-w-0 flex-col justify-center min-[991px]:order-2 min-[991px]:flex-1">
        {eyebrow ? (
          <Reveal>
            <span className="client_proof__eyebrow inline-flex items-center gap-2 text-[14px] font-semibold text-[#EA4E1A]">
              <span
                aria-hidden="true"
                className="rz-ripple-dot h-1.5 w-1.5 rounded-full bg-[#EA4E1A] text-[#EA4E1A]"
              />
              {eyebrow}
            </span>
          </Reveal>
        ) : null}

        <Reveal delay={80}>
          <h2 className="rz-h2 client_proof__title mt-6 text-[#14110d]">
            {heading}
          </h2>
        </Reveal>

        {description ? (
          <Reveal delay={160}>
            <p className="client_proof__description mt-6 max-w-[30em] rz-lead text-[#14110d]/70">
              {description}
            </p>
          </Reveal>
        ) : null}

        {/* Picker + the selected client's identity. */}
        <Reveal delay={220}>
          <div className="mt-8 border-t border-[#14110d]/10 pt-6">
            <div
              role="tablist"
              aria-label={labels.picker}
              dir="ltr"
              className="flex flex-wrap gap-2"
            >
              {works.map((work, i) => {
                const on = i === selected;
                return (
                  <button
                    key={work.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setSelected(i)}
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${work.brandColor}, ${work.brandColorEnd})`,
                      borderColor: work.brandColor,
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-full border py-1 ps-1 pe-3.5 text-[13px] font-bold text-white transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#EA4E1A]",
                      on
                        ? "opacity-100 shadow-[0_8px_20px_-8px_rgba(20,17,13,0.55)] ring-2 ring-[#14110d]/80 ring-offset-2 ring-offset-[#f6f3ea]"
                        : "opacity-75 hover:opacity-100",
                    )}
                  >
                    <img
                      src={work.thumb}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover object-top"
                    />
                    {work.host}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-4">
              <img
                src={front.thumb}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-full object-cover object-top"
              />
              <div>
                <p className="font-display text-[1.25rem] leading-[1.5] font-bold text-[#14110d]">
                  {front.name}
                </p>
                <p className="mt-0.5 text-[14px] font-medium text-[#14110d]/55">
                  {front.category}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={280}>
          <div className="mt-8 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:gap-7">
            {data.primaryCtaLabel ? (
              <a
                href={bookingHref(data.primaryCtaHref)}
                className="rz-cta-glow inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-base font-semibold whitespace-nowrap text-[var(--color-primary-foreground)] transition hover:brightness-110 sm:w-auto"
              >
                {data.primaryCtaLabel}
              </a>
            ) : null}
            <a
              href={front.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-1.5 self-center text-base font-semibold text-[#14110d] underline decoration-[#14110d]/30 underline-offset-[6px] transition hover:decoration-[#14110d] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#14110d]/40 focus-visible:outline-none sm:self-auto"
            >
              {front.linkLabel}
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 motion-reduce:transition-none"
              >
                ↗
              </span>
            </a>
          </div>
        </Reveal>
      </div>

      {dialogOpen ? (
        <SiteDialog
          image={{ src: front.imageSrc, url: front.url, label: front.host }}
          closeLabel={labels.close}
          newTabLabel={labels.newTab}
          onClose={close}
        />
      ) : null}
    </div>
  );
}

/** Faux browser bar with the site's address and a "live" badge. */
function BrowserBar({ address, live }: { address: string; live: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-[#14110d]/10 bg-gradient-to-b from-[#f6f3ea] to-[#ebe7dc] px-5 py-4">
      <span
        aria-hidden="true"
        dir="ltr"
        className="flex shrink-0 gap-2.5 sm:w-28"
      >
        <span className="h-3.5 w-3.5 rounded-full bg-[#ff5f57] ring-1 ring-black/10" />
        <span className="h-3.5 w-3.5 rounded-full bg-[#febc2e] ring-1 ring-black/10" />
        <span className="h-3.5 w-3.5 rounded-full bg-[#28c840] ring-1 ring-black/10" />
      </span>
      <span
        dir="ltr"
        className="mx-auto flex max-w-[34rem] min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-[#14110d]/8 bg-white px-4 py-1.5 font-mono text-[13px] text-[#14110d]/60"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 shrink-0 text-[#28a745]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="7" width="10" height="7" rx="1.5" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
        </svg>
        <span className="truncate">{address}</span>
      </span>
      <span className="hidden shrink-0 items-center justify-end gap-2 text-[13px] font-semibold text-[#14110d]/70 sm:flex sm:w-28">
        <span
          aria-hidden="true"
          className="rz-ripple-dot h-2 w-2 rounded-full bg-[#16a34a] text-[#16a34a]"
        />
        {live}
      </span>
    </div>
  );
}

/** A second site peeking out behind the front frame (decorative). */
function DepthPage({ work }: { work: Work }) {
  return (
    <div
      aria-hidden="true"
      className="h-full overflow-hidden rounded-[18px] border border-[#14110d]/10 bg-white shadow-[0_30px_70px_-35px_rgba(20,17,13,0.35)]"
    >
      <div
        dir="ltr"
        className="flex items-center gap-2 border-b border-[#14110d]/10 bg-[#efebe2] px-5 py-4"
      >
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="mx-auto truncate font-mono text-[14px] text-[#14110d]/50">
          {work.host}
        </span>
      </div>
      <img
        src={work.imageSrc}
        alt=""
        className="h-full w-full object-cover object-top"
      />
    </div>
  );
}
