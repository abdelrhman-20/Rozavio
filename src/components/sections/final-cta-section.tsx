import { ContactForm } from "@/components/sections/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { type FinalCtaData } from "@/content/types";

export type { FinalCtaData };

/**
 * Final CTA: the page's booking section and the first half of the closing
 * experience. A brand-orange introduction with the embedded Calendly
 * calendar beneath it.
 *
 * The orange fades linearly into the Footer's own ink colour (`#14101c`)
 * at the bottom of the section, so the footer follows with no visible seam
 * or cream gap. `id="book"` is the anchor every "Discuss Your Practice" CTA
 * scrolls to.
 */
export function FinalCtaSection({ data }: { data: FinalCtaData }) {
  const {
    overline,
    heading,
    description,
    placeholderTitle,
    placeholderText,
    fallbackHref,
  } = data;

  return (
    <section
      id="book"
      className="relative scroll-mt-16 overflow-hidden bg-[#EA4E1A] text-white"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-20"
      >
        <path
          d="M-40 700 C 300 640, 560 300, 880 340 S 1280 460, 1480 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative pt-12 pb-32 sm:pt-14 sm:pb-36 lg:pt-16 lg:pb-44">
        <div className="container mx-auto">
          <div className="max-w-[44rem]">
            {overline ? (
              <Reveal>
                <p className="flex items-center gap-3 text-[14px] font-semibold">
                  <span aria-hidden="true" className="h-px w-10 bg-white/70" />
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
                <p className="mt-6 max-w-[36rem] rz-lead text-white/90">
                  {description}
                </p>
              </Reveal>
            ) : null}
          </div>
        </div>

        {/* Enquiry form: composes a ready-to-send email until a booking
            calendar or mail service is connected. */}
        <div className="relative z-10 mx-auto mt-10 max-w-[1200px] px-4 sm:mt-12 sm:px-8 lg:px-0">
          <Reveal delay={200} className="min-w-0">
            <ContactForm
              email={fallbackHref?.replace(/^mailto:/, "") ?? "team@rozavio.com"}
              title={placeholderTitle}
              text={placeholderText}
            />
          </Reveal>
        </div>
      </div>

      {/* Smooth hand-off: the orange fades linearly into the footer's ink
          colour, so there is no visible edge between the two. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#14101c] sm:h-48 lg:h-56"
      />
    </section>
  );
}
