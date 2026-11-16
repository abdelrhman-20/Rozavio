import { Reveal } from "@/components/motion/reveal";

export type SectionTransitionVariant = "blend" | "curve" | "glow";

export interface SectionTransitionProps {
  /**
   * `blend` (default): the glow and the curve together, so the previous
   * section's light and line continue across the seam.
   * `curve`: the thin accent line only.
   * `glow`: the soft primary-colour light only.
   */
  variant?: SectionTransitionVariant;
  /**
   * `ramp` (default): the glow fades in from the seam. Use it when the
   * section above already fades to the canvas, as Section 2 does.
   * `continue`: the glow is solid at the seam at the strength of the
   * section above's bottom glow (16%), with no ramp. Use it when the
   * section above ends in a lit edge, as Section 3 does, so the light
   * carries over without a hard line.
   */
  seam?: "ramp" | "continue";
}

/**
 * Reusable visual transition for the top edge of a section.
 *
 * Place it as the first child of the section it leads into. The section
 * must be `relative overflow-hidden`, which every Rozavio section already
 * is. The transition is absolutely positioned, so it adds no height, and
 * it sits behind the section content (`z-0` under `z-10` content).
 *
 * Both neighbouring sections share the warm off-white base, so the seam
 * needs no background blend. The transition carries the decorative
 * language across it instead, which keeps the page one continuous story.
 * Reduced motion is handled by `<Reveal>`: the final state is shown
 * immediately and no movement is applied.
 *
 * Usage, for any section:
 *   <section className="relative overflow-hidden ...">
 *     <SectionTransition />
 *     ...content...
 *   </section>
 */
export function SectionTransition({
  variant = "blend",
  seam = "ramp",
}: SectionTransitionProps) {
  const showGlow = variant !== "curve";
  const showCurve = variant !== "glow";
  const continueSeam = seam === "continue";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[120px] overflow-hidden sm:h-[180px]"
    >
      <Reveal className="h-full w-full">
        {showCurve ? (
          <svg
            focusable="false"
            viewBox="0 0 1440 240"
            preserveAspectRatio="none"
            className="absolute -inset-x-[6%] top-0 h-full w-[112%] text-[var(--color-primary)] opacity-25"
          >
            <path
              d="M-40 170 C 300 170, 520 40, 820 70 S 1250 150, 1480 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : null}
        {showGlow ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: continueSeam
                ? "radial-gradient(ellipse 95% 100% at 85% 0%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 100%)"
                : "radial-gradient(ellipse 95% 100% at 85% 0%, color-mix(in srgb, var(--color-primary) 9%, transparent), transparent 100%)",
              // Ramp in from the seam so the glow has no hard top edge.
              // Skipped for `continue`, where the glow must meet the seam.
              ...(continueSeam
                ? {}
                : {
                    maskImage:
                      "linear-gradient(to bottom, transparent 0%, black 75%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 0%, black 75%)",
                  }),
            }}
          />
        ) : null}
      </Reveal>
    </div>
  );
}
