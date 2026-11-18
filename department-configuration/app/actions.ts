'use server';

import { updateTag } from 'next/cache';
import { PORTAL_CACHE_TAG } from '@/lib/data';

/** Expires cached portal data so public pages show admin edits on the next request. */
export async function refreshPortal() {
  updateTag(PORTAL_CACHE_TAG);
}
