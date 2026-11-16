// =====================================================================
//  admin.js — ระบบจัดการฟอร์มหลังบ้าน (Firebase Auth + Firestore + Block Editor)
// =====================================================================

import {
  auth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  googleProvider,
  db,
  collection,
  getDocs
} from './firebase-config.js';

import {
  fetchDepartments,
  saveDepartmentToFirestore,
  fetchArticles,
  saveArticleToFirestore,
  deleteArticleFromFirestore,
  fetchDocuments,
  saveDocumentToFirestore,
  deleteDocumentFromFirestore,
  fetchUserPermission,
  importMockDataToFirestore
} from './firestore-service.js';

import { CATEGORIES } from './mock-data.js';
import {
  renderBlocks,
  getDepartmentName,
  getCategoryName,
  getCategoryBadgeClass,
  formatDate,
  escapeHtml
} from './renderer.js';

// ─── State ──────────────────────────────────────────────────────────
let currentUser = null;
let currentPermission = null; // { role: 'super_admin' | 'editor', departmentId: 'gis' | 'all' }

let articles = [];
let departments = [];
let documents = [];
let currentBlocks = [];         // blocks being edited in article form
let editingArticleId = null;    // null = creating new article
let editingDocId = null;        // null = creating new doc
let selectedDeptId = 'gis';

// ─── 1. Authentication & Authorization Initialization ────────────────

function initAuth() {
  // Google Sign-In button
  document.getElementById('btnGoogleSignIn')?.addEventListener('click', handleGoogleSignIn);
  document.getElementById('btnSignOut')?.addEventListener('click', handleSignOut);
  document.getElementById('btnDeniedSignOut')?.addEventListener('click', handleSignOut);
  document.getElementById('btnFirstTimeSetup')?.addEventListener('click', handleFirstTimeSetup);
  document.getElementById('btnImportMockData')?.addEventListener('click', handleImportMockData);

  if (!auth) {
    console.warn('Firebase Auth is not initialized. Check firebase-credentials.js.');
    showLoginModal();
    return;
  }

  // Auth State Listener
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      await handleUserLoggedIn(user);
    } else {
      currentUser = null;
      currentPermission = null;
      showLoginModal();
    }
  });
}

async function handleGoogleSignIn() {
  if (!auth || !googleProvider) {
    alert('⚠️ ยังไม่ได้ตั้งค่า Firebase Credentials กรุณาสร้างไฟล์ public/js/firebase-credentials.js โดยคัดลอกจาก firebase-credentials.example.js');
    return;
  }
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error('Google Sign-In Error:', err);
    showToast(`❌ เข้าสู่ระบบไม่สำเร็จ: ${err.message}`, 'warning');
  }
}

async function handleSignOut() {
  try {
    await signOut(auth);
    showToast('👋 ออกจากระบบเรียบร้อยแล้ว');
  } catch (err) {
    console.error('Sign-Out Error:', err);
  }
}

async function handleUserLoggedIn(user) {
  const email = (user.email || '').toLowerCase();

  // Check user role in Firestore 'users' collection
  let permission = await fetchUserPermission(email);

  // If no permission found, check if 'users' collection is completely empty
  // (First-time deployment bootstrapping)
  if (!permission) {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      if (usersSnap.empty) {
        // Fresh database! Offer first-time setup
        showAccessDeniedModal(email, true);
        return;
      }
    } catch (e) {
      console.warn('Could not check users collection:', e);
    }
    showAccessDeniedModal(email, false);
    return;
  }

  // Permission granted!
  currentPermission = permission;
  hideAuthModals();
  updateUserProfileUI(user, permission);

  // Initialize Admin Panel Data
  await loadAllFirestoreData();
  setupTabNavigation();
  populateDropdowns();
  setupEventListeners();

  renderArticleList();
  initDepartmentProfileEditor();
  renderAdminDocsTable();
}

function showLoginModal() {
  document.getElementById('authLoginModal')?.classList.remove('hidden');
  document.getElementById('authLoginModal')?.classList.add('flex');
  document.getElementById('authAccessDeniedModal')?.classList.add('hidden');
  document.getElementById('userProfileWidget')?.classList.add('hidden');
  document.getElementById('userProfileWidget')?.classList.remove('flex');
}

function showAccessDeniedModal(email, isFirstTime) {
  document.getElementById('authLoginModal')?.classList.add('hidden');
  const deniedModal = document.getElementById('authAccessDeniedModal');
  deniedModal?.classList.remove('hidden');
  deniedModal?.classList.add('flex');

  document.getElementById('deniedUserEmail').textContent = email;

  const firstTimeBox = document.getElementById('firstTimeSetupBox');
  if (isFirstTime) {
    firstTimeBox?.classList.remove('hidden');
  } else {
    firstTimeBox?.classList.add('hidden');
  }
}

function hideAuthModals() {
  document.getElementById('authLoginModal')?.classList.add('hidden');
  document.getElementById('authLoginModal')?.classList.remove('flex');
  document.getElementById('authAccessDeniedModal')?.classList.add('hidden');
  document.getElementById('authAccessDeniedModal')?.classList.remove('flex');
}

