"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "./icons";

/** Appears after the first screen of scrolling; long department pages need it most. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="กลับขึ้นด้านบน"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={`fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-brand text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-brand-hover ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <ArrowUpIcon className="w-5 h-5" />
    </button>
  );
}
