// =====================================================================
//  department.js — ควบคุมการแสดงผลหน้ารายละเอียดแผนก
//  รองรับ URL Query String: department.html?dept=gis
// =====================================================================

import {
  fetchDepartments,
  fetchArticles,
  fetchAnnouncements,
  fetchDocuments
} from './firestore-service.js';
import {
  renderCard,
  renderArticleDetail,
  renderAnnouncementItem,
  renderDocumentCompact,
  renderMissionCard,
  renderPersonnelCard,
  escapeHtml
} from './renderer.js';

// ─── State ──────────────────────────────────────────────────────────
let currentDeptId = 'gis';
let currentDept = null;
let allDepartments = [];
let allArticles = [];
let allAnnouncements = [];
let allDocuments = [];

// ─── Init ───────────────────────────────────────────────────────────
async function init() {
  setupModalEvents();
  await loadData();
  resolveDepartmentFromUrl();
  setupDepartmentSwitcher();
  renderDepartmentView();
}

async function loadData() {
  try {
    const [loadedDepts, loadedArticles, loadedAnn, loadedDocs] = await Promise.all([
      fetchDepartments(),
      fetchArticles(),
      fetchAnnouncements(),
      fetchDocuments()
    ]);
    allDepartments = loadedDepts;
    allArticles = loadedArticles;
    allAnnouncements = loadedAnn;
    allDocuments = loadedDocs;
  } catch (err) {
    console.error('Error loading department data from Firestore:', err);
  }
}

function resolveDepartmentFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const deptParam = urlParams.get('dept');
  if (deptParam && allDepartments.some(d => d.id === deptParam)) {
    currentDeptId = deptParam;
  } else {
    currentDeptId = 'gis'; // Default to GIS as in template
  }
  currentDept = allDepartments.find(d => d.id === currentDeptId);
}

// ─── Department Switcher in Navbar ──────────────────────────────────
function setupDepartmentSwitcher() {
  const select = document.getElementById('headerDeptSwitcher');
  select.innerHTML = allDepartments.map(d => `
    <option value="${escapeHtml(d.id)}" ${d.id === currentDeptId ? 'selected' : ''}>
      🏢 ${escapeHtml(d.shortName || d.name)}
    </option>
  `).join('');

  select.addEventListener('change', (e) => {
    window.location.href = `department.html?dept=${encodeURIComponent(e.target.value)}`;
  });
}

