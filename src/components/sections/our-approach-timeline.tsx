"use client";

import { Icon, type IconifyIcon } from "@iconify/react/offline";
import chartNoAxesCombined from "@iconify-icons/lucide/chart-no-axes-combined";
import check from "@iconify-icons/lucide/check";
import compass from "@iconify-icons/lucide/compass";
import ear from "@iconify-icons/lucide/ear";
import handshake from "@iconify-icons/lucide/handshake";
import layers from "@iconify-icons/lucide/layers";
import lightbulb from "@iconify-icons/lucide/lightbulb";
import messagesSquare from "@iconify-icons/lucide/messages-square";
import rocket from "@iconify-icons/lucide/rocket";
import route from "@iconify-icons/lucide/route";
import scanSearch from "@iconify-icons/lucide/scan-search";
import stethoscope from "@iconify-icons/lucide/stethoscope";
import target from "@iconify-icons/lucide/target";
import workflow from "@iconify-icons/lucide/workflow";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/sections/spotlight-card";
import { type OurApproachData } from "@/content/types";

const ROZAVIO_ORANGE = "#EA4E1A";

type StageIcon = NonNullable<OurApproachData["stages"][number]["icon"]>;

// Legacy keys (message, search) from the first version map to Lucide too.
const ICONS: Record<StageIcon, IconifyIcon> = {
  "messages-square": messagesSquare,
  "scan-search": scanSearch,
  compass,
  "chart-no-axes-combined": chartNoAxesCombined,
  route,
  workflow,
  layers,
  ear,
  stethoscope,
  target,
  rocket,
  handshake,
  lightbulb,
  message: messagesSquare,
  search: scanSearch,
};

// Icon for each stage position. Used when a stage has no icon of its own,
// and to upgrade the icons older saved content still carries: the first
// version's defaults for each position, plus its generic "message", "search"
// and "scan-search" keys (which saved stages fell back to, so several stages
// ended up sharing one magnifier). Any other explicit choice is respected.
const DEFAULT_ICONS: StageIcon[] = ["ear", "stethoscope", "target", "rocket"];
const LEGACY_DEFAULT_ICONS: StageIcon[] = [
  "messages-square",
  "scan-search",
  "compass",
  "chart-no-axes-combined",
];
const LEGACY_GENERIC_ICONS: StageIcon[] = ["message", "search", "scan-search"];

function stageIcon(icon: StageIcon | undefined, index: number): IconifyIcon {
  const fallback = DEFAULT_ICONS[Math.min(index, DEFAULT_ICONS.length - 1)];
  const isLegacy =
    !icon ||
    icon === LEGACY_DEFAULT_ICONS[index] ||
    LEGACY_GENERIC_ICONS.includes(icon);
  return ICONS[isLegacy ? fallback : icon];
}

const COLUMNS: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

/**
 * One stage's place in the automatic sequence:
 *   pending    — muted, waiting its turn (or the resting start state)
 *   circling   — the accent stroke is sweeping once around its icon
 *   activating — the stroke just finished; icon pops into its full colour
 *   active     — settled in its final, full-colour appearance
 *
 * A connecting line is either `empty` (muted track only) or `filled`
 * (its accent overlay has grown to full length — scaling it is what
 * reads as the colour travelling, not an instant colour swap).
 */
type StepPhase = "pending" | "circling" | "activating" | "active";
type LinePhase = "empty" | "filled";

// Centralized timing/easing config. Every value here is read by both the
// JS schedule (via `setTimeout` delays) and the matching CSS animation/
// transition (via inline style or a CSS custom property) — never
// duplicated as a second, hardcoded number in a Tailwind class, so the
// two can never silently drift apart.
const LINE_MS = 1000;
const CIRCLE_MS = 850;
const ICON_POP_MS = 700;
const PAUSE_MS = 120;

// A constant, unaccelerated travel speed along the whole line.
const LINE_EASE = "linear";
// A constant rotational speed for the full 360° sweep.
const CIRCLE_EASE = "linear";
// The one eased curve in the sequence: a soft, premium settle for the
// icon's own colour swap and its scale pop.
const ICON_POP_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

interface OurApproachTimelineProps {
  stages: OurApproachData["stages"];
}

/**
 * The Our Approach stage row: an automatic, sequential progress timeline
 * of stage cards.
 *
 * Each stage is an icon node on the progress line with a stem dropping to
 * its own card, so the step and its card read as one unit and light up
 * together. On small screens the cards stack at full width and the line runs
 * down the centre, through each icon and in the gaps between cards.
 *
 * Renders fully "active" by default, so content is complete without
 * JavaScript or for reduced-motion users. Once mounted, if motion is
 * allowed, it resets to the pre-animation state and replays once the row
 * scrolls into view: step 1 activates, its line to step 2 fills, step 2's
 * icon sweeps and pops active, and so on through the last stage.
 *
 * The trigger fires as soon as the top of the row is comfortably inside
 * the viewport (not when a share of its area is visible), so a tall stacked
 * layout on a small screen can never leave the sequence waiting forever.
 */
