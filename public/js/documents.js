// =====================================================================
//  documents.js — ควบคุมระบบค้นหาและกรองคลังเอกสารเผยแพร่
// =====================================================================

import { fetchDocuments, fetchDepartments } from './firestore-service.js';
import { renderDocumentTableRow, renderDocumentCompact } from './renderer.js';

// ─── State ──────────────────────────────────────────────────────────
let allDocuments = [];
let allDepartments = [];
let filters = {
  search: '',
  department: 'all',
  year: 'all',
  category: 'all'
};

// ─── Init ───────────────────────────────────────────────────────────
async function init() {
  setupEventListeners();
  await loadData();
  populateDepartmentFilter();
  applyFilters();
}

async function loadData() {
  try {
    const [loadedDocs, loadedDepts] = await Promise.all([
      fetchDocuments(),
      fetchDepartments()
    ]);
    allDocuments = loadedDocs;
    allDepartments = loadedDepts;
  } catch (err) {
    console.error('Error loading documents from Firestore:', err);
  }
}

function populateDepartmentFilter() {
  const select = document.getElementById('docDeptFilter');
  allDepartments.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = `🏢 ${d.shortName || d.name}`;
    select.appendChild(opt);
  });
}

function setupEventListeners() {
  // Search input with debounce
  let searchTimer;
  document.getElementById('docSearchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      filters.search = e.target.value.trim().toLowerCase();
      applyFilters();
    }, 250);
  });

  // Department dropdown
  document.getElementById('docDeptFilter').addEventListener('change', (e) => {
    filters.department = e.target.value;
    applyFilters();
  });

  // Year dropdown
  document.getElementById('docYearFilter').addEventListener('change', (e) => {
    filters.year = e.target.value;
    applyFilters();
  });

  // Category Pills
  document.querySelectorAll('.doc-cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.doc-cat-pill').forEach(p => {
        p.classList.remove('active', 'bg-purple-700', 'text-white');
        p.classList.add('bg-gray-100', 'text-gray-700');
      });
      pill.classList.add('active', 'bg-purple-700', 'text-white');
      pill.classList.remove('bg-gray-100', 'text-gray-700');

      filters.category = pill.dataset.category;
      applyFilters();
    });
  });
}

function applyFilters() {
  let filtered = [...allDocuments];

  // 1. Department
  if (filters.department !== 'all') {
    filtered = filtered.filter(d => d.department === filters.department);
  }

  // 2. Year
  if (filters.year !== 'all') {
    filtered = filtered.filter(d => (d.year || '') === filters.year || (d.publishedAt || '').startsWith(filters.year));
  }

  // 3. Category
  if (filters.category !== 'all') {
    filtered = filtered.filter(d => d.category === filters.category);
  }

  // 4. Search text (matches title, department name, category name)
  if (filters.search) {
    const q = filters.search;
    filtered = filtered.filter(d =>
      (d.title || '').toLowerCase().includes(q) ||
      (d.deptName || '').toLowerCase().includes(q) ||
      (d.categoryName || '').toLowerCase().includes(q)
    );
  }

  renderResults(filtered);
}

function renderResults(filtered) {
  const desktopTableBody = document.getElementById('desktopDocsTableBody');
  const mobileCardsContainer = document.getElementById('mobileDocsCards');
  const emptyState = document.getElementById('docsEmptyState');
  const countEl = document.getElementById('docResultsCount');

  countEl.textContent = `พบ ${filtered.length} รายการ`;

  if (filtered.length === 0) {
    desktopTableBody.innerHTML = '';
    mobileCardsContainer.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  // Desktop Table
  desktopTableBody.innerHTML = filtered.map(doc => renderDocumentTableRow(doc)).join('');

  // Mobile Cards
  mobileCardsContainer.innerHTML = filtered.map(doc => `
    <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3">
      <div class="flex items-start gap-3">
        ${renderDocumentCompact(doc)}
      </div>
    </div>
  `).join('');
}

// ─── Go! ────────────────────────────────────────────────────────────
init();
