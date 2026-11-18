"use client";

import { useState } from "react";
import { ArticleContent } from "@/components/article-content";
import { ChevronLeftIcon, PencilIcon, TrashIcon } from "@/components/icons";
import { ARTICLE_CATEGORY_NAMES, categoryBadgeClass, categoryName, formatDate } from "@/lib/format";
import type { Article, ArticleCategoryId, Block, Department } from "@/lib/types";
import { BlockEditor } from "./block-editor";
import { Card, Field, FieldError, focusFirstError, inputClass, invalidProps, primaryButton, secondaryButton, type FormErrors } from "./ui";

type ErrorKey = "title" | "blocks";
const FIELD_ID: Record<ErrorKey, string> = { title: "article-title", blocks: "article-blocks" };

type Draft = { id: string | null; department: string; category: ArticleCategoryId; title: string; blocks: Block[] };

const ID_PREFIX: Partial<Record<ArticleCategoryId, string>> = { process: "proc", achievement: "achv" };

type Props = {
  articles: Article[];
  departments: Department[];
  /** Department an editor is locked to; `null` for super admins. */
  lockedDept: string | null;
  onSave: (article: Article) => Promise<boolean>;
  onDelete: (article: Article) => void;
};

export function ArticleManager({ articles, departments, lockedDept, onSave, onDelete }: Props) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<FormErrors<ErrorKey>>({});
  const [saving, setSaving] = useState(false);

  const deptName = (id: string) => departments.find((d) => d.id === id)?.name ?? id;
  const sorted = [...articles].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

  function open(article?: Article) {
    setDraft(
      article
        ? { id: article.id, department: article.department, category: article.category, title: article.title, blocks: structuredClone(article.blocks ?? []) }
        : { id: null, department: lockedDept ?? departments[0]?.id ?? "", category: "process", title: "", blocks: [] },
    );
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save() {
    if (!draft) return;
    const title = draft.title.trim();
    const found: FormErrors<ErrorKey> = {};
    if (!title) found.title = "กรุณากรอกหัวเรื่อง";
    if (!draft.blocks.length) found.blocks = "กรุณาเพิ่มเนื้อหาอย่างน้อย 1 บล็อก";
    setErrors(found);
    if (Object.keys(found).length) return focusFirstError(found, ["title", "blocks"], (k) => FIELD_ID[k]);

    const department = lockedDept ?? draft.department;
    setSaving(true);
    try {
      const ok = await onSave({
        id: draft.id ?? `${ID_PREFIX[draft.category] ?? "art"}-${department}-${Date.now().toString(36)}`,
        department,
        category: draft.category,
        title,
        updatedAt: new Date().toISOString(),
        blocks: draft.blocks,
      });
      if (ok) setDraft(null);
    } finally {
      setSaving(false);
    }
  }

  if (draft) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={() => setDraft(null)} aria-label="กลับ" className="text-muted hover:text-brand-hover p-1.5 rounded-lg hover:bg-line-soft">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-ink">{draft.id ? "แก้ไขบทความ" : "สร้างบทความใหม่"}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card title="ข้อมูลบทความ">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="แผนก" required hint={lockedDept && "สิทธิ์ Editor บันทึกได้เฉพาะแผนกของตนเอง"}>
                  <select
                    value={lockedDept ?? draft.department}
                    disabled={!!lockedDept}
                    onChange={(e) => setDraft({ ...draft, department: e.target.value })}
                    className={inputClass}
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="หมวดหมู่" required>
                  <select
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value as ArticleCategoryId })}
                    className={inputClass}
                  >
                    {Object.entries(ARTICLE_CATEGORY_NAMES).map(([id, name]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="หัวเรื่อง" required errorFor={FIELD_ID.title} error={errors.title}>
                    <input
                      {...invalidProps(FIELD_ID.title, errors.title)}
                      value={draft.title}
                      onChange={(e) => {
                        setDraft({ ...draft, title: e.target.value });
                        if (errors.title) setErrors({ ...errors, title: undefined });
                      }}
                      placeholder="เช่น ขั้นตอนการขอรับบริการข้อมูลแผนที่"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </Card>

            <Card title="เนื้อหาบทความ">
              {/* Focus target for the "no content" error; announced via its text. */}
              <div id={FIELD_ID.blocks} tabIndex={-1} className="outline-none" aria-describedby={errors.blocks ? `${FIELD_ID.blocks}-error` : undefined}>
                <FieldError id={FIELD_ID.blocks} error={errors.blocks} />
                <BlockEditor
                  blocks={draft.blocks}
                  onChange={(blocks) => {
                    setDraft({ ...draft, blocks });
                    if (errors.blocks && blocks.length) setErrors({ ...errors, blocks: undefined });
                  }}
                />
              </div>
            </Card>

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setDraft(null)} className={secondaryButton}>ยกเลิก</button>
              <button type="button" onClick={save} disabled={saving} className={primaryButton}>
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>

          <div className="lg:sticky lg:top-6 self-start">
            <Card title="ตัวอย่างหน้าบ้าน">
              {draft.blocks.length ? (
                <ArticleContent blocks={draft.blocks} />
              ) : (
                <p className="text-muted text-center text-xs">ตัวอย่างจะแสดงที่นี่เมื่อเริ่มพิมพ์เนื้อหา</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink">บทความและผลงาน</h2>
          <p className="text-xs text-muted mt-1">จัดการเนื้อหาและผลงานของแผนกแบบ Block-based</p>
        </div>
        <button type="button" onClick={() => open()} className={primaryButton}>+ สร้างบทความใหม่</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto border border-line">
        {sorted.length ? (
          <table className="w-full">
            <thead>
              <tr className="bg-tint border-b border-line text-left text-xs font-semibold text-brand-ink">
                <th className="px-6 py-3.5">หัวเรื่อง</th>
                <th className="px-6 py-3.5 hidden md:table-cell">แผนก</th>
                <th className="px-6 py-3.5 hidden sm:table-cell">หมวดหมู่</th>
                <th className="px-6 py-3.5 hidden lg:table-cell">อัปเดตล่าสุด</th>
                <th className="px-6 py-3.5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {sorted.map((a) => (
                <tr key={a.id} className="hover:bg-tint/60 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-ink">{a.title}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-sm text-muted">{deptName(a.department)}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryBadgeClass(a.category)}`}>
                      {categoryName(a.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-xs text-muted">{formatDate(a.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <RowActions onEdit={() => open(a)} onDelete={() => onDelete(a)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">ยังไม่มีบทความ</p>
            <p className="text-sm text-muted mt-1">กด &quot;สร้างบทความใหม่&quot; เพื่อเริ่มต้น</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button type="button" onClick={onEdit} aria-label="แก้ไข" className="text-brand-ink hover:text-brand-hover hover:bg-tint p-1.5 rounded-lg">
        <PencilIcon className="w-4 h-4" />
      </button>
      <button type="button" onClick={onDelete} aria-label="ลบ" className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1.5 rounded-lg">
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
