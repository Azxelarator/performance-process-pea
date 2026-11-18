import type { Metadata } from "next";
import { Breadcrumb, PageTitle } from "@/components/page-heading";

export const metadata: Metadata = { title: "นโยบายเว็บไซต์" };

// Placeholder until the organisation supplies the approved policy text.
const POLICIES = [
  { id: "website", title: "นโยบายเว็บไซต์" },
  { id: "privacy", title: "นโยบายคุ้มครองข้อมูลส่วนบุคคล" },
];

export default function PoliciesPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "นโยบาย" }]} />
      <PageTitle title="นโยบาย" />
      <div className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-5">
        {POLICIES.map((p) => (
          <section key={p.id} id={p.id} className="bg-white border border-line rounded-xl p-6">
            <h2 className="text-[22px] font-bold">{p.title}</h2>
            <p className="mt-2 text-muted">อยู่ระหว่างจัดทำ — เนื้อหาฉบับทางการจะเผยแพร่เมื่อได้รับการอนุมัติจากหน่วยงาน</p>
          </section>
        ))}
      </div>
    </>
  );
}
