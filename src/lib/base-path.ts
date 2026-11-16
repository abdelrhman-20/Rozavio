/**
 * Sub-path the site is served from (for example `/Rozavio` on GitHub Pages),
 * set through `NEXT_PUBLIC_BASE_PATH` at build time. Empty everywhere else.
 * `next/link` and metadata add it on their own; plain `<a href>` and
 * `<img src>` do not, so they go through `withBase`.
 */
export const basePath: string = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefixes a root-relative path with the base path (idempotent). */
export function withBase(path: string): string {
  if (!basePath || !path.startsWith("/")) return path;
  if (path === basePath) return path;
  const already =
    path.startsWith(`${basePath}/`) ||
    path.startsWith(`${basePath}#`) ||
    path.startsWith(`${basePath}?`);
  return already ? path : `${basePath}${path}`;
}
