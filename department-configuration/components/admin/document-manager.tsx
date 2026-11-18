"use client";

import { useState } from "react";
import { Modal } from "@/components/modal";
import { ALLOWED_FILES_TEXT, DOC_CATEGORY_NAMES, FILE_TYPES, FILE_TYPE_LABELS, fileTypeFromUrl, formatShortDate, isAllowedFileType, thaiYear } from "@/lib/format";
import type { DocCategoryId, Department, DocumentItem, FileType } from "@/lib/types";
import { RowActions } from "./article-manager";
import { Field, focusFirstError, inputClass, invalidProps, primaryButton, secondaryButton, type FormErrors } from "./ui";

type Draft = Pick<DocumentItem, "title" | "department" | "category" | "fileType" | "fileSize" | "year" | "fileUrl"> & { id: string | null };

type ErrorKey = "title" | "fileType" | "fileUrl";
const FIELD_ID: Record<ErrorKey, string> = { title: "doc-title", fileType: "doc-file-type", fileUrl: "doc-file-url" };

type Props = {
  documents: DocumentItem[];
  departments: Department[];
  lockedDept: string | null;
  onSave: (doc: DocumentItem) => Promise<boolean>;
  onDelete: (doc: DocumentItem) => void;
};

export function DocumentManager({ documents, departments, lockedDept, onSave, onDelete }: Props) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<FormErrors<ErrorKey>>({});
  const [saving, setSaving] = useState(false);
  const choices = lockedDept ? departments.filter((d) => d.id === lockedDept) : departments;

  function open(doc?: DocumentItem) {
    setErrors({});
    setDraft(
      doc
        ? { id: doc.id, title: doc.title, department: doc.department, category: doc.category, fileType: doc.fileType, fileSize: doc.fileSize, year: doc.year, fileUrl: doc.fileUrl }
        : { id: null, title: "", department: lockedDept ?? choices[0]?.id ?? "", category: "manual", fileType: "pdf", fileSize: "", year: thaiYear(new Date()), fileUrl: "" },
    );
  }

  async function save() {
    if (!draft) return;
    const title = draft.title.trim();
    const found: FormErrors<ErrorKey> = {};
    if (!title) found.title = "กรุณากรอกชื่อเอกสาร";
    if (!isAllowedFileType(draft.fileType)) found.fileType = ALLOWED_FILES_TEXT;
    const linkType = fileTypeFromUrl(draft.fileUrl);
    if (linkType === "unsupported") found.fileUrl = `ลิงก์ไฟล์ไม่ใช่ชนิดที่รองรับ — ${ALLOWED_FILES_TEXT}`;
    else if (linkType && isAllowedFileType(draft.fileType) && linkType !== draft.fileType) {
      found.fileUrl = `ลิงก์เป็นไฟล์ ${FILE_TYPE_LABELS[linkType]} แต่เลือกชนิดไฟล์เป็น ${FILE_TYPE_LABELS[draft.fileType]}`;
    }
    setErrors(found);
    if (Object.keys(found).length) return focusFirstError(found, ["title", "fileType", "fileUrl"], (k) => FIELD_ID[k]);

    const department = lockedDept ?? draft.department;
    const dept = departments.find((d) => d.id === department);
    const existing = documents.find((d) => d.id === draft.id);
    const now = new Date();

    setSaving(true);
    try {
      const ok = await onSave({
        ...existing,
        id: draft.id ?? `doc-${department}-${now.getTime().toString(36)}`,
        title,
        department,
        deptName: dept?.shortName || dept?.name || department,
        category: draft.category,
        categoryName: DOC_CATEGORY_NAMES[draft.category],
        fileType: draft.fileType,
        fileSize: draft.fileSize.trim(),
        year: draft.year.trim() || thaiYear(now),
        fileUrl: draft.fileUrl.trim() || "#",
        publishedAt: existing?.publishedAt ?? now.toISOString().slice(0, 10),
        dateText: existing?.dateText ?? formatShortDate(now),
        downloads: existing?.downloads ?? 0,
      });
      if (ok) setDraft(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink">คลังเอกสารเผยแพร่</h2>
          <p className="text-xs text-muted mt-1">เพิ่ม แก้ไข และลบคู่มือ แบบฟอร์ม รายงาน และประกาศ</p>
        </div>
        <button type="button" onClick={() => open()} className={primaryButton}>+ เพิ่มเอกสารใหม่</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-line overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-tint border-b border-line text-xs font-bold text-brand-ink">
              <th className="px-5 py-3.5">ชื่อเอกสาร</th>
              <th className="px-5 py-3.5">หมวดหมู่</th>
              <th className="px-5 py-3.5">หน่วยงาน</th>
              <th className="px-5 py-3.5">ประเภท/ขนาด</th>
              <th className="px-5 py-3.5 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {documents.length ? (
              documents.map((d) => (
                <tr key={d.id} className="hover:bg-tint/60 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-semibold text-ink">{d.title}</td>
                  <td className="px-5 py-3.5 text-xs">
                    <span className="px-2 py-0.5 rounded bg-tint text-brand-ink border border-line">{d.categoryName || d.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted">{d.deptName || d.department}</td>
                  <td className="px-5 py-3.5 text-xs text-muted uppercase">
                    {d.fileType} ({d.fileSize || "-"})
                    {!isAllowedFileType(d.fileType) && (
                      <span className="block normal-case text-alert font-semibold">ชนิดไฟล์ไม่รองรับ — ไม่แสดงบนหน้าเว็บ</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions onEdit={() => open(d)} onDelete={() => onDelete(d)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-muted">ยังไม่มีเอกสารในคลัง</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={draft !== null} onClose={() => setDraft(null)} title={draft?.id ? "แก้ไขเอกสาร" : "เพิ่มเอกสารใหม่"}>
        {draft && (
          <div className="space-y-3">
            <Field label="ชื่อเอกสาร" required errorFor={FIELD_ID.title} error={errors.title}>
              <input
                {...invalidProps(FIELD_ID.title, errors.title)}
                value={draft.title}
                onChange={(e) => {
                  setDraft({ ...draft, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                className={inputClass}
                placeholder="เช่น คู่มือการใช้งานระบบแผนที่"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="หน่วยงานเจ้าของ">
                <select value={lockedDept ?? draft.department} disabled={!!lockedDept} onChange={(e) => setDraft({ ...draft, department: e.target.value })} className={inputClass}>
                  {choices.map((d) => (
                    <option key={d.id} value={d.id}>{d.shortName || d.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="หมวดหมู่เอกสาร">
                <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as DocCategoryId })} className={inputClass}>
                  {Object.entries(DOC_CATEGORY_NAMES).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="ชนิดไฟล์" errorFor={FIELD_ID.fileType} error={errors.fileType}>
                <select
                  {...invalidProps(FIELD_ID.fileType, errors.fileType)}
                  value={draft.fileType}
                  onChange={(e) => {
                    setDraft({ ...draft, fileType: e.target.value as FileType });
                    setErrors({ ...errors, fileType: undefined, fileUrl: undefined });
                  }}
                  className={inputClass}
                >
                  {FILE_TYPES.map((t) => (
                    <option key={t} value={t}>{FILE_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </Field>
              <Field label="ขนาดไฟล์">
                <input value={draft.fileSize} onChange={(e) => setDraft({ ...draft, fileSize: e.target.value })} placeholder="เช่น 2.5 MB" className={inputClass} />
              </Field>
              <Field label="ปี พ.ศ.">
                <input inputMode="numeric" value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <Field label="ลิงก์ไฟล์ (URL)" hint={ALLOWED_FILES_TEXT} errorFor={FIELD_ID.fileUrl} error={errors.fileUrl}>
              <input
                {...invalidProps(FIELD_ID.fileUrl, errors.fileUrl)}
                type="url"
                value={draft.fileUrl}
                onChange={(e) => {
                  // Pick the file type from the link's extension when it has one.
                  const detected = fileTypeFromUrl(e.target.value);
                  setDraft({ ...draft, fileUrl: e.target.value, ...(detected && detected !== "unsupported" ? { fileType: detected } : {}) });
                  if (errors.fileUrl || errors.fileType) setErrors({ ...errors, fileUrl: undefined, fileType: undefined });
                }}
                placeholder="https://.../ไฟล์.pdf"
                className={inputClass}
              />
            </Field>
            <div className="flex justify-end gap-2 pt-3 border-t border-line">
              <button type="button" onClick={() => setDraft(null)} className={secondaryButton}>ยกเลิก</button>
              <button type="button" onClick={save} disabled={saving} className={primaryButton}>
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
