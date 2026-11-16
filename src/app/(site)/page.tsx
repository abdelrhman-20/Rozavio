import { BeforeAfterSection } from "@/components/sections/before-after-section";
import { ClientProofSection } from "@/components/sections/client-proof-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { HeroFrameSection } from "@/components/sections/hero-frame-section";
import { OurApproachSection } from "@/components/sections/our-approach-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { RozavioExperienceSection } from "@/components/sections/rozavio-experience-section";
import { WhatWeBuildSection } from "@/components/sections/what-we-build-section";
import {
  approach,
  beforeAfter,
  clientProof,
  experience,
  finalCta,
  hero,
  problem,
  whatWeBuild,
} from "@/content";

/**
 * Homepage: same section order as the Rozavio reference site. Every
 * section is a pure component fed by a typed object from `src/content`,
 * so an admin can later supply the same objects without touching the
 * components.
 */
export default function HomePage() {
  return (
    <>
      <HeroFrameSection data={hero} />
      <ClientProofSection data={clientProof} />
      <ProblemSection data={problem} />
      <OurApproachSection data={approach} />
      <WhatWeBuildSection data={whatWeBuild} />
      <BeforeAfterSection data={beforeAfter} />
      <RozavioExperienceSection data={experience} />
      <FinalCtaSection data={finalCta} />
    </>
  );
}
