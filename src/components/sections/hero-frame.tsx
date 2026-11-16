"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useRef, useState } from "react";

import { SiteDialog } from "@/components/sections/site-dialog";
import { type HeroFrameData } from "@/content/types";
import { cn } from "@/lib/utils/cn";

type FrameImage = HeroFrameData["frameImages"][number];

export interface HeroFrameProps {
  eyebrow: string;
  clientName: string;
  clientDescriptor?: string;
  images: FrameImage[];
  hint?: string;
  openLabel?: string;
  closeLabel?: string;
  newTabLabel?: string;
  minimizeLabel?: string;
  expandLabel?: string;
  chooseLabel?: string;
}

type WinState = "open" | "min" | "closed";

/**
 * Hero Frame: the evidence panel beside the hero claim.
 *
 * A browser window shows a tall screenshot of a real client site. The
 * visitor scrolls it with the mouse wheel (or finger) as if browsing the
 * site; nothing scrolls on its own. A site picker above the window
 * switches between the client sites, and pressing the window opens the
 * live website in a large dialog (iframe) where everything is selectable.
 *
 * All windows stay mounted, so each remembers its own scroll position and
 * its screenshot is already decoded when selected.
 */
export function HeroFrame({
  eyebrow,
  clientName,
  clientDescriptor,
  images,
  hint,
  openLabel = "Open",
  closeLabel = "Close",
  newTabLabel = "Open in new tab",
  minimizeLabel = "Minimize",
  expandLabel = "Expand",
  chooseLabel = "Choose a site",
}: HeroFrameProps) {
  const [selected, setSelected] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  // Each window keeps its own state: red closes, yellow folds to the bar.
  const [states, setStates] = useState<WinState[]>(() =>
    images.map(() => "open"),
  );
  const [dialogIndex, setDialogIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const setWin = useCallback((index: number, next: WinState) => {
    setStates((prev) => prev.map((s, i) => (i === index ? next : s)));
  }, []);
  const choose = useCallback(
    (index: number) => {
      setSelected(index);
      setWin(index, "open");
    },
    [setWin],
  );
  const expand = useCallback((index: number) => {
    openerRef.current = document.activeElement as HTMLElement | null;
    setDialogIndex(index);
  }, []);
  const closeDialog = useCallback(() => {
    setDialogIndex(null);
    openerRef.current?.focus();
  }, []);

  // Go straight to the live website in a new tab (no in-page dialog).
  const open = useCallback(
    (index: number) => {
      const url = images[index]?.url;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    },
    [images],
  );

  return (
    <div className="hero__frame flex flex-col">
      <span className="rz-hero-rise rz-hero-d1 mx-auto mb-4 inline-flex w-full max-w-[380px] items-center justify-start gap-2 text-[13px] font-semibold tracking-[0.04em] text-[#EA4E1A] sm:max-w-[474px]">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-[#EA4E1A]"
        />
        {eyebrow}
      </span>

      <div className="relative mx-auto w-full max-w-[380px] sm:max-w-[474px]">
        {/* Soft glow behind the card that follows the moving border light. */}
        <div aria-hidden="true" className="rz-hero-halo" />

        <div className="rz-hero-rise rz-hero-d2 relative overflow-hidden rounded-[26px] p-[2px]">
          {/* Static gradient border: bright orange easing into a deep rust. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[26px]"
            style={{
              background:
                "linear-gradient(135deg, #EA4E1A 0%, #c9481d 30%, #9a3d1b 60%, #74301a 100%)",
            }}
          />

          {/* Moving light: a soft-tailed sweep that glides around the border. */}
          <div aria-hidden="true" className="rz-hero-light" />

          <div
            className="bg-fill rounded-[23px]"
            style={{
              background:
                "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(234,78,26,0.22), transparent 70%), #0a0810",
            }}
          >
            {/* Site picker */}
            <div
              role="tablist"
              aria-label={eyebrow}
              dir="ltr"
              className="absolute inset-x-3 top-4 z-30 flex justify-center gap-2"
            >
              {images.map((image, index) => {
                const on = index === selected;
                const st = states[index];
                return (
                  <button
                    key={image.url}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => choose(index)}
                    className={cn(
                      "flex min-w-0 items-center gap-2 rounded-full border py-1 ps-1 pe-3 text-xs font-bold transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#EA4E1A]",
                      on
                        ? "border-[#EA4E1A] bg-[#EA4E1A]/20 text-white"
                        : "border-white/15 bg-white/5 text-[#f4f0e6]/70 hover:border-white/35 hover:text-white",
                    )}
                  >
                    <img
                      src={image.thumb}
                      alt=""
                      className="h-6 w-6 shrink-0 rounded-full object-cover object-top"
                    />
                    <span className="truncate">{image.label}</span>
                    {st !== "open" ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          st === "closed" ? "bg-[#ff5f57]" : "bg-[#febc2e]",
                        )}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Browser windows */}
            <div className="absolute inset-x-4 top-16 bottom-24">
              {images.map((image, index) => {
                const st = states[index] ?? "open";
                const on = index === selected && st !== "closed";
                const folded = on && st === "min";
                return (
                  <div
                    key={image.url}
                    role="tabpanel"
                    aria-hidden={!on}
                    className={cn(
                      "absolute inset-x-0 top-0 flex h-full flex-col overflow-hidden rounded-xl bg-[#14101c] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.8)] ring-1 ring-white/15 transition-[opacity,transform,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                      on ? "opacity-100" : "pointer-events-none opacity-0",
                      index === selected &&
                        st === "closed" &&
                        "translate-y-2 scale-90",
                      folded && "h-[34px]",
                    )}
                  >
                    <div
                      dir="ltr"
                      onClick={(event) => {
                        if (
                          folded &&
                          !(event.target as HTMLElement).closest("button")
                        )
                          setWin(index, "open");
                      }}
                      className="flex h-[34px] shrink-0 items-center gap-1 bg-[#1e1b26] ps-0.5 pe-3"
                    >
                      <span className="group/dots flex shrink-0">
                        <WindowDot
                          color="#ff5f57"
                          label={closeLabel}
                          glyph="close"
                          disabled={!on}
                          onClick={() => setWin(index, "closed")}
                        />
                        <WindowDot
                          color="#febc2e"
                          label={minimizeLabel}
                          glyph="min"
                          disabled={!on}
                          onClick={() => setWin(index, folded ? "open" : "min")}
                        />
                        <WindowDot
                          color="#28c840"
                          label={expandLabel}
                          glyph="expand"
                          disabled={!on}
                          onClick={() => expand(index)}
                        />
                      </span>
                      <span className="ms-1 flex-1 truncate rounded bg-black/30 px-2 py-0.5 text-center font-mono text-[10px] text-[#f4f0e6]/60">
                        {image.label}
                      </span>
                      <button
                        type="button"
                        tabIndex={on ? 0 : -1}
                        onClick={() => open(index)}
                        className="shrink-0 rounded-full bg-[#EA4E1A] px-2.5 py-0.5 text-[10px] font-bold text-white transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                      >
                        {openLabel} ↗
                      </button>
                    </div>

                    {/* The visitor scrolls this region. Lenis is told to
                        leave the wheel alone here so it scrolls natively. */}
                    <div
                      data-lenis-prevent
                      tabIndex={on && !folded ? 0 : -1}
                      role="region"
                      aria-label={image.alt}
                      onScroll={() => setScrolled(true)}
                      onClick={() => open(index)}
                      dir="ltr"
                      className="hero-preview-scroll relative min-h-0 flex-1 cursor-pointer overflow-y-auto bg-white outline-none focus-visible:ring-2 focus-visible:ring-[#EA4E1A] focus-visible:ring-inset"
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading={index === 0 ? "eager" : "lazy"}
                        draggable={false}
                        className="block h-auto w-full select-none"
                      />
                    </div>
                  </div>
                );
              })}

              {states[selected] === "closed" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-white/20 text-center">
                  <p className="text-sm text-[#f4f0e6]/70">{chooseLabel}</p>
                  <div dir="ltr" className="flex gap-3.5">
                    {images.map((image, index) => (
                      <button
                        key={image.url}
                        type="button"
                        onClick={() => choose(index)}
                        className="group/app grid w-20 justify-items-center gap-1.5 font-mono text-[10px] text-[#f4f0e6]/80 outline-none focus-visible:text-white"
                      >
                        <img
                          src={image.thumb}
                          alt=""
                          className="h-14 w-14 rounded-2xl object-cover object-top ring-1 ring-white/15 transition-transform duration-200 group-hover/app:-translate-y-1 group-hover/app:scale-105 group-focus-visible/app:ring-2 group-focus-visible/app:ring-[#EA4E1A]"
                        />
                        <span className="max-w-full truncate">
                          {image.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {hint && !scrolled && states[selected] === "open" ? (
                <span className="pointer-events-none absolute start-1/2 bottom-3 z-10 -translate-x-1/2 rounded-full border border-white/20 bg-[#0a0810]/80 px-3 py-1 text-[11px] whitespace-nowrap text-[#f4f0e6] backdrop-blur-sm rtl:translate-x-1/2">
                  {hint} ↓
                </span>
              ) : null}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#0a0810] via-[#0a0810]/85 to-transparent px-5 pt-10 pb-5">
              <p className="text-base font-bold text-white">{clientName}</p>
              {clientDescriptor ? (
                <p className="mt-0.5 text-sm text-[#f4f0e6]/70">
                  {clientDescriptor}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {dialogIndex !== null && images[dialogIndex] ? (
        <SiteDialog
          image={{
            src: images[dialogIndex].src,
            url: images[dialogIndex].url,
            label: images[dialogIndex].label,
          }}
          closeLabel={closeLabel}
          newTabLabel={newTabLabel}
          onClose={closeDialog}
        />
      ) : null}
    </div>
  );
}

/** A macOS-style window control: a roomy touch target around a small dot. */
function WindowDot({
  color,
  label,
  glyph,
  disabled,
  onClick,
}: {
  color: string;
  label: string;
  glyph: "close" | "min" | "expand";
  disabled?: boolean;
  onClick: () => void;
}) {
  const path = {
    close: "M1.5 1.5l5 5M6.5 1.5l-5 5",
    min: "M1.5 4h5",
    expand: "M2 5.8V2h3.8M6 2.2V6H2.2",
  }[glyph];
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      tabIndex={disabled ? -1 : 0}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="group/dot grid h-[34px] w-6 cursor-pointer place-items-center outline-none"
    >
      <span
        style={{ backgroundColor: color }}
        className="grid h-[11px] w-[11px] place-items-center rounded-full transition-transform duration-150 group-hover/dot:scale-110 group-active/dot:scale-90 group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-white"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 8 8"
          className="h-[7px] w-[7px] fill-none stroke-black/65 opacity-0 transition-opacity group-focus-within/dots:opacity-100 group-hover/dots:opacity-100"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={path} />
        </svg>
      </span>
    </button>
  );
}
