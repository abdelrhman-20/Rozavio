"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";

import { Icon } from "@iconify/react/offline";
import check from "@iconify-icons/lucide/check";
import layoutList from "@iconify-icons/lucide/layout-list";
import messageSquareQuote from "@iconify-icons/lucide/message-square-quote";
import mousePointerClick from "@iconify-icons/lucide/mouse-pointer-click";
import sparkles from "@iconify-icons/lucide/sparkles";
import xIcon from "@iconify-icons/lucide/x";

import { type BeforeAfterData } from "@/content/types";

const ROZAVIO_ORANGE = "#EA4E1A";

type Mode = "before" | "after";

// One icon per theme, in order; extra themes fall back to the last one.
const ITEM_ICONS = [
  messageSquareQuote,
  layoutList,
  mousePointerClick,
  sparkles,
];

interface BeforeAfterTabsProps {
  beforeLabel: string;
  afterLabel: string;
  items: BeforeAfterData["items"];
}

/**
 * The Before / After switch: a two-tab segmented control (WAI-ARIA tabs
 * pattern, with arrow-key navigation) and one panel that shows the same
 * themes in whichever state is selected. Both states stay in the DOM
 * order of the themes, so visitors compare like with like. The panel is
 * remounted on change (via `key`) to play a short fade; reduced-motion
 * users get an instant swap.
 */
