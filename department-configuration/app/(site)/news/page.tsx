import type { Metadata } from "next";
import { AnnouncementBoard } from "@/components/announcement-board";
import { sortAnnouncements } from "@/components/announcement-item";
import { Breadcrumb, PageTitle } from "@/components/page-heading";
import { getAnnouncements, getDepartments } from "@/lib/data";

export const metadata: Metadata = { title: "ข่าวและประกาศ" };

export default async function NewsPage() {
  const [announcements, departments] = await Promise.all([getAnnouncements(), getDepartments()]);

  return (
    <>
      <Breadcrumb items={[{ label: "ข่าวและประกาศ" }]} />
      <PageTitle title="ข่าวและประกาศ" subtitle="ประกาศ แนวปฏิบัติ ผลงาน และข่าวรับสมัครงานของทุกแผนก เรียงจากล่าสุด" />
      <section className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-4 pb-14">
        <div className="bg-white border border-line rounded-xl p-6">
          <AnnouncementBoard
            announcements={sortAnnouncements(announcements)}
            departments={departments.map((d) => ({ id: d.id, name: d.shortName || d.name }))}
          />
        </div>
      </section>
    </>
  );
}
