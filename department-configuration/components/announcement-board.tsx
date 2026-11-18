"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Announcement } from "@/lib/types";
import { AnnouncementItem } from "./announcement-item";

type Props = {
  /** Already sorted newest first. */
  announcements: Announcement[];
  /** Show only the first N matches and a "see all" link. */
  limit?: number;
  departments?: { id: string; name: string }[];
};

export function AnnouncementBoard({ announcements, limit, departments }: Props) {
  const [type, setType] = useState("all");
  const [department, setDepartment] = useState("all");

  // Tabs come from the data, so new announcement types show up without code changes.
  const tabs = useMemo(() => {
    const seen = new Map<string, string>();
    for (const a of announcements) if (!seen.has(a.type)) seen.set(a.type, a.typeName || a.type);
    return [{ id: "all", label: "ทั้งหมด" }, ...[...seen].map(([id, label]) => ({ id, label }))];
  }, [announcements]);

  const matches = announcements.filter(
    (a) => (type === "all" || a.type === type) && (department === "all" || a.department === department),
  );
  const visible = limit ? matches.slice(0, limit) : matches;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mt-4 mb-2">
        <div className="flex flex-wrap gap-2" role="group" aria-label="ประเภทข่าว">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={type === t.id}
              onClick={() => setType(t.id)}
              className={`min-h-10 px-4 rounded-full border text-[15px] ${
                type === t.id ? "bg-brand border-brand text-white font-semibold" : "bg-white border-field text-ink-2 hover:border-brand"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {departments && (
          <label className="ml-auto flex items-center gap-2 text-sm font-semibold">
            แผนก
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-10 border border-field rounded-lg px-2.5 bg-white font-normal text-[15px]"
            >
              <option value="all">ทุกแผนก</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {visible.length ? (
        <div key={`${type}-${department}`} className="flex flex-col animate-fade-in">
          {visible.map((a) => (
            <AnnouncementItem key={a.id} ann={a} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center py-8">ไม่มีข่าวในหมวดนี้</p>
      )}

      {limit && matches.length > limit && (
        <Link href="/news" className="mt-4 flex items-center justify-center min-h-11 rounded-lg bg-tint font-semibold">
          ดูข่าวและประกาศทั้งหมด ({matches.length} รายการ)
        </Link>
      )}
    </>
  );
}
