// The canonical production origin, used to build shareable links. Shares should
// point at the real deployment rather than wherever the app happens to run
// (localhost, a preview URL), so this is a fixed origin, overridable per
// environment with VITE_SITE_URL.

export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://playcodle.vercel.app').replace(
  /\/+$/,
  '',
);

/** Deep link to a specific day's archive entry; loads directly, no in-app nav needed. */
export function archiveUrl(dateISO: string): string {
  return `${SITE_URL}/archive/${dateISO}`;
}
