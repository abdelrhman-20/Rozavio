import { type Metadata } from "next";
import { type ReactNode } from "react";
import { Cairo } from "next/font/google";

import { siteUrl } from "@/lib/site-url";
import "@/styles/globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-sans",
  display: "swap",
});

const title = "Rozavio | مواقع مخصصة لكل نشاط تجاري";
const description =
  "تصمم Rozavio وتبني مواقع استراتيجية مخصصة لأي نشاط تجاري، مع لوحة تحكم خاصة بكل عميل.";

export const metadata: Metadata = {
  title,
  description,
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } }
    : {}),
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ar_AR",
    siteName: "Rozavio",
  },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
