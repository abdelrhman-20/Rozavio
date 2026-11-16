"use client";

import { type KeyboardEvent, type ReactNode, useRef, useState } from "react";

import {
  JourneyFeatureList,
  PracticeJourneyMockup,
} from "@/components/sections/what-we-build-journey";
import { PracticeFoundationsMockup } from "@/components/sections/what-we-build-foundations-mockup";
import { PracticeSiteMockup } from "@/components/sections/what-we-build-practice-mockup";
import { PracticePrioritiesMockup } from "@/components/sections/what-we-build-priorities-mockup";
import { ScaledDesktop } from "@/components/sections/scaled-desktop";
import { type WhatWeBuildData } from "@/content/types";

const ROZAVIO_ORANGE = "#EA4E1A";

type Visual = NonNullable<WhatWeBuildData["items"][number]["visual"]>;
const VISUAL_ORDER: Visual[] = [
  "messaging",
  "journey",
  "priorities",
  "foundations",
];

const MOCKUPS: Record<Visual, () => ReactNode> = {
  messaging: PracticeSiteMockup,
  journey: PracticeJourneyMockup,
  priorities: PracticePrioritiesMockup,
  foundations: PracticeFoundationsMockup,
};

/**
 * The four capabilities as tabs: the visitor picks one and sees its copy,
 * feature list and website mockup side by side, instead of scrolling past
 * four stacked rows. WAI-ARIA tabs pattern with arrow-key navigation. Only
 * the selected panel is mounted; the swap plays the shared `rz-swap` fade
 * (instant for reduced-motion users).
 */
export function WhatWeBuildTabs({
  items,
}: {
  items: WhatWeBuildData["items"];
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = items.length - 1;

  function select(index: number) {
    setActive(index);
    refs.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // Arrow keys follow the visual direction, which is mirrored in RTL.
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const backward = rtl ? "ArrowRight" : "ArrowLeft";
    if (event.key === forward) {
      event.preventDefault();
      select(active === last ? 0 : active + 1);
    } else if (event.key === backward) {
      event.preventDefault();
      select(active === 0 ? last : active - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0);
    } else if (event.key === "End") {
      event.preventDefault();
      select(last);
    }
  }

  const item = items[active];
  if (!item) return null;
  const visual = item.visual ?? VISUAL_ORDER[active % VISUAL_ORDER.length]!;
  const VisualMockup = MOCKUPS[visual];

  return (
    <div>
      <div
        role="tablist"
        aria-label="ما نبنيه"
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4"
      >
        {items.map((tab, index) => {
          const selected = index === active;
          return (
            <button
              key={index}
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`wwb-tab-${index}`}
              aria-selected={selected}
              aria-controls="wwb-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              className={`flex min-h-[64px] cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-start transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#EA4E1A] focus-visible:ring-offset-2 focus-visible:outline-none ${
                selected
                  ? "border-[#14110d] bg-[#14110d] text-[#f4f0e6]"
                  : "border-[#14110d]/12 bg-white/60 text-[#14110d] hover:border-[#14110d]/30"
              }`}
            >
              <span
                className="font-display text-[1.4rem] leading-none font-extrabold"
                style={{ color: ROZAVIO_ORANGE }}
              >
                {tab.number}
              </span>
              <span className="text-[14px] leading-[1.4] font-bold sm:text-[15px]">
                {tab.title}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="wwb-panel"
        role="tabpanel"
        aria-labelledby={`wwb-tab-${active}`}
        tabIndex={0}
        className="mt-10 rounded-sm focus-visible:ring-2 focus-visible:ring-[#EA4E1A] focus-visible:ring-offset-4 focus-visible:outline-none lg:mt-14"
      >
        <div
          key={active}
          className="rz-swap grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
        >
          <div className="lg:col-span-5">
            <h3 className="rz-h3-lg">{item.title}</h3>
            {item.description ? (
              <p className="mt-4 rz-lead text-[#14110d]/70">
                {item.description}
              </p>
            ) : null}
            {item.examples.length > 0 ? (
              <JourneyFeatureList examples={item.examples} visual={visual} />
            ) : null}
          </div>
          <div className="min-w-0 lg:col-span-7">
            <ScaledDesktop>
              <VisualMockup />
            </ScaledDesktop>
          </div>
        </div>
      </div>
    </div>
  );
}
