import Link from "next/link";
import { AnnouncementBoard } from "@/components/announcement-board";
import { sortAnnouncements } from "@/components/announcement-item";
import { DocumentRow } from "@/components/document-item";
import { ArrowRightIcon, LayersIcon, MegaphoneIcon } from "@/components/icons";
import { SiteShell } from "@/components/site-shell";
import { getAnnouncements, getDepartments, getDocuments } from "@/lib/data";

const HOME_NEWS_LIMIT = 6;

const RELATED_LINKS = [
  { href: "/departments/gis", label: "ระบบแผนที่ (GIS)" },
  { href: "/departments/it", label: "IT Service Desk" },
  { href: "/departments/hr", label: "HR Self-Service" },
  { href: "/documents", label: "คลังเอกสาร" },
];

export default async function HomePage() {
  const [departments, announcements, documents] = await Promise.all([getDepartments(), getAnnouncements(), getDocuments()]);
  const news = sortAnnouncements(announcements);
  const latestNotice = news.find((a) => a.type === "notice") ?? news[0];

  return (
    <SiteShell>
      <Hero />

      {latestNotice && (
        <div className="bg-white border-b border-line">
          <div className="max-w-300 mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
            <span className="shrink-0 inline-flex items-center gap-1.5 bg-gold text-gold-ink text-sm font-bold px-3 py-1 rounded-full">
              <MegaphoneIcon className="w-4 h-4" />
              ประกาศล่าสุด
            </span>
            <Link href={`/departments/${encodeURIComponent(latestNotice.department)}#posts`} className="min-w-0 truncate font-semibold text-ink hover:text-brand-ink">
              {latestNotice.title}
            </Link>
            <span className="hidden sm:inline shrink-0 text-sm text-muted ml-auto">{latestNotice.dateText}</span>
          </div>
        </div>
      )}

      {/* News first: it is what most visitors come for. */}
      <section id="news" className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-10 pb-6 flex flex-wrap items-start gap-7">
        <div className="flex-[999_1_560px] min-w-0 bg-white border border-line rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">ข่าวและประกาศล่าสุด</h2>
            <Link href="/news" className="font-semibold text-[15px]">ดูทั้งหมด →</Link>
          </div>
          <AnnouncementBoard announcements={news} limit={HOME_NEWS_LIMIT} />
        </div>

        <aside className="flex-[1_1_320px] min-w-0 flex flex-col gap-5">
          <div className="bg-white border border-line rounded-xl p-6">
            <h2 className="text-[22px] font-bold">เอกสารเผยแพร่ล่าสุด</h2>
            <div className="mt-2">
              {documents.length ? (
                documents.slice(0, 4).map((d) => <DocumentRow key={d.id} doc={d} />)
              ) : (
                <p className="text-muted text-sm py-4 text-center">ยังไม่มีเอกสาร</p>
              )}
            </div>
            <Link href="/documents" className="mt-4 flex items-center justify-center min-h-11 rounded-lg bg-tint font-semibold">
              ดูเอกสารทั้งหมด
            </Link>
          </div>

          <div className="bg-white border border-line rounded-xl p-6">
            <h2 className="text-xl font-bold mb-3">ลิงก์ที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {RELATED_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="border border-line rounded-lg p-3 text-sm text-center text-ink-2 hover:border-brand hover:text-brand-ink">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section id="departments" className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-6 pb-14">
        <div className="mb-6">
          <h2 className="text-[28px] font-bold">หน่วยงานภายใน</h2>
          <p className="text-muted">เลือกแผนกเพื่อดูข้อมูล หน้าที่ ผลงาน และเอกสารของแผนก</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
          {departments.map((d) => (
            <Link
              key={d.id}
              href={`/departments/${encodeURIComponent(d.id)}`}
              className="bg-white border border-line border-t-4 border-t-brand rounded-xl p-6 flex flex-col gap-3 text-ink hover:text-ink hover:shadow-md motion-safe:hover:-translate-y-0.5 transition duration-200 group"
            >
              <span className="w-12 h-12 rounded-[10px] bg-tint text-brand-ink flex items-center justify-center">
                <LayersIcon className="w-[26px] h-[26px]" strokeWidth={1.8} />
              </span>
              <span>
                <span className="block text-[19px] font-bold leading-snug">{d.name}</span>
                <span className="block text-muted text-[15px] mt-1 line-clamp-3">{d.heroDescription || d.overviewText}</span>
              </span>
              <span className="mt-auto text-brand-ink font-semibold text-[15px] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                เข้าสู่หน้าแผนก <ArrowRightIcon className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

function Hero() {
  return (
    <section className="bg-brand-deep overflow-hidden focus-on-dark">
      <div className="max-w-300 mx-auto px-4 sm:px-6 py-10 md:py-12 flex flex-wrap items-center gap-8">
        <div className="flex-[1_1_520px] min-w-0 text-white">
          <span className="inline-block bg-white/15 border border-white/30 rounded-full px-3.5 py-1 text-sm">เว็บไซต์ภายในหน่วยงาน</span>
          <h1 className="mt-4 mb-3 text-3xl sm:text-[40px] leading-tight font-bold">
            ศูนย์รวมข่าวสาร ประกาศ
            <br />
            และเอกสารของทุกแผนก
          </h1>
          <p className="mb-7 text-lg text-on-brand max-w-140">
            ติดตามข่าวประชาสัมพันธ์ ประกาศ และดาวน์โหลดเอกสารเผยแพร่ของแต่ละแผนกได้ในที่เดียว
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="#news" className="inline-flex items-center min-h-11 px-6 rounded-lg bg-gold text-gold-ink hover:text-gold-ink hover:brightness-105 font-semibold">
              ดูประกาศล่าสุด
            </Link>
            <Link href="/documents" className="inline-flex items-center min-h-11 px-6 rounded-lg border border-white/60 text-white hover:text-white hover:bg-white/10 font-semibold">
              ค้นหาเอกสาร
            </Link>
          </div>
        </div>
        <div className="hidden md:flex flex-[1_1_360px] min-w-0 justify-center">
          <MapIllustration />
        </div>
      </div>
    </section>
  );
}

function MapIllustration() {
  const contours = [
    "M20 240 C 80 200, 120 260, 190 220 S 300 170, 400 210",
    "M20 200 C 90 160, 130 220, 200 180 S 310 120, 400 160",
    "M20 160 C 100 120, 140 180, 210 140 S 320 70, 400 110",
    "M40 120 C 110 80, 160 130, 220 100 S 320 30, 390 60",
    "M80 80 C 130 50, 170 90, 230 64 S 300 20, 360 30",
  ];
  return (
    <svg viewBox="0 0 420 300" className="w-full max-w-[420px] h-auto" aria-hidden="true" fill="none">
      {contours.map((d) => (
        <path key={d} d={d} stroke="rgba(255,255,255,0.22)" strokeWidth={2} />
      ))}
      <path d="M60 260 L 150 150 L 250 190 L 340 90" stroke="#C7911B" strokeWidth={3} strokeDasharray="8 8" />
      {[[60, 260], [150, 150], [250, 190]].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r={7} fill="#FFFFFF" />
      ))}
      <path d="M340 52 c -16 0 -26 12 -26 26 c 0 20 26 42 26 42 s 26 -22 26 -42 c 0 -14 -10 -26 -26 -26 z" fill="#C7911B" />
      <circle cx={340} cy={78} r={9} fill="#5F034E" />
    </svg>
  );
}
