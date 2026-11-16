"use client";

import { Icon } from "@iconify/react/offline";
import { useState } from "react";
import shieldCheck from "@iconify-icons/lucide/shield-check";
import arrowRight from "@iconify-icons/lucide/arrow-right";
import calendarCheck from "@iconify-icons/lucide/calendar-check";
import chevronDown from "@iconify-icons/lucide/chevron-down";
import check from "@iconify-icons/lucide/check";
import chevronRight from "@iconify-icons/lucide/chevron-right";
import fileText from "@iconify-icons/lucide/file-text";

import {
  BrowserChrome,
  SiteNav,
} from "@/components/sections/what-we-build-practice-mockup";

const ORANGE = "#EA4E1A";
const INK = "#14110d";
const serif = { fontFamily: "var(--font-sans)" };


// Items marked `wide` only appear once the frame has room for them.
const AUDIENCES: { label: string; wide?: boolean }[] = [
  { label: "الأفراد" },
  { label: "الشركات" },
  { label: "الجهات الحكومية" },
  { label: "الشركاء", wide: true },
];
const CTA_FX =
  "cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.98]";

const INCLUSIONS = [
  "عقود مرنة حسب احتياجك",
  "تنفيذ في موقعك أو عن بُعد",
  "تقارير دورية لمتابعة التقدّم",
];

const FORM_FIELDS: {
  label: string;
  required?: boolean;
  kind?: "select" | "textarea";
  full?: boolean;
  type?: "text" | "tel" | "email";
  options?: string[];
}[] = [
  { label: "اسم المسؤول", required: true },
  { label: "الجهة" },
  { label: "رقم الهاتف", required: true, type: "tel" },
  { label: "البريد الإلكتروني", required: true, type: "email" },
  { label: "الاسم الأول", required: true },
  { label: "اسم العائلة", required: true },
  {
    label: "نوع الخدمة",
    required: true,
    kind: "select",
    options: ["استشارة", "تصميم وتطوير", "حملات وتسويق", "دعم فني"],
  },
  {
    label: "الميزانية",
    kind: "select",
    options: ["أقل من 10 آلاف", "من 10 إلى 50 ألفًا", "أكثر من 50 ألفًا"],
  },
  { label: "رقم بديل", type: "tel" },
  { label: "هدف المشروع" },
  { label: "ملاحظات إضافية", kind: "textarea", full: true },
];

/** Shared look of the form controls (typed text is dark, placeholder is light). */
const FIELD =
  "mt-0.5 block w-full rounded border border-[#14110d]/12 bg-[#FAF8F4] px-1.5 text-[7px] text-[#14110d] outline-none transition-colors duration-200 placeholder:text-[#14110d]/30 hover:border-[#EA4E1A]/60 hover:bg-white focus:border-[#EA4E1A] focus:bg-white focus:ring-1 focus:ring-[#EA4E1A]/30";

const STEPS = ["إرسال الطلب", "التقييم الأولي", "الخطة والتنفيذ"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validates the request form: required fields, a real email, a real phone. */
function validate(values: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const { label, required, type } of FORM_FIELDS) {
    const value = (values[label] ?? "").trim();
    if (!value) {
      if (required) errors[label] = "هذا الحقل مطلوب";
      continue;
    }
    if (type === "email" && !EMAIL_RE.test(value)) {
      errors[label] = "اكتب بريدًا صحيحًا مثل name@company.com";
    }
    if (type === "tel" && value.length < 8) {
      errors[label] = "اكتب رقمًا صحيحًا (8 أرقام على الأقل)";
    }
  }
  return errors;
}

/**
 * A styled dropdown. The browser's own menu can't be themed (blue
 * highlight, tiny text), so this renders its own list.
 */
