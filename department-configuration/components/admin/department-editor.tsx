"use client";

import { useState } from "react";
import type { Contact, Department, DepartmentStat, Mission } from "@/lib/types";
import { Card, Field, inputClass, primaryButton } from "./ui";

const STAT_SLOTS = 3;
const MISSION_SLOTS = 6;

type Props = {
  departments: Department[];
  lockedDept: string | null;
  onSave: (dept: Department) => Promise<boolean>;
};

export function DepartmentEditor({ departments, lockedDept, onSave }: Props) {
  const choices = lockedDept ? departments.filter((d) => d.id === lockedDept) : departments;
  const [selectedId, setSelectedId] = useState(choices[0]?.id ?? "");
  const dept = choices.find((d) => d.id === selectedId) ?? choices[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink">ข้อมูลและภารกิจของแผนก</h2>
          <p className="text-xs text-muted mt-1">ภาพรวม สถิติ ภารกิจ และข้อมูลติดต่อที่แสดงในหน้าแผนก</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-muted">
          เลือกแผนก
          <select
            value={dept?.id ?? ""}
            disabled={!!lockedDept}
            onChange={(e) => setSelectedId(e.target.value)}
            className={`${inputClass} w-auto font-medium text-brand-ink`}
          >
            {choices.map((d) => (
              <option key={d.id} value={d.id}>{d.shortName || d.name}</option>
            ))}
          </select>
        </label>
      </div>
      {/* key: reset the form whenever another department is picked */}
      {dept ? <DepartmentForm key={dept.id} dept={dept} onSave={onSave} /> : <p className="text-sm text-muted">ไม่พบข้อมูลแผนก</p>}
    </div>
  );
}

function padded<T>(items: T[] | undefined, size: number, empty: () => T): T[] {
  return Array.from({ length: size }, (_, i) => items?.[i] ?? empty());
}

function DepartmentForm({ dept, onSave }: { dept: Department; onSave: (dept: Department) => Promise<boolean> }) {
  const [form, setForm] = useState({
    name: dept.name ?? "",
    nameEn: dept.nameEn ?? "",
    heroDescription: dept.heroDescription ?? "",
    overviewTitle: dept.overviewTitle ?? "",
    overviewText: dept.overviewText ?? "",
  });
  const [stats, setStats] = useState<DepartmentStat[]>(() => padded(dept.stats, STAT_SLOTS, () => ({ label: "", value: "", unit: "" })));
  const [missions, setMissions] = useState<Mission[]>(() =>
    padded(dept.missions, MISSION_SLOTS, () => ({ step: 0, title: "", description: "" })),
  );
  const [contact, setContact] = useState<Contact>(dept.contact ?? {});
  const [saving, setSaving] = useState(false);

  const setStat = (i: number, patch: Partial<DepartmentStat>) => setStats(stats.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const setMission = (i: number, patch: Partial<Mission>) => setMissions(missions.map((m, j) => (j === i ? { ...m, ...patch } : m)));

  async function save() {
    setSaving(true);
    try {
      await onSave({
        ...dept,
        ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()])),
        stats: stats.map((s, i) => ({ id: s.id ?? `stat_${i}`, value: s.value.trim(), label: s.label.trim(), unit: s.unit?.trim() ?? "" })),
        missions: missions
          .map((m) => ({ title: m.title.trim(), description: m.description.trim() }))
          .filter((m) => m.title)
          .map((m, i) => ({ ...m, step: i + 1 })),
        contact: Object.fromEntries(Object.entries(contact).map(([k, v]) => [k, (v ?? "").trim()])),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setSaving(false);
    }
  }

  const text = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value }),
    className: inputClass,
  });

  return (
    <div className="space-y-6">
      <Card title="1. ภาพรวมแผนก">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="ชื่อแผนก (ภาษาไทย)"><input {...text("name")} /></Field>
          <Field label="ชื่อภาษาอังกฤษ"><input {...text("nameEn")} /></Field>
          <div className="sm:col-span-2"><Field label="คำอธิบายสั้นใน Hero Banner"><input {...text("heroDescription")} /></Field></div>
          <Field label="หัวข้อภาพรวม (เช่น GIS คืออะไร)"><input {...text("overviewTitle")} /></Field>
          <div className="sm:col-span-2"><Field label="เนื้อหาภาพรวมแผนก"><textarea rows={3} {...text("overviewText")} /></Field></div>
        </div>
      </Card>

      <Card title={`2. ตัวเลขสถิติสำคัญ ${STAT_SLOTS} ด้าน`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <fieldset key={i} className="border border-line rounded-xl p-3 bg-canvas space-y-2">
              <legend className="text-xs font-bold text-brand-ink px-1">ช่องสถิติที่ {i + 1}</legend>
              <input aria-label="ค่า" placeholder="ค่า เช่น 8" value={s.value} onChange={(e) => setStat(i, { value: e.target.value })} className={inputClass} />
              <input aria-label="ชื่อสถิติ" placeholder="ชื่อสถิติ เช่น จัดเก็บ" value={s.label} onChange={(e) => setStat(i, { label: e.target.value })} className={inputClass} />
              <input aria-label="หน่วย" placeholder="หน่วย เช่น ชุดข้อมูล" value={s.unit ?? ""} onChange={(e) => setStat(i, { unit: e.target.value })} className={inputClass} />
            </fieldset>
          ))}
        </div>
      </Card>

      <Card title={`3. หน้าที่และภารกิจ (${MISSION_SLOTS} ข้อ)`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missions.map((m, i) => (
            <fieldset key={i} className="border border-line rounded-xl p-3 bg-canvas space-y-1.5">
              <legend className="text-xs font-bold text-brand-ink px-1">ภารกิจข้อที่ {i + 1}</legend>
              <input aria-label="หัวข้อภารกิจ" placeholder="หัวข้อภารกิจ" value={m.title} onChange={(e) => setMission(i, { title: e.target.value })} className={`${inputClass} font-semibold`} />
              <textarea aria-label="คำอธิบายภารกิจ" rows={2} placeholder="คำอธิบายภารกิจ" value={m.description} onChange={(e) => setMission(i, { description: e.target.value })} className={inputClass} />
            </fieldset>
          ))}
        </div>
        <p className="text-[11px] text-muted mt-3">ข้อที่ไม่กรอกหัวข้อจะไม่แสดงในหน้าแผนก</p>
      </Card>

      <Card title="4. ข้อมูลติดต่อแผนก">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              ["location", "สถานที่ตั้ง / อาคาร"],
              ["phone", "เบอร์โทรศัพท์ติดต่อ"],
              ["email", "อีเมลทางการ"],
              ["hours", "เวลาทำการ"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              <input
                type={key === "email" ? "email" : "text"}
                value={contact[key] ?? ""}
                onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
                className={inputClass}
              />
            </Field>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <button type="button" onClick={save} disabled={saving} className={primaryButton}>
          {saving ? "กำลังบันทึก..." : "บันทึกข้อมูลแผนก"}
        </button>
      </div>
    </div>
  );
}
