import { Reveal } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/sections/spotlight-card";
import { type ExperienceData } from "@/content/types";

export type { ExperienceData };

const ROZAVIO_ORANGE = "#EA4E1A";

/**
 * The Rozavio Experience: a dark, premium split layout. The left column
 * (sticky on desktop) carries the overline, headline, introduction, a small
 * animated "you + us" diagram and, only when one has been supplied, an
 * approved client quote. The right column is a vertical timeline of the
 * working-relationship principles, each a spotlight card that follows the
 * pointer, with a light travelling down the line beside them.
 *
 * Ambient motion (drifting glows, the diagram, the travelling light) is CSS
 * only and switches off for reduced-motion visitors. No imagery, team or
 * testimonial is invented: with no quote configured the left column is
 * typography and the diagram only.
 */
export function RozavioExperienceSection({
  data,
}: { data: ExperienceData }) {
  const {
    overline,
    heading,
    description,
    diagram,
    principles,
  } = data;

  return (
    <section
      id="rozavio_experience"
      className="relative scroll-mt-20 overflow-hidden text-[#f4f0e6]"
      style={{ backgroundColor: "#14110d" }}
    >
      {/* Ambient backdrop: drifting glows and a faded grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="rz-exp-glow-a absolute -top-32 -start-24 h-[28rem] w-[28rem] rounded-full blur-[110px]"
          style={{ backgroundColor: `${ROZAVIO_ORANGE}40` }}
        />
        <div
          className="rz-exp-glow-b absolute -end-32 bottom-0 h-[26rem] w-[26rem] rounded-full blur-[120px]"
          style={{ backgroundColor: `${ROZAVIO_ORANGE}26` }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#f4f0e6 1px, transparent 1px), linear-gradient(90deg, #f4f0e6 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at 30% 20%, black 10%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 30% 20%, black 10%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative container mx-auto grid gap-14 py-16 sm:gap-16 sm:pt-20 sm:pb-24 lg:grid-cols-12 lg:gap-16 lg:pt-28 lg:pb-32">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
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
                <p className="mt-6 max-w-[30rem] rz-lead text-[#f4f0e6]/70">
                  {description}
                </p>
              </Reveal>
            ) : null}

            {/* You + us: two circles that drift together around a shared centre */}
            <Reveal delay={220}>
              <div
                aria-hidden="true"
                className="relative mt-10 h-36 w-full max-w-[22rem]"
              >
                <div className="rz-exp-venn-b absolute top-2 right-0 grid h-32 w-32 place-items-center rounded-full border border-[#f4f0e6]/25 bg-[#f4f0e6]/[0.04] pe-8 text-center">
                  <span className="text-[13px] leading-[1.4] font-semibold text-[#f4f0e6]/75">
                    {diagram.practice}
                  </span>
                </div>
                <div
                  className="rz-exp-venn-a absolute top-2 right-[6.5rem] grid h-32 w-32 place-items-center rounded-full border ps-8 text-center"
                  style={{
                    borderColor: `${ROZAVIO_ORANGE}99`,
                    backgroundColor: `${ROZAVIO_ORANGE}1f`,
                  }}
                >
                  <span
                    className="text-[13px] leading-[1.4] font-semibold uppercase"
                    style={{ color: ROZAVIO_ORANGE }}
                  >
                    {diagram.expertise}
                  </span>
                </div>
                <span
                  className="absolute top-[4.5rem] right-[6.1rem] h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: ROZAVIO_ORANGE,
                    boxShadow: `0 0 18px 4px ${ROZAVIO_ORANGE}99`,
                  }}
                />
              </div>
            </Reveal>

          </div>
        </div>

        {principles.length > 0 ? (
          <ol className="relative space-y-5 ps-9 sm:ps-12 lg:col-span-7">
            {/* Timeline line with a light travelling down it */}
            <div
              aria-hidden="true"
              className="absolute top-3 bottom-3 start-[5px] w-px overflow-hidden bg-[#f4f0e6]/12"
            >
              <span
                className="rz-exp-line absolute start-0 h-28 w-px"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${ROZAVIO_ORANGE})`,
                }}
              />
            </div>

            {principles.map((p, index) => (
              <li key={index} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-9 -start-9 sm:-start-12"
                >
                  <span
                    className="rz-exp-node relative block h-[11px] w-[11px] rounded-full ring-4 ring-[#14110d]"
                    style={{ backgroundColor: ROZAVIO_ORANGE }}
                  />
                </span>
                <Reveal delay={index * 100}>
                  <SpotlightCard className="rounded-2xl border border-[#f4f0e6]/10 bg-[#f4f0e6]/[0.04] p-6 transition-colors duration-500 hover:border-[#EA4E1A]/45 sm:p-8">
                    {/* Oversized outlined number */}
                    <span
                      aria-hidden="true"
                      className="font-display pointer-events-none absolute -top-3 end-5 text-[5.5rem] leading-none font-extrabold text-transparent transition-transform duration-500 group-hover:-translate-y-1"
                      style={{ WebkitTextStroke: "1px rgba(244,240,230,0.14)" }}
                    >
                      {p.number || String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="relative">
                      {p.label ? (
                        <p
                          className="inline-flex rounded-full border px-3 py-1 text-[13.5px] font-semibold"
                          style={{
                            color: ROZAVIO_ORANGE,
                            borderColor: `${ROZAVIO_ORANGE}59`,
                            backgroundColor: `${ROZAVIO_ORANGE}14`,
                          }}
                        >
                          {p.label}
                        </p>
                      ) : null}
                      <h3 className="rz-h3 mt-4 max-w-[26rem]">
                        {p.title}
                      </h3>
                      {p.description ? (
                        <p className="mt-3 max-w-[34rem] text-[16px] leading-[1.7] text-[#f4f0e6]/78">
                          {p.description}
                        </p>
                      ) : null}
                    </div>
                  </SpotlightCard>
                </Reveal>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
