import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ComponentType, type ReactNode, type SVGProps } from "react";
import { AnnouncementCompact, sortAnnouncements } from "@/components/announcement-item";
import { ArticleGrid } from "@/components/article-grid";
import { DepartmentSwitcher } from "@/components/department-switcher";
import { DocumentRow } from "@/components/document-item";
import { SectionNav } from "@/components/section-nav";
import { ChartIcon, ClockIcon, DatabaseIcon, MailIcon, MapIcon, MapPinIcon, PhoneIcon, UserIcon } from "@/components/icons";
import { getAnnouncements, getArticles, getDepartment, getDepartments, getDocuments } from "@/lib/data";
import type { Department } from "@/lib/types";

export async function generateStaticParams() {
  const departments = await getDepartments();
  return departments.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: PageProps<"/departments/[id]">): Promise<Metadata> {
  const dept = await getDepartment((await params).id);
  return { title: dept?.name ?? "ไม่พบหน่วยงาน" };
}

const STAT_ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [DatabaseIcon, ChartIcon, MapIcon];

type Params = PageProps<"/departments/[id]">["params"];

// The page itself stays synchronous so navigation can show the skeleton instantly;
// reading `params` (URL data) happens inside the Suspense boundary.
export default function DepartmentPage({ params }: PageProps<"/departments/[id]">) {
  return (
    <Suspense fallback={<DepartmentSkeleton />}>
      <DepartmentContent params={params} />
    </Suspense>
  );
}

function DepartmentSkeleton() {
  return (
    <div className="max-w-300 w-full mx-auto px-4 sm:px-6 py-6 space-y-8 animate-pulse" aria-busy="true" aria-label="กำลังโหลด">
      <div className="h-56 rounded-2xl bg-brand/20" />
      <div className="h-11 rounded-lg bg-line" />
      <div className="h-40 rounded-xl bg-line" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-24 rounded-xl bg-line" />
        ))}
      </div>
    </div>
  );
}