function updateUserProfileUI(user, permission) {
  const widget = document.getElementById('userProfileWidget');
  widget?.classList.remove('hidden');
  widget?.classList.add('flex');

  const avatar = document.getElementById('userAvatarImg');
  if (avatar) avatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Admin')}&background=E5A93C&color=4A154B`;

  const nameTxt = document.getElementById('userNameTxt');
  if (nameTxt) nameTxt.textContent = user.displayName || user.email;

  const roleBadge = document.getElementById('userRoleBadge');
  const importBtn = document.getElementById('btnImportMockData');

  if (permission.role === 'super_admin') {
    if (roleBadge) roleBadge.textContent = '⭐ Super Admin';
    if (importBtn) importBtn.classList.remove('hidden');
  } else {
    const deptName = getDepartmentName(permission.departmentId) || permission.departmentId;
    if (roleBadge) roleBadge.textContent = `🏢 Editor: ${deptName}`;
    if (importBtn) importBtn.classList.add('hidden');
  }
}

// ─── First-time Setup & Mock Data Import ─────────────────────────────

async function handleFirstTimeSetup() {
  if (!currentUser) return;
  const btn = document.getElementById('btnFirstTimeSetup');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ กำลังตั้งค่าระบบและนำเข้าข้อมูล...';
  }

  try {
    await importMockDataToFirestore(currentUser.email);
    showToast('🎉 ตั้งค่า Super Admin และนำเข้าข้อมูลเริ่มต้นสำเร็จ!');
    await handleUserLoggedIn(currentUser);
  } catch (err) {
    console.error('First-time setup failed:', err);
    showToast(`❌ เกิดข้อผิดพลาด: ${err.message}`, 'warning');
    if (btn) {
      btn.disabled = false;
      btn.textContent = '🚀 ตั้งค่าบัญชีนี้เป็น Super Admin & นำเข้าข้อมูล';
    }
  }
}

async function handleImportMockData() {
  if (!confirm('ยืนยันการนำเข้าข้อมูลจำลอง (Mock Data) ขึ้น Firestore หรือไม่? (ข้อมูลเดิมจะถูกเขียนทับ)')) {
    return;
  }
  const btn = document.getElementById('btnImportMockData');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ กำลังนำเข้าข้อมูล...';
  }

  try {
    await importMockDataToFirestore(currentUser?.email);
    showToast('✅ นำเข้าข้อมูลจำลองขึ้น Firestore เรียบร้อยแล้ว!');
    await loadAllFirestoreData();
    populateDropdowns();
    renderArticleList();
    initDepartmentProfileEditor();
    renderAdminDocsTable();
  } catch (err) {
    console.error('Import failed:', err);
    showToast(`❌ เกิดข้อผิดพลาด: ${err.message}`, 'warning');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>🚀</span> Import Mock Data to Firestore';
    }
  }
}

// ─── 2. Data Loading from Firestore ──────────────────────────────────

async function loadAllFirestoreData() {
  const [loadedDepts, loadedArticles, loadedDocs] = await Promise.all([
    fetchDepartments(),
    fetchArticles(),
    fetchDocuments()
  ]);

  departments = loadedDepts;
  articles = loadedArticles;
  documents = loadedDocs;

  // Set default selected department based on permission
  if (currentPermission?.role === 'editor' && currentPermission.departmentId) {
    selectedDeptId = currentPermission.departmentId;
  } else if (!selectedDeptId || !departments.some(d => d.id === selectedDeptId)) {
    selectedDeptId = departments[0]?.id || 'gis';
  }
}

// ─── 3. Navigation & Dropdowns ───────────────────────────────────────

function setupTabNavigation() {
  const tabArticlesBtn = document.getElementById('tabArticlesBtn');
  const tabDeptBtn = document.getElementById('tabDeptBtn');
  const tabDocsBtn = document.getElementById('tabDocsBtn');

  const secArticles = document.getElementById('sectionArticles');
  const secDept = document.getElementById('sectionDepartment');
  const secDocs = document.getElementById('sectionDocuments');

  function switchTab(activeBtn, activeSec) {
    [tabArticlesBtn, tabDeptBtn, tabDocsBtn].forEach(btn => btn?.classList.remove('nav-tab-active'));
    [secArticles, secDept, secDocs].forEach(sec => sec?.classList.add('hidden'));

    activeBtn.classList.add('nav-tab-active');
    activeSec.classList.remove('hidden');
  }

  tabArticlesBtn?.addEventListener('click', () => switchTab(tabArticlesBtn, secArticles));
  tabDeptBtn?.addEventListener('click', () => switchTab(tabDeptBtn, secDept));
  tabDocsBtn?.addEventListener('click', () => switchTab(tabDocsBtn, secDocs));
}

