// =====================================================================
//  portal.test.js — Automated Unit Tests for Portal System
//  Uses Node.js standard modules: node:test and node:assert/strict
// =====================================================================

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  escapeHtml,
  sanitizeUrl,
  renderBlocks,
  renderCard,
  renderArticleDetail,
  renderFileBadge,
  renderDocumentCompact,
  renderDocumentTableRow,
  renderMissionCard,
  renderPersonnelCard,
  formatDate,
  getDepartmentName,
  getCategoryName,
  getCategoryBadgeClass
} from '../public/js/renderer.js';

import {
  DEPARTMENTS,
  CATEGORIES,
  MOCK_ARTICLES,
  DOCUMENTS,
  ANNOUNCEMENTS
} from '../public/js/mock-data.js';

// ─── 1. XSS Prevention & Sanitization Tests ─────────────────────────
describe('Security: XSS Prevention & Sanitization', () => {

  test('escapeHtml: escapes all 5 dangerous characters (<, >, &, ", \')', () => {
    const raw = `<script>alert("XSS & 'pwned'")</script>`;
    const escaped = escapeHtml(raw);
    assert.ok(!escaped.includes('<script>'), 'Must not contain raw <script>');
    assert.ok(!escaped.includes('</script>'), 'Must not contain raw </script>');
    assert.ok(escaped.includes('&lt;script&gt;'));
    assert.ok(escaped.includes('&quot;XSS &amp; &#39;pwned&#39;&quot;'));
  });

  test('escapeHtml: handles attribute breakout attempts', () => {
    const maliciousInput = `" onfocus="alert('xss')" data-x="`;
    const escaped = escapeHtml(maliciousInput);
    assert.ok(!escaped.includes('"'), 'Must not contain raw double quotes');
    assert.ok(escaped.includes('&quot;'));
  });

  test('escapeHtml: handles edge cases (null, undefined, 0, numbers, empty string)', () => {
    assert.equal(escapeHtml(null), '');
    assert.equal(escapeHtml(undefined), '');
    assert.equal(escapeHtml(''), '');
    assert.equal(escapeHtml(0), '0');
    assert.equal(escapeHtml(12345), '12345');
    assert.equal(escapeHtml(false), 'false');
  });

  test('sanitizeUrl: blocks javascript: and vbscript: pseudo-protocols', () => {
    assert.equal(sanitizeUrl('javascript:alert(1)'), '#');
    assert.equal(sanitizeUrl('JAVASCRIPT:alert(1)'), '#');
    assert.equal(sanitizeUrl('   javascript:alert(1)   '), '#');
    assert.equal(sanitizeUrl('vbscript:msgbox("xss")'), '#');
    assert.equal(sanitizeUrl('data:text/html,<script>alert(1)</script>'), '#');
  });

  test('sanitizeUrl: allows safe HTTP, HTTPS, relative paths and hash', () => {
    assert.equal(sanitizeUrl('https://example.com/file.pdf'), 'https://example.com/file.pdf');
    assert.equal(sanitizeUrl('http://localhost:3001/doc.docx'), 'http://localhost:3001/doc.docx');
    assert.equal(sanitizeUrl('/downloads/guide.pdf'), '/downloads/guide.pdf');
    assert.equal(sanitizeUrl('#overviewSection'), '#overviewSection');
    assert.equal(sanitizeUrl(''), '#');
    assert.equal(sanitizeUrl(null), '#');
  });

});

