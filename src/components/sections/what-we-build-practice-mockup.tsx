"use client";

import { Icon } from "@iconify/react/offline";
import { useState } from "react";
import shieldCheck from "@iconify-icons/lucide/shield-check";
import activity from "@iconify-icons/lucide/activity";
import arrowRight from "@iconify-icons/lucide/arrow-right";
import calendarCheck from "@iconify-icons/lucide/calendar-check";
import check from "@iconify-icons/lucide/check";
import clock from "@iconify-icons/lucide/clock";
import { withBase } from "@/lib/base-path";

const ORANGE = "#EA4E1A";
const INK = "#14110d";


// Placeholder headshots (men only) for the practitioner avatars.
const PHYSIO_PHOTOS = [1, 2, 3, 4].map(
  (n) => withBase(`/images/what-we-build/physio-${n}.jpg`),
);

// Items marked `wide` only appear once the frame has room for them.
const NAV: { label: string; wide?: boolean }[] = [
  { label: "الرئيسية" },
  { label: "من نحن", wide: true },
  { label: "الخدمات" },
  { label: "فريقنا" },
  { label: "الحلول" },
  { label: "للشركاء", wide: true },
  { label: "تواصل" },
];

const DAYS = [
  { day: "إثنين", date: "21" },
  { day: "ثلاثاء", date: "22" },
  { day: "أربعاء", date: "23" },
  { day: "خميس", date: "24" },
];

// `booked` marks a slot that is already taken.
const SLOTS: { time: string; period: "ص" | "م"; booked?: boolean }[] = [
  { time: "8:15", period: "ص" },
  { time: "10:00", period: "ص", booked: true },
  { time: "11:30", period: "ص" },
  { time: "1:00", period: "م" },
  { time: "2:30", period: "م" },
  { time: "4:45", period: "م" },
];

/** Shared hover/press feel for the mockup's calls to action. */
const CTA_FX =
  "cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.98]";

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function Stars() {
  return (
    <span className="flex gap-px text-[#FBBC05]">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-current">
          <path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55-4.76-4.64 6.58-.96z" />
        </svg>
      ))}
    </span>
  );
}

const serif = { fontFamily: "var(--font-sans)" };

