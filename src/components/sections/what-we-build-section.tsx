import { Reveal } from "@/components/motion/reveal";
import {
  DISCUSS_PRACTICE_HREF,
  SectionCta,
} from "@/components/sections/section-cta";
import { WhatWeBuildTabs } from "@/components/sections/what-we-build-tabs";
import { type WhatWeBuildData } from "@/content/types";

export type { WhatWeBuildData };

const ROZAVIO_ORANGE = "#EA4E1A";

/**
 * What We Build section: an editorial intro, the four capabilities as
 * tabs (see `WhatWeBuildTabs`), then a closing line and CTA.
 *
 * Structure mirrors the Hero Frame: `section > div.container > content`.
 * Every visual is a page of the same realistic practice website, sharing
 * its nav and hero for consistency.
 */

export function WhatWeBuildSection({
  data,
}: { data: WhatWeBuildData }) {
  const {
    overline,
    heading,
    description,
    closingStatement,
    items,
    ctaLabel,
    ctaHref,
  } = data;

  return (
    <section
      id="what_we_build"
      className="relative scroll-mt-20 overflow-hidden text-[#14110d]"
      style={{ backgroundColor: "#fdfbf7" }}
    >
      <div className="relative container mx-auto flex flex-col gap-16 py-16 sm:gap-20 sm:pt-20 sm:pb-24 lg:gap-24 lg:pt-28 lg:pb-32">
        <div className="max-w-[44rem]">
          {overline ? (
            <Reveal>
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
            </Reveal>
          ) : null}
          <Reveal delay={80}>
            <h2 className="rz-h2 mt-6">
              {heading}
            </h2>
          </Reveal>
          {description ? (
            <Reveal delay={160}>
              <p className="mt-6 max-w-[38rem] rz-lead text-[#14110d]/70">
                {description}
              </p>
            </Reveal>
          ) : null}
        </div>

        {items.length > 0 ? (
          <Reveal delay={200}>
            <WhatWeBuildTabs items={items} />
          </Reveal>
        ) : null}

        {closingStatement ? (
          <Reveal>
            <p className="font-display max-w-[34rem] border-s-2 border-[#EA4E1A] ps-5 text-[1.35rem] leading-[1.35] font-bold sm:text-[1.6rem]">
              {closingStatement}
            </p>
          </Reveal>
        ) : null}

        <Reveal className="-mt-6 sm:-mt-8 lg:-mt-12">
          <SectionCta href={ctaHref ?? DISCUSS_PRACTICE_HREF}>
            {ctaLabel}
          </SectionCta>
        </Reveal>
      </div>
    </section>
  );
}