// ─── 2. Block-based Content Rendering Tests ─────────────────────────
describe('Block Engine: renderBlocks()', () => {

  test('renders paragraph block with escaping', () => {
    const blocks = [{ type: 'paragraph', text: 'ยินดีต้อนรับสู่ระบบ <b>PEA</b>' }];
    const html = renderBlocks(blocks);
    assert.ok(html.includes('<p class="text-gray-700 leading-relaxed mb-4">'));
    assert.ok(html.includes('ยินดีต้อนรับสู่ระบบ &lt;b&gt;PEA&lt;/b&gt;'));
    assert.ok(!html.includes('<b>PEA</b>'));
  });

  test('renders callout blocks with correct styles (info, warning, success)', () => {
    const blocks = [
      { type: 'callout', icon: 'info', text: 'ข้อความข้อมูล' },
      { type: 'callout', icon: 'warning', text: 'ข้อความเตือน' },
      { type: 'callout', icon: 'success', text: 'ข้อความสำเร็จ' }
    ];
    const html = renderBlocks(blocks);
    assert.ok(html.includes('border-purple-400 bg-purple-50'));
    assert.ok(html.includes('border-amber-400 bg-amber-50'));
    assert.ok(html.includes('border-green-400 bg-green-50'));
    assert.ok(html.includes('ข้อความข้อมูล'));
    assert.ok(html.includes('ข้อความเตือน'));
    assert.ok(html.includes('ข้อความสำเร็จ'));
  });

  test('renders image block with sanitized url and escaped caption', () => {
    const blocks = [
      {
        type: 'image',
        url: 'https://example.com/photo.jpg',
        caption: 'ภาพผังแปลง <script>alert(1)</script>'
      }
    ];
    const html = renderBlocks(blocks);
    assert.ok(html.includes('src="https://example.com/photo.jpg"'));
    assert.ok(html.includes('alt="ภาพผังแปลง &lt;script&gt;alert(1)&lt;/script&gt;"'));
    assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
    assert.ok(!html.includes('<script>'));
  });

  test('renders list blocks (ordered and unordered)', () => {
    const unordered = [
      { type: 'list', style: 'unordered', items: ['ข้อ ก', 'ข้อ ข'] }
    ];
    const ordered = [
      { type: 'list', style: 'ordered', items: ['ขั้นตอนที่ 1', 'ขั้นตอนที่ 2'] }
    ];

    const unHtml = renderBlocks(unordered);
    assert.ok(unHtml.includes('<ul class="list-disc'));
    assert.ok(unHtml.includes('<li>ข้อ ก</li>') || unHtml.includes('ข้อ ก'));

    const ordHtml = renderBlocks(ordered);
    assert.ok(ordHtml.includes('<ol class="list-decimal'));
    assert.ok(ordHtml.includes('ขั้นตอนที่ 1'));
  });

  test('handles edge cases: empty blocks, null, undefined, unknown type', () => {
    assert.equal(renderBlocks([]), '<p class="text-gray-400 italic">ยังไม่มีเนื้อหา</p>');
    assert.equal(renderBlocks(null), '<p class="text-gray-400 italic">ยังไม่มีเนื้อหา</p>');
    assert.equal(renderBlocks(undefined), '<p class="text-gray-400 italic">ยังไม่มีเนื้อหา</p>');

    const unknown = [{ type: 'unknown_type', data: 123 }];
    const html = renderBlocks(unknown);
    assert.ok(html.includes('[Unknown block type: unknown_type]'));
  });

});

// ─── 3. UI Component Renderers Tests ────────────────────────────────
describe('UI Components: Cards, Badges and Tables', () => {

  test('renderCard: renders card correctly with escaped content', () => {
    const article = {
      id: 'test-001',
      department: 'gis',
      category: 'achievement',
      title: 'ผลงานทดสอบ & แผนที่ <tag>',
      updatedAt: '2026-11-10T09:00:00Z',
      blocks: []
    };
    const html = renderCard(article);
    assert.ok(html.includes('data-article-id="test-001"'));
    assert.ok(html.includes('ผลงานทดสอบ &amp; แผนที่ &lt;tag&gt;'));
    assert.ok(html.includes('แผนก GIS'));
    assert.ok(!html.includes('<tag>'));
  });

  test('renderFileBadge: produces proper colors for file extensions', () => {
    assert.ok(renderFileBadge('pdf').includes('bg-red-600'));
    assert.ok(renderFileBadge('PDF').includes('bg-red-600'));
    assert.ok(renderFileBadge('docx').includes('bg-blue-600'));
    assert.ok(renderFileBadge('xlsx').includes('bg-emerald-600'));
    assert.ok(renderFileBadge('zip').includes('bg-gray-600'));
  });

  test('renderDocumentCompact: renders download button and safe link', () => {
    const doc = {
      id: 'doc-1',
      title: 'คู่มือใช้งาน GIS',
      categoryName: 'คู่มือ',
      deptName: 'แผนก GIS',
      dateText: '10 พ.ย. 2569',
      fileType: 'pdf',
      fileUrl: 'https://example.com/guide.pdf'
    };
    const html = renderDocumentCompact(doc);
    assert.ok(html.includes('คู่มือใช้งาน GIS'));
    assert.ok(html.includes('href="https://example.com/guide.pdf"'));
    assert.ok(html.includes('download="คู่มือใช้งาน GIS"'));
  });

  test('renderDocumentTableRow: renders desktop table row with proper tags', () => {
    const doc = {
      id: 'doc-table-1',
      title: 'รายงานการเงิน',
      categoryName: 'รายงาน',
      deptName: 'ฝ่ายการเงิน',
      dateText: '15 ต.ค. 2569',
      fileType: 'xlsx',
      fileSize: '3.1 MB',
      fileUrl: '/docs/fin.xlsx'
    };
    const html = renderDocumentTableRow(doc);
    assert.ok(html.includes('<tr'));
    assert.ok(html.includes('รายงานการเงิน'));
    assert.ok(html.includes('ฝ่ายการเงิน'));
    assert.ok(html.includes('3.1 MB'));
  });

  test('renderMissionCard: escapes mission title and description', () => {
    const mission = {
      step: 1,
      title: 'ภารกิจ "สำคัญ" & เร่งด่วน',
      description: 'คำอธิบาย <script>alert(1)</script>'
    };
    const html = renderMissionCard(mission);
    assert.ok(html.includes('ภารกิจ &quot;สำคัญ&quot; &amp; เร่งด่วน'));
    assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
    assert.ok(!html.includes('<script>'));
  });

  test('renderPersonnelCard: renders team member information safely', () => {
    const person = {
      name: 'นายทดสอบ ปลอดภัย',
      position: 'วิศวกรระบบ',
      role: 'ผู้ดูแลฐานข้อมูล'
    };
    const html = renderPersonnelCard(person);
    assert.ok(html.includes('นายทดสอบ ปลอดภัย'));
    assert.ok(html.includes('วิศวกรระบบ'));
    assert.ok(html.includes('ผู้ดูแลฐานข้อมูล'));
  });

});