function populateDropdowns() {
  const isEditor = currentPermission?.role === 'editor';
  const userDeptId = currentPermission?.departmentId;

  // Article department dropdown
  const deptSelect = document.getElementById('inputDepartment');
  deptSelect.innerHTML = departments.map(d => `<option value="${escapeHtml(d.id)}">${escapeHtml(d.name)}</option>`).join('');

  const deptLockNotice = document.getElementById('deptLockNotice');

  if (isEditor && userDeptId) {
    deptSelect.value = userDeptId;
    deptSelect.disabled = true;
    deptLockNotice?.classList.remove('hidden');
  } else {
    deptSelect.disabled = false;
    deptLockNotice?.classList.add('hidden');
  }

  // Article category dropdown
  const catSelect = document.getElementById('inputCategory');
  catSelect.innerHTML = CATEGORIES.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`).join('');

  // Dept selector for Section 2 (Department profile)
  const adminDeptSelector = document.getElementById('adminDeptSelector');
  if (isEditor && userDeptId) {
    const editorDept = departments.filter(d => d.id === userDeptId);
    adminDeptSelector.innerHTML = editorDept.map(d => `<option value="${escapeHtml(d.id)}">🏢 ${escapeHtml(d.shortName || d.name)}</option>`).join('');
    adminDeptSelector.disabled = true;
    selectedDeptId = userDeptId;
  } else {
    adminDeptSelector.innerHTML = departments.map(d => `<option value="${escapeHtml(d.id)}" ${d.id === selectedDeptId ? 'selected' : ''}>🏢 ${escapeHtml(d.shortName || d.name)}</option>`).join('');
    adminDeptSelector.disabled = false;
  }

  // Doc modal dept dropdown
  const docInputDept = document.getElementById('docInputDept');
  if (isEditor && userDeptId) {
    const editorDept = departments.filter(d => d.id === userDeptId);
    docInputDept.innerHTML = editorDept.map(d => `<option value="${escapeHtml(d.id)}">${escapeHtml(d.shortName || d.name)}</option>`).join('');
    docInputDept.disabled = true;
  } else {
    docInputDept.innerHTML = departments.map(d => `<option value="${escapeHtml(d.id)}">${escapeHtml(d.shortName || d.name)}</option>`).join('');
    docInputDept.disabled = false;
  }
}

function setupEventListeners() {
  // Section 1: Articles Block Editor
  document.getElementById('btnCreate')?.addEventListener('click', () => openForm(null));
  document.getElementById('btnBack')?.addEventListener('click', closeForm);
  document.getElementById('btnCancel')?.addEventListener('click', closeForm);
  document.getElementById('btnSave')?.addEventListener('click', handleSave);

  document.querySelectorAll('.btn-add-block').forEach(btn => {
    btn.addEventListener('click', () => addBlock(btn.dataset.blockType));
  });

  document.getElementById('btnDeleteCancel')?.addEventListener('click', closeDeleteModal);

  // Section 2: Department Profile
  document.getElementById('adminDeptSelector')?.addEventListener('change', (e) => {
    selectedDeptId = e.target.value;
    loadDepartmentIntoEditor(selectedDeptId);
  });
  document.getElementById('btnSaveDeptProfile')?.addEventListener('click', handleSaveDepartmentProfile);

  // Section 3: Documents Manager
  document.getElementById('btnOpenDocModal')?.addEventListener('click', () => openDocModal(null));
  document.getElementById('btnCloseDocModal')?.addEventListener('click', closeDocModal);
  document.getElementById('btnCancelDocModal')?.addEventListener('click', closeDocModal);
  document.getElementById('btnSaveDoc')?.addEventListener('click', handleSaveDoc);
}

// ═════════════════════════════════════════════════════════════════════
//  SECTION 1: ARTICLES & WORKS (BLOCK-BASED ARCHITECTURE)
// ═════════════════════════════════════════════════════════════════════

function renderArticleList() {
  const tbody = document.getElementById('articlesTableBody');
  const empty = document.getElementById('tableEmpty');

  const isEditor = currentPermission?.role === 'editor';
  const userDeptId = currentPermission?.departmentId;

  // Filter for editor if needed
  let displayArticles = articles;
  if (isEditor && userDeptId) {
    displayArticles = articles.filter(a => a.department === userDeptId);
  }

  if (displayArticles.length === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  const sorted = [...displayArticles].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  tbody.innerHTML = sorted.map(article => {
    const badgeClass = getCategoryBadgeClass(article.category);
    return `
      <tr class="hover:bg-purple-50/50 transition-colors">
        <td class="px-6 py-4">
          <p class="text-sm font-semibold text-gray-900 line-clamp-1">${escapeHtml(article.title)}</p>
        </td>
        <td class="px-6 py-4 hidden md:table-cell">
          <span class="text-sm text-gray-600">${escapeHtml(getDepartmentName(article.department))}</span>
        </td>
        <td class="px-6 py-4 hidden sm:table-cell">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}">
            ${escapeHtml(getCategoryName(article.category))}
          </span>
        </td>
        <td class="px-6 py-4 hidden lg:table-cell">
          <span class="text-xs text-gray-500">${formatDate(article.updatedAt)}</span>
        </td>
        <td class="px-6 py-4 text-center">
          <div class="flex items-center justify-center gap-2">
            <button class="btn-edit text-purple-600 hover:text-purple-800 hover:bg-purple-100 p-1.5 rounded-lg transition-colors"
                    data-id="${escapeHtml(article.id)}" title="แก้ไข">
              ✏️
            </button>
            <button class="btn-delete text-red-500 hover:text-red-700 hover:bg-red-100 p-1.5 rounded-lg transition-colors"
                    data-id="${escapeHtml(article.id)}" title="ลบ">
              🗑️
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');

  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const article = articles.find(a => a.id === btn.dataset.id);
      if (article) openForm(article);
    });
  });

  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(btn.dataset.id, 'article'));
  });
}

