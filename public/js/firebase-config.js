// =====================================================================
//  firebase-config.js — การตั้งค่าและการเชื่อมต่อ Firebase Modular SDK (v10+)
//  โหลดผ่าน Google CDN โดยตรงสำหรับ Vanilla JavaScript
//  ⚠️ ไม่เก็บ API Key ในไฟล์นี้โดยตรงเพื่อความปลอดภัยและป้องกันการรั่วไหลขึ้น Git
// =====================================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ─── 1. Load Firebase Configuration Dynamically ───────────────────────
let resolvedConfig = null;

// ระดับ 1: โหลดจาก firebase-credentials.js ในเครื่อง (Local File - ถูกละเว้นใน .gitignore)
try {
  const creds = await import('./firebase-credentials.js');
  if (creds?.firebaseConfig?.apiKey && creds.firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY') {
    resolvedConfig = creds.firebaseConfig;
  }
} catch {
  // ไม่พบไฟล์ local credentials (เช่น กรณี clone ลงเครื่องใหม่)
}

// ระดับ 2: โหลดจาก Endpoint /api/firebase-config (สำหรับ Container / Cloud Run ผ่าน Env)
if (!resolvedConfig && typeof fetch === 'function') {
  try {
    const res = await fetch('/api/firebase-config');
    if (res.ok) {
      const data = await res.json();
      if (data?.apiKey) resolvedConfig = data;
    }
  } catch {}
}

// ระดับ 3: โหลดจาก Firebase Hosting Reserved URL (เมื่อ deploy บน Firebase Hosting)
if (!resolvedConfig && typeof fetch === 'function') {
  try {
    const res = await fetch('/__/firebase/init.json');
    if (res.ok) {
      const data = await res.json();
      if (data?.apiKey) resolvedConfig = data;
    }
  } catch {}
}

// ระดับ 4: โหลดจาก window.__FIREBASE_CONFIG__ (หากมีการประกาศแบบ Global Script)
if (!resolvedConfig && typeof window !== 'undefined' && window.__FIREBASE_CONFIG__) {
  resolvedConfig = window.__FIREBASE_CONFIG__;
}

if (!resolvedConfig) {
  console.warn(
    '⚠️ ไม่พบการตั้งค่า Firebase: ระบบจะทำงานในโหมด Fallback Mock Data\n' +
    '💡 หากต้องการเชื่อมต่อ Firestore กรุณาคัดลอก `public/js/firebase-credentials.example.js` ไปเป็น `firebase-credentials.js`'
  );
}

// ─── 2. Initialize Firebase Core & Services ───────────────────────────
export const app = resolvedConfig ? initializeApp(resolvedConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

// Authentication Provider
export const googleProvider = app ? new GoogleAuthProvider() : null;
if (googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

export function isFirebaseReady() {
  return Boolean(app && db);
}

// Export Auth & Firestore Modular Methods for convenience
export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp
};
