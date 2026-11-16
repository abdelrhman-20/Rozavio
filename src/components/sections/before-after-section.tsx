import { Reveal } from "@/components/motion/reveal";
import { BeforeAfterTabs } from "@/components/sections/before-after-tabs";
import {
  DISCUSS_PRACTICE_HREF,
  SectionCta,
} from "@/components/sections/section-cta";
import { type BeforeAfterData } from "@/content/types";

export type { BeforeAfterData };

const ROZAVIO_ORANGE = "#EA4E1A";

/**
 * Before / After section: a centred heading above an interactive
 * two-state comparison of the same four themes.
 *
 * Structure mirrors the Hero Frame: `section > div.container > content`.
 * The server component owns the copy and layout; the switch itself is the
 * `BeforeAfterTabs` client component. Without JavaScript the "before"
 * state is rendered, so all content stays readable.
 */
export function BeforeAfterSection({
  data,
}: { data: BeforeAfterData }) {
  const {
    overline,
    heading,
    description,
    beforeLabel,
    afterLabel,
    note,
    items,
    ctaText,
    ctaLabel,
    ctaHref,
  } = data;

  return (
    <section className="relative overflow-hidden bg-[rgb(var(--ba-bg))] text-[rgb(var(--ba-fg))] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [--ba-bg:248_245_238] [--ba-fg:20_17_13] has-[[data-ba-mode=after]]:[--ba-bg:20_17_13] has-[[data-ba-mode=after]]:[--ba-fg:244_240_230] motion-reduce:transition-none">
      <div className="relative container mx-auto py-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <div className="mx-auto max-w-[46rem] text-center">
          {overline ? (
            <Reveal>
              <p
                className="text-[14px] font-semibold"
                style={{ color: ROZAVIO_ORANGE }}
              >
                {overline}
              </p>
            </Reveal>
          ) : null}
          <Reveal delay={80}>
            <h2 className="rz-h2 mt-6">
              {heading}
            </h2>
          </Reveal>
          {description ? (
            <Reveal delay={160}>
              <p className="mx-auto mt-6 max-w-[38rem] rz-lead text-[rgb(var(--ba-fg)/0.7)] transition-colors duration-700">
                {description}
              </p>
            </Reveal>
          ) : null}
        </div>

        {items.length > 0 ? (
          <Reveal delay={240} className="mt-10 sm:mt-12">
            <BeforeAfterTabs
              beforeLabel={beforeLabel || "قبل"}
              afterLabel={afterLabel || "بعد"}
              items={items}
            />
          </Reveal>
        ) : null}

        {items.length > 0 ? (
          <Reveal delay={120} className="mt-12 sm:mt-16">
            {/* Inverts with the section: dark panel on the light "before"
                state, cream panel on the dark "after" state. */}
            <div className="relative mx-auto max-w-[62rem] overflow-hidden rounded-[28px] bg-[rgb(var(--ba-fg))] px-6 py-8 text-[rgb(var(--ba-bg))] shadow-[0_40px_80px_-40px_rgba(234,78,26,0.55)] transition-colors duration-700 sm:px-12 sm:py-9">
              {/* Decorative backdrop: orange glow, dot grid and a dashed orbit */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -end-16 h-72 w-72 rounded-full blur-3xl"
                style={{ backgroundColor: `${ROZAVIO_ORANGE}59` }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    "radial-gradient(currentColor 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                  maskImage: "linear-gradient(to right, black, transparent 70%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, black, transparent 70%)",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 -end-20 h-80 w-80 -translate-y-1/2 rounded-full border border-dashed"
                style={{ borderColor: `${ROZAVIO_ORANGE}66` }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{
                  background: `linear-gradient(270deg, ${ROZAVIO_ORANGE}, ${ROZAVIO_ORANGE}00 70%)`,
                }}
              />

              <div className="relative flex flex-col items-start gap-7 md:flex-row md:items-center md:justify-between md:gap-10">
                <p className="font-display max-w-[34rem] text-[1.4rem] leading-[1.4] font-extrabold text-balance sm:text-[1.65rem]">
                  {ctaText}
                </p>
                <SectionCta
                  href={ctaHref || DISCUSS_PRACTICE_HREF}
                  className="md:min-w-[15rem]"
                >
                  {ctaLabel}
                </SectionCta>
              </div>
            </div>
          </Reveal>
        ) : null}

        {note ? (
          <p className="mx-auto mt-12 max-w-[40rem] text-center text-[13px] leading-[1.6] text-[rgb(var(--ba-fg)/0.55)] transition-colors duration-700">
            {note}
          </p>
        ) : null}
      </div>
    </section>
  );
}