async function DepartmentContent({ params }: { params: Params }) {
  const { id } = await params;
  const [departments, articles, announcements, documents] = await Promise.all([
    getDepartments(),
    getArticles(),
    getAnnouncements(),
    getDocuments(),
  ]);
  const dept = departments.find((d) => d.id === id);
  if (!dept) notFound();

  const short = dept.shortName || dept.name;
  const deptArticles = articles
    .filter((a) => a.department === id)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  const deptAnnouncements = sortAnnouncements(announcements.filter((a) => a.department === id));
  const deptDocuments = documents.filter((d) => d.department === id);

  // Announcements come first in the sub-nav: they are what visitors look for most.
  const sections = [
    { id: "posts", label: "ประกาศและเอกสาร" },
    { id: "about", label: dept.overviewTitle || `${short} คืออะไร` },
    { id: "mission", label: "หน้าที่และภารกิจ" },
    { id: "works", label: "ผลงาน" },
    { id: "contact", label: "บุคลากรและติดต่อ" },
  ];

  return (
    <>
      <div className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-3 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="breadcrumb" className="text-sm text-muted flex flex-wrap gap-2 min-w-0">
          <Link href="/" className="no-underline">หน้าแรก</Link>
          <span aria-hidden="true">›</span>
          <Link href="/#departments" className="no-underline">หน่วยงานภายใน</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page" className="text-ink font-semibold">{short}</span>
        </nav>
        <DepartmentSwitcher current={id} options={departments.map((d) => ({ id: d.id, label: d.shortName || d.name }))} />
      </div>

      <section className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-3">
        <div className="bg-brand-deep rounded-2xl p-6 sm:p-10 flex flex-wrap items-center gap-8">
          <div className="flex-[1_1_480px] min-w-0 text-white">
            <span className="inline-block bg-white/15 border border-white/30 rounded-full px-3 py-0.5 text-sm">หน่วยงานภายใน</span>
            <h1 className="mt-3 mb-1 text-[28px] sm:text-4xl leading-tight font-bold">{dept.name}</h1>
            {dept.nameEn && <div className="text-lg text-gold-soft">{dept.nameEn}</div>}
            <p className="mt-4 text-[17px] text-on-brand max-w-140">{dept.heroDescription || dept.overviewText}</p>
          </div>
          <div className="hidden sm:flex flex-[0_1_300px] min-w-0 justify-center">
            <LayerIllustration />
          </div>
        </div>
      </section>

      <SectionNav sections={sections} />

      <section id="posts" className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-8 flex flex-wrap items-start gap-6">
        <Panel title="ประกาศของแผนก" link={{ href: "/news", label: "ข่าวทั้งหมด →" }}>
          {deptAnnouncements.length ? (
            deptAnnouncements.map((a) => <AnnouncementCompact key={a.id} ann={a} />)
          ) : (
            <Empty>ยังไม่มีประกาศของแผนก</Empty>
          )}
        </Panel>
        <Panel title="เอกสารของแผนก" link={{ href: "/documents", label: "ทั้งหมด →" }}>
          {deptDocuments.length ? (
            deptDocuments.map((d) => (
              <DocumentRow key={d.id} doc={d} meta={[d.categoryName, d.dateText || d.publishedAt].filter(Boolean).join(" · ")} />
            ))
          ) : (
            <Empty>ยังไม่มีเอกสารของแผนก</Empty>
          )}
        </Panel>
      </section>

      <section id="about" className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-10 flex flex-wrap gap-8">
        <div className="flex-[1_1_440px] min-w-0">
          <h2 className="text-[28px] font-bold mb-3">{dept.overviewTitle || `${short} คืออะไร`}</h2>
          <p className="text-[17px] text-ink-2">{dept.overviewText}</p>
        </div>
        {!!dept.stats?.length && (
          <div className="flex-[1_1_440px] min-w-0 grid grid-cols-3 gap-3 self-start">
            {dept.stats.map((s, i) => {
              const Icon = STAT_ICONS[i % STAT_ICONS.length];
              return (
                <div key={s.id ?? i} className="bg-white border border-line rounded-xl p-4 sm:p-5 text-center">
                  <Icon className="w-8 h-8 mx-auto text-brand-ink" strokeWidth={1.8} />
                  <div className="text-2xl font-bold text-brand mt-1">{s.value}</div>
                  <div className="font-bold leading-tight">{s.label}</div>
                  {s.unit && <div className="text-sm text-muted">{s.unit}</div>}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section id="mission" className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-10">
        <h2 className="text-[28px] font-bold mb-5">หน้าที่และภารกิจ</h2>
        {dept.missions?.length ? (
          <ol className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {dept.missions.map((m) => (
              <li key={m.step} className="bg-white border border-line rounded-xl p-5 flex items-start gap-4 transition-colors hover:border-brand/40">
                <span className="shrink-0 w-10 h-10 rounded-[10px] bg-tint text-brand-ink font-bold flex items-center justify-center">{m.step}</span>
                <div>
                  <h3 className="font-bold text-[17px]">{m.title}</h3>
                  <p className="text-[15px] text-muted mt-0.5">{m.description}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <Empty>ยังไม่มีข้อมูลภารกิจ</Empty>
        )}
      </section>

      <section id="works" className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-10">
        <h2 className="text-[28px] font-bold mb-5">ผลงานของแผนก</h2>
        {deptArticles.length ? <ArticleGrid articles={deptArticles} /> : <Empty>ยังไม่มีผลงานที่บันทึกไว้</Empty>}
      </section>

      <section id="contact" className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-10 pb-14">
        <h2 className="text-[28px] font-bold mb-5">บุคลากรและติดต่อแผนก</h2>
        <div className="flex flex-wrap items-stretch gap-6">
          <div className="flex-[999_1_560px] min-w-0">
            {dept.personnel?.length ? (
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                {dept.personnel.map((p) => (
                  <li key={p.name} className="bg-white border border-line rounded-xl p-5 text-center">
                    <span className="w-20 h-20 rounded-full bg-line-soft text-muted mx-auto mb-2.5 flex items-center justify-center">
                      <UserIcon className="w-9 h-9" strokeWidth={1.6} />
                    </span>
                    <div className="font-bold">{p.name}</div>
                    <div className="text-sm text-muted">{p.position}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>ยังไม่มีข้อมูลบุคลากร</Empty>
            )}
          </div>
          <ContactCard dept={dept} />
        </div>
      </section>
    </>
  );
}

function ContactCard({ dept }: { dept: Department }) {
  const c = dept.contact ?? {};
  const rows = [
    { icon: MapPinIcon, label: "ที่ตั้ง", value: c.location },
    { icon: PhoneIcon, label: "โทรศัพท์", value: c.phone },
    { icon: MailIcon, label: "อีเมล", value: c.email },
    { icon: ClockIcon, label: "เวลาทำการ", value: c.hours },
  ].filter((r) => r.value);

  return (
    <div className="flex-[1_1_300px] min-w-0 bg-white border border-line border-t-4 border-t-brand rounded-xl p-6 flex flex-col gap-3">
      <h3 className="font-bold text-lg">ติดต่อ{dept.shortName || dept.name}</h3>
      {rows.length ? (
        <dl className="flex flex-col gap-3">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-2.5">
              <dt className="mt-1"><Icon className="w-5 h-5 text-brand-ink" strokeWidth={1.8} aria-label={label} /></dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-muted">ยังไม่มีข้อมูลติดต่อ</p>
      )}
      {c.email && (
        <a href={`mailto:${c.email}`} className="mt-auto flex items-center justify-center min-h-11 rounded-lg bg-gold text-gold-ink hover:text-gold-ink font-semibold">
          ส่งอีเมลถึงแผนก
        </a>
      )}
    </div>
  );
}

function Panel({ title, link, children }: { title: string; link: { href: string; label: string }; children: ReactNode }) {
  return (
    <div className="flex-[1_1_460px] min-w-0 bg-white border border-line rounded-xl p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[22px] font-bold">{title}</h2>
        <Link href={link.href} className="font-semibold text-[15px]">{link.label}</Link>
      </div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="text-muted text-center py-6">{children}</p>;
}

function LayerIllustration() {
  return (
    <svg viewBox="0 0 280 200" className="w-full max-w-[300px] h-auto" aria-hidden="true" fill="none">
      <path d="M140 20 L260 70 L140 120 L20 70 Z" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
      <path d="M70 70 L130 50 L190 80" stroke="#C7911B" strokeWidth={3} />
      <circle cx={70} cy={70} r={5} fill="#C7911B" />
      <circle cx={130} cy={50} r={5} fill="#C7911B" />
      <circle cx={190} cy={80} r={5} fill="#C7911B" />
      <path d="M20 105 L140 155 L260 105" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
      <path d="M20 135 L140 185 L260 135" stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
    </svg>
  );
}
