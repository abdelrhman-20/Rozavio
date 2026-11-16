import { HeroFrame } from "@/components/sections/hero-frame";
import { type HeroFrameData } from "@/content/types";

export type { HeroFrameData };

interface HeroFrameSectionProps {
  data: HeroFrameData;
}

/**
 * Hero Frame section: a full-bleed dark panel ("framed" hero).
 *
 * Layout: a two-column editorial panel. The start column (right in RTL)
 * carries the Rozavio point of view (overline, oversized headline,
 * description and CTA cluster). The end column carries real proof: a stack
 * of client-site screenshots.
 *
 * The panel is permanently dark by design: it is a deliberate contrast
 * object against the page, so it uses a fixed ink/surface palette rather
 * than the semantic background/foreground tokens.
 */
export function HeroFrameSection({ data }: HeroFrameSectionProps) {
  const {
    badgeText,
    title,
    description,
    metaItems,
    ctaNote,
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    frameEyebrow,
    frameImages,
    frameHint,
    frameOpenLabel,
    frameCloseLabel,
    frameNewTabLabel,
    frameMinimizeLabel,
    frameExpandLabel,
    frameChooseLabel,
    clientName,
    clientDescriptor,
  } = data;

  return (
    <section
      className="bg-background hero_section overflow-x-clip"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 25% 0%, color-mix(in srgb, var(--color-primary) 22%, transparent), transparent 60%), radial-gradient(ellipse 70% 70% at 90% 100%, rgba(255,217,168,0.08), transparent 65%), linear-gradient(200deg, #1e1433 0%, #0a0810 65%)",
      }}
    >
      {/* Ambient primary glows. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-56 -start-32 h-[560px] w-[560px] rounded-full opacity-50 blur-[70px]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, var(--color-primary), transparent 72%)",
          }}
        />
        <div
          className="absolute top-32 start-72 h-[420px] w-[420px] rounded-full opacity-30 blur-[70px]"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, #ffd9a8, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-20 -end-36 h-[360px] w-[360px] rounded-full opacity-20 blur-[70px]"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--color-primary), transparent 70%)",
          }}
        />
      </div>

      <div className="relative container mx-auto flex flex-col items-center justify-between gap-18 text-[#f4f0e6] sm:flex-row sm:pt-24 sm:pb-20 lg:gap-14 lg:pt-40 lg:pb-24">
        {/* Start column: the claim. */}
        <div className="relative z-10 flex flex-col justify-center">
          {badgeText ? (
            <span className="hero__overline rz-hero-rise rz-hero-d1 inline-flex items-center gap-2 self-start text-[14px] font-semibold text-primary">
              <span
                aria-hidden="true"
                className="rz-ripple-dot h-1.5 w-1.5 rounded-full bg-primary text-primary"
              />
              {badgeText}
            </span>
          ) : null}

          <div className="hero__content max-w-[768px] pt-6">
            <h1 className="hero__title rz-hero-rise rz-hero-d2 font-display text-[2.1em] leading-[1.3] font-extrabold text-white sm:text-[3em] lg:text-[3.6em]">
              {title}
            </h1>

            {description ? (
              <p className="hero__description rz-hero-rise rz-hero-d3 mt-6 max-w-[38em] text-[1.1em] leading-[1.9] text-[#f4f0e6]/70 sm:text-[19px]">
                {description}
              </p>
            ) : null}

            {primaryCtaLabel || secondaryCtaLabel ? (
              <div className="rz-hero-rise rz-hero-d4 mt-8 flex h-full flex-col gap-3 sm:flex-row">
                {primaryCtaLabel ? (
                  <a
                    href={primaryCtaHref ?? "#"}
                    className="rz-cta-glow inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-base font-semibold whitespace-nowrap text-[var(--color-primary-foreground)] transition hover:brightness-110 sm:w-auto"
                  >
                    {primaryCtaLabel}
                  </a>
                ) : null}
                {secondaryCtaLabel ? (
                  <a
                    href={secondaryCtaHref ?? "#"}
                    className="inline-flex w-full items-center justify-center rounded-full border border-[#f4f0e6]/40 px-6 py-3 text-base font-semibold whitespace-nowrap text-[#f4f0e6] transition hover:border-[#f4f0e6] hover:bg-white/5 sm:w-auto"
                  >
                    {secondaryCtaLabel}
                  </a>
                ) : null}
              </div>
            ) : null}

            {metaItems?.length || ctaNote ? (
              <div className="rz-hero-rise rz-hero-d5 mt-10 flex h-full flex-col gap-6 border-t border-[#f4f0e6]/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
                {metaItems && metaItems.length > 0 ? (
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {metaItems.map((item) => (
                      <span
                        key={item}
                        className="text-[13px] font-medium text-[#f4f0e6]/50"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
                {ctaNote ? (
                  <p className="max-w-[360px] text-base leading-relaxed text-[#f4f0e6]/60 sm:text-end">
                    {ctaNote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* End column: evidence. */}
        <div className="relative z-10 flex flex-col justify-center">
          <HeroFrame
            eyebrow={frameEyebrow ?? ""}
            clientName={clientName ?? ""}
            clientDescriptor={clientDescriptor}
            images={frameImages}
            hint={frameHint}
            openLabel={frameOpenLabel}
            closeLabel={frameCloseLabel}
            newTabLabel={frameNewTabLabel}
            minimizeLabel={frameMinimizeLabel}
            expandLabel={frameExpandLabel}
            chooseLabel={frameChooseLabel}
          />
        </div>
      </div>
    </section>
  );
}
