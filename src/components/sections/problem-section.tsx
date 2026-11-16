import { type CSSProperties, type ReactNode } from "react";

import { ProblemIntro } from "@/components/sections/problem-intro";
import { ProblemGapEntry } from "@/components/sections/problem-gap-entry";
import { SpotlightCard } from "@/components/sections/spotlight-card";
import { type ProblemData } from "@/content/types";

export type { ProblemData };

/**
 * Rozavio's "Rozavio orange" — distinct from the per-site primary token
 * (which carries the niche palette). Reserved here for the headline's
 * emphasis, the category labels, the timeline markers and small accents.
 */
const ROZAVIO_ORANGE = "#EA4E1A";

/**
 * Problem section — "The Digital Gap", a split, scroll-driven editorial
 * section directly below the client proof.
 *
 * Strategic purpose: diagnose, not attack. The Hero has made Rozavio's
 * claim and the client proof has shown real work; this section creates
 * recognition ("that's exactly what's happening with our website") and
 * reframes the issue as a gap between the practice and its digital
 * presence — not a verdict that the website is bad. It deliberately ends
 * without a CTA so it flows into the next section's perspective.
 *
 * Structure mirrors the Hero Frame: `section > div.container > content`,
 * so it shares the site's container width.
 *
 *   - Left: a sticky panel (eyebrow, headline, paragraph, scroll hint)
 *     that stays in view while the visitor reads the timeline. Plain CSS
 *     `position: sticky` — no scroll locking; it releases when the
 *     section ends. Below 991px it is not sticky and simply stacks first.
 *   - Right: four numbered entries on a thin vertical timeline, each
 *     revealing as it scrolls into view (`ProblemGapEntry`), then the
 *     closing statement.
 *
 * Optional images (one per entry) come from the Media Library; without them the typography and timeline carry the section.
 */
