"use client";

import { useEffect, useState } from "react";

const SIZES = [
  { label: "ก-", aria: "ลดขนาดตัวอักษร", value: "87.5%", text: "text-[13px]" },
  { label: "ก", aria: "ขนาดตัวอักษรปกติ", value: "100%", text: "text-[15px]" },
  { label: "ก+", aria: "เพิ่มขนาดตัวอักษร", value: "112.5%", text: "text-[17px]" },
];
const STORAGE_KEY = "portal-font-size";

export function FontSizeControl() {
  const [current, setCurrent] = useState("100%");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SIZES.some((s) => s.value === saved)) apply(saved);
    } catch {
      // Storage can be unavailable (private mode); default size is fine.
    }
  }, []);

  function apply(value: string) {
    document.documentElement.style.fontSize = value;
    setCurrent(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {}
  }

  return (
    <span className="hidden sm:inline-flex items-center gap-1.5" role="group" aria-label="ขนาดตัวอักษร">
      <span className="mr-1">ขนาดตัวอักษร</span>
      {SIZES.map((s) => (
        <button
          key={s.value}
          type="button"
          aria-label={s.aria}
          aria-pressed={current === s.value}
          onClick={() => apply(s.value)}
          className={`min-w-9 h-8 rounded-md border border-white/40 text-white ${s.text} ${current === s.value ? "bg-white/15" : "bg-transparent hover:bg-white/10"}`}
        >
          {s.label}
        </button>
      ))}
    </span>
  );
}