function openForm(article) {
  editingArticleId = article ? article.id : null;

  document.getElementById('formTitle').textContent = article
    ? '✏️ แก้ไขบทความ'
    : '➕ สร้างบทความใหม่';

  const deptSelect = document.getElementById('inputDepartment');
  if (currentPermission?.role === 'editor') {
    deptSelect.value = currentPermission.departmentId;
    deptSelect.disabled = true;
  } else {
    deptSelect.value = article ? article.department : (departments[0]?.id || 'gis');
    deptSelect.disabled = false;
  }

  document.getElementById('inputCategory').value = article ? article.category : CATEGORIES[0].id;
  document.getElementById('inputTitle').value = article ? article.title : '';

  currentBlocks = article ? JSON.parse(JSON.stringify(article.blocks || [])) : [];

  renderBlocksEditor();
  updatePreview();
  showFormView();
}

function closeForm() {
  editingArticleId = null;
  currentBlocks = [];
  showListView();
}

function showFormView() {
  document.getElementById('listView').classList.add('hidden');
  document.getElementById('formView').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showListView() {
  document.getElementById('formView').classList.add('hidden');
  document.getElementById('listView').classList.remove('hidden');
  renderArticleList();
}

function addBlock(type) {
  let newBlock;
  switch (type) {
    case 'paragraph':
      newBlock = { type: 'paragraph', text: '' };
      break;
    case 'callout':
      newBlock = { type: 'callout', icon: 'info', text: '' };
      break;
    case 'image':
      newBlock = { type: 'image', url: '', caption: '' };
      break;
    case 'list':
      newBlock = { type: 'list', style: 'unordered', items: [''] };
      break;
    default:
      return;
  }
  currentBlocks.push(newBlock);
  renderBlocksEditor();
  updatePreview();
}

function removeBlock(index) {
  currentBlocks.splice(index, 1);
  renderBlocksEditor();
  updatePreview();
}

function moveBlock(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= currentBlocks.length) return;
  [currentBlocks[index], currentBlocks[newIndex]] = [currentBlocks[newIndex], currentBlocks[index]];
  renderBlocksEditor();
  updatePreview();
}

function renderBlocksEditor() {
  const container = document.getElementById('blocksContainer');
  const emptyMsg = document.getElementById('blocksEmpty');

  if (currentBlocks.length === 0) {
    container.innerHTML = '';
    emptyMsg.classList.remove('hidden');
    return;
  }

  emptyMsg.classList.add('hidden');

  container.innerHTML = currentBlocks.map((block, index) => {
    const isFirst = index === 0;
    const isLast = index === currentBlocks.length - 1;
    return `
      <div class="border border-gray-200 rounded-xl p-4 bg-gray-50 relative group" data-block-index="${index}">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
          <span class="text-xs font-semibold uppercase tracking-wider ${getBlockLabelClass(block.type)}">
            ${getBlockLabel(block.type)}
          </span>
          <div class="flex items-center gap-1">
            <button class="block-btn-up p-1 rounded hover:bg-gray-200 transition-colors ${isFirst ? 'opacity-30 cursor-not-allowed' : ''}"
                    data-index="${index}" ${isFirst ? 'disabled' : ''} title="เลื่อนขึ้น">
              ⬆️
            </button>
            <button class="block-btn-down p-1 rounded hover:bg-gray-200 transition-colors ${isLast ? 'opacity-30 cursor-not-allowed' : ''}"
                    data-index="${index}" ${isLast ? 'disabled' : ''} title="เลื่อนลง">
              ⬇️
            </button>
            <button class="block-btn-remove p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                    data-index="${index}" title="ลบบล็อก">
              ❌
            </button>
          </div>
        </div>
        ${renderBlockForm(block, index)}
      </div>`;
  }).join('');

  attachBlockListeners();
}

function getBlockLabel(type) {
  const labels = {
    paragraph: '📝 ย่อหน้า',
    callout: '💬 กรอบข้อความ',
    image: '🖼️ รูปภาพ',
    list: '📋 รายการ'
  };
  return labels[type] || type;
}

function getBlockLabelClass(type) {
  const classes = {
    paragraph: 'text-purple-600',
    callout: 'text-amber-600',
    image: 'text-green-600',
    list: 'text-blue-600'
  };
  return classes[type] || 'text-gray-600';
}

