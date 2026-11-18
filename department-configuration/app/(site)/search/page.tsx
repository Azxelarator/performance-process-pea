import type { Metadata } from "next";
import { Suspense } from "react";
import { sortAnnouncements } from "@/components/announcement-item";
import { Breadcrumb } from "@/components/page-heading";
import { SearchResults } from "@/components/search-results";
import { getAnnouncements, getArticles, getDepartments, getDocuments } from "@/lib/data";

export const metadata: Metadata = { title: "ผลการค้นหา", robots: { index: false } };

export default async function SearchPage() {
  const [announcements, documents, articles, departments] = await Promise.all([
    getAnnouncements(),
    getDocuments(),
    getArticles(),
    getDepartments(),
  ]);
  const deptNames = Object.fromEntries(departments.map((d) => [d.id, d.shortName || d.name]));

  return (
    <>
      <Breadcrumb items={[{ label: "ผลการค้นหา" }]} />
      {/* The query comes from the URL (?q=), which only exists at request time. */}
      <Suspense fallback={<p className="max-w-300 w-full mx-auto px-4 sm:px-6 py-8 text-muted">กำลังค้นหา...</p>}>
        <SearchResults
          announcements={sortAnnouncements(announcements)}
          documents={documents}
          articles={articles.map((a) => ({ id: a.id, title: a.title, department: a.department, deptName: deptNames[a.department] ?? a.department }))}
        />
      </Suspense>
    </>
  );
}
