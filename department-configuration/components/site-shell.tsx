import type { ReactNode } from "react";
import { getDepartments } from "@/lib/data";
import { BackToTop } from "./back-to-top";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export async function SiteShell({ children }: { children: ReactNode }) {
  const departments = await getDepartments();
  return (
    <>
      {/* Keyboard and screen-reader users can jump past the header and menus. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-brand focus:text-white focus:font-semibold"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>
      <SiteHeader departments={departments.map((d) => ({ id: d.id, name: d.name }))} />
      <main id="main" tabIndex={-1} className="flex-1 flex flex-col outline-none">
        {children}
      </main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
