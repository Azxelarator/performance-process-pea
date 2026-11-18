import type { ArticleCategoryId, DocCategoryId, FileType } from './types';

export const ARTICLE_CATEGORY_NAMES: Record<ArticleCategoryId, string> = {
  process: 'Process การทำงาน',
  achievement: 'ผลงานของแผนก',
  notice: 'ข่าวและประกาศ',
  document: 'เอกสารเผยแพร่',
};

export const DOC_CATEGORY_NAMES: Record<DocCategoryId, string> = {
  manual: 'คู่มือ',
  form: 'แบบฟอร์ม',
  report: 'รายงาน',
  order: 'ประกาศ/คำสั่ง',
};

/** The only document formats the portal accepts. */
export const FILE_TYPES: FileType[] = ['pdf', 'xlsx', 'docx'];

export const FILE_TYPE_LABELS: Record<FileType, string> = {
  pdf: 'PDF',
  xlsx: 'Excel (.xlsx)',
  docx: 'Word (.docx)',
};

export const ALLOWED_FILES_TEXT = 'รองรับเฉพาะไฟล์ PDF, Excel (.xlsx) และ Word (.docx)';

export function isAllowedFileType(value: unknown): value is FileType {
  return typeof value === 'string' && (FILE_TYPES as string[]).includes(value.toLowerCase());
}

/**
 * Reads the extension from a link's path.
 * Returns the file type, `'unsupported'` for any other extension, or `null` when the
 * link has no extension (e.g. a Google Drive or SharePoint share link).
 */
export function fileTypeFromUrl(url: string): FileType | 'unsupported' | null {
  let path = url.trim();
  try {
    path = new URL(path, 'https://local.invalid').pathname;
  } catch {
    // keep the raw string
  }
  const ext = path.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1];
  if (!ext) return null;
  return isAllowedFileType(ext) ? ext : 'unsupported';
}

const CATEGORY_BADGE: Record<ArticleCategoryId, string> = {
  process: 'bg-tint text-brand-ink border-line',
  achievement: 'bg-amber-100 text-amber-800 border-amber-200',
  notice: 'bg-blue-100 text-blue-800 border-blue-200',
  document: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export function categoryBadgeClass(category: string): string {
  return CATEGORY_BADGE[category as ArticleCategoryId] ?? 'bg-gray-100 text-gray-800 border-gray-200';
}

export function categoryName(category: string): string {
  return ARTICLE_CATEGORY_NAMES[category as ArticleCategoryId] ?? category;
}

const thaiLongDate = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
const thaiShortDate = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

/** "12 พฤศจิกายน 2569" */
export function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : thaiLongDate.format(date);
}

/** "12 พ.ย. 2569" */
export function formatShortDate(date: Date): string {
  return thaiShortDate.format(date);
}

/** Buddhist-era year, e.g. "2569". */
export function thaiYear(date: Date): string {
  return String(date.getFullYear() + 543);
}

const THAI_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

/** Parses announcement dates such as day "10", month "พ.ย.", year "69" or "2569". */
export function parseThaiDate(day: string, month: string, year: string): Date | null {
  const m = THAI_MONTHS.indexOf(month.trim());
  const d = Number(day);
  let y = Number(year);
  if (m < 0 || !d || !y) return null;
  if (y < 100) y += 2500;
  return new Date(y - 543, m, d);
}

/** Blocks javascript:, vbscript: and non-image data: URLs. */
export function sanitizeUrl(url: unknown): string {
  if (!url) return '#';
  const trimmed = String(url).trim();
  return /^(javascript|vbscript|data:(?!image\/))/i.test(trimmed) ? '#' : trimmed;
}
