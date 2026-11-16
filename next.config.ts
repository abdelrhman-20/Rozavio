import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Sites the "Our Work" dialog may embed in an iframe. Keep this in sync with
 * `src/content/client-proof.ts` when a client site is added.
 */
const EMBEDDED_SITES = [
  "https://wida.sa",
  "https://brwaz1.sa",
  "https://meltonphysio.com.au",
];

/**
 * Content-Security-Policy, enforced in production: the browser blocks
 * anything outside this list. (`'unsafe-inline'` is needed for Next's
 * inline bootstrap scripts.)
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  `frame-src ${EMBEDDED_SITES.join(" ")}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  // Nobody can embed this site in an iframe (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // The browser must trust the declared file types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Other sites only learn our origin, not the full page address.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site never uses these browser features, so switch them off.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  ...(isProd
    ? [
        // Always use HTTPS for a year after the first visit.
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
        { key: "Content-Security-Policy", value: csp },
      ]
    : []),
];

/**
 * GitHub Pages build (`DEPLOY_TARGET=github-pages`): a static export served
 * under `/Rozavio`. Pages cannot send custom response headers, so the
 * security headers above only apply on hosts that run Next.js itself.
 */
const isPages = process.env.DEPLOY_TARGET === "github-pages";

const nextConfig: NextConfig = isPages
  ? {
      output: "export",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH,
      images: { unoptimized: true },
      trailingSlash: true,
    }
  : {
      async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
      },
    };

export default nextConfig;