function renderBlockForm(block, index) {
  switch (block.type) {
    case 'paragraph':
      return `
        <textarea class="block-input w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-y min-h-[80px]"
                  data-index="${index}" data-field="text"
                  placeholder="พิมพ์เนื้อหาย่อหน้า...">${escapeHtml(block.text || '')}</textarea>`;

    case 'callout':
      return `
        <div class="space-y-2">
          <select class="block-input w-full sm:w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  data-index="${index}" data-field="icon">
            <option value="info" ${block.icon === 'info' ? 'selected' : ''}>ℹ️ ข้อมูล (Info)</option>
            <option value="warning" ${block.icon === 'warning' ? 'selected' : ''}>⚠️ คำเตือน (Warning)</option>
            <option value="success" ${block.icon === 'success' ? 'selected' : ''}>✅ สำเร็จ (Success)</option>
          </select>
          <textarea class="block-input w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-y min-h-[60px]"
                    data-index="${index}" data-field="text"
                    placeholder="พิมพ์ข้อความในกรอบ...">${escapeHtml(block.text || '')}</textarea>
        </div>`;

    case 'image':
      return `
        <div class="space-y-2">
          <input type="url" class="block-input w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                 data-index="${index}" data-field="url"
                 placeholder="https://example.com/image.jpg"
                 value="${escapeHtml(block.url || '')}">
          <input type="text" class="block-input w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                 data-index="${index}" data-field="caption"
                 placeholder="คำอธิบายใต้ภาพ"
                 value="${escapeHtml(block.caption || '')}">
        </div>`;

    case 'list':
      return `
        <div class="space-y-2">
          <select class="block-input w-full sm:w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  data-index="${index}" data-field="style">
            <option value="unordered" ${block.style === 'unordered' ? 'selected' : ''}>• หัวข้อย่อย (Bullet)</option>
            <option value="ordered" ${block.style === 'ordered' ? 'selected' : ''}>1. ลำดับเลข (Numbered)</option>
          </select>
          <div class="space-y-2 list-items-container" data-block-index="${index}">
            ${(block.items || []).map((item, itemIdx) => `
              <div class="flex items-center gap-2">
                <span class="text-gray-400 text-xs w-6 text-right flex-shrink-0">${block.style === 'ordered' ? (itemIdx + 1) + '.' : '•'}</span>
                <input type="text" class="list-item-input flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                       data-block-index="${index}" data-item-index="${itemIdx}"
                       placeholder="รายการที่ ${itemIdx + 1}"
                       value="${escapeHtml(item || '')}">
                <button class="btn-remove-item text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"
                        data-block-index="${index}" data-item-index="${itemIdx}"
                        title="ลบรายการ" ${(block.items || []).length <= 1 ? 'disabled style="opacity:0.3;cursor:not-allowed"' : ''}>
                  ✕
                </button>
              </div>
            `).join('')}
          </div>
          <button class="btn-add-item text-blue-600 hover:text-blue-800 text-xs font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                  data-block-index="${index}">
            + เพิ่มรายการ
          </button>
        </div>`;

    default:
      return `<p class="text-red-500 text-sm">Unknown block type: ${block.type}</p>`;
  }
}

function attachBlockListeners() {
  document.querySelectorAll('.block-btn-up').forEach(btn => {
    btn.addEventListener('click', () => moveBlock(parseInt(btn.dataset.index), -1));
  });

  document.querySelectorAll('.block-btn-down').forEach(btn => {
    btn.addEventListener('click', () => moveBlock(parseInt(btn.dataset.index), 1));
  });

  document.querySelectorAll('.block-btn-remove').forEach(btn => {
    btn.addEventListener('click', () => removeBlock(parseInt(btn.dataset.index)));
  });

  document.querySelectorAll('.block-input').forEach(input => {
    input.addEventListener('input', handleBlockInput);
    input.addEventListener('change', handleBlockInput);
  });

  document.querySelectorAll('.list-item-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const blockIdx = parseInt(e.target.dataset.blockIndex);
      const itemIdx = parseInt(e.target.dataset.itemIndex);
      currentBlocks[blockIdx].items[itemIdx] = e.target.value;
      updatePreview();
    });
  });

  document.querySelectorAll('.btn-add-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const blockIdx = parseInt(btn.dataset.blockIndex);
      currentBlocks[blockIdx].items.push('');
      renderBlocksEditor();
      updatePreview();
    });
  });

  document.querySelectorAll('.btn-remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const blockIdx = parseInt(btn.dataset.blockIndex);
      const itemIdx = parseInt(btn.dataset.itemIndex);
      if (currentBlocks[blockIdx].items.length > 1) {
        currentBlocks[blockIdx].items.splice(itemIdx, 1);
        renderBlocksEditor();
        updatePreview();
      }
    });
  });
}

function handleBlockInput(e) {
  const idx = parseInt(e.target.dataset.index);
  const field = e.target.dataset.field;
  if (idx >= 0 && field && currentBlocks[idx]) {
    currentBlocks[idx][field] = e.target.value;
    updatePreview();
  }
}

function updatePreview() {
  const container = document.getElementById('previewContainer');
  if (currentBlocks.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center text-xs">ตัวอย่างจะแสดงที่นี่เมื่อเริ่มพิมพ์เนื้อหา</p>';
    return;
  }
  container.innerHTML = renderBlocks(currentBlocks);
}