export function ProblemSection({
  data,
}: { data: ProblemData }) {
  const {
    eyebrow,
    heading,
    leadParagraph,
    supportingParagraph,
    headingAccent,
    scrollHint,
    gaps,
    closingStatement,
    closingAccent,
    diagram,
  } = data;

  return (
    <section
      className="problem_section relative overflow-x-clip text-[#14110d]"
      style={{ backgroundColor: "rgb(248, 245, 238)" }}
    >
      <div className="relative container mx-auto flex flex-col gap-12 py-16 min-[991px]:flex-row min-[991px]:items-start min-[991px]:gap-12 sm:gap-14 sm:pt-20 sm:pb-24 lg:gap-16 lg:pt-28 lg:pb-32">
        {/* Left — persistent headline (sticky on desktop). Plain type on
            the section ground: no panel, border or background. */}
        <div className="min-w-0 min-[991px]:sticky min-[991px]:top-8 min-[991px]:w-[38%] min-[991px]:shrink-0 min-[991px]:self-start">
          <ProblemIntro className="rz-intro flex flex-col justify-between min-[991px]:h-[calc(100vh-4rem)] min-[991px]:max-h-[44rem] min-[991px]:min-h-[30rem]">
            <div className="my-auto">
              {eyebrow ? (
                <p className="problem__eyebrow flex items-center gap-3 text-[14px] font-semibold text-[#EA4E1A] uppercase">
                  <span
                    aria-hidden="true"
                    className="rz-intro-line h-px w-10 bg-[#EA4E1A]"
                  />
                  <span
                    className="rz-intro-item"
                    style={{ "--d": "150ms" } as CSSProperties}
                  >
                    {eyebrow}
                  </span>
                </p>
              ) : null}

              <h2 className="rz-h2 problem__title mt-6">
                {renderHeadingWithEmphasis(heading, headingAccent)}
              </h2>

              {leadParagraph ? (
                <p
                  className="rz-intro-item rz-intro-rise mt-7 max-w-[26em] rz-lead text-[#14110d]/70"
                  style={{ "--d": "1000ms" } as CSSProperties}
                >
                  {leadParagraph}
                </p>
              ) : null}
              {supportingParagraph ? (
                <p
                  className="rz-intro-item rz-intro-rise mt-4 max-w-[26em] rz-lead text-[#14110d]/70"
                  style={{ "--d": "1150ms" } as CSSProperties}
                >
                  {supportingParagraph}
                </p>
              ) : null}

              {/* Practice vs website: a glowing circle and a faded one with
                  a dashed, travelling line (the gap) between them. */}
              <div
                aria-hidden="true"
                className="rz-intro-item rz-intro-rise relative mt-9 h-[10.75rem] w-full max-w-[25rem]"
                style={{ "--d": "1250ms" } as CSSProperties}
              >
                <div
                  className="rz-gap-float-a rz-gap-merge-b absolute top-2 right-0 grid h-28 w-28 place-items-center rounded-full border text-center"
                  style={{
                    borderColor: ROZAVIO_ORANGE,
                    backgroundColor: `${ROZAVIO_ORANGE}1f`,
                    boxShadow: `0 0 44px -6px ${ROZAVIO_ORANGE}8c`,
                  }}
                >
                  <span
                    className="text-[13.5px] leading-[1.4] font-bold uppercase"
                    style={{ color: ROZAVIO_ORANGE }}
                  >
                    {diagram.practice}
                  </span>
                </div>

                <svg
                  className="rz-gap-hide absolute top-[3.625rem] left-28 h-3 w-[calc(100%-14rem)] overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 4"
                >
                  <line
                    x1="0"
                    y1="2"
                    x2="100"
                    y2="2"
                    stroke={ROZAVIO_ORANGE}
                    strokeWidth="2"
                    strokeDasharray="5 7"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    className="rz-gap-dash"
                  />
                </svg>
                <span
                  className="rz-gap-chip rz-gap-hide absolute top-[3.2rem] left-1/2 -translate-x-1/2 rounded-full border bg-white px-2.5 py-1 text-[13.5px] font-bold whitespace-nowrap shadow-[0_8px_20px_-10px_rgba(20,17,13,0.4)]"
                  style={{
                    color: ROZAVIO_ORANGE,
                    borderColor: `${ROZAVIO_ORANGE}66`,
                  }}
                >
                  {diagram.gap}
                </span>

                {/* A few seconds in the circles slide together and overlap,
                    and Rozavio appears where they meet. */}
                <span
                  className="rz-gap-orb absolute top-[3.625rem] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full opacity-0"
                  style={{
                    backgroundColor: ROZAVIO_ORANGE,
                    boxShadow: `0 0 18px 5px ${ROZAVIO_ORANGE}99`,
                  }}
                />
                <span
                  className="rz-gap-rozavio absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[13.5px] font-bold whitespace-nowrap text-white opacity-0"
                  style={{
                    backgroundColor: ROZAVIO_ORANGE,
                    boxShadow: `0 8px 24px -6px ${ROZAVIO_ORANGE}b3`,
                  }}
                >
                  {diagram.solution}
                </span>

                <div className="rz-gap-float-b rz-gap-merge-a absolute top-2 left-0 grid h-28 w-28 place-items-center rounded-full border border-dashed border-[#14110d]/25 bg-[#14110d]/[0.04] text-center">
                  <span className="rz-gap-flicker rz-gap-grey text-[13.5px] leading-[1.4] font-bold text-[#14110d]/40 uppercase">
                    <span className="mx-auto mb-1.5 block h-1 w-8 rounded-full bg-[#14110d]/15" />
                    {diagram.website}
                  </span>
                  {/* The website once connected: solid, glowing, alive */}
                  <span
                    className="rz-gap-alive absolute -inset-px grid place-items-center rounded-full border text-center opacity-0"
                    style={{
                      borderColor: ROZAVIO_ORANGE,
                      backgroundColor: `${ROZAVIO_ORANGE}1f`,
                      boxShadow: `0 0 44px -6px ${ROZAVIO_ORANGE}8c`,
                    }}
                  >
                    <span
                      className="text-[13.5px] leading-[1.4] font-bold uppercase"
                      style={{ color: ROZAVIO_ORANGE }}
                    >
                      {/* Same footprint as the grey state's placeholder bar,
                          so the label doesn't shift when the circle lights up. */}
                      <span className="mx-auto mb-1.5 block h-1 w-8" />
                      {diagram.website}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {scrollHint ? (
              <div
                aria-hidden="true"
                className="rz-intro-item rz-intro-rise mt-10 hidden items-end gap-3 min-[991px]:flex"
                style={{ "--d": "1350ms" } as CSSProperties}
              >
                <span className="relative h-14 w-px bg-[#14110d]/15">
                  <span
                    className="absolute top-0 start-0 h-6 w-px"
                    style={{ backgroundColor: ROZAVIO_ORANGE }}
                  />
                </span>
                <span className="text-[13px] leading-[1.6] font-medium text-[#14110d]/50 uppercase">
                  {scrollHint}
                </span>
              </div>
            ) : null}
          </ProblemIntro>
        </div>

        {/* Right — the timeline and the closing statement. */}
        <div className="min-w-0 min-[991px]:flex-1 min-[991px]:pt-2">
          {gaps.length > 0 ? (
            <ol className="relative flex flex-col">
              {/* Thin vertical timeline behind the markers. */}
              <span
                aria-hidden="true"
                className="absolute top-6 bottom-6 start-6 hidden w-px bg-[#EA4E1A]/20 sm:start-7 sm:block"
              />
              {gaps.map((gap, index) => (
                <ProblemGapEntry
                  key={index}
                  number={gap.number ?? String(index + 1).padStart(2, "0")}
                >
                  {/* The outer wrapper owns the hover area; only the inner
                      one lifts, so the cursor can't fall off the edge. */}
                  <article className="group pb-5 sm:pb-6">
                    <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 motion-reduce:transition-none">
                      <SpotlightCard className="rounded-2xl border border-[#14110d]/10 bg-[#fdfbf7] p-6 shadow-[0_20px_40px_-32px_rgba(20,17,13,0.35)] transition-[border-color,box-shadow] duration-500 hover:border-[#EA4E1A]/40 hover:shadow-[0_30px_60px_-30px_rgba(234,78,26,0.45)] sm:p-8">
                        {/* Accent bar that draws across on hover */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-[3px] origin-left rtl:origin-right scale-x-[0.18] bg-[#EA4E1A] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none"
                        />
                        <div className="relative flex flex-col gap-7 xl:flex-row xl:items-start xl:gap-9">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p
                                className="inline-flex rounded-full border px-3 py-1 text-[13px] font-semibold uppercase"
                                style={{
                                  color: ROZAVIO_ORANGE,
                                  borderColor: `${ROZAVIO_ORANGE}59`,
                                  backgroundColor: `${ROZAVIO_ORANGE}14`,
                                }}
                              >
                                {gap.category}
                              </p>
                              {/* On phones the timeline marker is hidden, so the
                                  step number lives inside the card instead. */}
                              <span
                                aria-hidden="true"
                                className="font-display text-[1.6rem] leading-none font-extrabold text-transparent sm:hidden"
                                style={{
                                  WebkitTextStroke: `1px ${ROZAVIO_ORANGE}`,
                                }}
                              >
                                {gap.number ??
                                  String(index + 1).padStart(2, "0")}
                              </span>
                            </div>
                            <h3 className="rz-h3 mt-3">
                              {gap.heading}
                            </h3>
                            {gap.description ? (
                              <p className="mt-4 max-w-[34em] text-[16px] leading-[1.7] text-[#14110d]/78 sm:text-[16.5px]">
                                {gap.description}
                              </p>
                            ) : null}
                          </div>

                        </div>
                      </SpotlightCard>
                    </div>
                  </article>
                </ProblemGapEntry>
              ))}
            </ol>
          ) : null}

          {closingStatement ? (
            <footer className="mt-4 border-t border-[#14110d]/10 pt-10 sm:ms-[5.25rem] sm:pt-12">
              <p className="rz-h3-lg max-w-[24em] font-semibold">
                {renderClosing(closingStatement, closingAccent)}
              </p>
            </footer>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * Renders the headline as two lines: the plain claim, then the accent
 * clause in the brand orange. Each line flips open on its own.
 */
function renderHeadingWithEmphasis(heading: string, accent?: string): ReactNode {
  const flip = (delay: string): CSSProperties =>
    ({ "--d": delay }) as CSSProperties;

  return (
    <>
      <span className="rz-intro-item rz-intro-flip block" style={flip("350ms")}>
        {heading}
      </span>
      {accent ? (
        <span
          className="rz-intro-item rz-intro-flip block"
          style={{ ...flip("650ms"), color: ROZAVIO_ORANGE }}
        >
          {accent}
        </span>
      ) : null}
    </>
  );
}

/** Closing statement: a bold lead-in and a quieter continuation. */
function renderClosing(statement: string, accent?: string): ReactNode {
  return (
    <>
      {statement}{" "}
      {accent ? <span className="text-[#14110d]/60">{accent}</span> : null}
    </>
  );
}
