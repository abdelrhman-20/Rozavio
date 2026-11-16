"use client";

import { Icon, type IconifyIcon } from "@iconify/react/offline";
import activity from "@iconify-icons/lucide/activity";
import arrowRight from "@iconify-icons/lucide/arrow-right";
import calendarCheck from "@iconify-icons/lucide/calendar-check";
import chartLine from "@iconify-icons/lucide/chart-line";
import chevronDown from "@iconify-icons/lucide/chevron-down";
import compass from "@iconify-icons/lucide/compass";
import gauge from "@iconify-icons/lucide/gauge";
import layoutGrid from "@iconify-icons/lucide/layout-grid";
import layoutList from "@iconify-icons/lucide/layout-list";
import listTree from "@iconify-icons/lucide/list-tree";
import mapPinned from "@iconify-icons/lucide/map-pinned";
import menuIcon from "@iconify-icons/lucide/menu";
import messageSquareQuote from "@iconify-icons/lucide/message-square-quote";
import monitorSmartphone from "@iconify-icons/lucide/monitor-smartphone";
import mousePointerClick from "@iconify-icons/lucide/mouse-pointer-click";
import plugZap from "@iconify-icons/lucide/plug-zap";
import searchCheck from "@iconify-icons/lucide/search-check";
import target from "@iconify-icons/lucide/target";
import userRoundSearch from "@iconify-icons/lucide/user-round-search";
import usersRound from "@iconify-icons/lucide/users-round";
import xIcon from "@iconify-icons/lucide/x";
import { useState } from "react";

import {
  BrowserChrome,
  PracticeHero,
} from "@/components/sections/what-we-build-practice-mockup";
import { withBase } from "@/lib/base-path";

const ORANGE = "#EA4E1A";
const INK = "#14110d";
const serif = { fontFamily: "var(--font-sans)" };

/**
 * Photography, served from `public/`. Until a file
 * exists its slot shows a warm tile with the service icon instead: the
 * photo is a background layer, so a missing file never renders as a
 * broken image.
 */
const PHOTO = {
  hero: withBase("/images/what-we-build/journey-hero.jpg"),
  sports: withBase("/images/what-we-build/journey-sports.jpg"),
  back: withBase("/images/what-we-build/journey-back.jpg"),
  rehab: withBase("/images/what-we-build/journey-rehab.jpg"),
  ndis: withBase("/images/what-we-build/journey-ndis.jpg"),
};

// ─── Left column: feature rows ───

/** Icons for the four feature rows of each What We Build capability. */
const FEATURE_ICONS: Record<
  "messaging" | "journey" | "priorities" | "foundations",
  IconifyIcon[]
> = {
  messaging: [messageSquareQuote, usersRound, layoutList, listTree],
  journey: [compass, calendarCheck, mousePointerClick, usersRound],
  priorities: [target, userRoundSearch, mapPinned, plugZap],
  foundations: [monitorSmartphone, searchCheck, gauge, chartLine],
};

