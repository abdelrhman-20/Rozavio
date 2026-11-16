"use client";

import { type FormEvent, useState } from "react";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
  /** Address the enquiry is sent to (a `mailto:` link, no backend yet). */
  email: string;
  title: string;
  text: string;
}

const fieldClass =
  "h-12 rounded-xl border-[#14110d]/15 bg-white px-4 text-[15px] text-[#14110d] placeholder:text-[#14110d]/40 focus-visible:ring-[#EA4E1A]";

/**
 * Enquiry form for the booking section. There is no mail service wired up
 * yet, so submitting composes a `mailto:` message to the team with the
 * answers filled in; the visitor just presses send in their mail app.
 */
export function ContactForm({ email, title, text }: ContactFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const get = (key: string) => String(form.get(key) ?? "").trim();

    const name = get("name");
    const contact = get("contact");
    const business = get("business");
    const message = get("message");

    const next: Record<string, string> = {};
    if (!name) next.name = "اكتب اسمك";
    if (!contact) next.contact = "اكتب بريدك أو رقم جوالك";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const body = [
      `الاسم: ${name}`,
      `وسيلة التواصل: ${contact}`,
      business ? `النشاط: ${business}` : "",
      "",
      message,
    ]
      .filter((line, i) => line !== "" || i === 3)
      .join("\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      `طلب جديد من ${name}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <div className="grid overflow-hidden rounded-[28px] bg-white text-[#14110d] shadow-[0_40px_90px_-40px_rgba(20,17,13,0.55)] lg:grid-cols-[0.85fr_1.15fr]">
      <div className="relative flex flex-col justify-center bg-[#14101c] px-7 py-10 text-[#f4f0e6] sm:px-10 lg:py-14">
        <span
          aria-hidden="true"
          className="grid h-14 w-14 place-items-center rounded-full bg-[#EA4E1A]/15 text-[#EA4E1A]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
        </span>
        <h3 className="rz-h3-lg mt-6">{title}</h3>
        <p className="mt-3 text-[16px] leading-[1.8] text-[#f4f0e6]/65">
          {text}
        </p>
        <a
          href={`mailto:${email}`}
          dir="ltr"
          className="mt-8 inline-flex w-fit items-center gap-2 text-[15px] font-semibold text-[#EA4E1A] transition hover:brightness-125"
        >
          {email}
        </a>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="grid gap-5 px-7 py-10 sm:grid-cols-2 sm:px-10 lg:py-14"
      >
        <FormField label="الاسم" htmlFor="cf-name" error={errors.name}>
          <Input
            id="cf-name"
            name="name"
            autoComplete="name"
            placeholder="اسمك الكريم"
            className={fieldClass}
          />
        </FormField>
        <FormField
          label="البريد أو الجوال"
          htmlFor="cf-contact"
          error={errors.contact}
        >
          <Input
            id="cf-contact"
            name="contact"
            autoComplete="email"
            dir="auto"
            placeholder="name@company.com"
            className={fieldClass}
          />
        </FormField>
        <FormField
          label="نشاطك"
          htmlFor="cf-business"
          className="sm:col-span-2"
        >
          <Input
            id="cf-business"
            name="business"
            placeholder="مثلًا: عيادة، مكتب استشارات، متجر…"
            className={fieldClass}
          />
        </FormField>
        <FormField
          label="ماذا تريد أن يفعله موقعك؟"
          htmlFor="cf-message"
          className="sm:col-span-2"
        >
          <Textarea
            id="cf-message"
            name="message"
            rows={4}
            placeholder="احكِ لنا باختصار عن نشاطك وأهدافك"
            className="rounded-xl border-[#14110d]/15 bg-white px-4 py-3 text-[15px] text-[#14110d] placeholder:text-[#14110d]/40 focus-visible:ring-[#EA4E1A]"
          />
        </FormField>

        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            className="rz-cta-glow inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-base font-semibold text-[var(--color-primary-foreground)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#EA4E1A] focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            أرسل طلبك
          </button>
          <p
            role="status"
            aria-live="polite"
            className="text-sm leading-relaxed text-[#14110d]/60"
          >
            {sent
              ? "فتحنا لك رسالة جاهزة في تطبيق البريد، اضغط إرسال لتصلنا."
              : "سيفتح طلبك كرسالة بريد جاهزة للإرسال."}
          </p>
        </div>
      </form>
    </div>
  );
}
