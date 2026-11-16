import { Icon } from "@iconify/react/offline";
import check from "@iconify-icons/lucide/check";
import trendingUp from "@iconify-icons/lucide/trending-up";

import {
  BrowserChrome,
  PracticeHero,
  SiteNav,
} from "@/components/sections/what-we-build-practice-mockup";

const ORANGE = "#EA4E1A";
const INK = "#14110d";
// Lighthouse's "good" score colour.
const PASS = "#0cce6b";

const SCORES = [
  { label: "الأداء", value: 98 },
  { label: "سهولة الوصول", value: 100 },
  { label: "أفضل الممارسات", value: 100 },
  { label: "SEO", value: 100 },
];

// Weekly organic enquiries, rising; drawn as a sparkline.
const TREND = [12, 14, 13, 17, 16, 20, 22, 21, 26, 29];

function Gauge({ value }: { value: number }) {
  const r = 15;
  const circumference = 2 * Math.PI * r;
  return (
    <span className="relative grid h-8 w-8 place-items-center">
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
        <circle cx="18" cy="18" r={r} fill={`${PASS}1f`} stroke="none" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={PASS}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * circumference} ${circumference}`}
        />
      </svg>
      <span className="relative text-[8.5px] font-bold text-[#0a8f4a]">
        {value}
      </span>
    </span>
  );
}

function Sparkline() {
  const max = Math.max(...TREND);
  const min = Math.min(...TREND);
  const points = TREND.map((v, i) => {
    const x = (i / (TREND.length - 1)) * 100;
    const y = 28 - ((v - min) / (max - min)) * 24;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-7 w-full">
      <polygon points={`0,30 ${points} 100,30`} fill={`${ORANGE}1f`} />
      <polyline
        points={points}
        fill="none"
        stroke={ORANGE}
        strokeWidth="2"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * The same practice homepage shown as a desktop browser and a phone,
 * with a card of Lighthouse scores and search analytics, used as the visual for
 * the fourth What We Build capability ("get the foundations right").
 * Decorative and `aria-hidden`.
 *
 * Both screens reuse the practice site's nav and hero. The phone renders
 * the hero at a real mobile width inside its own size container, then
 * scales it down to fit the device.
 */
export function PracticeFoundationsMockup() {
  return (
    // Only a small right inset for the phone, so the desktop frame stays as
    // wide as the other mockups and the hero keeps its two-column layout.
    <div aria-hidden="true" className="rz-mock relative pb-24 sm:pl-5 sm:pb-20">
      {/* Desktop */}
      <div className="@container relative overflow-hidden rounded-[18px] border border-[#14110d]/10 bg-white shadow-[0_40px_80px_-40px_rgba(20,17,13,0.45)]">
        <BrowserChrome />
        <SiteNav />
        <PracticeHero />
      </div>

      {/* Lighthouse scores, with search analytics beside them when there's room */}
      <div className="absolute bottom-0 right-3 z-20 flex gap-3 rounded-xl border border-[#14110d]/8 bg-white px-3 py-2.5 shadow-[0_20px_40px_-20px_rgba(20,17,13,0.5)] sm:right-6">
        <div>
          <p className="text-[7px] font-semibold text-[#14110d]/45 uppercase">
            Lighthouse · الجوال
          </p>
          <ul className="mt-1.5 flex gap-2.5">
            {SCORES.map(({ label, value }) => (
              <li
                key={label}
                className="flex w-10 cursor-default flex-col items-center gap-1 transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110"
              >
                <Gauge value={value} />
                <span className="text-center text-[6px] leading-tight text-[#14110d]/60">
                  {label}
                </span>
              </li>
            ))}
          </ul>
          <p
            className="mt-2 flex items-center gap-1 border-t border-[#14110d]/8 pt-1.5 text-[7px] font-semibold"
            style={{ color: INK }}
          >
            <span
              className="grid h-3 w-3 place-items-center rounded-full text-white"
              style={{ backgroundColor: PASS }}
            >
              <Icon icon={check} className="h-2 w-2" />
            </span>
            اجتاز Core Web Vitals
          </p>
        </div>

        <div className="hidden w-[7.5rem] flex-col border-l border-[#14110d]/8 pl-3 sm:flex">
          <p className="text-[7px] font-semibold text-[#14110d]/45 uppercase">
            طلبات من البحث
          </p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[13px] font-bold" style={{ color: INK }}>
              +38%
            </span>
            <span className="inline-flex items-center gap-0.5 text-[6.5px] font-semibold text-[#0a8f4a]">
              <Icon icon={trendingUp} className="h-2.5 w-2.5" />
              مقارنة بالربع السابق
            </span>
          </p>
          <div className="mt-auto">
            <Sparkline />
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="absolute left-0 bottom-10 w-[7.5rem] rounded-[1.35rem] bg-[#14110d] p-[5px] shadow-[0_30px_60px_-24px_rgba(20,17,13,0.6)] sm:bottom-8 sm:w-[8.5rem]">
        <div className="relative h-[15rem] overflow-hidden rounded-[1.05rem] bg-white sm:h-[16.5rem]">
          {/* Dynamic island */}
          <span className="absolute top-1.5 left-1/2 z-10 h-2.5 w-10 -translate-x-1/2 rounded-full bg-[#14110d]" />
          <div className="@container w-[250%] origin-top-right scale-[0.4] pt-6">
            <SiteNav />
            <PracticeHero />
          </div>
        </div>
      </div>
    </div>
  );
}
