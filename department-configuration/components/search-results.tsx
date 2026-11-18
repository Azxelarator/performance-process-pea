"use client";

import Form from "next/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import type { Announcement, DocumentItem } from "@/lib/types";
import { AnnouncementItem } from "./announcement-item";
import { DocumentRow } from "./document-item";
import { SearchIcon } from "./icons";

type ArticleHit = { id: string; title: string; department: string; deptName: string };

type Props = { announcements: Announcement[]; documents: DocumentItem[]; articles: ArticleHit[] };

const matches = (q: string, ...fields: (string | undefined)[]) => fields.some((f) => f?.toLowerCase().includes(q));

export function SearchResults({ announcements, documents, articles }: Props) {
  const raw = useSearchParams().get("q") ?? "";
  const q = raw.trim().toLowerCase();

  const news = q ? announcements.filter((a) => matches(q, a.title, a.deptName, a.typeName)) : [];
  const docs = q ? documents.filter((d) => matches(q, d.title, d.deptName, d.categoryName)) : [];
  const works = q ? articles.filter((a) => matches(q, a.title, a.deptName)) : [];
  const total = news.length + docs.length + works.length;

  return (
    <div className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6">
      <div>
        <h1 className="text-[28px] sm:text-[34px] font-bold leading-tight">ผลการค้นหา</h1>
        <Form action="/search" role="search" className="mt-3 max-w-xl">
          <label htmlFor="search-page-q" className="sr-only">คำค้น</label>
          <div className="flex items-center gap-2 h-12 px-3 rounded-lg border border-field bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand">
            <SearchIcon className="w-5 h-5 text-muted shrink-0" />
            <input id="search-page-q" key={raw} name="q" type="search" defaultValue={raw} placeholder="ค้นหาข่าว ประกาศ เอกสาร" className="flex-1 min-w-0 bg-transparent outline-none" />
            <button type="submit" className="h-9 px-4 rounded-md bg-brand text-white font-semibold">ค้นหา</button>
          </div>
        </Form>
        {q && (
          <p className="mt-2 text-muted" role="status">
            พบ {total} รายการสำหรับ “{raw.trim()}”
          </p>
        )}
      </div>

      {!q ? (
        <p className="text-muted">พิมพ์คำที่ต้องการค้นหา เช่น ชื่อประกาศ ชื่อเอกสาร หรือชื่อแผนก</p>
      ) : total === 0 ? (
        <div className="bg-white border border-line rounded-xl p-8 text-center text-muted">
          ไม่พบผลลัพธ์ ลองใช้คำที่สั้นลง หรือดู <Link href="/news">ข่าวทั้งหมด</Link> / <Link href="/documents">เอกสารทั้งหมด</Link>
        </div>
      ) : (
        <>
          {news.length > 0 && (
            <Group title="ข่าวและประกาศ" count={news.length}>
              {news.map((a) => <AnnouncementItem key={a.id} ann={a} />)}
            </Group>
          )}
          {docs.length > 0 && (
            <Group title="เอกสาร" count={docs.length}>
              {docs.map((d) => <DocumentRow key={d.id} doc={d} />)}
            </Group>
          )}
          {works.length > 0 && (
            <Group title="ผลงานของแผนก" count={works.length}>
              {works.map((w) => (
                <Link key={w.id} href={`/departments/${encodeURIComponent(w.department)}#works`} className="block py-3.5 border-b border-line-soft last:border-b-0">
                  <span className="block font-semibold">{w.title}</span>
                  <span className="text-[13px] text-muted">{w.deptName}</span>
                </Link>
              ))}
            </Group>
          )}
        </>
      )}
    </div>
  );
}

function Group({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <section className="bg-white border border-line rounded-xl px-6 pt-5 pb-2">
      <h2 className="text-xl font-bold">
        {title} <span className="text-muted font-normal text-base">({count})</span>
      </h2>
      {children}
    </section>
  );
}