function FormSelect({
  id,
  value,
  options,
  invalid,
  onChange,
}: {
  id: string;
  value: string;
  options: string[];
  invalid: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`${FIELD} flex h-4 cursor-pointer items-center justify-between text-start ${
          invalid ? "!border-[#dc2626] bg-white" : ""
        } ${open ? "border-[#EA4E1A] bg-white" : ""}`}
      >
        <span className={value ? "" : "text-[#14110d]/35"}>{value || "اختر"}</span>
        <Icon
          icon={chevronDown}
          className={`h-2 w-2 text-[#14110d]/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-0.5 overflow-hidden rounded-md border border-[#14110d]/10 bg-white p-0.5 shadow-[0_16px_32px_-12px_rgba(20,17,13,0.45)]"
        >
          {options.map((o) => (
            <li key={o} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={o === value}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between rounded px-1.5 py-1 text-start text-[8px] font-medium transition-colors duration-150 ${
                  o === value
                    ? "bg-[#EA4E1A]/10 text-[#EA4E1A]"
                    : "text-[#14110d]/80 hover:bg-[#EA4E1A]/[0.07] hover:text-[#EA4E1A]"
                }`}
              >
                {o}
                {o === value ? <Icon icon={check} className="h-2 w-2" /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * A realistic business-solutions landing page, used as the
 * visual for the third What We Build capability ("build around your
 * business priorities"): an audience switcher, a targeted hero, a new
 * location and the booking and referral integrations behind it.
 * The request form is live: its fields accept typing.
 *
 * Like the other practice mockups the frame is a size container, so the
 * layout follows its own width rather than the viewport.
 */
export function PracticePrioritiesMockup() {
  const [audience, setAudience] = useState("الشركات");
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const setValue = (label: string, value: string) => {
    setValues((v) => ({ ...v, [label]: value }));
    // Editing a field clears its error and un-sends the request.
    setErrors((e) => {
      if (!e[label]) return e;
      const { [label]: _removed, ...rest } = e;
      return rest;
    });
    setSent(false);
  };

  return (
    <div
      className="rz-mock @container relative overflow-hidden rounded-[18px] border border-[#14110d]/10 bg-white shadow-[0_40px_80px_-40px_rgba(20,17,13,0.45)]"
    >
      <BrowserChrome url="yourcompany.com/business" />
      <SiteNav active="الحلول" />

      {/* Audience switcher */}
      <div className="flex items-center gap-1.5 overflow-hidden border-y border-[#14110d]/6 bg-[#FAF8F4] px-5 py-2 @xl:px-7">
        <span className="shrink-0 text-[7.5px] font-semibold text-[#14110d]/45 uppercase">
          أنا
        </span>
        {AUDIENCES.map(({ label, wide }) => {
          const on = label === audience;
          return (
            <button
              key={label}
              type="button"
              tabIndex={-1}
              onClick={() => setAudience(label)}
              className={`shrink-0 cursor-pointer rounded-full px-2.5 py-1 text-[8px] font-semibold transition duration-200 ${
                on
                  ? "text-white shadow-[0_6px_14px_-6px_rgba(234,78,26,0.8)]"
                  : "border border-[#14110d]/10 bg-white text-[#14110d]/65 hover:-translate-y-px hover:border-[#EA4E1A]/60 hover:text-[#EA4E1A]"
              } ${wide ? "hidden @xl:inline" : ""}`}
              style={on ? { backgroundColor: ORANGE } : undefined}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid @xl:grid-cols-[1.1fr_1fr]">
        {/* Targeted hero */}
        <div className="px-5 pt-4 pb-5 @xl:px-7 @xl:py-6">
          <p className="flex items-center gap-1 text-[7.5px] text-[#14110d]/45">
            الرئيسية
            <Icon icon={chevronRight} className="h-2.5 w-2.5" />
            <span style={{ color: ORANGE }}>حلول الشركات</span>
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[#14110d]/10 bg-white px-2 py-1 shadow-[0_6px_16px_-12px_rgba(20,17,13,0.5)]">
            <Icon icon={shieldCheck} className="h-3.5 w-3.5" style={{ color: ORANGE }} />
            <span className="text-[7.5px] font-semibold text-[#14110d]/70">
              مزوّد معتمد
            </span>
          </span>
          <p
            className="mt-3 text-[1.55rem] leading-[1.45] font-bold @xl:text-[1.7rem]"
            style={{ ...serif, color: INK }}
          >
            حلول الشركات،
            <br />
            على قدر عملك.
          </p>
          <p className="mt-2.5 max-w-[32ch] text-[10px] leading-[1.55] text-[#14110d]/65">
            خدمات تركّز على أهداف شركتك، مع تقارير واضحة لخطتك وفريق دعم يتابع معك.
          </p>
          <ul className="mt-3 space-y-1.5">
            {INCLUSIONS.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-[8.5px] text-[#14110d]/75">
                <span
                  className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full"
                  style={{ backgroundColor: `${ORANGE}1a`, color: ORANGE }}
                >
                  <Icon icon={check} className="h-2.5 w-2.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[9.5px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(234,78,26,0.7)] ${CTA_FX}`}
              style={{ backgroundColor: ORANGE }}
            >
              اطلب عرضًا
              <Icon icon={arrowRight} className="h-3 w-3" />
            </span>
            <span className="inline-flex cursor-pointer items-center rounded-md border border-[#EA4E1A]/35 px-3 py-2 text-[9.5px] font-semibold text-[#14110d]/80 transition duration-200 hover:-translate-y-0.5 hover:border-[#EA4E1A] hover:bg-[#EA4E1A]/[0.06] hover:text-[#EA4E1A]">
              اعرف الباقات
            </span>
          </div>
        </div>

        {/* Locations and integrations */}
        <div className="relative flex flex-col gap-2.5 bg-[#FAF8F4] px-5 py-5 @xl:border-l @xl:border-[#14110d]/6 @xl:px-5">
          {/* Referral form */}
          <div className="rounded-xl border border-[#14110d]/8 bg-white p-2.5 shadow-[0_14px_30px_-20px_rgba(20,17,13,0.45)]">
            <p className="text-[8px] font-bold" style={{ color: INK }}>
              نموذج الطلب
            </p>
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                const next = validate(values);
                setErrors(next);
                setSent(Object.keys(next).length === 0);
              }}
            >
              <div className="mt-1.5 grid grid-cols-2 gap-x-1.5 gap-y-1.5">
                {FORM_FIELDS.map(({ label, required, kind, full, type, options }) => {
                  const error = errors[label];
                  const value = values[label] ?? "";
                  const fieldClass = `${FIELD} ${error ? "!border-[#dc2626] bg-white" : ""}`;
                  return (
                    <div key={label} className={full ? "col-span-2" : undefined}>
                      <label
                        htmlFor={`wwb-${label}`}
                        className="block text-[6px] font-semibold text-[#14110d]/65"
                      >
                        {label}
                        {required ? <span style={{ color: ORANGE }}>*</span> : null}
                      </label>
                      {kind === "select" ? (
                        <FormSelect
                          id={`wwb-${label}`}
                          value={value}
                          options={options ?? []}
                          invalid={Boolean(error)}
                          onChange={(v) => setValue(label, v)}
                        />
                      ) : kind === "textarea" ? (
                        <textarea
                          id={`wwb-${label}`}
                          value={value}
                          onChange={(e) => setValue(label, e.target.value)}
                          rows={2}
                          className={`${fieldClass} h-7 resize-none pt-1 leading-tight`}
                        />
                      ) : (
                        <input
                          id={`wwb-${label}`}
                          type={type === "tel" ? "text" : (type ?? "text")}
                          inputMode={
                            type === "tel" ? "numeric" : type === "email" ? "email" : undefined
                          }
                          maxLength={type === "tel" ? 15 : undefined}
                          autoComplete={type === "tel" ? "tel" : type === "email" ? "email" : "off"}
                          value={value}
                          onChange={(e) =>
                            setValue(
                              label,
                              // Phone numbers take digits only.
                              type === "tel" ? e.target.value.replace(/\D/g, "") : e.target.value,
                            )
                          }
                          dir={type === "tel" || type === "email" ? "ltr" : undefined}
                          aria-invalid={Boolean(error)}
                          className={`${fieldClass} h-4`}
                        />
                      )}
                      {error ? (
                        <span role="alert" className="mt-px block text-[5.5px] text-[#dc2626]">
                          {error}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <button
                type="submit"
                className={`mt-2 inline-flex w-full items-center justify-center gap-1 rounded px-2 py-1.5 text-[7.5px] font-semibold text-white ${CTA_FX}`}
                style={{ backgroundColor: sent ? "#16a34a" : ORANGE }}
              >
                {sent ? "تم إرسال الطلب" : "إرسال الطلب"}
                <Icon icon={sent ? check : arrowRight} className="h-2.5 w-2.5" />
              </button>
            </form>
          </div>

          {/* Referral received via the online form */}
          <div
            aria-live="polite"
            className={`flex items-center gap-2 rounded-lg border border-[#14110d]/8 bg-white px-2.5 py-2 shadow-[0_14px_30px_-18px_rgba(20,17,13,0.5)] transition-all duration-500 ${
              sent
                ? "translate-y-0 scale-100 opacity-100"
                : "pointer-events-none translate-y-2 scale-95 opacity-0"
            }`}
          >
            <span
              className="grid h-6 w-6 shrink-0 place-items-center rounded-md"
              style={{ backgroundColor: `${ORANGE}1a`, color: ORANGE }}
            >
              <Icon icon={fileText} className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[8px] font-semibold" style={{ color: INK }}>
                وصل طلب جديد
              </span>
              <span className="block truncate text-[6.5px] text-[#14110d]/50">
                من {values["اسم المسؤول"]?.trim() || "عميلنا"}
                {values["الجهة"]?.trim() ? `، ${values["الجهة"].trim()}` : ""} · الآن
              </span>
            </span>
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#16a34a] text-white">
              <Icon icon={check} className="h-2.5 w-2.5" />
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[6.5px] font-semibold text-[#14110d]/45 uppercase">
              متصل
            </span>
            {["الحجز أونلاين", "نموذج الطلب", "تنبيهات البريد"].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-full border border-[#14110d]/10 bg-white px-1.5 py-0.5 text-[6.5px] font-medium text-[#14110d]/65"
              >
                <span className="h-1 w-1 rounded-full bg-[#16a34a]" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="flex items-center justify-between gap-2 border-t border-[#14110d]/6 px-5 py-3 @xl:px-7">
        <ol className="flex min-w-0 flex-1 items-center gap-1.5">
          {STEPS.map((stepLabel, i) => (
            <li key={stepLabel} className="flex min-w-0 items-center gap-1.5">
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setStep(i)}
                className="group flex min-w-0 cursor-pointer items-center gap-1.5"
              >
                <span
                  className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-[7px] font-bold transition duration-200 group-hover:scale-110"
                  style={
                    i === step
                      ? { backgroundColor: ORANGE, color: "white" }
                      : { backgroundColor: `${INK}0d`, color: INK }
                  }
                >
                  {i + 1}
                </span>
                <span
                  className={`truncate text-[7.5px] font-medium transition-colors duration-200 group-hover:text-[#EA4E1A] ${
                    i === step ? "font-semibold text-[#14110d]" : "text-[#14110d]/70"
                  }`}
                >
                  {stepLabel}
                </span>
              </button>
              {i < STEPS.length - 1 ? (
                <span className="hidden h-px w-4 bg-[#14110d]/15 @md:block" />
              ) : null}
            </li>
          ))}
        </ol>
        <span
          className="hidden shrink-0 items-center gap-1 text-[8px] font-semibold @xl:inline-flex"
          style={{ color: ORANGE }}
        >
          <Icon icon={calendarCheck} className="h-3 w-3" />
          احجز استشارة
        </span>
      </div>
    </div>
  );
}