/** Stacked feature rows: tinted icon square, title and one sentence. */
export function JourneyFeatureList({
  examples,
  visual,
}: {
  examples: { title: string; description: string }[];
  visual: keyof typeof FEATURE_ICONS;
}) {
  const icons = FEATURE_ICONS[visual];
  return (
    <ul className="mt-6 flex flex-col gap-5 border-t border-[#14110d]/10 pt-6">
      {examples.map((example, index) => (
        <li key={example.title} className="flex gap-4">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            style={{ backgroundColor: `${ORANGE}14`, color: ORANGE }}
          >
            <Icon
              icon={icons[index % icons.length] ?? arrowRight}
              className="h-[18px] w-[18px]"
            />
          </span>
          <span>
            <span className="block text-[16px] leading-[1.5] font-semibold text-[#14110d]">
              {example.title}
            </span>
            <span className="mt-1 block text-[15px] leading-[1.7] text-[#14110d]/60">
              {example.description}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

// ─── Right column: practice website mockup ───

// Same items as the shared SiteNav; `wide` items appear once there's room.
const NAV: { label: string; wide?: boolean }[] = [
  { label: "الرئيسية" },
  { label: "من نحن", wide: true },
  { label: "الخدمات" },
  { label: "فريقنا" },
  { label: "الحلول" },
  { label: "للشركاء", wide: true },
  { label: "تواصل" },
];

interface Service {
  label: string;
  title: string;
  body: string;
  photo: string;
  icon: IconifyIcon;
}

function Photo({
  src,
  icon,
  className = "",
}: {
  src: string;
  icon: IconifyIcon;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          "radial-gradient(120% 100% at 30% 20%, #f8e9de 0%, #efd8c7 55%, #e4c4ae 100%)",
      }}
    >
      <Icon
        icon={icon}
        className="absolute top-1/2 left-1/2 h-[28%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-35"
        style={{ color: ORANGE }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
      />
    </div>
  );
}

const SERVICES: Service[] = [
  {
    label: "جميع الخدمات",
    icon: layoutGrid,
    title: "اعثر على الخدمة المناسبة",
    body: "استكشف كل خدماتنا واختر ما يناسب احتياجك.",
    photo: PHOTO.hero,
  },
  {
    label: "الاستشارات",
    icon: compass,
    title: "الاستشارات",
    body: "جلسة تحدد احتياجك وتقترح أنسب خطوة للبدء.",
    photo: PHOTO.sports,
  },
  {
    label: "التصميم والتطوير",
    icon: monitorSmartphone,
    title: "التصميم والتطوير",
    body: "تصميم مخصص وتنفيذ يعمل بكفاءة على كل الأجهزة.",
    photo: PHOTO.back,
  },
  {
    label: "الحملات والتسويق",
    icon: target,
    title: "الحملات والتسويق",
    body: "خطط وحملات تصل لعملائك المناسبين بالرسالة المناسبة.",
    photo: PHOTO.rehab,
  },
  {
    label: "التكاملات والأتمتة",
    icon: plugZap,
    title: "التكاملات والأتمتة",
    body: "ربط أدوات العمل بالموقع لتوفير وقتك وتقليل الأخطاء.",
    photo: PHOTO.ndis,
  },
  {
    label: "الدعم الفني",
    icon: usersRound,
    title: "الدعم الفني",
    body: "فريق يتابع معك ويحل أي مشكلة بسرعة.",
    photo: PHOTO.rehab,
  },
  {
    label: "الصيانة والتحديث",
    icon: gauge,
    title: "الصيانة والتحديث",
    body: "تحديثات دورية تحافظ على سرعة الموقع وأمانه.",
    photo: PHOTO.ndis,
  },
  {
    label: "تحليل الأداء",
    icon: chartLine,
    title: "تحليل الأداء",
    body: "قياس يوضح ما الذي يجلب الطلبات وما الذي يحتاج تحسينًا.",
    photo: PHOTO.back,
  },
  {
    label: "الباقات والأسعار",
    icon: listTree,
    title: "الباقات والأسعار",
    body: "باقات واضحة تناسب حجم نشاطك وميزانيتك.",
    photo: PHOTO.sports,
  },
];

const CARDS = SERVICES.slice(1, 5);

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#EA4E1A] focus-visible:ring-offset-1";

/**
 * A believable practice homepage in a browser frame with the Services
 * mega-menu open, illustrating information architecture for the second
 * What We Build capability.
 *
 * The frame is a size container, so its layout follows the frame's
 * width rather than the viewport: a mega-menu with a preview panel when
 * wide (`@2xl:`), and a compact hamburger menu when narrow. The menu
 * starts open; the Services item (or the hamburger) toggles it, and
 * hovering or focusing a service swaps the preview.
 */
export function PracticeJourneyMockup() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState(1);
  const preview = SERVICES[active]!;

  return (
    <div
      role="group"
      aria-label="مثال لموقع شركة يعرض قائمة الخدمات"
      className="rz-mock @container relative overflow-hidden rounded-[18px] border border-[#14110d]/10 bg-white shadow-[0_40px_80px_-40px_rgba(20,17,13,0.45)]"
    >
      <div aria-hidden="true">
        <BrowserChrome />
      </div>

      {/* Site nav: matches the shared SiteNav, with Services as the menu toggle */}
      <div className="relative z-20 flex items-center justify-between gap-3 px-5 py-3 @xl:px-7">
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="grid h-5 w-5 place-items-center rounded-md text-white"
            style={{ backgroundColor: ORANGE }}
          >
            <Icon icon={activity} className="h-3 w-3" />
          </span>
          <span className="text-[11px] font-bold" style={{ color: INK }}>
            شركتك
          </span>
        </div>

        <ul className="hidden items-center gap-3 text-[9px] font-medium text-[#14110d]/70 @md:flex @2xl:gap-3.5 @2xl:text-[9.5px]">
          {NAV.map(({ label, wide }) =>
            label === "الخدمات" ? (
              <li key={label}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpen((v) => !v)}
                  className={`flex items-center gap-0.5 rounded border-b pb-0.5 ${focusRing}`}
                  style={{ color: ORANGE, borderColor: ORANGE }}
                >
                  الخدمات
                  <Icon
                    icon={chevronDown}
                    className={`h-2.5 w-2.5 motion-safe:transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
              </li>
            ) : (
              <li key={label} aria-hidden="true" className={wide ? "hidden @2xl:block" : undefined}>
                {label}
              </li>
            ),
          )}
        </ul>

        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="rounded-md px-2.5 py-1.5 text-[9.5px] font-semibold text-white"
            style={{ backgroundColor: ORANGE }}
          >
            احجز الآن
          </span>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            onClick={() => setOpen((v) => !v)}
            className={`grid h-6 w-6 place-items-center rounded-md border border-[#14110d]/10 text-[#14110d]/80 @md:hidden ${focusRing}`}
          >
            <Icon icon={open ? xIcon : menuIcon} className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Services menu: mega-menu when wide, compact list when narrow. */}
        <div
          className={`absolute top-2 end-3 z-30 w-[52%]motion-safe:transition-[opacity,transform] motion-safe:duration-200 @2xl:end-auto @2xl:start-[42%] @2xl:w-[55%] ${
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          }`}
          inert={!open}
        >
          <div className="flex overflow-hidden rounded-xl border border-[#14110d]/10 bg-white shadow-[0_24px_48px_-24px_rgba(20,17,13,0.45)]">
            <ul className="flex w-full flex-col gap-px p-2 @2xl:w-[46%] @2xl:border-e @2xl:border-[#14110d]/8">
              {SERVICES.map((service, i) => (
                <li
                  key={service.label}
                  // The compact (narrow) menu lists the first six services.
                  className={i > 5 ? "hidden @2xl:block" : undefined}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-[5px] text-start text-[9.5px] font-medium motion-safe:transition-colors ${focusRing} ${
                      i === active
                        ? "text-[#14110d]"
                        : "text-[#14110d]/65 hover:bg-[#14110d]/[0.03] hover:text-[#14110d]"
                    }`}
                    style={i === active ? { backgroundColor: `${ORANGE}14` } : undefined}
                  >
                    {service.label}
                    <Icon
                      icon={arrowRight}
                      className={`h-2.5 w-2.5 ${i === active ? "" : "opacity-0"}`}
                      style={{ color: ORANGE }}
                    />
                  </button>
                </li>
              ))}
              <li
                aria-hidden="true"
                className="mt-1 flex items-center gap-1 border-t border-[#14110d]/8 px-2 pt-1.5 pb-0.5 text-[8.5px] font-semibold @2xl:hidden"
                style={{ color: ORANGE }}
              >
                عرض كل الخدمات <Icon icon={arrowRight} className="h-2.5 w-2.5" />
              </li>
            </ul>

            <div aria-live="polite" className="hidden flex-1 flex-col p-3 @2xl:flex">
              <Photo
                key={preview.label}
                src={preview.photo}
                icon={preview.icon}
                className="rz-swap aspect-[16/10] w-full rounded-lg"
              />
              <p
                className="mt-2.5 text-[11px] leading-[1.4] font-bold"
                style={{ ...serif, color: INK }}
              >
                {preview.title}
              </p>
              <p className="mt-1 text-[8.5px] leading-[1.5] text-[#14110d]/60">
                {preview.body}
              </p>
              <span
                aria-hidden="true"
                className="mt-auto inline-flex items-center gap-1 pt-2 text-[9px] font-semibold"
                style={{ color: ORANGE }}
              >
                اعرف المزيد <Icon icon={arrowRight} className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Homepage behind the menu, isolated so its own layers stay below it */}
        <div aria-hidden="true" className="relative isolate z-0">
          <PracticeHero />

          {/* Service cards */}
          <div className="border-t border-[#14110d]/6 bg-[#FAF8F4] px-4 pt-4 pb-5 @xl:px-6">
            <div className="flex items-end justify-between gap-3">
              <p
                className="text-[0.95rem] leading-[1.4] font-bold"
                style={{ ...serif, color: INK }}
              >
                كيف نساعدك؟
              </p>
              <span
                className="inline-flex shrink-0 items-center gap-1 text-[8.5px] font-semibold"
                style={{ color: ORANGE }}
              >
                عرض كل الخدمات <Icon icon={arrowRight} className="h-3 w-3" />
              </span>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2 @2xl:grid-cols-4">
              {CARDS.map((card) => (
                <li
                  key={card.label}
                  className="group relative overflow-hidden rounded-lg border border-[#14110d]/8 bg-white shadow-[0_8px_20px_-16px_rgba(20,17,13,0.4)] motion-safe:transition-transform motion-safe:duration-200 hover:-translate-y-0.5"
                >
                  <Photo src={card.photo} icon={card.icon} className="aspect-[16/10] w-full" />
                  <div className="p-2 pe-5">
                    <p className="text-[9px] leading-[1.4] font-bold" style={{ ...serif, color: INK }}>
                      {card.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[7.5px] leading-[1.45] text-[#14110d]/55">
                      {card.body}
                    </p>
                  </div>
                  <Icon
                    icon={arrowRight}
                    className="absolute end-2 bottom-2 h-2.5 w-2.5 motion-safe:transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                    style={{ color: ORANGE }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
