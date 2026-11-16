// =====================================================================
//  firestore-service.js — Service Layer สำหรับเชื่อมต่อ Firestore
//  ครอบคลุม CRUD 4 Collections หลัก + สิทธิ์ผู้ใช้ และฟังก์ชัน Seeding
// =====================================================================

import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp
} from './firebase-config.js';

import {
  DEPARTMENTS as FALLBACK_DEPARTMENTS,
  MOCK_ARTICLES as FALLBACK_ARTICLES,
  DOCUMENTS as FALLBACK_DOCUMENTS,
  ANNOUNCEMENTS as FALLBACK_ANNOUNCEMENTS,
  STAFF as FALLBACK_STAFF
} from './mock-data.js';

// ─── 1. Departments ──────────────────────────────────────────────────

export async function fetchDepartments() {
  try {
    const colRef = collection(db, 'departments');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.warn('⚠️ Firestore collection "departments" is empty. Using fallback mock data.');
      return [...FALLBACK_DEPARTMENTS];
    }
    const depts = [];
    snapshot.forEach(docSnap => {
      depts.push({ id: docSnap.id, ...docSnap.data() });
    });
    return depts;
  } catch (err) {
    console.error('Error fetching departments from Firestore:', err);
    return [...FALLBACK_DEPARTMENTS];
  }
}

export async function saveDepartmentToFirestore(department) {
  if (!department || !department.id) throw new Error('Invalid department data');
  const docRef = doc(db, 'departments', department.id);
  const data = { ...department };
  delete data.id; // ID is the document key
  data.updatedAt = new Date().toISOString();
  await setDoc(docRef, data, { merge: true });
  return { id: department.id, ...data };
}

// ─── 2. Articles (Block-based) ───────────────────────────────────────

export async function fetchArticles() {
  try {
    const colRef = collection(db, 'articles');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.warn('⚠️ Firestore collection "articles" is empty. Using fallback mock data.');
      return [...FALLBACK_ARTICLES];
    }
    const articles = [];
    snapshot.forEach(docSnap => {
      articles.push({ id: docSnap.id, ...docSnap.data() });
    });
    return articles;
  } catch (err) {
    console.error('Error fetching articles from Firestore:', err);
    return [...FALLBACK_ARTICLES];
  }
}

export async function saveArticleToFirestore(article) {
  if (!article || !article.id) throw new Error('Invalid article data');
  const docRef = doc(db, 'articles', article.id);
  const data = { ...article };
  delete data.id;
  await setDoc(docRef, data, { merge: true });
  return { id: article.id, ...data };
}

export async function deleteArticleFromFirestore(articleId) {
  if (!articleId) throw new Error('Missing articleId');
  const docRef = doc(db, 'articles', articleId);
  await deleteDoc(docRef);
}

// ─── 3. Documents ────────────────────────────────────────────────────

export async function fetchDocuments() {
  try {
    const colRef = collection(db, 'documents');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.warn('⚠️ Firestore collection "documents" is empty. Using fallback mock data.');
      return [...FALLBACK_DOCUMENTS];
    }
    const docs = [];
    snapshot.forEach(docSnap => {
      docs.push({ id: docSnap.id, ...docSnap.data() });
    });
    return docs;
  } catch (err) {
    console.error('Error fetching documents from Firestore:', err);
    return [...FALLBACK_DOCUMENTS];
  }
}

export async function saveDocumentToFirestore(documentItem) {
  if (!documentItem || !documentItem.id) throw new Error('Invalid document data');
  const docRef = doc(db, 'documents', documentItem.id);
  const data = { ...documentItem };
  delete data.id;
  await setDoc(docRef, data, { merge: true });
  return { id: documentItem.id, ...data };
}

export async function deleteDocumentFromFirestore(docId) {
  if (!docId) throw new Error('Missing docId');
  const docRef = doc(db, 'documents', docId);
  await deleteDoc(docRef);
}

// ─── 4. Announcements ────────────────────────────────────────────────

export async function fetchAnnouncements() {
  try {
    const colRef = collection(db, 'announcements');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.warn('⚠️ Firestore collection "announcements" is empty. Using fallback mock data.');
      return [...FALLBACK_ANNOUNCEMENTS];
    }
    const anns = [];
    snapshot.forEach(docSnap => {
      anns.push({ id: docSnap.id, ...docSnap.data() });
    });
    return anns;
  } catch (err) {
    console.error('Error fetching announcements from Firestore:', err);
    return [...FALLBACK_ANNOUNCEMENTS];
  }
}

// ─── 5. Staff (Org Chart) ─────────────────────────────────────────────

export async function fetchStaff() {
  try {
    const colRef = collection(db, 'staff');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.warn('⚠️ Firestore collection "staff" is empty. Using fallback mock data.');
      return [...FALLBACK_STAFF];
    }
    const staff = [];
    snapshot.forEach(docSnap => {
      staff.push({ id: docSnap.id, ...docSnap.data() });
    });
    return staff;
  } catch (err) {
    console.error('Error fetching staff from Firestore:', err);
    return [...FALLBACK_STAFF];
  }
}

export async function saveStaffToFirestore(staffMember) {
  if (!staffMember || !staffMember.id) throw new Error('Invalid staff data');
  const docRef = doc(db, 'staff', staffMember.id);
  const data = { ...staffMember };
  delete data.id;
  data.updatedAt = new Date().toISOString();
  await setDoc(docRef, data, { merge: true });
  return { id: staffMember.id, ...data };
}

export async function deleteStaffFromFirestore(staffId) {
  if (!staffId) throw new Error('Missing staffId');
  const docRef = doc(db, 'staff', staffId);
  await deleteDoc(docRef);
}

// ─── 6. User Permissions (RBAC) ─────────────────────────────────────

export async function fetchUserPermission(email) {
  if (!email) return null;
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const docRef = doc(db, 'users', normalizedEmail);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { email: normalizedEmail, ...snap.data() };
    }
    return null;
  } catch (err) {
    console.error('Error fetching user permission for:', normalizedEmail, err);
    return null;
  }
}

// ─── 6. Seeding: Import Mock Data to Firestore (Super Admin only) ────

export async function importMockDataToFirestore(userEmail) {
  const normalizedEmail = (userEmail || '').trim().toLowerCase();
  const batch = writeBatch(db);

  // 1. Departments
  FALLBACK_DEPARTMENTS.forEach(dept => {
    const ref = doc(db, 'departments', dept.id);
    const data = { ...dept };
    delete data.id;
    batch.set(ref, data);
  });

  // 2. Articles
  FALLBACK_ARTICLES.forEach(art => {
    const ref = doc(db, 'articles', art.id);
    const data = { ...art };
    delete data.id;
    batch.set(ref, data);
  });

  // 3. Documents
  FALLBACK_DOCUMENTS.forEach(d => {
    const ref = doc(db, 'documents', d.id);
    const data = { ...d };
    delete data.id;
    batch.set(ref, data);
  });

  // 4. Announcements
  FALLBACK_ANNOUNCEMENTS.forEach(ann => {
    const ref = doc(db, 'announcements', ann.id);
    const data = { ...ann };
    delete data.id;
    batch.set(ref, data);
  });

  // 5. Ensure current user is assigned as super_admin if not already present
  if (normalizedEmail) {
    const userRef = doc(db, 'users', normalizedEmail);
    batch.set(userRef, {
      email: normalizedEmail,
      role: 'super_admin',
      departmentId: 'all',
      importedAt: new Date().toISOString()
    }, { merge: true });
  }

  // Commit batch write
  await batch.commit();
  console.log('✅ Successfully seeded all collections to Firestore!');
}
