/**
 * Typed content shapes for every homepage section.
 *
 * Components receive these objects as plain props and never fetch data.
 * A future admin only needs to produce the same shapes.
 */

export interface HeroFrameData {
  badgeText?: string;
  title: string;
  description?: string;
  metaItems?: string[];
  ctaNote?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  /** Eyebrow above the visual (right column). */
  frameEyebrow?: string;
  /** Images stacked inside the hero frame (screenshots of real sites). */
  frameImages: {
    /** Tall full-page screenshot, scrolled by the visitor inside the frame. */
    src: string;
    /** Small avatar for the site picker. */
    thumb: string;
    alt: string;
    label: string;
    url: string;
  }[];
  /** Small hint under the stack explaining the interaction. */
  frameHint?: string;
  frameOpenLabel?: string;
  frameCloseLabel?: string;
  frameNewTabLabel?: string;
  /** Yellow window dot: fold the window to its title bar. */
  frameMinimizeLabel?: string;
  /** Green window dot: open the site full screen. */
  frameExpandLabel?: string;
  /** Shown when the visitor closes the window (red dot). */
  frameChooseLabel?: string;
  clientName?: string;
  clientDescriptor?: string;
  supportingDetail?: string;
}

export interface ClientProofData {
  eyebrow?: string;
  heading: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  /** Portfolio sites; the first is shown first. */
  works: {
    id: string;
    name: string;
    category: string;
    url: string;
    host: string;
    /** Tall full-page screenshot (cropped to the top in the frame). */
    imageSrc: string;
    thumb: string;
    imageAlt: string;
    linkLabel: string;
    /** The site's main brand colour, used as its picker button background. */
    brandColor: string;
    /** Second brand colour, the end of the picker button gradient. */
    brandColorEnd: string;
  }[];
  labels: {
    live: string;
    visit: string;
    close: string;
    newTab: string;
    picker: string;
  };
}

export interface ProblemGap {
  number: string;
  category: string;
  heading: string;
  description: string;
}

export interface ProblemData {
  eyebrow?: string;
  heading: string;
  /** Part of the heading rendered in the brand colour. */
  headingAccent?: string;
  leadParagraph?: string;
  supportingParagraph?: string;
  gaps: ProblemGap[];
  closingStatement?: string;
  closingAccent?: string;
  scrollHint?: string;
  /** Labels inside the "practice vs website" diagram. */
  diagram: {
    practice: string;
    website: string;
    gap: string;
    solution: string;
  };
}

export interface ApproachStage {
  number: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  outcome: string;
}

export interface OurApproachData {
  overline?: string;
  heading: string;
  description?: string;
  stages: ApproachStage[];
}

export interface BuildItem {
  number: string;
  title: string;
  description: string;
  examples: { title: string; description: string }[];
  visual: "messaging" | "journey" | "priorities" | "foundations";
}

export interface WhatWeBuildData {
  overline?: string;
  heading: string;
  description?: string;
  closingStatement?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items: BuildItem[];
}

export interface BeforeAfterItem {
  number: string;
  label: string;
  beforeHeading: string;
  beforeDescription: string;
  afterHeading: string;
  afterDescription: string;
}

export interface BeforeAfterData {
  overline?: string;
  heading: string;
  description?: string;
  beforeLabel?: string;
  afterLabel?: string;
  note?: string;
  ctaText?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items: BeforeAfterItem[];
}

export interface ExperiencePrinciple {
  number: string;
  label: string;
  title: string;
  description: string;
}

export interface ExperienceData {
  overline?: string;
  heading: string;
  description?: string;
  /** Labels inside the "you + us" diagram. */
  diagram: { practice: string; expertise: string };
  principles: ExperiencePrinciple[];
}

export interface FinalCtaData {
  overline?: string;
  heading: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  fallbackLabel?: string;
  fallbackHref?: string;
  /** Shown in place of an embedded booking calendar (not connected yet). */
  placeholderTitle: string;
  placeholderText: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteData {
  name: string;
  logoSrc: string;
  logoAlt: string;
  nav: NavLink[];
  cta: NavLink;
  footer: {
    heading: string;
    description: string;
    tags: string[];
    ctaLabel: string;
    backToTop: string;
    copyright: string;
  };
}
