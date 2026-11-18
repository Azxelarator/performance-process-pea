import type { Metadata } from "next";
import { DocumentBrowser } from "@/components/document-browser";
import { Breadcrumb, PageTitle } from "@/components/page-heading";
import { getDepartments, getDocuments } from "@/lib/data";

export const metadata: Metadata = { title: "เอกสารเผยแพร่" };

export default async function DocumentsPage() {
  const [documents, departments] = await Promise.all([getDocuments(), getDepartments()]);

  return (
    <>
      <Breadcrumb items={[{ label: "เอกสารเผยแพร่" }]} />
      <PageTitle title="เอกสารเผยแพร่" subtitle="ค้นหาและดาวน์โหลดคู่มือ แบบฟอร์ม รายงาน และประกาศของทุกแผนก" />
      <DocumentBrowser documents={documents} departments={departments.map((d) => ({ id: d.id, label: d.shortName || d.name }))} />
    </>
  );
}