// ─── Render Entire Department Page ──────────────────────────────────
function renderDepartmentView() {
  if (!currentDept) return;

  // 1. Breadcrumb & Titles
  document.title = `${currentDept.name} — พอร์ทัลองค์กร`;
  document.getElementById('breadcrumbDeptName').textContent = currentDept.name;
  document.getElementById('deptTitle').textContent = currentDept.name;
  document.getElementById('deptTitleEn').textContent = currentDept.nameEn || '';
  document.getElementById('deptHeroDesc').textContent = currentDept.heroDescription || currentDept.overviewText || '';
  document.getElementById('deptBadgeCode').textContent = `PEA - ${(currentDept.shortName || currentDept.id).toUpperCase()}`;

  // 2. Overview & Stats
  document.getElementById('overviewHeading').textContent = currentDept.overviewTitle || `${currentDept.shortName || currentDept.name} คืออะไร`;
  document.getElementById('overviewParagraph').textContent = currentDept.overviewText || '';

  const statsContainer = document.getElementById('statsContainer');
  if (currentDept.stats && currentDept.stats.length > 0) {
    statsContainer.innerHTML = currentDept.stats.map(st => `
      <div class="bg-purple-50/80 rounded-xl p-3 sm:p-4 text-center border border-purple-200/70 shadow-sm">
        <div class="text-xl sm:text-2xl font-bold text-purple-900">${escapeHtml(st.value)}</div>
        <div class="text-xs font-semibold text-purple-700 mt-0.5">${escapeHtml(st.label)}</div>
        <div class="text-[10px] text-gray-500">${escapeHtml(st.unit || '')}</div>
      </div>
    `).join('');
  } else {
    statsContainer.innerHTML = `
      <div class="col-span-3 bg-purple-50 rounded-xl p-4 text-center text-xs text-purple-700">
        ข้อมูลสถิติของแผนก
      </div>`;
  }

  // 3. Missions (6 cards)
  const missionsContainer = document.getElementById('missionsGrid');
  if (currentDept.missions && currentDept.missions.length > 0) {
    missionsContainer.innerHTML = currentDept.missions.map(m => renderMissionCard(m)).join('');
  } else {
    missionsContainer.innerHTML = '<p class="text-gray-400 text-sm italic col-span-3">ยังไม่มีข้อมูลภารกิจ</p>';
  }

  // 4. Department Articles (Block-based achievements & processes)
  const deptArticles = allArticles.filter(a => a.department === currentDeptId);
  const articlesGrid = document.getElementById('deptArticlesGrid');

  if (deptArticles.length === 0) {
    articlesGrid.innerHTML = `
      <div class="col-span-3 text-center py-10 bg-white rounded-2xl border border-gray-200">
        <p class="text-3xl mb-2">📝</p>
        <p class="text-gray-500 text-sm">ยังไม่มีผลงานหรือ Process ที่บันทึกไว้ในแผนกนี้</p>
        <a href="admin.html" class="inline-block mt-3 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-medium">
          + เพิ่มผลงานในหน้าจัดการหลังบ้าน
        </a>
      </div>`;
  } else {
    articlesGrid.innerHTML = deptArticles.map(a => renderCard(a)).join('');

    // Attach click listeners to cards to open modal
    articlesGrid.querySelectorAll('[data-article-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.articleId;
        const article = deptArticles.find(a => a.id === id);
        if (article) openArticleModal(article);
      });
    });
  }

  // 5. Announcements of this department
  const deptAnn = allAnnouncements.filter(a => a.department === currentDeptId);
  const annContainer = document.getElementById('deptAnnouncementsList');
  if (deptAnn.length > 0) {
    annContainer.innerHTML = deptAnn.map(a => renderAnnouncementItem(a)).join('');
  } else {
    annContainer.innerHTML = '<p class="text-gray-400 text-xs italic py-4 text-center">ไม่มีประกาศของแผนกในขณะนี้</p>';
  }

  // 6. Documents of this department
  const deptDocs = allDocuments.filter(d => d.department === currentDeptId);
  const docsContainer = document.getElementById('deptDocumentsList');
  if (deptDocs.length > 0) {
    docsContainer.innerHTML = deptDocs.map(d => renderDocumentCompact(d)).join('');
  } else {
    docsContainer.innerHTML = '<p class="text-gray-400 text-xs italic py-4 text-center">ไม่มีเอกสารเผยแพร่ของแผนกในขณะนี้</p>';
  }

  // 7. Personnel
  const personnelContainer = document.getElementById('personnelGrid');
  if (currentDept.personnel && currentDept.personnel.length > 0) {
    personnelContainer.innerHTML = currentDept.personnel.map(p => renderPersonnelCard(p)).join('');
  } else {
    personnelContainer.innerHTML = '<p class="text-gray-400 text-xs italic col-span-4 text-center py-4">ไม่มีข้อมูลบุคลากร</p>';
  }

  // 8. Contact Card
  const contactCard = document.getElementById('contactCard');
  const c = currentDept.contact || {};
  contactCard.innerHTML = `
    <div>
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">📞</span>
        <h3 class="text-base font-bold text-amber-300">ติดต่อ ${escapeHtml(currentDept.shortName || currentDept.name)}</h3>
      </div>
      <div class="space-y-2.5 text-xs text-purple-100">
        <p class="flex items-start gap-2">
          <span class="text-amber-400">📍</span>
          <span>${escapeHtml(c.location || 'สำนักงานใหญ่ PEA')}</span>
        </p>
        <p class="flex items-start gap-2">
          <span class="text-amber-400">☎️</span>
          <span>${escapeHtml(c.phone || '02-xxx-xxxx')}</span>
        </p>
        <p class="flex items-start gap-2">
          <span class="text-amber-400">✉️</span>
          <span>${escapeHtml(c.email || 'contact@pea.co.th')}</span>
        </p>
        <p class="flex items-start gap-2">
          <span class="text-amber-400">🕒</span>
          <span>${escapeHtml(c.hours || 'จันทร์ - ศุกร์ (08:30 - 16:30 น.)')}</span>
        </p>
      </div>
    </div>
    <div class="mt-4 pt-3 border-t border-purple-800/80">
      <a href="mailto:${escapeHtml(c.email || '')}" class="inline-flex items-center justify-center w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 text-xs font-bold transition-colors shadow">
        ส่งข้อความถึงแผนก
      </a>
    </div>`;
}

// ─── Modal Events ───────────────────────────────────────────────────
function setupModalEvents() {
  const modal = document.getElementById('articleModal');
  const closeBtn = document.getElementById('closeModal');

  closeBtn?.addEventListener('click', closeArticleModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeArticleModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeArticleModal();
  });
}

function openArticleModal(article) {
  const modal = document.getElementById('articleModal');
  const body = document.getElementById('modalBody');
  body.innerHTML = renderArticleDetail(article);
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
  const modal = document.getElementById('articleModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

// ─── Go! ────────────────────────────────────────────────────────────
init();
