/**
 * The public address of the site (for example `https://rozavio.com`), set
 * through `NEXT_PUBLIC_SITE_URL` at build time. Canonical links and the
 * sitemap are only emitted when it is set, so no address is ever guessed.
 */
export const siteUrl: string | undefined = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "")
  : undefined;