async function handleSave() {
  const department = document.getElementById('inputDepartment').value;
  const category = document.getElementById('inputCategory').value;
  const title = document.getElementById('inputTitle').value.trim();

  if (!title) {
    showToast('⚠️ กรุณากรอกหัวเรื่อง', 'warning');
    document.getElementById('inputTitle').focus();
    return;
  }

  if (currentBlocks.length === 0) {
    showToast('⚠️ กรุณาเพิ่มเนื้อหาอย่างน้อย 1 บล็อก', 'warning');
    return;
  }

  const now = new Date().toISOString();
  const saveBtn = document.getElementById('btnSave');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ กำลังบันทึก...';
  }

  try {
    if (editingArticleId) {
      const updatedArticle = {
        id: editingArticleId,
        department,
        category,
        title,
        updatedAt: now,
        blocks: JSON.parse(JSON.stringify(currentBlocks))
      };
      await saveArticleToFirestore(updatedArticle);
      const idx = articles.findIndex(a => a.id === editingArticleId);
      if (idx !== -1) articles[idx] = updatedArticle;
      showToast('✅ อัปเดตบทความลง Firestore สำเร็จ');
    } else {
      const newArticle = {
        id: generateId(category, department),
        department,
        category,
        title,
        updatedAt: now,
        blocks: JSON.parse(JSON.stringify(currentBlocks))
      };
      await saveArticleToFirestore(newArticle);
      articles.unshift(newArticle);
      showToast('✅ สร้างบทความใหม่ลง Firestore สำเร็จ');
    }
    closeForm();
  } catch (err) {
    console.error('Save Article Error:', err);
    showToast(`❌ บันทึกไม่สำเร็จ: ${err.message}`, 'warning');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<span>💾</span> บันทึกลง Firestore';
    }
  }
}

function generateId(category, department) {
  const prefix = category === 'process' ? 'proc' : (category === 'achievement' ? 'achv' : 'art');
  const ts = Date.now().toString(36);
  return `${prefix}-${department}-${ts}`;
}

// ═════════════════════════════════════════════════════════════════════
//  SECTION 2: DEPARTMENT PROFILE & MISSIONS
// ═════════════════════════════════════════════════════════════════════

function initDepartmentProfileEditor() {
  loadDepartmentIntoEditor(selectedDeptId);
}

function loadDepartmentIntoEditor(deptId) {
  const dept = departments.find(d => d.id === deptId) || departments[0];
  if (!dept) return;

  selectedDeptId = dept.id;

  document.getElementById('deptEditName').value = dept.name || '';
  document.getElementById('deptEditNameEn').value = dept.nameEn || '';
  document.getElementById('deptEditHeroDesc').value = dept.heroDescription || '';
  document.getElementById('deptEditOverviewTitle').value = dept.overviewTitle || '';
  document.getElementById('deptEditOverviewText').value = dept.overviewText || '';

  // Stats (3 items)
  const stats = dept.stats || [
    { label: 'สถิติ 1', value: '0', unit: '' },
    { label: 'สถิติ 2', value: '0', unit: '' },
    { label: 'สถิติ 3', value: '0', unit: '' }
  ];
  const statsContainer = document.getElementById('deptEditStatsContainer');
  statsContainer.innerHTML = [0, 1, 2].map(i => {
    const s = stats[i] || { label: '', value: '', unit: '' };
    return `
      <div class="border rounded-xl p-3 bg-gray-50 space-y-2">
        <span class="text-xs font-bold text-purple-800">ช่องสถิติที่ ${i + 1}</span>
        <input type="text" id="statValue_${i}" placeholder="ค่า เช่น 8" value="${escapeHtml(s.value)}" class="w-full border rounded-lg px-2.5 py-1.5 text-xs">
        <input type="text" id="statLabel_${i}" placeholder="ชื่อสถิติ เช่น จัดเก็บ" value="${escapeHtml(s.label)}" class="w-full border rounded-lg px-2.5 py-1.5 text-xs">
        <input type="text" id="statUnit_${i}" placeholder="หน่วย เช่น ชุดข้อมูล" value="${escapeHtml(s.unit || '')}" class="w-full border rounded-lg px-2.5 py-1.5 text-xs">
      </div>`;
  }).join('');

  // Missions (6 items)
  const missions = dept.missions || [];
  const missionsContainer = document.getElementById('deptEditMissionsContainer');
  missionsContainer.innerHTML = [0, 1, 2, 3, 4, 5].map(i => {
    const m = missions[i] || { title: '', description: '' };
    return `
      <div class="border rounded-xl p-3 bg-gray-50 space-y-1.5">
        <span class="text-xs font-bold text-purple-900">ภารกิจข้อที่ ${i + 1}</span>
        <input type="text" id="missionTitle_${i}" placeholder="หัวข้อภารกิจ" value="${escapeHtml(m.title || '')}" class="w-full border rounded-lg px-2.5 py-1.5 text-xs font-semibold">
        <textarea id="missionDesc_${i}" rows="2" placeholder="คำอธิบายภารกิจย่อย..." class="w-full border rounded-lg px-2.5 py-1.5 text-xs">${escapeHtml(m.description || '')}</textarea>
      </div>`;
  }).join('');

  // Contact
  const c = dept.contact || {};
  document.getElementById('deptEditLocation').value = c.location || '';
  document.getElementById('deptEditPhone').value = c.phone || '';
  document.getElementById('deptEditEmail').value = c.email || '';
  document.getElementById('deptEditHours').value = c.hours || '';
}

