import Link from "next/link";
import { parseThaiDate } from "@/lib/format";
import type { Announcement } from "@/lib/types";
import { NewBadge } from "./new-badge";

const departmentHref = (ann: Announcement) => `/departments/${encodeURIComponent(ann.department)}#posts`;

export function announcementTime(ann: Announcement): number {
  return parseThaiDate(ann.day, ann.month, ann.year)?.getTime() ?? 0;
}

/** Newest first. */
export function sortAnnouncements(list: Announcement[]): Announcement[] {
  return [...list].sort((a, b) => announcementTime(b) - announcementTime(a));
}

/** Row with a calendar-style date box (home page, news page). */
export function AnnouncementItem({ ann }: { ann: Announcement }) {
  return (
    <Link href={departmentHref(ann)} className="flex gap-4 py-4 border-b border-line-soft last:border-b-0 text-ink hover:text-ink group">
      <div className="shrink-0 w-16 text-center border border-line rounded-lg overflow-hidden bg-white">
        <div className="bg-tint text-brand-ink text-[13px] py-0.5">
          {ann.month} {ann.year.slice(-2)}
        </div>
        <div className="text-2xl font-bold leading-normal">{ann.day}</div>
      </div>
      <div className="min-w-0 flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[13px] bg-tint text-brand-ink px-2.5 rounded-full">{ann.deptName || "ส่วนกลาง"}</span>
          <span className="text-[13px] bg-chip text-chip-ink px-2.5 rounded-full">{ann.typeName || "ประกาศ"}</span>
          <NewBadge time={announcementTime(ann)} />
        </div>
        <div className="text-[17px] font-semibold group-hover:text-brand-ink group-hover:underline underline-offset-2">{ann.title}</div>
      </div>
    </Link>
  );
}

/** Compact row: date + type + title (department page). */
export function AnnouncementCompact({ ann }: { ann: Announcement }) {
  return (
    <div className="flex flex-col gap-0.5 py-3.5 border-b border-line-soft last:border-b-0">
      <div className="flex items-center gap-2 text-[13px] text-muted">
        <span>{ann.dateText}</span>
        <span className="bg-chip text-chip-ink px-2 rounded-full">{ann.typeName}</span>
        <NewBadge time={announcementTime(ann)} />
      </div>
      <div className="font-semibold">{ann.title}</div>
    </div>
  );
}
