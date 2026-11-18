"use client";

import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FontSizeControl } from "./font-size-control";
import { ChevronDownIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";

export type NavDepartment = { id: string; name: string };

const LINKS = [
  { href: "/", label: "หน้าแรก", match: (p: string) => p === "/" },
  { href: "/news", label: "ข่าวและประกาศ", match: (p: string) => p.startsWith("/news") },
  { href: "/documents", label: "เอกสารเผยแพร่", match: (p: string) => p.startsWith("/documents") },
  { href: "#contact", label: "ติดต่อเรา", match: () => false },
];

/**
 * PEA Brand Bible 2022 (web): emblem at least 60px tall, 16px gap, then the unit name
 * in Prompt Regular 24px / 28px line height. First word gold, rest purple on light
 * backgrounds; white with #CDB578 on purple/dark, where the emblem gets a white ring.
 */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-4">
      <Image
        src="/pea-logo.png"
        alt="ตราสัญลักษณ์การไฟฟ้าส่วนภูมิภาค"
        width={60}
        height={60}
        priority={!light}
        className={`w-[60px] h-[60px] shrink-0 ${light ? "rounded-full bg-white ring-2 ring-white" : ""}`}
      />
      <span className="flex flex-col font-[family-name:var(--font-heading)] text-lg sm:text-2xl leading-[1.17] font-normal">
        <span>
          <span className={light ? "text-gold-soft" : "text-gold"}>พอร์ทัล</span>
          <span className={light ? "text-white" : "text-brand"}>หน่วยงานภายใน</span>
        </span>
        <span className={light ? "text-gold-soft" : "text-brand"}>การไฟฟ้าส่วนภูมิภาค</span>
      </span>
    </span>
  );
}

function SearchBox({ id }: { id: string }) {
  return (
    <Form action="/search" role="search" className="flex-1">
      <label htmlFor={id} className="sr-only">ค้นหาในเว็บไซต์</label>
      <div className="flex items-center gap-2 h-11 px-3 rounded-lg border border-field bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand">
        <SearchIcon className="w-[18px] h-[18px] text-muted shrink-0" />
        <input
          id={id}
          name="q"
          type="search"
          placeholder="ค้นหาข่าว ประกาศ เอกสาร"
          className="flex-1 min-w-0 bg-transparent outline-none text-[15px]"
        />
      </div>
    </Form>
  );
}

export function SiteHeader({ departments }: { departments: NavDepartment[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Escape closes the mobile menu, as people expect from any popup.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  const inDepartments = pathname.startsWith("/departments");

  const tab = (active: boolean) =>
    `px-[18px] py-3 border-b-3 text-white hover:text-white ${active ? "border-gold font-semibold" : "border-transparent hover:border-white/40"}`;

  return (
    <>
      <div className="bg-brand-dark text-on-brand text-sm focus-on-dark">
        <div className="max-w-300 mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <span>โทร 1129 PEA Contact Center</span>
          <span className="flex items-center gap-4">
            <FontSizeControl />
            <Link href="/admin" className="text-gold-soft hover:text-white">ระบบจัดการ</Link>
          </span>
        </div>
      </div>

      <header className="bg-white border-b border-line">
        <div className="max-w-300 mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <Link href="/" aria-label="หน้าแรก" className="text-ink">
            <Logo />
          </Link>
          <div className="hidden md:flex flex-[0_1_340px] min-w-[220px]">
            <SearchBox id="site-search" />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            className="md:hidden w-11 h-11 rounded-lg border border-line flex items-center justify-center text-brand-ink"
          >
            {menuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <nav aria-label="เมนูหลัก" className="bg-brand sticky top-0 z-50 shadow-sm hidden md:block focus-on-dark">
        <div className="max-w-300 mx-auto px-6 flex flex-wrap">
          <Link href="/" className={tab(pathname === "/")}>หน้าแรก</Link>
          <DepartmentsMenu departments={departments} pathname={pathname} buttonClass={`${tab(inDepartments)} flex items-center gap-1.5`} />
          {LINKS.slice(1).map((l) => (
            <Link key={l.href} href={l.href} className={tab(l.match(pathname))}>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-b border-line shadow-md px-4 pb-4 space-y-3 animate-drop-in">
          <SearchBox id="mobile-search" />
          <ul className="divide-y divide-line-soft">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setMenuOpen(false)} className={`block py-3 ${l.match(pathname) ? "font-semibold text-brand" : "text-ink"}`}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="py-3">
              <span className="block text-sm font-semibold text-muted mb-1">หน่วยงานภายใน</span>
              {departments.map((d) => (
                <Link key={d.id} href={`/departments/${encodeURIComponent(d.id)}`} onClick={() => setMenuOpen(false)} className="block py-1.5 pl-3 text-ink-2">
                  {d.name}
                </Link>
              ))}
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

/**
 * Disclosure menu (WCAG 1.4.13): opens on click or hover, closes with Escape, on
 * click/focus outside, or when the pointer leaves. Links are only in the Tab order
 * while the menu is open, so keyboard users don't tab through every department.
 */
function DepartmentsMenu({ departments, pathname, buttonClass }: { departments: NavDepartment[]; pathname: string; buttonClass: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // A mouse user's hover already opened the menu; their click shouldn't close it again.
  const openedByHover = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => {
        if (!open) openedByHover.current = true;
        setOpen(true);
      }}
      onMouseLeave={() => {
        openedByHover.current = false;
        setOpen(false);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="departments-menu"
        onClick={() => {
          if (openedByHover.current) openedByHover.current = false;
          else setOpen((o) => !o);
        }}
        className={buttonClass}
      >
        หน่วยงานภายใน
        <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2.5} />
      </button>
      {open && (
        <ul id="departments-menu" className="focus-on-light absolute left-0 top-full z-50 animate-drop-in min-w-72 bg-white border border-line rounded-b-xl shadow-lg py-2">
          <li>
            <Link href="/#departments" onClick={() => setOpen(false)} className="block px-4 py-2 text-[15px] font-semibold text-brand-ink hover:bg-tint border-b border-line-soft">
              ดูหน่วยงานทั้งหมด
            </Link>
          </li>
          {departments.map((d) => {
            const current = pathname === `/departments/${d.id}`;
            return (
              <li key={d.id}>
                <Link
                  href={`/departments/${encodeURIComponent(d.id)}`}
                  onClick={() => setOpen(false)}
                  aria-current={current ? "page" : undefined}
                  className={`block px-4 py-2 text-[15px] hover:bg-tint ${current ? "font-semibold text-brand" : "text-ink-2"}`}
                >
                  {d.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