/** Browser window bar shared by the practice website mockups. */
export function BrowserChrome({ url = "yourcompany.com" }: { url?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-[#14110d]/8 bg-[#f6f3ee] px-4 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      <div className="mx-auto flex h-5 w-1/2 items-center justify-center rounded-md bg-[#14110d]/[0.06] text-[9px] text-[#14110d]/45">
        {url}
      </div>
      <span className="shrink-0 rounded-full bg-[#14110d]/[0.06] px-2 py-0.5 text-[8px] font-semibold text-[#14110d]/55">
        مثال توضيحي
      </span>
    </div>
  );
}

/**
 * The practice site's header: logo, nav (hidden on narrow frames) and a
 * booking button. `active` is the highlighted nav item.
 */
export function SiteNav({ active = "الرئيسية" }: { active?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3 @xl:px-7">
      <div className="flex items-center gap-1.5">
        <span
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
        {NAV.map(({ label, wide }) => (
          <li
            key={label}
            className={`cursor-pointer transition-colors duration-200 hover:text-[#EA4E1A] ${label === active ? "border-b pb-0.5" : ""} ${wide ? "hidden @2xl:block" : ""}`}
            style={label === active ? { color: ORANGE, borderColor: ORANGE } : undefined}
          >
            {label}
          </li>
        ))}
      </ul>
      <span
        className={`rounded-md px-2.5 py-1.5 text-[9.5px] font-semibold text-white ${CTA_FX}`}
        style={{ backgroundColor: ORANGE }}
      >
        احجز الآن
      </span>
    </div>
  );
}

/**
 * The practice homepage hero: headline, calls to action and trust
 * badges beside an online booking widget. Shared by both practice
 * website mockups so every frame shows the same hero. Sits inside an
 * `@container` frame and reflows on its width.
 */
export function PracticeHero() {
  // The booking widget is live: pick a day and a time, then confirm.
  const [dayIndex, setDayIndex] = useState(1);
  const [slotIndex, setSlotIndex] = useState(4);
  const [confirmed, setConfirmed] = useState(false);
  const day = DAYS[dayIndex]!;
  const slot = SLOTS[slotIndex]!;

  return (
    <div className="grid @xl:grid-cols-2">
      <div className="relative z-10 flex flex-col justify-center px-5 pt-4 pb-6 @xl:px-7 @xl:py-7">
        <p
          className="text-[8.5px] font-semibold uppercase"
          style={{ color: ORANGE }}
        >
          حلول مصمّمة لنشاطك
        </p>
        <p
          className="mt-2.5 text-[1.9rem] leading-[1.45] font-bold @xl:text-[1.7rem]"
          style={{ ...serif, color: INK }}
        >
          ابدأ بخطوة واضحة.
          <br />
          وتابع بثقة.
        </p>
        <p className="mt-3 max-w-[30ch] text-[10.5px] leading-[1.55] text-[#14110d]/65">
          خدمة شخصية من فريق ذي خبرة، ومواعيد ومسارات واضحة تناسب جدولك.
        </p>
        <div className="mt-4 flex gap-1.5 @xl:flex-wrap @xl:gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-[9.5px] whitespace-nowrap @xl:gap-1.5 @xl:px-3 @xl:text-[10px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(234,78,26,0.7)] ${CTA_FX}`}
            style={{ backgroundColor: ORANGE }}
          >
            احجز موعدًا
            <Icon icon={arrowRight} className="h-3 w-3" />
          </span>
          <span className="inline-flex cursor-pointer items-center rounded-md border border-[#EA4E1A]/35 px-2.5 py-2 text-[9.5px] font-semibold whitespace-nowrap text-[#14110d]/80 transition duration-200 hover:-translate-y-0.5 hover:border-[#EA4E1A] hover:bg-[#EA4E1A]/[0.06] hover:text-[#EA4E1A] @xl:px-3 @xl:text-[10px]">
            خدماتنا
          </span>
        </div>
        <div className="mt-5 flex items-stretch gap-1.5 border-t border-[#14110d]/8 pt-4">
          {/* Google reviews badge */}
          <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-[#14110d]/10 bg-white px-2 py-1.5 @xl:shrink-0 @xl:gap-2 @xl:px-2.5 shadow-[0_6px_16px_-12px_rgba(20,17,13,0.5)]">
            <GoogleG className="h-4 w-4 shrink-0 @xl:h-5 @xl:w-5" />
            <span className="leading-none">
              <span className="flex items-center gap-1">
                <span className="text-[11px] font-bold" style={{ color: INK }}>
                  4.9
                </span>
                <Stars />
              </span>
              <span className="mt-1 block text-[7px] whitespace-nowrap text-[#14110d]/55 @xl:text-[7.5px]">
                +320 تقييم على Google
              </span>
            </span>
          </div>

          {/* مزوّد معتمد badge */}
          <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-[#14110d]/10 bg-white px-2 py-1.5 @xl:shrink-0 @xl:gap-2 @xl:px-2.5 shadow-[0_6px_16px_-12px_rgba(20,17,13,0.5)]">
            <Icon icon={shieldCheck} className="h-4 w-4 @xl:h-5 @xl:w-5" style={{ color: ORANGE }} />
            <span className="text-[7px] @xl:text-[7.5px] leading-[1.45] font-medium text-[#14110d]/60">
              مزوّد
              <br />
              معتمد
            </span>
          </div>

        </div>
      </div>

      {/* Compact online booking widget with floating supporting cards */}
      <div className="relative flex flex-col items-center justify-center gap-2.5 overflow-hidden bg-white px-5 py-6 @xl:min-h-0 @xl:flex-row @xl:gap-0 @xl:px-6 @xl:py-7">
        {/* Decorative backdrop: dot grid, soft glow and a dashed orbit */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(rgba(20,17,13,0.12) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
            maskImage:
              "radial-gradient(closest-side, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(closest-side, black 30%, transparent 100%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{ backgroundColor: `${ORANGE}22` }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed"
          style={{ borderColor: `${ORANGE}40` }}
        />
        <span
          className="absolute top-[22%] left-[14%] h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: ORANGE }}
        />
        <span
          className="absolute right-[12%] bottom-[30%] h-2 w-2 rounded-full border-2"
          style={{ borderColor: ORANGE }}
        />
        <span className="absolute bottom-[14%] left-[42%] h-1 w-1 rounded-full bg-[#14110d]/30" />

        <div className="relative order-2 w-full max-w-[11.5rem] rounded-xl border border-[#14110d]/8 bg-white p-2.5 shadow-[0_20px_40px_-24px_rgba(20,17,13,0.4)]">
          <div className="flex items-center gap-2">
            <span
              className="grid h-5 w-5 place-items-center rounded-md"
              style={{ backgroundColor: `${ORANGE}1a`, color: ORANGE }}
            >
              <Icon icon={calendarCheck} className="h-3 w-3" />
            </span>
            <span className="leading-tight">
              <span className="block text-[8.5px] font-bold" style={{ color: INK }}>
                احجز أونلاين
              </span>
              <span className="block text-[6.5px] text-[#14110d]/50">
                استشارة أولى · 45 دقيقة
              </span>
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#14110d]/8 bg-[#fbf8f4] px-1.5 py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHYSIO_PHOTOS[0]}
              alt=""
              className="h-5 w-5 shrink-0 rounded-full object-cover"
            />
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[7.5px] font-semibold" style={{ color: INK }}>
                أحمد سليم
              </span>
              <span className="block text-[6.5px] text-[#14110d]/50">
                مستشار أول
              </span>
            </span>
            <Icon icon={check} className="h-3 w-3 shrink-0" style={{ color: ORANGE }} />
          </div>

          <div className="mt-2 grid grid-cols-4 gap-1">
            {DAYS.map((d, i) => {
              const on = i === dayIndex;
              return (
                <button
                  key={d.day}
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    setDayIndex(i);
                    setConfirmed(false);
                  }}
                  className={`cursor-pointer rounded-md border py-0.5 text-center leading-tight transition duration-200 ${
                    on
                      ? "text-white shadow-[0_6px_14px_-6px_rgba(234,78,26,0.8)]"
                      : "border-[#14110d]/10 text-[#14110d]/70 hover:-translate-y-px hover:border-[#EA4E1A]/60 hover:bg-[#EA4E1A]/[0.06] hover:text-[#EA4E1A]"
                  }`}
                  style={on ? { backgroundColor: ORANGE, borderColor: ORANGE } : undefined}
                >
                  <span className="block text-[5.5px] uppercase opacity-80">{d.day}</span>
                  <span className="block text-[8px] font-bold">{d.date}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-1.5 grid grid-cols-3 gap-1">
            {SLOTS.map((s, i) => {
              const on = i === slotIndex;
              return (
                <button
                  key={s.time}
                  type="button"
                  tabIndex={-1}
                  disabled={s.booked}
                  onClick={() => {
                    setSlotIndex(i);
                    setConfirmed(false);
                  }}
                  className={`rounded-md border py-0.5 text-center text-[7px] font-semibold transition duration-200 ${
                    s.booked
                      ? "cursor-not-allowed border-transparent bg-[#14110d]/[0.04] text-[#14110d]/25 line-through"
                      : on
                        ? "cursor-pointer"
                        : "cursor-pointer border-[#14110d]/10 text-[#14110d]/70 hover:-translate-y-px hover:border-[#EA4E1A]/60 hover:bg-[#EA4E1A]/[0.06] hover:text-[#EA4E1A]"
                  }`}
                  style={
                    on
                      ? { borderColor: ORANGE, color: ORANGE, backgroundColor: `${ORANGE}14` }
                      : undefined
                  }
                >
                  {s.time}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            tabIndex={-1}
            onClick={() => setConfirmed(true)}
            className={`mt-2 flex w-full items-center justify-center gap-1 rounded-md py-1.5 text-[7.5px] font-semibold text-white ${CTA_FX}`}
            style={{ backgroundColor: confirmed ? "#16a34a" : ORANGE }}
          >
            {confirmed
              ? `تم تأكيد ${day.day} ${day.date}، ${slot.time} ${slot.period}`
              : `تأكيد ${day.day} ${day.date}، ${slot.time} ${slot.period}`}
            <Icon icon={confirmed ? check : arrowRight} className="h-2.5 w-2.5" />
          </button>
        </div>

        {/* Floating: physios available today */}
        <div className="order-1 flex w-full max-w-[11.5rem] items-center gap-1.5 rounded-full border border-[#14110d]/8 bg-white py-1 pr-2.5 pl-1 shadow-[0_12px_26px_-16px_rgba(20,17,13,0.5)] @xl:absolute @xl:top-4 @xl:left-4 @xl:w-auto @xl:max-w-none">
          <span className="flex -space-x-1.5">
            {PHYSIO_PHOTOS.slice(1).map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="h-5 w-5 rounded-full border-[1.5px] border-white object-cover"
              />
            ))}
          </span>
          <span className="leading-tight">
            <span className="block text-[7px] font-semibold" style={{ color: INK }}>
              3 مستشارين متاحون اليوم
            </span>
            <span className="block text-[6px] text-[#14110d]/50">
              اختر الوقت المناسب لك
            </span>
          </span>
        </div>

        {/* Floating: confirmation toast */}
        <div
          className={`order-4 flex w-full max-w-[11.5rem] items-center gap-1.5 rounded-lg border border-[#14110d]/8 bg-white px-2 py-1.5 shadow-[0_14px_30px_-16px_rgba(20,17,13,0.5)] transition-all duration-500 @xl:absolute @xl:bottom-6 @xl:left-2 @xl:w-auto @xl:max-w-none ${
            confirmed
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-2 scale-95 opacity-0"
          }`}
        >
          <span className="grid h-4 w-4 place-items-center rounded-full bg-[#16a34a] text-white">
            <Icon icon={check} className="h-2.5 w-2.5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[7.5px] font-semibold" style={{ color: INK }}>
              تم تأكيد الحجز
            </span>
            <span className="block text-[6.5px] text-[#14110d]/50">
              أُرسل تذكير برسالة نصية
            </span>
          </span>
        </div>

        {/* Floating: quick booking pill */}
        <div className="absolute hidden items-center gap-1 rounded-full bg-[#14110d] px-2 py-1 text-[6.5px] font-semibold text-white shadow-[0_12px_26px_-14px_rgba(20,17,13,0.7)] @xl:right-4 @xl:bottom-9 @xl:flex">
          <Icon icon={clock} className="h-2.5 w-2.5" style={{ color: ORANGE }} />
          احجز في أقل من 60 ثانية
        </div>

        {/* Floating patient review */}
        <div className="order-3 w-full max-w-[11.5rem] rounded-lg border border-[#14110d]/8 bg-white px-2 py-1.5 shadow-[0_14px_30px_-16px_rgba(20,17,13,0.5)] @xl:absolute @xl:top-5 @xl:right-4 @xl:w-auto @xl:max-w-[9rem]">
          <div className="flex items-center gap-1.5">
            <GoogleG className="h-3 w-3" />
            <Stars />
          </div>
          <p className="mt-1 text-[7.5px] leading-[1.4] text-[#14110d]/70">
            &ldquo;فريق محترف وردّ سريع، والخطوات كانت واضحة من البداية.&rdquo;
          </p>
          <p className="mt-0.5 text-[7px] font-semibold" style={{ color: INK }}>
            خالد م.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * A realistic practice homepage inside a browser frame, used as the
 * visual for the first What We Build capability ("make your expertise
 * clear"). Decorative and `aria-hidden`.
 *
 * The frame is a size container: the inner layout reflows on the
 * frame's own width (`@xl:` etc.), not the viewport, so it reads as a
 * desktop site beside the text and as a stacked mobile site on phones.
 */
export function PracticeSiteMockup() {
  return (
    <div
      aria-hidden="true"
      className="rz-mock @container relative overflow-hidden rounded-[18px] border border-[#14110d]/10 bg-white shadow-[0_40px_80px_-40px_rgba(20,17,13,0.45)]"
    >
      <BrowserChrome />
      <SiteNav />

      <PracticeHero />
    </div>
  );
}
