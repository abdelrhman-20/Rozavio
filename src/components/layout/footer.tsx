import { BackToTop } from "@/components/layout/back-to-top";
import { type SiteData } from "@/content/types";
import { withBase } from "@/lib/base-path";

const ROZAVIO_ORANGE = "#EA4E1A";

interface FooterProps {
  site: SiteData;
}

/**
 * Global site footer: the final chapter of the page. Its ink colour
 * (`#14101c`) is shared with the Final CTA section above it, so the orange
 * CTA panel and the footer read as one continuous dark closing surface.
 */
export function Footer({ site }: FooterProps) {
  const { footer } = site;

  return (
    <footer className="relative overflow-hidden bg-[#14101c] text-[#f4f0e6]">
      {/* Ambient backdrop: a drifting glow and a faded grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="rz-exp-glow-a absolute -top-40 -start-32 h-[26rem] w-[26rem] rounded-full blur-[120px]"
          style={{ backgroundColor: `${ROZAVIO_ORANGE}33` }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#f4f0e6 1px, transparent 1px), linear-gradient(90deg, #f4f0e6 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at 80% 0%, black 5%, transparent 65%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 80% 0%, black 5%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative container mx-auto">
        <div className="pt-14 pb-10 text-center sm:pt-16 lg:pt-24 lg:pb-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={site.logoSrc}
            alt={site.logoAlt}
            className="mx-auto mb-8 h-10 w-auto sm:h-12"
          />
          <p className="font-display mx-auto max-w-[26ch] text-[1.75rem] leading-[1.35] font-extrabold text-balance sm:text-[2.6rem] lg:text-[3.1rem]">
            {footer.heading}
          </p>
          <p className="mx-auto mt-6 max-w-[34rem] text-[15px] leading-[1.9] text-balance text-[#f4f0e6]/55">
            {footer.description}
          </p>

          <ul
            aria-label="ما نقدمه"
            className="mt-7 flex flex-wrap justify-center gap-2.5"
          >
            {footer.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-[#f4f0e6]/15 bg-[#f4f0e6]/[0.04] px-4 py-1.5 text-[13px] font-semibold text-[#f4f0e6]/70"
              >
                {tag}
              </li>
            ))}
          </ul>

          <a
            href={withBase(site.cta.href)}
            className="rz-cta-glow mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-base font-semibold whitespace-nowrap text-[var(--color-primary-foreground)] transition hover:brightness-110 sm:w-auto"
          >
            {footer.ctaLabel}
          </a>
        </div>

        <div className="flex flex-col items-center gap-2 border-t border-white/10 py-6 text-center sm:flex-row sm:justify-between sm:gap-3">
          <p className="text-xs text-[#f4f0e6]/55" dir="ltr">
            {footer.copyright}
          </p>
          <BackToTop label={footer.backToTop} />
        </div>
      </div>

      {/* Oversized wordmark, cropped by the footer's bottom edge. */}
      <div
        aria-hidden="true"
        dir="ltr"
        className="font-display pointer-events-none relative -mt-2 h-[clamp(4rem,15vw,13rem)] overflow-hidden text-center leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap select-none"
      >
        <span
          className="block text-[clamp(5rem,22vw,19rem)] leading-[0.8] text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(244,240,230,0.2), rgba(244,240,230,0) 85%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          {site.name}
        </span>
      </div>
    </footer>
  );
}
