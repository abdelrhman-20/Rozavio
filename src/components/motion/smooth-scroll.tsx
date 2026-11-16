"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth page scrolling for the public site, powered by Lenis.
 *
 * Lenis runs its own requestAnimationFrame loop (`autoRaf`), so there is
 * no second loop to coordinate. The existing IntersectionObserver reveals
 * are unaffected: they read viewport position, not scroll events.
 *
 * `anchors: true` routes in-page `#links` through Lenis, so they use the
 * same smooth scroll as the wheel. Native CSS `scroll-behavior` is not
 * used, to keep a single smooth-scroll system.
 *
 * Lenis is not created when the visitor prefers reduced motion, so native
 * scrolling is used. Touch scrolling stays native (`smoothTouch` is off).
 */

let activeLenis: Lenis | null = null;
let fallbackOverflow: string | null = null;

/**
 * Locks or unlocks page scrolling for overlays such as the mobile menu.
 *
 * It pauses the existing Lenis instance rather than creating a second
 * scroll system. Lenis's own stop state also blocks wheel and touch
 * scrolling. When Lenis is not running (reduced motion), the document's
 * overflow is locked directly and restored on unlock.
 */
export function setScrollLocked(locked: boolean) {
  if (activeLenis) {
    if (locked) activeLenis.stop();
    else activeLenis.start();
    return;
  }

  const root = document.documentElement;
  if (locked) {
    if (fallbackOverflow === null) fallbackOverflow = root.style.overflow;
    root.style.overflow = "hidden";
  } else if (fallbackOverflow !== null) {
    root.style.overflow = fallbackOverflow;
    fallbackOverflow = null;
  }
}

/**
 * Glides the page back to the top. Uses the running Lenis instance so it
 * matches the rest of the site's scrolling; falls back to the browser's
 * smooth scroll (or an instant jump for reduced motion).
 */
export function scrollToTop() {
  if (activeLenis) {
    // Longer pages get a longer glide, and an ease-in-out curve starts and
    // ends gently instead of rushing off and stopping abruptly.
    const distance = window.scrollY;
    const duration = Math.min(3.2, Math.max(1.6, 1.2 + distance / 5000));
    activeLenis.scrollTo(0, {
      duration,
      easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
    });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      anchors: true,
      autoRaf: true,
    });
    activeLenis = lenis;

    return () => {
      activeLenis = null;
      lenis.destroy();
    };
  }, []);

  return null;
}