export function OurApproachTimeline({ stages }: OurApproachTimelineProps) {
  const total = stages.length;
  const lineCount = Math.max(total - 1, 0);

  const [stepPhase, setStepPhase] = useState<StepPhase[]>(() =>
    Array(total).fill("active"),
  );
  const [linePhase, setLinePhase] = useState<LinePhase[]>(() =>
    Array(lineCount).fill("filled"),
  );
  const containerRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || total === 0) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only now, once we know it's safe to animate, drop to the starting
    // state — avoids any flash of an incomplete timeline before this runs.
    setStepPhase(Array(total).fill("pending"));
    setLinePhase(Array(lineCount).fill("empty"));

    const timeoutIds: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delay: number) => {
      timeoutIds.push(setTimeout(fn, delay));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        setStepPhase((prev) =>
          prev.map((phase, idx) => (idx === 0 ? "active" : phase)),
        );

        let t = 0;
        for (let i = 1; i < total; i++) {
          const lineIndex = i - 1;

          schedule(() => {
            setLinePhase((prev) =>
              prev.map((phase, idx) => (idx === lineIndex ? "filled" : phase)),
            );
          }, t);
          t += LINE_MS;

          schedule(() => {
            setStepPhase((prev) =>
              prev.map((phase, idx) => (idx === i ? "circling" : phase)),
            );
          }, t);
          t += CIRCLE_MS;

          schedule(() => {
            setStepPhase((prev) =>
              prev.map((phase, idx) => (idx === i ? "activating" : phase)),
            );
          }, t);
          t += ICON_POP_MS;

          schedule(() => {
            setStepPhase((prev) =>
              prev.map((phase, idx) => (idx === i ? "active" : phase)),
            );
          }, t);
          t += PAUSE_MS;
        }
      },
      // Fire once the row's top edge is 15% up from the bottom of the
      // viewport. Independent of the row's height.
      { threshold: 0, rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      timeoutIds.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per mount for this fixed stage count
  }, [total]);

  if (total === 0) return null;

  return (
    <ol
      ref={containerRef}
      className={`grid gap-y-12 lg:gap-x-8 ${COLUMNS[total] ?? "lg:grid-cols-4"}`}
    >
      {stages.map((stage, index) => {
        const isLast = index === total - 1;
        const phase = stepPhase[index] ?? "active";
        const isMuted = phase === "pending" || phase === "circling";
        const tag = [stage.number, stage.label].filter(Boolean).join(". ");

        return (
          <li key={index} className="group relative">
            <Reveal delay={240 + index * 120} className="flex h-full flex-col">
              <span className="relative mx-auto h-14 w-14 shrink-0">
                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-full border bg-[#fdfbf7] transition-colors group-hover:scale-105 group-hover:transition-transform group-hover:duration-300 motion-reduce:transition-none motion-reduce:group-hover:transition-none ${
                    phase === "activating" ? "rz-icon-pop" : ""
                  }`}
                  style={
                    {
                      borderColor: isMuted
                        ? "rgba(20,17,13,0.14)"
                        : `${ROZAVIO_ORANGE}59`,
                      color: isMuted ? "rgba(20,17,13,0.32)" : ROZAVIO_ORANGE,
                      transitionDuration: `${ICON_POP_MS}ms`,
                      transitionTimingFunction: ICON_POP_EASE,
                      "--rz-pop-ms": `${ICON_POP_MS}ms`,
                    } as CSSProperties
                  }
                >
                  <Icon
                    icon={stageIcon(stage.icon, index)}
                    width={24}
                    height={24}
                    aria-hidden="true"
                    className="block"
                  />
                </div>

                {phase === "circling" ? (
                  // Matches the icon's own 56px circular boundary exactly
                  // (same viewBox, same radius as the icon's own border),
                  // rendered after the icon div so it paints on top of the
                  // icon's border. Rotation matches where each breakpoint's
                  // line actually enters the circle: left on desktop, top
                  // on mobile/tablet.
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 56 56"
                    className="pointer-events-none absolute inset-0 h-full w-full -rotate-90 motion-reduce:hidden lg:rotate-0"
                  >
                    <circle
                      cx="28"
                      cy="28"
                      r="27"
                      fill="none"
                      stroke={ROZAVIO_ORANGE}
                      strokeWidth="2"
                      strokeLinecap="round"
                      pathLength={100}
                      strokeDasharray={100}
                      className="rz-circle-sweep"
                      style={
                        {
                          "--rz-circle-ms": `${CIRCLE_MS}ms`,
                          "--rz-circle-ease": CIRCLE_EASE,
                        } as CSSProperties
                      }
                    />
                  </svg>
                ) : null}
              </span>

              {/* Desktop stem: drops from the icon to its card and fills
                  when the stage activates, so each step is visibly tied to
                  its own card. */}
              <span
                aria-hidden="true"
                className="relative mx-auto block h-7 w-px overflow-hidden bg-[#14110d]/15"
              >
                <span
                  className="absolute inset-0 origin-top transition-transform motion-reduce:transition-none"
                  style={
                    {
                      backgroundColor: ROZAVIO_ORANGE,
                      transform: isMuted ? "scaleY(0)" : "scaleY(1)",
                      transitionDuration: `${ICON_POP_MS}ms`,
                      transitionTimingFunction: ICON_POP_EASE,
                    } as CSSProperties
                  }
                />
              </span>

              {/* The stage's content card. It lights up with its icon: muted
                  while the sequence hasn't reached it, accented once it has.
                  The li owns the hover area; only the inner wrapper lifts. */}
              <div className="flex flex-1 flex-col">
                <div className="flex flex-1 flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 motion-reduce:transition-none">
                  <SpotlightCard
                    className="flex h-full flex-col rounded-2xl border bg-[#fdfbf7] p-6 transition-[border-color,box-shadow] motion-reduce:transition-none"
                    style={
                      {
                        borderColor: isMuted
                          ? "rgba(20,17,13,0.1)"
                          : `${ROZAVIO_ORANGE}40`,
                        boxShadow: isMuted
                          ? "0 20px 40px -34px rgba(20,17,13,0.3)"
                          : `0 24px 50px -32px ${ROZAVIO_ORANGE}73`,
                        transitionDuration: `${ICON_POP_MS}ms`,
                        transitionTimingFunction: ICON_POP_EASE,
                      } as CSSProperties
                    }
                  >
                    {/* Accent bar along the top edge */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[3px] origin-left rtl:origin-right transition-transform motion-reduce:transition-none"
                      style={
                        {
                          backgroundColor: ROZAVIO_ORANGE,
                          transform: isMuted ? "scaleX(0)" : "scaleX(1)",
                          transitionDuration: `${ICON_POP_MS}ms`,
                          transitionTimingFunction: ICON_POP_EASE,
                        } as CSSProperties
                      }
                    />
                    {/* Oversized outlined stage number */}
                    {stage.number ? (
                      <span
                        aria-hidden="true"
                        className="font-display pointer-events-none absolute -top-2 end-4 text-[4.5rem] leading-none font-extrabold text-transparent"
                        style={{ WebkitTextStroke: "1px rgba(20,17,13,0.14)" }}
                      >
                        {stage.number}
                      </span>
                    ) : null}

                    <div className="relative flex flex-1 flex-col">
                      {tag ? (
                        <p
                          className="inline-flex self-start rounded-full border px-3 py-1 text-[13.5px] font-semibold"
                          style={{
                            color: ROZAVIO_ORANGE,
                            borderColor: `${ROZAVIO_ORANGE}59`,
                            backgroundColor: `${ROZAVIO_ORANGE}14`,
                          }}
                        >
                          {stage.label || tag}
                        </p>
                      ) : null}
                      <h3 className="rz-h3 mt-4">
                        {stage.title}
                      </h3>
                      {stage.description ? (
                        <p className="mt-3 text-[16px] leading-[1.7] text-[#14110d]/80">
                          {stage.description}
                        </p>
                      ) : null}
                      {stage.outcome ? (
                        <div className="mt-auto pt-5">
                          <p className="flex gap-3 rounded-xl bg-[#14110d]/[0.04] px-3.5 py-3 text-[15px] leading-[1.55] font-medium text-[#14110d]/85">
                            <span
                              aria-hidden="true"
                              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
                              style={{ backgroundColor: ROZAVIO_ORANGE }}
                            >
                              <Icon icon={check} className="h-3 w-3" />
                            </span>
                            {stage.outcome}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </SpotlightCard>
                </div>
              </div>
            </Reveal>

            {/* Connectors between icons: a vertical track in the gap between cards
                on small screens, a horizontal one on desktop running from this icon's edge to
                the next icon's edge (centre to centre, minus the 56px
                icons). The accent overlay growing from 0 to full length is
                what shows the progress travelling. */}
            {!isLast ? (
              <>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-12 left-1/2 h-12 w-px -translate-x-1/2 overflow-hidden bg-[#14110d]/15 lg:hidden"
                >
                  <span
                    className="absolute inset-0 origin-top transition-transform motion-reduce:transition-none"
                    style={
                      {
                        backgroundColor: ROZAVIO_ORANGE,
                        transform:
                          linePhase[index] === "filled"
                            ? "scaleY(1)"
                            : "scaleY(0)",
                        transitionDuration: `${LINE_MS}ms`,
                        transitionTimingFunction: LINE_EASE,
                      } as CSSProperties
                    }
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute top-7 start-[calc(50%+1.75rem)] hidden h-px w-[calc(100%-1.5rem)] overflow-hidden bg-[#14110d]/15 lg:block"
                >
                  <span
                    className="absolute inset-0 origin-left rtl:origin-right transition-transform motion-reduce:transition-none"
                    style={
                      {
                        backgroundColor: ROZAVIO_ORANGE,
                        transform:
                          linePhase[index] === "filled"
                            ? "scaleX(1)"
                            : "scaleX(0)",
                        transitionDuration: `${LINE_MS}ms`,
                        transitionTimingFunction: LINE_EASE,
                      } as CSSProperties
                    }
                  />
                </span>
              </>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