// ─── 4. Data Filter Logic Tests ─────────────────────────────────────
describe('Data Filtering Logic', () => {

  test('filter documents by department', () => {
    const gisDocs = DOCUMENTS.filter(d => d.department === 'gis');
    assert.ok(gisDocs.length > 0);
    assert.ok(gisDocs.every(d => d.department === 'gis'));
  });

  test('filter documents by category (manual, form, report, order)', () => {
    const forms = DOCUMENTS.filter(d => d.category === 'form');
    assert.ok(forms.length > 0);
    assert.ok(forms.every(d => d.category === 'form'));
  });

  test('filter documents by year', () => {
    const year2569 = DOCUMENTS.filter(d => d.year === '2569');
    assert.ok(year2569.length > 0);
    assert.ok(year2569.every(d => d.year === '2569'));
  });

  test('search documents by keyword in title', () => {
    const query = 'แผนที่';
    const matches = DOCUMENTS.filter(d =>
      d.title.toLowerCase().includes(query.toLowerCase())
    );
    assert.ok(matches.length >= 2, 'Should find multiple documents related to "แผนที่"');
  });

  test('filter articles by department and category', () => {
    const gisAchievements = MOCK_ARTICLES.filter(
      a => a.department === 'gis' && a.category === 'achievement'
    );
    assert.ok(gisAchievements.length >= 2);
    assert.ok(gisAchievements.every(a => a.department === 'gis' && a.category === 'achievement'));
  });

});

// ─── 5. Schema Validation & Integrity Tests ─────────────────────────
describe('Schema Integrity: Mock Data & Field Matching', () => {

  test('DEPARTMENTS: every department has required metadata', () => {
    assert.ok(DEPARTMENTS.length >= 6);
    DEPARTMENTS.forEach(dept => {
      assert.ok(typeof dept.id === 'string' && dept.id.length > 0, 'Dept must have id');
      assert.ok(typeof dept.name === 'string' && dept.name.length > 0, 'Dept must have name');
      assert.ok(Array.isArray(dept.stats), `${dept.id} must have stats array`);
      assert.ok(Array.isArray(dept.missions), `${dept.id} must have missions array`);
      assert.ok(typeof dept.contact === 'object' && dept.contact !== null, `${dept.id} must have contact object`);
    });
  });

  test('MOCK_ARTICLES: every article has valid department reference and blocks array', () => {
    const validDeptIds = new Set(DEPARTMENTS.map(d => d.id));
    assert.ok(MOCK_ARTICLES.length > 0);

    MOCK_ARTICLES.forEach(art => {
      assert.ok(typeof art.id === 'string' && art.id.length > 0);
      assert.ok(validDeptIds.has(art.department), `Article ${art.id} references invalid department: ${art.department}`);
      assert.ok(typeof art.title === 'string' && art.title.length > 0);
      assert.ok(typeof art.updatedAt === 'string');
      assert.ok(Array.isArray(art.blocks), `Article ${art.id} must have blocks array`);
      assert.ok(art.blocks.length > 0, `Article ${art.id} should have at least 1 block`);
    });
  });

  test('DOCUMENTS: every document has valid department reference', () => {
    const validDeptIds = new Set(DEPARTMENTS.map(d => d.id));
    assert.ok(DOCUMENTS.length > 0);

    DOCUMENTS.forEach(doc => {
      assert.ok(typeof doc.id === 'string' && doc.id.length > 0);
      assert.ok(typeof doc.title === 'string' && doc.title.length > 0);
      assert.ok(validDeptIds.has(doc.department), `Document ${doc.id} references invalid department: ${doc.department}`);
      assert.ok(['pdf', 'docx', 'xlsx'].includes(doc.fileType.toLowerCase()), `Invalid fileType: ${doc.fileType}`);
      assert.ok(typeof doc.fileUrl === 'string');
    });
  });

  test('ANNOUNCEMENTS: every announcement has valid structure and department reference', () => {
    const validDeptIds = new Set(DEPARTMENTS.map(d => d.id));
    assert.ok(ANNOUNCEMENTS.length > 0);

    ANNOUNCEMENTS.forEach(ann => {
      assert.ok(typeof ann.id === 'string');
      assert.ok(typeof ann.day === 'string');
      assert.ok(typeof ann.month === 'string');
      assert.ok(typeof ann.title === 'string');
      assert.ok(validDeptIds.has(ann.department), `Announcement ${ann.id} references invalid department: ${ann.department}`);
    });
  });

});
