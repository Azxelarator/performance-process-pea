// Cached reads for Server Components. Admin saves call `refreshPortal()` to expire the tag.
import { cacheLife, cacheTag } from 'next/cache';
import { isAllowedFileType } from './format';
import { fetchCollection, type CollectionName } from './repository';

export const PORTAL_CACHE_TAG = 'portal';

async function cachedCollection<K extends CollectionName>(name: K) {
  'use cache';
  cacheLife('minutes');
  cacheTag(PORTAL_CACHE_TAG);
  const items = await fetchCollection(name);
  // Firestore may return class instances (e.g. Timestamp); keep the cache payload plain.
  return JSON.parse(JSON.stringify(items)) as typeof items;
}

export const getDepartments = () => cachedCollection('departments');
export const getArticles = () => cachedCollection('articles');
// Records in any other format (e.g. old .doc/.xls entries) are not shown publicly.
export const getDocuments = async () => (await cachedCollection('documents')).filter((d) => isAllowedFileType(d.fileType));
export const getAnnouncements = () => cachedCollection('announcements');

export async function getDepartment(id: string) {
  const departments = await getDepartments();
  return departments.find((d) => d.id === id);
}