async function handleSaveDepartmentProfile() {
  const deptIdx = departments.findIndex(d => d.id === selectedDeptId);
  if (deptIdx === -1) return;

  const btn = document.getElementById('btnSaveDeptProfile');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ กำลังบันทึก...';
  }

  const name = document.getElementById('deptEditName').value.trim();
  const nameEn = document.getElementById('deptEditNameEn').value.trim();
  const heroDescription = document.getElementById('deptEditHeroDesc').value.trim();
  const overviewTitle = document.getElementById('deptEditOverviewTitle').value.trim();
  const overviewText = document.getElementById('deptEditOverviewText').value.trim();

  const stats = [0, 1, 2].map(i => ({
    id: `stat_${i}`,
    value: document.getElementById(`statValue_${i}`).value.trim(),
    label: document.getElementById(`statLabel_${i}`).value.trim(),
    unit: document.getElementById(`statUnit_${i}`).value.trim()
  }));

  const missions = [0, 1, 2, 3, 4, 5].map(i => ({
    step: i + 1,
    title: document.getElementById(`missionTitle_${i}`).value.trim(),
    description: document.getElementById(`missionDesc_${i}`).value.trim()
  })).filter(m => m.title);

  const contact = {
    location: document.getElementById('deptEditLocation').value.trim(),
    phone: document.getElementById('deptEditPhone').value.trim(),
    email: document.getElementById('deptEditEmail').value.trim(),
    hours: document.getElementById('deptEditHours').value.trim()
  };

  const updatedDept = {
    ...departments[deptIdx],
    id: selectedDeptId,
    name,
    nameEn,
    heroDescription,
    overviewTitle,
    overviewText,
    stats,
    missions,
    contact
  };

  try {
    await saveDepartmentToFirestore(updatedDept);
    departments[deptIdx] = updatedDept;
    showToast('✅ บันทึกข้อมูลแผนกลง Firestore สำเร็จ');
  } catch (err) {
    console.error('Save Dept Error:', err);
    showToast(`❌ บันทึกไม่สำเร็จ: ${err.message}`, 'warning');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '💾 บันทึกข้อมูลแผนกลง Firestore';
    }
  }
}

// ═════════════════════════════════════════════════════════════════════
//  SECTION 3: DOCUMENTS MANAGER
// ═════════════════════════════════════════════════════════════

