import { type SiteData } from "./types";

export const site: SiteData = {
  name: "Rozavio",
  logoSrc: "/images/logo-light.png",
  logoAlt: "Rozavio",
  nav: [
    { label: "منهجنا", href: "/#our-approach" },
    { label: "ما نبنيه", href: "/#what_we_build" },
    { label: "أعمالنا", href: "/#our-work" },
    { label: "لماذا Rozavio", href: "/#rozavio_experience" },
  ],
  cta: { label: "ناقش مشروعك", href: "/#book" },
  footer: {
    heading: "شريكك الرقمي لبناء مواقع مخصصة لكل نشاط",
    description:
      "تصمم Rozavio وتبني مواقع استراتيجية لأي نشاط تجاري، ومع كل موقع لوحة تحكم خاصة بالعميل، لنجذب العملاء المناسبين ونحوّل الزيارات إلى طلبات.",
    tags: ["الاستراتيجية", "التصميم", "التطوير", "SEO"],
    ctaLabel: "ناقش مشروعك",
    backToTop: "العودة للأعلى",
    copyright: "© 2026 Rozavio",
  },
};