export function BeforeAfterTabs({
  beforeLabel,
  afterLabel,
  items,
}: BeforeAfterTabsProps) {
  const [mode, setMode] = useState<Mode>("before");
  const refs = useRef<Record<Mode, HTMLButtonElement | null>>({
    before: null,
    after: null,
  });

  const tabs: { id: Mode; label: string }[] = [
    { id: "before", label: beforeLabel },
    { id: "after", label: afterLabel },
  ];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next: Mode =
      event.key === "Home"
        ? "before"
        : event.key === "End"
          ? "after"
          : mode === "before"
            ? "after"
            : "before";
    setMode(next);
    refs.current[next]?.focus();
  }

  const isAfter = mode === "after";

  return (
    <>
      <div
        role="tablist"
        aria-label="قارن بين موقع عادي وموقع أكثر استراتيجية"
        onKeyDown={onKeyDown}
        data-ba-mode={mode}
        className="relative mx-auto flex w-full max-w-[34rem] overflow-hidden rounded-full border border-[rgb(var(--ba-fg)/0.12)] bg-[rgb(var(--ba-fg)/0.06)] shadow-[0_10px_30px_-22px_rgba(20,17,13,0.35)] transition-colors duration-700"
      >
        {/* The sliding indicator: one pill, exactly one tab's size, that
            transforms between the two tab positions. This is what makes
            the switch feel like the colour physically travels, instead of
            each button independently cross-fading its own background. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 start-0 w-1/2 rounded-full transition-[transform,background-color] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{
            transform: isAfter
              ? "translateX(calc(100% * var(--rz-dir, 1)))"
              : "translateX(0%)",
            backgroundColor: isAfter ? ROZAVIO_ORANGE : "rgb(20 17 13)",
          }}
        />
        {tabs.map((tab) => {
          const selected = mode === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`ba-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls="ba-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setMode(tab.id)}
              className={`relative z-10 min-h-[52px] flex-1 rounded-full px-3 py-3 text-[13px] font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#EA4E1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--ba-bg))] focus-visible:outline-none sm:px-5 sm:text-[14px] ${
                selected
                  ? tab.id === "after"
                    ? "text-white"
                    : "text-[#f4f0e6]"
                  : "text-[rgb(var(--ba-fg)/0.6)] hover:text-[rgb(var(--ba-fg))]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id="ba-panel"
        role="tabpanel"
        aria-labelledby={`ba-tab-${mode}`}
        tabIndex={0}
        className="mt-10 rounded-sm focus-visible:ring-2 focus-visible:ring-[#EA4E1A] focus-visible:ring-offset-4 focus-visible:ring-offset-[rgb(var(--ba-bg))] focus-visible:outline-none sm:mt-12"
      >
        <ol
          key={mode}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5"
        >
          {items.map((item, index) => {
            const heading = isAfter ? item.afterHeading : item.beforeHeading;
            const body = isAfter
              ? item.afterDescription
              : item.beforeDescription;
            const themeIcon =
              ITEM_ICONS[Math.min(index, ITEM_ICONS.length - 1)];
            return (
              <li
                key={index}
                className="rz-swap group"
                style={
                  { "--rz-swap-delay": `${index * 60}ms` } as CSSProperties
                }
              >
                {/* The li stays put and owns the hover area; only this card
                  lifts, so the cursor can't fall off the edge mid-move. */}
                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 text-start transition-[transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:-translate-y-1 sm:p-7 ${
                    isAfter
                      ? "bg-[rgb(var(--ba-fg)/0.06)] shadow-[0_24px_50px_-30px_rgba(234,78,26,0.55)] group-hover:shadow-[0_30px_60px_-28px_rgba(234,78,26,0.7)]"
                      : "bg-[rgb(var(--ba-fg)/0.035)] group-hover:shadow-[0_24px_50px_-34px_rgba(20,17,13,0.45)]"
                  }`}
                  style={{
                    borderColor: isAfter
                      ? `${ROZAVIO_ORANGE}59`
                      : "rgb(var(--ba-fg) / 0.12)",
                  }}
                >
                  {/* Accent bar along the top edge */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{
                      background: isAfter
                        ? `linear-gradient(270deg, ${ROZAVIO_ORANGE}, ${ROZAVIO_ORANGE}00)`
                        : "linear-gradient(270deg, rgb(var(--ba-fg) / 0.25), rgb(var(--ba-fg) / 0))",
                    }}
                  />
                  {/* Oversized watermark number */}
                  <span
                    aria-hidden="true"
                    className="font-display pointer-events-none absolute -top-2 end-3 text-[5.5rem] leading-none font-extrabold transition-colors duration-700"
                    style={{
                      color: isAfter
                        ? `${ROZAVIO_ORANGE}22`
                        : "rgb(var(--ba-fg) / 0.06)",
                    }}
                  >
                    {item.number}
                  </span>

                  <span
                    className="relative grid h-12 w-12 place-items-center rounded-xl transition-colors duration-700"
                    style={
                      isAfter
                        ? { backgroundColor: ROZAVIO_ORANGE, color: "white" }
                        : {
                            backgroundColor: "rgb(var(--ba-fg) / 0.08)",
                            color: "rgb(var(--ba-fg) / 0.55)",
                          }
                    }
                  >
                    <Icon icon={themeIcon} className="h-6 w-6" />
                    <span
                      aria-hidden="true"
                      className={`absolute -end-1.5 -bottom-1.5 grid h-5 w-5 place-items-center rounded-full ring-2 ring-[rgb(var(--ba-bg))] ${
                        isAfter
                          ? "bg-[#16a34a] text-white"
                          : "bg-[#d64545] text-white"
                      }`}
                    >
                      <Icon
                        icon={isAfter ? check : xIcon}
                        className="h-3 w-3"
                      />
                    </span>
                  </span>

                  <p
                    className="mt-6 text-[13px] font-semibold"
                    style={{
                      color: isAfter
                        ? ROZAVIO_ORANGE
                        : "rgb(var(--ba-fg) / 0.5)",
                    }}
                  >
                    {item.label}
                  </p>
                  <h3
                    className={`rz-h3 mt-2.5 transition-colors duration-700 lg:text-[clamp(1.2rem,1rem+0.45vw,1.375rem)]! ${
                      isAfter
                        ? "text-[rgb(var(--ba-fg))]"
                        : "text-[rgb(var(--ba-fg)/0.8)]"
                    }`}
                  >
                    {heading}
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.65] text-[rgb(var(--ba-fg)/0.78)] transition-colors duration-700 xl:min-h-[calc(2*1.65*15px)] xl:text-[15px]">
                    {body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