function renderAdminDocsTable() {
  const tbody = document.getElementById('adminDocsTableBody');
  if (!tbody) return;

  const isEditor = currentPermission?.role === 'editor';
  const userDeptId = currentPermission?.departmentId;

  let displayDocs = documents;
  if (isEditor && userDeptId) {
    displayDocs = documents.filter(d => d.department === userDeptId);
  }

  if (displayDocs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-xs text-gray-400">ยังไม่มีเอกสารในคลัง</td></tr>`;
    return;
  }

  tbody.innerHTML = displayDocs.map(doc => `
    <tr class="hover:bg-purple-50/40 transition-colors border-b border-gray-100">
      <td class="px-5 py-3.5">
        <span class="text-sm font-semibold text-gray-900">${escapeHtml(doc.title)}</span>
      </td>
      <td class="px-5 py-3.5 text-xs">
        <span class="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">${escapeHtml(doc.categoryName || doc.category)}</span>
      </td>
      <td class="px-5 py-3.5 text-xs text-gray-600">
        ${escapeHtml(doc.deptName || doc.department)}
      </td>
      <td class="px-5 py-3.5 text-xs text-gray-500 uppercase">
        ${escapeHtml(doc.fileType)} (${escapeHtml(doc.fileSize || '-')})
      </td>
      <td class="px-5 py-3.5 text-center">
        <div class="flex items-center justify-center gap-2">
          <button class="btn-edit-doc text-purple-700 hover:bg-purple-100 p-1.5 rounded" data-id="${escapeHtml(doc.id)}" title="แก้ไข">✏️</button>
          <button class="btn-delete-doc text-red-500 hover:bg-red-100 p-1.5 rounded" data-id="${escapeHtml(doc.id)}" title="ลบ">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.btn-edit-doc').forEach(btn => {
    btn.addEventListener('click', () => {
      const doc = documents.find(d => d.id === btn.dataset.id);
      if (doc) openDocModal(doc);
    });
  });

  tbody.querySelectorAll('.btn-delete-doc').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(btn.dataset.id, 'document'));
  });
}

function openDocModal(doc) {
  editingDocId = doc ? doc.id : null;
  document.getElementById('docModalTitle').textContent = doc ? '✏️ แก้ไขเอกสาร' : '➕ เพิ่มเอกสารใหม่';

  document.getElementById('docInputTitle').value = doc ? doc.title : '';

  const docInputDept = document.getElementById('docInputDept');
  if (currentPermission?.role === 'editor') {
    docInputDept.value = currentPermission.departmentId;
    docInputDept.disabled = true;
  } else {
    docInputDept.value = doc ? doc.department : (departments[0]?.id || 'gis');
    docInputDept.disabled = false;
  }

  document.getElementById('docInputCat').value = doc ? doc.category : 'manual';
  document.getElementById('docInputType').value = doc ? doc.fileType : 'pdf';
  document.getElementById('docInputSize').value = doc ? doc.fileSize : '2.5 MB';
  document.getElementById('docInputYear').value = doc ? (doc.year || '2569') : '2569';
  document.getElementById('docInputUrl').value = doc ? (doc.fileUrl || '#') : '#';

  const modal = document.getElementById('docModal');
  modal?.classList.remove('hidden');
  modal?.classList.add('flex');
}

function closeDocModal() {
  const modal = document.getElementById('docModal');
  modal?.classList.add('hidden');
  modal?.classList.remove('flex');
  editingDocId = null;
}

async function handleSaveDoc() {
  const title = document.getElementById('docInputTitle').value.trim();
  const department = document.getElementById('docInputDept').value;
  const category = document.getElementById('docInputCat').value;
  const fileType = document.getElementById('docInputType').value;
  const fileSize = document.getElementById('docInputSize').value.trim() || '1.0 MB';
  const year = document.getElementById('docInputYear').value.trim() || '2569';
  const fileUrl = document.getElementById('docInputUrl').value.trim() || '#';

  if (!title) {
    showToast('⚠️ กรุณากรอกชื่อเอกสาร', 'warning');
    return;
  }

  const catMap = { manual: 'คู่มือ', form: 'แบบฟอร์ม', report: 'รายงาน', order: 'ประกาศ/คำสั่ง' };
  const deptObj = departments.find(d => d.id === department);
  const saveBtn = document.getElementById('btnSaveDoc');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ กำลังบันทึก...';
  }

  try {
    if (editingDocId) {
      const updatedDoc = {
        id: editingDocId,
        title,
        department,
        deptName: deptObj?.shortName || deptObj?.name || department,
        category,
        categoryName: catMap[category] || category,
        fileType,
        fileSize,
        year,
        fileUrl
      };
      await saveDocumentToFirestore(updatedDoc);
      const idx = documents.findIndex(d => d.id === editingDocId);
      if (idx !== -1) documents[idx] = updatedDoc;
      showToast('✅ อัปเดตเอกสารลง Firestore สำเร็จ');
    } else {
      const newDoc = {
        id: `doc-${department}-${Date.now().toString(36)}`,
        title,
        department,
        deptName: deptObj?.shortName || deptObj?.name || department,
        category,
        categoryName: catMap[category] || category,
        fileType,
        fileSize,
        year,
        fileUrl,
        publishedAt: new Date().toISOString().split('T')[0],
        dateText: `${new Date().getDate()} พ.ย. ${year}`,
        downloads: 0
      };
      await saveDocumentToFirestore(newDoc);
      documents.unshift(newDoc);
      showToast('✅ เพิ่มเอกสารใหม่ลง Firestore สำเร็จ');
    }

    renderAdminDocsTable();
    closeDocModal();
  } catch (err) {
    console.error('Save Doc Error:', err);
    showToast(`❌ บันทึกไม่สำเร็จ: ${err.message}`, 'warning');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'บันทึกลง Firestore';
    }
  }
}

// ═════════════════════════════════════════════════════════════════════
//  DELETE CONFIRMATION & TOAST
// ═════════════════════════════════════════════════════════════

let deleteTargetId = null;
let deleteTargetType = 'article'; // 'article' | 'document'

function openDeleteModal(id, type = 'article') {
  deleteTargetId = id;
  deleteTargetType = type;

  const item = type === 'article'
    ? articles.find(a => a.id === id)
    : documents.find(d => d.id === id);

  document.getElementById('deleteMessage').textContent =
    `คุณต้องการลบ "${item?.title || ''}" ออกจาก Firestore หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`;

  const modal = document.getElementById('deleteModal');
  modal?.classList.remove('hidden');
  modal?.classList.add('flex');

  const confirmBtn = document.getElementById('btnDeleteConfirm');
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  newConfirmBtn.addEventListener('click', async () => {
    try {
      if (deleteTargetType === 'article') {
        await deleteArticleFromFirestore(deleteTargetId);
        articles = articles.filter(a => a.id !== deleteTargetId);
        renderArticleList();
        showToast('🗑️ ลบบทความจาก Firestore สำเร็จ');
      } else {
        await deleteDocumentFromFirestore(deleteTargetId);
        documents = documents.filter(d => d.id !== deleteTargetId);
        renderAdminDocsTable();
        showToast('🗑️ ลบเอกสารจาก Firestore สำเร็จ');
      }
    } catch (err) {
      console.error('Delete Error:', err);
      showToast(`❌ ลบไม่สำเร็จ: ${err.message}`, 'warning');
    }
    closeDeleteModal();
  });
}

function closeDeleteModal() {
  const modal = document.getElementById('deleteModal');
  modal?.classList.add('hidden');
  modal?.classList.remove('flex');
  deleteTargetId = null;
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMessage');

  msgEl.textContent = message;
  toast.className = toast.className
    .replace(/bg-\w+-600/g, '')
    .replace('translate-y-20 opacity-0', '');

  const bgColor = type === 'warning' ? 'bg-amber-600' : 'bg-green-600';
  toast.classList.add(bgColor, 'translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 2500);
}

// ─── Start Admin Lifecycle ──────────────────────────────────────────
initAuth();
