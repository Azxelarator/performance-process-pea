"use client";

import { useSyncExternalStore } from "react";

const NEW_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const noop = () => () => {};
// One clock reading per page load keeps the snapshot stable between renders.
let pageLoadedAt = 0;
const readClock = () => (pageLoadedAt ||= Date.now());

/**
 * "ใหม่" badge for items from the last 7 days. Pages are cached, so the
 * comparison runs against the viewer's clock (server snapshot renders nothing).
 */
export function NewBadge({ time }: { time: number }) {
  const now = useSyncExternalStore(noop, readClock, () => 0);
  if (!time || !now || now - time > NEW_WINDOW_MS || time > now) return null;
  return <span className="text-xs bg-alert text-white px-2 rounded font-semibold">ใหม่</span>;
}
