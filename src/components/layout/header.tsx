import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteNavigation } from "@/components/layout/site-navigation";
import { type SiteData } from "@/content/types";

interface HeaderProps {
  site: SiteData;
}

/**
 * Global site header: a floating overlay that sits inside the hero frame
 * at the top of the page. Three balanced zones keep the links optically
 * centred: logo at the start edge, nav in the middle, CTA pill and the
 * mobile menu at the end edge. In RTL "start" is the right side.
 */
export function Header({ site }: HeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-50 pt-6 sm:pt-8">
      <div className="container mx-auto flex h-16 w-full items-center gap-4">
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="rz-enter rz-enter-left flex items-center gap-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.logoSrc}
              alt={site.logoAlt}
              className="h-auto w-[10em] sm:h-13 sm:w-auto"
            />
          </Link>
        </div>
        <div className="hidden items-center justify-center min-[991px]:flex">
          <SiteNavigation items={site.nav} />
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <Link
            href={site.cta.href}
            className="rz-enter rz-enter-right hidden items-center gap-2 rounded-full bg-primary p-[0.7em_1.4em] text-sm font-semibold text-primary-foreground transition hover:brightness-110 sm:inline-flex"
          >
            {site.cta.label}
          </Link>
          <MobileNav items={site.nav} cta={site.cta} />
        </div>
      </div>
    </header>
  );
}
