"use client";

import { useEffect, useState } from "react";

type Section = { id: string; label: string };

/** Sticky in-page tabs that underline the section currently on screen. */
export function SectionNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const targets = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    // A section counts as current once its top passes the upper third of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-120px 0px -60% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="เมนูในหน้าแผนก" className="sticky top-0 md:top-12 z-30 bg-canvas/95 backdrop-blur mt-5">
      <div className="max-w-300 mx-auto px-4 sm:px-6 overflow-x-auto">
        <div className="flex gap-1 border-b border-line min-w-max">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setActive(s.id)}
              aria-current={active === s.id ? "location" : undefined}
              className={`px-4 py-2.5 no-underline border-b-3 transition-colors duration-200 ${
                active === s.id ? "border-brand text-brand-ink font-semibold" : "border-transparent text-ink-2 hover:border-line hover:text-brand-ink"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
