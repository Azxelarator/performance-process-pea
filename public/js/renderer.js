// =====================================================================
//  renderer.js — แปลง JSON Blocks และ Data Components ให้กลายเป็น HTML
//  ใช้ Tailwind CSS classes ตรง (ไม่มี custom CSS ที่ต้อง build)
// =====================================================================

import { DEPARTMENTS, CATEGORIES } from './mock-data.js';

// ─── Helpers ─────────────────────────────────────────────────────────

export function getDepartmentName(id) {
  return DEPARTMENTS.find(d => d.id === id)?.name ?? id;
}

export function getDepartmentShortName(id) {
  return DEPARTMENTS.find(d => d.id === id)?.shortName ?? getDepartmentName(id);
}

export function getCategoryName(id) {
  return CATEGORIES.find(c => c.id === id)?.name ?? id;
}

export function getCategoryBadgeClass(category) {
  switch (category) {
    case 'process':
      return 'bg-purple-100 text-purple-800 border border-purple-200';
    case 'achievement':
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'notice':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'document':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
}

export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ─── File Type Badges ────────────────────────────────────────────────

export function renderFileBadge(fileType) {
  const type = (fileType || 'pdf').toLowerCase();
  if (type === 'pdf') {
    return `<span class="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-red-600 text-white font-bold text-xs tracking-wider shadow-sm flex-shrink-0">PDF</span>`;
  }
  if (type === 'docx' || type === 'doc') {
    return `<span class="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-blue-600 text-white font-bold text-xs tracking-wider shadow-sm flex-shrink-0">DOCX</span>`;
  }
  if (type === 'xlsx' || type === 'xls') {
    return `<span class="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-600 text-white font-bold text-xs tracking-wider shadow-sm flex-shrink-0">XLSX</span>`;
  }
  return `<span class="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-gray-600 text-white font-bold text-xs tracking-wider shadow-sm flex-shrink-0">${escapeHtml(type.toUpperCase())}</span>`;
}

// ─── Callout Icon Map ────────────────────────────────────────────────

const CALLOUT_STYLES = {
  info: {
    border: 'border-purple-400',
    bg: 'bg-purple-50',
    icon: `<svg class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`
  },
  warning: {
    border: 'border-amber-400',
    bg: 'bg-amber-50',
    icon: `<svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`
  },
  success: {
    border: 'border-green-400',
    bg: 'bg-green-50',
    icon: `<svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`
  }
};

// ─── Security & Sanitization Helpers ─────────────────────────────────

/**
 * Robust HTML escaping for both text and attributes.
 * Escapes &, <, >, ", and ' deterministically across both Node.js and browser.
 */
export function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitize URL to prevent javascript: and dangerous pseudo-protocol XSS.
 */
export function sanitizeUrl(url) {
  if (!url) return '#';
  const trimmed = String(url).trim();
  if (/^(javascript|vbscript|data:(?!image\/))/i.test(trimmed)) {
    return '#';
  }
  return trimmed;
}

// ─── Block Renderers ─────────────────────────────────────────────────

function renderParagraph(block) {
  const text = block && block.text !== undefined ? block.text : '';
  return `<p class="text-gray-700 leading-relaxed mb-4">${escapeHtml(text)}</p>`;
}

function renderCallout(block) {
  const icon = block && block.icon ? block.icon : 'info';
  const text = block && block.text !== undefined ? block.text : '';
  const style = CALLOUT_STYLES[icon] || CALLOUT_STYLES.info;
  return `
    <div class="border-l-4 ${style.border} ${style.bg} p-4 rounded-r-lg mb-4">
      <div class="flex gap-3">
        ${style.icon}
        <p class="text-gray-700 leading-relaxed">${escapeHtml(text)}</p>
      </div>
    </div>`;
}

function renderImage(block) {
  const url = block && block.url ? sanitizeUrl(block.url) : '';
  const caption = block && block.caption !== undefined ? block.caption : '';
  return `
    <figure class="mb-4">
      <img src="${escapeHtml(url)}" alt="${escapeHtml(caption)}"
           class="w-full rounded-lg shadow-md border border-gray-200"
           loading="lazy"
           onerror="this.onerror=null;this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22400%22 fill=%22%23f3e8ff%22><rect width=%22800%22 height=%22400%22/><text x=%22400%22 y=%22200%22 text-anchor=%22middle%22 fill=%22%237e22ce%22 font-size=%2220%22>ไม่สามารถโหลดรูปภาพได้</text></svg>';">
      <figcaption class="text-sm text-gray-500 mt-2 text-center italic">${escapeHtml(caption)}</figcaption>
    </figure>`;
}

function renderList(block) {
  const isOrdered = block && block.style === 'ordered';
  const tag = isOrdered ? 'ol' : 'ul';
  const listClass = isOrdered ? 'list-decimal' : 'list-disc';
  const rawItems = block && Array.isArray(block.items) ? block.items : [];
  const items = rawItems.map(item =>
    `<li class="text-gray-700 leading-relaxed">${escapeHtml(item)}</li>`
  ).join('\n      ');
  return `
    <${tag} class="${listClass} list-inside space-y-1 mb-4 pl-2">
      ${items}
    </${tag}>`;
}

// ─── Public Block Render API ─────────────────────────────────────────

const BLOCK_RENDERERS = {
  paragraph: renderParagraph,
  callout:   renderCallout,
  image:     renderImage,
  list:      renderList
};

/**
 * Render an array of content blocks to HTML string.
 */
export function renderBlocks(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return '<p class="text-gray-400 italic">ยังไม่มีเนื้อหา</p>';
  return blocks
    .filter(block => block && typeof block === 'object')
    .map(block => {
      const renderer = BLOCK_RENDERERS[block.type];
      return renderer ? renderer(block) : `<p class="text-red-400">[Unknown block type: ${escapeHtml(block.type)}]</p>`;
    })
    .join('\n');
}

/**
 * Render an article as a card (for listing / achievements grid).
 */
export function renderCard(article) {
  if (!article) return '';
  const deptName = getDepartmentShortName(article.department);
  const catName = getCategoryName(article.category);
  const badgeClass = getCategoryBadgeClass(article.category);
  const dateStr = formatDate(article.updatedAt);

  return `
    <article class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group flex flex-col justify-between"
             data-article-id="${escapeHtml(article.id)}">
      <div class="h-1 bg-gradient-to-r from-purple-800 to-amber-500"></div>
      <div class="p-5 flex-1 flex flex-col">
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
            🏢 ${escapeHtml(deptName)}
          </span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeClass}">
            ${article.category === 'process' ? '⚙️' : '🏆'} ${escapeHtml(catName)}
          </span>
        </div>
        <h3 class="text-base font-semibold text-gray-900 group-hover:text-purple-700 transition-colors mb-2 line-clamp-2">
          ${escapeHtml(article.title)}
        </h3>
        <p class="text-xs text-gray-400 mt-auto pt-2">
          📅 อัปเดตเมื่อ ${dateStr}
        </p>
      </div>
    </article>`;
}

/**
 * Render full article detail view inside modal or page.
 */
export function renderArticleDetail(article) {
  if (!article) return '<p class="text-gray-400">ไม่พบบทความ</p>';
  const deptName = getDepartmentName(article.department);
  const catName = getCategoryName(article.category);
  const badgeClass = getCategoryBadgeClass(article.category);
  const dateStr = formatDate(article.updatedAt);

  return `
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-2 mb-4 flex-wrap">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
          🏢 ${escapeHtml(deptName)}
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeClass}">
          ${article.category === 'process' ? '⚙️' : '🏆'} ${escapeHtml(catName)}
        </span>
      </div>
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        ${escapeHtml(article.title)}
      </h1>
      <p class="text-sm text-gray-500 mb-8 pb-4 border-b border-gray-200">
        📅 อัปเดตเมื่อ ${dateStr}
      </p>
      <div class="prose-content">
        ${renderBlocks(article.blocks)}
      </div>
    </div>`;
}

// ─── Template Component Renderers (แบบ A ม่วง-ทอง) ─────────────────────

/**
 * Render Announcement item for Home / Department page.
 */
export function renderAnnouncementItem(ann) {
  if (!ann) return '';
  const safeLink = sanitizeUrl(ann.link);
  return `
    <div class="flex items-start gap-4 p-3.5 rounded-xl hover:bg-purple-50/60 transition-colors border border-gray-100 group">
      <!-- Date Box -->
      <div class="w-14 h-14 bg-purple-50 border border-purple-200 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-center">
        <span class="text-lg font-bold text-purple-900 leading-none">${escapeHtml(ann.day)}</span>
        <span class="text-[11px] font-medium text-purple-600 mt-0.5">${escapeHtml(ann.month)}</span>
      </div>
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-purple-100 text-purple-800">
            ${escapeHtml(ann.deptName || 'ทั่วไป')}
          </span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            ${escapeHtml(ann.typeName || 'ประกาศ')}
          </span>
        </div>
        <a href="${escapeHtml(safeLink)}" class="text-sm font-semibold text-gray-900 group-hover:text-purple-700 line-clamp-2 transition-colors block">
          ${escapeHtml(ann.title)}
        </a>
      </div>
    </div>`;
}

/**
 * Render Document Item (Compact row with Download button) for Home / Department page.
 */
export function renderDocumentCompact(doc) {
  if (!doc) return '';
  const safeUrl = sanitizeUrl(doc.fileUrl);
  return `
    <div class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors gap-3">
      <div class="flex items-center gap-3 min-w-0">
        ${renderFileBadge(doc.fileType)}
        <div class="min-w-0">
          <h4 class="text-sm font-semibold text-gray-900 truncate" title="${escapeHtml(doc.title)}">
            ${escapeHtml(doc.title)}
          </h4>
          <p class="text-xs text-gray-400 mt-0.5">
            ${escapeHtml(doc.categoryName || 'เอกสาร')} • ${escapeHtml(doc.deptName || '')} • ${escapeHtml(doc.dateText || doc.publishedAt || '')}
          </p>
        </div>
      </div>
      <a href="${escapeHtml(safeUrl)}"
         download="${escapeHtml(doc.title)}"
         class="w-9 h-9 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-700 hover:text-white transition-colors flex items-center justify-center flex-shrink-0 shadow-sm"
         title="ดาวน์โหลด ${escapeHtml(doc.title)}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
      </a>
    </div>`;
}

/**
 * Render Document Table Row (for Documents Repository page on Desktop).
 */
export function renderDocumentTableRow(doc) {
  if (!doc) return '';
  const safeUrl = sanitizeUrl(doc.fileUrl);
  return `
    <tr class="hover:bg-purple-50/40 transition-colors border-b border-gray-100">
      <td class="px-5 py-3.5">
        <div class="flex items-center gap-3">
          ${renderFileBadge(doc.fileType)}
          <div>
            <span class="text-sm font-semibold text-gray-900 hover:text-purple-700 transition-colors">
              ${escapeHtml(doc.title)}
            </span>
            <span class="text-xs text-gray-400 block sm:hidden mt-0.5">${escapeHtml(doc.fileSize || '')}</span>
          </div>
        </div>
      </td>
      <td class="px-5 py-3.5 whitespace-nowrap text-xs">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-200">
          ${escapeHtml(doc.categoryName || 'เอกสาร')}
        </span>
      </td>
      <td class="px-5 py-3.5 whitespace-nowrap text-sm text-gray-600">
        ${escapeHtml(doc.deptName || doc.department)}
      </td>
      <td class="px-5 py-3.5 whitespace-nowrap text-xs text-gray-500">
        ${escapeHtml(doc.dateText || doc.publishedAt)}
      </td>
      <td class="px-5 py-3.5 whitespace-nowrap text-center">
        <a href="${escapeHtml(safeUrl)}"
           download="${escapeHtml(doc.title)}"
           class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-700 hover:text-white transition-all text-xs font-medium shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          ดาวน์โหลด
        </a>
      </td>
    </tr>`;
}

/**
 * Render Mission Card for Department page (Step 1-6).
 */
export function renderMissionCard(mission) {
  if (!mission) return '';
  return `
    <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5">
      <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-sm flex-shrink-0">
        ${escapeHtml(mission.step)}
      </div>
      <div>
        <h4 class="text-sm font-bold text-gray-900 mb-1">${escapeHtml(mission.title)}</h4>
        <p class="text-xs text-gray-500 leading-relaxed">${escapeHtml(mission.description)}</p>
      </div>
    </div>`;
}

/**
 * Render Personnel Card for Department page.
 */
export function renderPersonnelCard(person) {
  return `
    <div class="bg-white rounded-xl p-4 border border-gray-200 text-center shadow-sm hover:shadow transition-shadow flex flex-col items-center">
      <div class="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold mb-3 shadow-inner">
        👤
      </div>
      <h4 class="text-sm font-bold text-gray-900 mb-0.5">${escapeHtml(person.name)}</h4>
      <p class="text-xs text-purple-700 font-medium mb-1">${escapeHtml(person.position)}</p>
      <p class="text-[11px] text-gray-400">${escapeHtml(person.role || '')}</p>
    </div>`;
}
