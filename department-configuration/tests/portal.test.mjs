// Run with `npm test` (Node >= 22.18 strips TypeScript types natively).
import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { DOC_CATEGORY_NAMES, categoryName, fileTypeFromUrl, formatDate, isAllowedFileType, sanitizeUrl, thaiYear } from "../lib/format.ts";
import { pageItems } from "../lib/pagination.ts";
import { ANNOUNCEMENTS, ARTICLES, DEPARTMENTS, DOCUMENTS, STAFF } from "../lib/mock-data.ts";

describe("sanitizeUrl", () => {
  test("blocks script pseudo-protocols and non-image data URLs", () => {
    for (const url of ["javascript:alert(1)", "JAVASCRIPT:alert(1)", "  javascript:alert(1)  ", 'vbscript:msgbox("x")', "data:text/html,<script>"]) {
      assert.equal(sanitizeUrl(url), "#", url);
    }
  });

  test("keeps safe URLs and maps empty values to #", () => {
    assert.equal(sanitizeUrl("https://example.com/file.pdf"), "https://example.com/file.pdf");
    assert.equal(sanitizeUrl("/downloads/guide.pdf"), "/downloads/guide.pdf");
    assert.equal(sanitizeUrl("#overview"), "#overview");
    assert.equal(sanitizeUrl("data:image/png;base64,AAA"), "data:image/png;base64,AAA");
    assert.equal(sanitizeUrl(""), "#");
    assert.equal(sanitizeUrl(null), "#");
  });
});

describe("format helpers", () => {
  test("formatDate renders Thai Buddhist-era dates and tolerates bad input", () => {
    assert.match(formatDate("2026-11-12T14:00:00+07:00"), /2569/);
    assert.equal(formatDate(""), "");
    assert.equal(formatDate("not-a-date"), "");
  });

  test("thaiYear and categoryName", () => {
    assert.equal(thaiYear(new Date("2026-01-01")), "2569");
    assert.equal(categoryName("process"), "Process การทำงาน");
    assert.equal(categoryName("unknown"), "unknown");
  });
});

describe("allowed file types (PDF, Excel, Word only)", () => {
  test("isAllowedFileType accepts only pdf, xlsx, docx", () => {
    for (const t of ["pdf", "xlsx", "docx", "PDF"]) assert.ok(isAllowedFileType(t), t);
    for (const t of ["doc", "xls", "pptx", "zip", "exe", "", undefined]) assert.ok(!isAllowedFileType(t), String(t));
  });

  test("fileTypeFromUrl reads the extension from the link path", () => {
    assert.equal(fileTypeFromUrl("https://example.com/files/guide.PDF"), "pdf");
    assert.equal(fileTypeFromUrl("https://example.com/report.xlsx?download=1#top"), "xlsx");
    assert.equal(fileTypeFromUrl("/docs/form.docx"), "docx");
    assert.equal(fileTypeFromUrl("https://example.com/old.doc"), "unsupported");
    assert.equal(fileTypeFromUrl("https://example.com/setup.exe"), "unsupported");
    assert.equal(fileTypeFromUrl("https://drive.google.com/file/d/abc123/view"), null);
    assert.equal(fileTypeFromUrl(""), null);
  });
});

describe("pageItems (compact pagination)", () => {
  test("shows every page when there are few", () => {
    assert.deepEqual(pageItems(1, 1), [1]);
    assert.deepEqual(pageItems(2, 4), [1, 2, 3, 4]);
  });

  test("collapses distant pages into gaps", () => {
    assert.deepEqual(pageItems(1, 20), [1, 2, "gap", 20]);
    assert.deepEqual(pageItems(10, 20), [1, "gap", 9, 10, 11, "gap", 20]);
    assert.deepEqual(pageItems(20, 20), [1, "gap", 19, 20]);
  });

  test("never hides a single page behind a gap", () => {
    assert.deepEqual(pageItems(4, 20), [1, 2, 3, 4, 5, "gap", 20]);
  });
});

describe("mock data integrity", () => {
  const deptIds = new Set(DEPARTMENTS.map((d) => d.id));
  const unique = (items) => new Set(items.map((i) => i.id)).size === items.length;

  test("ids are unique within each collection", () => {
    for (const [name, items] of Object.entries({ DEPARTMENTS, ARTICLES, DOCUMENTS, ANNOUNCEMENTS, STAFF })) {
      assert.ok(unique(items), `${name} has duplicate ids`);
    }
  });

  test("every record points at an existing department", () => {
    for (const item of [...ARTICLES, ...DOCUMENTS, ...ANNOUNCEMENTS, ...STAFF]) {
      assert.ok(deptIds.has(item.department), `${item.id} -> ${item.department}`);
    }
  });

  test("document categories and article blocks are well-formed", () => {
    for (const doc of DOCUMENTS) {
      assert.equal(doc.categoryName, DOC_CATEGORY_NAMES[doc.category], doc.id);
      assert.ok(isAllowedFileType(doc.fileType), `${doc.id}: ${doc.fileType}`);
    }
    const blockTypes = new Set(["paragraph", "callout", "image", "list"]);
    for (const article of ARTICLES) {
      assert.ok(article.blocks.length > 0, `${article.id} has no blocks`);
      for (const block of article.blocks) assert.ok(blockTypes.has(block.type), `${article.id}: ${block.type}`);
    }
  });

  test("department missions are numbered 1..n", () => {
    for (const dept of DEPARTMENTS) {
      (dept.missions ?? []).forEach((m, i) => assert.equal(m.step, i + 1, `${dept.id} mission ${i}`));
    }
  });
});
