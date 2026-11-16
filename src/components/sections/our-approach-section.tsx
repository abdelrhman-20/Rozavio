import { Reveal } from "@/components/motion/reveal";
import { SectionTransition } from "@/components/sections/section-transition";
import { OurApproachTimeline } from "@/components/sections/our-approach-timeline";
import { type OurApproachData } from "@/content/types";

export type { OurApproachData };

const ROZAVIO_ORANGE = "#EA4E1A";

/**
 * Our Approach section: an editorial intro above one connected process
 * (Understand, Diagnose, Strategize, Build & Improve).
 *
 * Structure mirrors the Hero Frame: `section > div.container > content`,
 * so it shares the site's container width. Every value comes from
 * validated section data, so it is editable in the Admin.
 *
 * The stage row itself — icons, connecting lines, and the automatic
 * sequential reveal animation — lives in the client component
 * `OurApproachTimeline`; see that file for the animation sequence.
 */
export function OurApproachSection({
  data,
}: { data: OurApproachData }) {
  const { overline, heading, description, stages } = data;

  return (
    <section
      id="our-approach"
      className="relative scroll-mt-20 overflow-hidden text-[#14110d]"
      style={{
        backgroundColor: "rgb(248, 245, 238)",
        backgroundImage:
          "radial-gradient(ellipse 75% 50% at 85% 100%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 115%)",
      }}
    >
      {/* Transition from the previous section: the seam carries the curve across. */}
      <SectionTransition />

      <div className="relative z-10 container mx-auto flex flex-col gap-12 py-16 sm:gap-14 sm:pt-20 sm:pb-24 lg:gap-16 lg:pt-28 lg:pb-32">
        {/* Introduction: one left edge, 20px rhythm between its parts. The
            whole block reveals as one unit, so the paragraph can never be
            left hidden beneath an already-visible heading. */}
        <Reveal className="max-w-176">
          {overline ? (
            <p
              className="flex items-center gap-3 text-[14px] font-semibold"
              style={{ color: ROZAVIO_ORANGE }}
            >
              <span
                aria-hidden="true"
                className="h-px w-10"
                style={{ backgroundColor: ROZAVIO_ORANGE }}
              />
              {overline}
            </p>
          ) : null}

          <h2 className="rz-h2 mt-5">
            {heading}
          </h2>

          {description ? (
            <p className="mt-5 max-w-[34rem] text-[16px] leading-[1.65] text-[#14110d]/70">
              {description}
            </p>
          ) : null}
        </Reveal>

        <OurApproachTimeline stages={stages} />
      </div>
    </section>
  );
}
