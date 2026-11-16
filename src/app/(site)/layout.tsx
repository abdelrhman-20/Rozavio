import { type ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { site } from "@/content";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <div className="flex min-h-screen flex-col font-sans [font-size:var(--font-base-size)]">
        <Header site={site} />
        <main className="flex-1">{children}</main>
        <Footer site={site} />
      </div>
    </>
  );
}
