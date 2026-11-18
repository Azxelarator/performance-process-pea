// Firestore access shared by server pages (via lib/data.ts) and the admin client.
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { ANNOUNCEMENTS, ARTICLES, DEPARTMENTS, DOCUMENTS, STAFF } from './mock-data';
import type { Announcement, Article, Department, DocumentItem, StaffMember, UserPermission } from './types';

type Collections = {
  departments: Department;
  articles: Article;
  documents: DocumentItem;
  announcements: Announcement;
  staff: StaffMember;
};

export type CollectionName = keyof Collections;

const FALLBACK: { [K in CollectionName]: Collections[K][] } = {
  departments: DEPARTMENTS,
  articles: ARTICLES,
  documents: DOCUMENTS,
  announcements: ANNOUNCEMENTS,
  staff: STAFF,
};

const READ_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); },
    );
  });
}

/** Reads a whole collection; falls back to mock data when Firestore is empty or unreachable. */
export async function fetchCollection<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  if (!isFirebaseConfigured) return FALLBACK[name];
  try {
    const snapshot = await withTimeout(getDocs(collection(db, name)), READ_TIMEOUT_MS);
    if (snapshot.empty) return FALLBACK[name];
    return snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as Collections[K]);
  } catch (error) {
    console.warn(`[firestore] "${name}" unavailable, using mock data:`, error);
    return FALLBACK[name];
  }
}

/** Upserts a document keyed by `item.id` (the id itself is not stored as a field). */
export async function saveItem<K extends CollectionName>(name: K, item: Collections[K]): Promise<void> {
  const { id, ...data } = item;
  await setDoc(doc(db, name, id), data, { merge: true });
}

export async function deleteItem(name: CollectionName, id: string): Promise<void> {
  await deleteDoc(doc(db, name, id));
}

export async function fetchUserPermission(email: string): Promise<UserPermission | null> {
  const key = email.trim().toLowerCase();
  if (!key) return null;
  const snap = await getDoc(doc(db, 'users', key));
  return snap.exists() ? ({ ...snap.data(), email: key } as UserPermission) : null;
}

export async function hasAnyUsers(): Promise<boolean> {
  const snap = await getDocs(collection(db, 'users'));
  return !snap.empty;
}

/** Seeds every collection with the mock data and grants `email` super_admin. */
export async function seedMockData(email: string): Promise<void> {
  const batch = writeBatch(db);
  for (const name of Object.keys(FALLBACK) as CollectionName[]) {
    for (const { id, ...data } of FALLBACK[name]) {
      batch.set(doc(db, name, id), data);
    }
  }
  const key = email.trim().toLowerCase();
  if (key) {
    batch.set(
      doc(db, 'users', key),
      { email: key, role: 'super_admin', departmentId: 'all', importedAt: new Date().toISOString() },
      { merge: true },
    );
  }
  await batch.commit();
}
