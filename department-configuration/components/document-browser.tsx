"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { DOC_CATEGORY_NAMES } from "@/lib/format";
import { pageItems } from "@/lib/pagination";
import type { DocCategoryId, DocumentItem } from "@/lib/types";
import { DocumentRow, DownloadButton, FileBadge, fileInfo } from "./document-item";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "./icons";

type Option = { id: string; label: string };

const PAGE_SIZE = 10;

const CATEGORY_FILTERS: { id: "all" | DocCategoryId; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  ...(Object.entries(DOC_CATEGORY_NAMES) as [DocCategoryId, string][]).map(([id, label]) => ({ id, label })),
];

const fieldLabel = "text-sm font-semibold";
const selectClass = "h-11 border border-field rounded-lg px-2.5 text-[15px] bg-white";

export function DocumentBrowser({ documents, departments }: { documents: DocumentItem[]; departments: Option[] }) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [year, setYear] = useState("all");
  const [category, setCategory] = useState<"all" | DocCategoryId>("all");
  const [page, setPage] = useState(1);
  const query = useDeferredValue(search.trim().toLowerCase());

  const years = useMemo(() => [...new Set(documents.map((d) => d.year).filter(Boolean))].sort().reverse(), [documents]);

  const filtered = documents.filter(
    (d) =>
      (department === "all" || d.department === department) &&
      (year === "all" || d.year === year) &&
      (category === "all" || d.category === category) &&
      (!query || [d.title, d.deptName, d.categoryName].some((v) => v?.toLowerCase().includes(query))),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // Any filter change goes back to page 1.
  const filter = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  return (
    <>
      <section className="max-w-300 w-full mx-auto px-4 sm:px-6 py-4">
        <div className="bg-white border border-line rounded-xl p-5 flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            <label className="flex-[3_1_300px] min-w-0 flex flex-col gap-1">
              <span className={fieldLabel}>ค้นหาชื่อเอกสาร</span>
              <span className="flex items-center gap-2 h-11 px-3 rounded-lg border border-field focus-within:border-brand focus-within:ring-2 focus-within:ring-brand">
                <SearchIcon className="w-[18px] h-[18px] text-muted shrink-0" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => filter(setSearch)(e.target.value)}
                  placeholder="พิมพ์คำค้น เช่น คู่มือ, แบบฟอร์ม"
                  className="flex-1 min-w-0 bg-transparent outline-none text-[15px]"
                />
              </span>
            </label>
            <label className="flex-[1_1_180px] min-w-0 flex flex-col gap-1">
              <span className={fieldLabel}>แผนก</span>
              <select value={department} onChange={(e) => filter(setDepartment)(e.target.value)} className={selectClass}>
                <option value="all">ทุกแผนก</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </label>
            <label className="flex-[1_1_140px] min-w-0 flex flex-col gap-1">
              <span className={fieldLabel}>ปี พ.ศ.</span>
              <select value={year} onChange={(e) => filter(setYear)(e.target.value)} className={selectClass}>
                <option value="all">ทั้งหมด</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="หมวดหมู่">
            <span className={`${fieldLabel} mr-1`}>หมวดหมู่</span>
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => filter(setCategory)(c.id)}
                className={`min-h-10 px-4 rounded-full border text-[15px] ${
                  category === c.id ? "bg-brand border-brand text-white font-semibold" : "bg-white border-field text-ink-2 hover:border-brand"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-2 pb-14">
        <p className="text-sm text-muted mb-2" role="status">พบ {filtered.length} รายการ</p>

        {filtered.length === 0 ? (
          <div className="bg-white border border-line rounded-xl p-8 text-center text-muted">
            ไม่พบเอกสารที่ตรงกับเงื่อนไข ลองเปลี่ยนคำค้นหรือหมวดหมู่
          </div>
        ) : (
          <>
            <div key={`${department}-${year}-${category}-${current}`} className="hidden md:block bg-white border border-line rounded-xl overflow-x-auto animate-fade-in">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-tint text-sm text-ink-2">
                    <th className="px-4 py-3">ชื่อเอกสาร</th>
                    <th className="px-4 py-3">หมวด</th>
                    <th className="px-4 py-3">แผนก</th>
                    <th className="px-4 py-3">วันที่เผยแพร่</th>
                    <th className="px-4 py-3 text-center">ดาวน์โหลด</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((d) => (
                    <tr key={d.id} className="border-t border-line-soft">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <FileBadge fileType={d.fileType} small />
                          <span>
                            <span className="block font-semibold">{d.title}</span>
                            <span className="text-[13px] text-muted">{fileInfo(d)}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] bg-chip text-chip-ink px-2.5 py-0.5 rounded-full whitespace-nowrap">{d.categoryName}</span>
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap">{d.deptName || d.department}</td>
                      <td className="px-4 py-3 text-[15px] text-muted whitespace-nowrap">{d.dateText || d.publishedAt}</td>
                      <td className="px-4 py-3 text-center">
                        <DownloadButton doc={d} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden bg-white border border-line rounded-xl px-4">
              {rows.map((d) => (
                <DocumentRow key={d.id} doc={d} />
              ))}
            </div>

            {pageCount > 1 && (
              <nav aria-label="เปลี่ยนหน้า" className="flex justify-center gap-1.5 mt-5">
                <button
                  type="button"
                  aria-label="หน้าก่อนหน้า"
                  disabled={current === 1}
                  onClick={() => setPage(current - 1)}
                  className="w-11 h-11 rounded-lg bg-white border border-line text-ink-2 flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                {pageItems(current, pageCount).map((n, i) =>
                  n === "gap" ? (
                    <span key={`gap-${i}`} aria-hidden="true" className="w-8 h-11 flex items-center justify-center text-muted">…</span>
                  ) : (
                  <button
                    key={n}
                    type="button"
                    aria-label={`หน้า ${n}`}
                    aria-current={n === current ? "page" : undefined}
                    onClick={() => setPage(n)}
                    className={`w-11 h-11 rounded-lg font-semibold ${n === current ? "bg-brand text-white" : "bg-white border border-line text-ink-2"}`}
                  >
                    {n}
                  </button>
                  ),
                )}
                <button
                  type="button"
                  aria-label="หน้าถัดไป"
                  disabled={current === pageCount}
                  onClick={() => setPage(current + 1)}
                  className="w-11 h-11 rounded-lg bg-white border border-line text-ink-2 flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </>
  );
}
