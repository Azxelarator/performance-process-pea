"use client";

import { useRouter } from "next/navigation";

type Option = { id: string; label: string };

export function DepartmentSwitcher({ options, current }: { options: Option[]; current: string }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      ไปยังแผนก
      <select
        value={current}
        onChange={(e) => router.push(`/departments/${encodeURIComponent(e.target.value)}`)}
        className="h-10 bg-white text-ink text-[15px] rounded-lg px-2.5 border border-field"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
