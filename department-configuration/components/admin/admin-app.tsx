"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { refreshPortal } from "@/app/actions";
import { Modal } from "@/components/modal";
import { signInWithGoogle, signOutUser, watchAuth, type User } from "@/lib/supabase-auth";
import { deleteItem, fetchCollection, fetchUserPermission, hasAnyUsers, saveItem, seedMockData } from "@/lib/repository";
import type { Article, Department, DocumentItem, UserPermission } from "@/lib/types";
import { ArticleManager } from "./article-manager";
import { DepartmentEditor } from "./department-editor";
import { DocumentManager } from "./document-manager";
import { ToastProvider, errorMessage, primaryButton, secondaryButton, useToast } from "./ui";

type Session =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "denied"; user: User; canBootstrap: boolean }
  | { status: "ready"; user: User; permission: UserPermission };

type Data = { departments: Department[]; articles: Article[]; documents: DocumentItem[] };
type Tab = "articles" | "department" | "documents";
type PendingDelete = { kind: "articles"; item: Article } | { kind: "documents"; item: DocumentItem };

const TABS: { id: Tab; label: string }[] = [
  { id: "articles", label: "บทความและผลงาน" },
  { id: "department", label: "ข้อมูลและภารกิจแผนก" },
  { id: "documents", label: "คลังเอกสารเผยแพร่" },
];

async function loadData(): Promise<Data> {
  const [departments, articles, documents] = await Promise.all([
    fetchCollection("departments"),
    fetchCollection("articles"),
    fetchCollection("documents"),
  ]);
  return { departments, articles, documents };
}

async function resolveSession(user: User): Promise<Session> {
  const permission = await fetchUserPermission(user.email ?? "");
  if (permission) return { status: "ready", user, permission };
  const canBootstrap = !(await hasAnyUsers().catch(() => true));
  return { status: "denied", user, canBootstrap };
}

export function AdminApp() {
  return (
    <ToastProvider>
      <AdminShell />
    </ToastProvider>
  );
}

function AdminShell() {
  const toast = useToast();
  const [session, setSession] = useState<Session>({ status: "loading" });

  useEffect(
    () =>
      watchAuth(async (user) => {
        if (!user) return setSession({ status: "signed-out" });
        try {
          setSession(await resolveSession(user));
        } catch (error) {
          toast(`ตรวจสอบสิทธิ์ไม่สำเร็จ: ${errorMessage(error)}`, "error");
          setSession({ status: "denied", user, canBootstrap: false });
        }
      }),
    [toast],
  );

  async function signIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast(`เข้าสู่ระบบไม่สำเร็จ: ${errorMessage(error)}`, "error");
    }
  }

  async function bootstrap(user: User) {
    try {
      await seedMockData(user.email ?? "");
      toast("ตั้งค่า Super Admin และนำเข้าข้อมูลเริ่มต้นสำเร็จ");
      await refreshPortal();
      setSession(await resolveSession(user));
    } catch (error) {
      toast(`เกิดข้อผิดพลาด: ${errorMessage(error)}`, "error");
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-brand shadow-lg focus-on-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image src="/pea-logo.png" alt="ตราสัญลักษณ์การไฟฟ้าส่วนภูมิภาค" width={60} height={60} className="rounded-full bg-white ring-2 ring-white" />
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">ระบบจัดการข้อมูลพอร์ทัล</h1>
              <p className="text-gold-soft text-xs">Admin Management Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {session.status === "ready" && <UserBadge user={session.user} permission={session.permission} />}
            <Link href="/" className="text-on-brand hover:text-gold-soft text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10">
              กลับหน้าบ้าน
            </Link>
          </div>
        </div>
      </header>

      {session.status === "loading" && <p className="p-10 text-center text-sm text-muted">กำลังตรวจสอบสิทธิ์...</p>}
      {session.status === "signed-out" && <SignInPanel onSignIn={signIn} />}
      {session.status === "denied" && <DeniedPanel session={session} onBootstrap={() => bootstrap(session.user)} />}
      {session.status === "ready" && <Workspace permission={session.permission} />}
    </div>
  );
}

function UserBadge({ user, permission }: { user: User; permission: UserPermission }) {
  return (
    <div className="flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white">
      <div className="hidden sm:block text-left">
        <div className="font-bold leading-tight truncate max-w-32">{user.displayName || user.email}</div>
        <div className="text-[10px] text-gold-soft font-medium">
          {permission.role === "super_admin" ? "Super Admin" : `Editor: ${permission.departmentId}`}
        </div>
      </div>
      <button type="button" onClick={() => signOutUser()} className="text-on-brand hover:text-gold-soft underline-offset-2 hover:underline">
        ออกจากระบบ
      </button>
    </div>
  );
}

function AuthCard({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "red" }) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-brand-dark/95">
      <div className={`bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center space-y-5 border-2 ${tone === "red" ? "border-alert" : "border-gold"}`}>
        {children}
      </div>
    </div>
  );
}

function SignInPanel({ onSignIn }: { onSignIn: () => void }) {
  return (
    <AuthCard>
      <div>
        <h2 className="text-2xl font-bold text-ink">ระบบจัดการข้อมูลพอร์ทัล</h2>
        <p className="text-xs text-brand-ink font-medium mt-1">การไฟฟ้าส่วนภูมิภาค (PEA)</p>
        <p className="text-xs text-muted mt-2">กรุณาเข้าสู่ระบบด้วยบัญชี Google เพื่อยืนยันสิทธิ์การเข้าถึง</p>
      </div>
      <button
        type="button"
        onClick={onSignIn}
        className="w-full py-3 px-4 rounded-xl border border-field hover:border-brand bg-white hover:bg-tint text-ink-2 font-semibold text-sm transition-colors flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        เข้าสู่ระบบด้วย Google
      </button>
    </AuthCard>
  );
}

function DeniedPanel({ session, onBootstrap }: { session: Extract<Session, { status: "denied" }>; onBootstrap: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  return (
    <AuthCard tone="red">
      <div>
        <h2 className="text-xl font-bold text-ink">ไม่มีสิทธิ์เข้าถึงระบบแอดมิน</h2>
        <p className="text-xs text-muted mt-2">
          บัญชี <span className="font-bold text-alert">{session.user.email}</span> ยังไม่ได้รับสิทธิ์เข้าใช้งาน
        </p>
        <p className="text-[11px] text-muted mt-1">กรุณาติดต่อ Super Admin เพื่อเพิ่มสิทธิ์ในตาราง &quot;user_permissions&quot;</p>
      </div>
      {session.canBootstrap && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-2 text-left">
          <p className="font-bold">ระบบยังไม่มีผู้ดูแล</p>
          <p className="text-[11px] text-amber-800">ลงทะเบียนบัญชีนี้เป็น Super Admin และนำเข้าข้อมูลเริ่มต้นได้</p>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await onBootstrap();
              setBusy(false);
            }}
            className="w-full py-2 px-3 rounded-lg bg-gold hover:brightness-95 text-gold-ink font-bold text-xs disabled:opacity-60"
          >
            {busy ? "กำลังตั้งค่าระบบ..." : "ตั้งค่าบัญชีนี้เป็น Super Admin"}
          </button>
        </div>
      )}
      <div className="flex gap-2 justify-center">
        <button type="button" onClick={() => signOutUser()} className={secondaryButton}>ออกจากระบบ</button>
        <Link href="/" className={primaryButton}>กลับหน้าบ้าน</Link>
      </div>
    </AuthCard>
  );
}

function Workspace({ permission }: { permission: UserPermission }) {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("articles");
  const [data, setData] = useState<Data | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [seeding, setSeeding] = useState(false);

  const isSuperAdmin = permission.role === "super_admin";
  const lockedDept = isSuperAdmin ? null : permission.departmentId;

  const reload = useCallback(() => loadData().then(setData), []);
  useEffect(() => {
    reload();
  }, [reload]);

  /** Runs a write, refreshes public pages and reports the result. Resolves to `true` on success. */
  async function write(task: () => Promise<void>, success: string): Promise<boolean> {
    try {
      await task();
    } catch (error) {
      toast(`บันทึกไม่สำเร็จ: ${errorMessage(error)}`, "error");
      return false;
    }
    toast(success);
    await refreshPortal().catch(() => {}); // cache refresh is best-effort
    return true;
  }

  const upsert = <T extends { id: string }>(list: T[], item: T) =>
    list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];

  async function confirmDelete() {
    if (!pendingDelete) return;
    const { kind, item } = pendingDelete;
    setPendingDelete(null);
    if (await write(() => deleteItem(kind, item.id), "ลบเรียบร้อยแล้ว")) {
      setData((d) => d && { ...d, [kind]: (d[kind] as { id: string }[]).filter((x) => x.id !== item.id) });
    }
  }

  async function seed() {
    if (!window.confirm("นำเข้าข้อมูลตัวอย่างเข้าสู่ Supabase? ข้อมูลที่มี id ซ้ำจะถูกเขียนทับ")) return;
    setSeeding(true);
    if (await write(() => seedMockData(permission.email), "นำเข้าข้อมูลตัวอย่างเรียบร้อยแล้ว")) await reload();
    setSeeding(false);
  }

  if (!data) return <p className="p-10 text-center text-sm text-muted">กำลังโหลดข้อมูล...</p>;

  const scoped = <T extends { department: string }>(items: T[]) => (lockedDept ? items.filter((i) => i.department === lockedDept) : items);

  return (
    <>
      <nav className="bg-brand border-t border-white/15 focus-on-dark" aria-label="ส่วนจัดการ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4 sm:gap-6 overflow-x-auto text-sm">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-current={tab === t.id ? "page" : undefined}
              onClick={() => setTab(t.id)}
              className={`py-2.5 px-2 whitespace-nowrap border-b-3 transition-colors ${
                tab === t.id ? "border-gold text-white font-bold" : "border-transparent text-on-brand hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {isSuperAdmin && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={seed}
              disabled={seeding}
              className="bg-gold hover:brightness-95 text-gold-ink font-bold px-4 py-2 rounded-xl shadow text-xs disabled:opacity-60"
            >
              {seeding ? "กำลังนำเข้าข้อมูล..." : "นำเข้าข้อมูลตัวอย่าง (Mock Data)"}
            </button>
          </div>
        )}

        {tab === "articles" && (
          <ArticleManager
            articles={scoped(data.articles)}
            departments={data.departments}
            lockedDept={lockedDept}
            onDelete={(item) => setPendingDelete({ kind: "articles", item })}
            onSave={async (article) => {
              const ok = await write(() => saveItem("articles", article), "บันทึกบทความเรียบร้อยแล้ว");
              if (ok) setData((d) => d && { ...d, articles: upsert(d.articles, article) });
              return ok;
            }}
          />
        )}
        {tab === "department" && (
          <DepartmentEditor
            departments={data.departments}
            lockedDept={lockedDept}
            onSave={async (dept) => {
              const ok = await write(() => saveItem("departments", dept), "บันทึกข้อมูลแผนกเรียบร้อยแล้ว");
              if (ok) setData((d) => d && { ...d, departments: upsert(d.departments, dept) });
              return ok;
            }}
          />
        )}
        {tab === "documents" && (
          <DocumentManager
            documents={scoped(data.documents)}
            departments={data.departments}
            lockedDept={lockedDept}
            onDelete={(item) => setPendingDelete({ kind: "documents", item })}
            onSave={async (doc) => {
              const ok = await write(() => saveItem("documents", doc), "บันทึกเอกสารเรียบร้อยแล้ว");
              if (ok) setData((d) => d && { ...d, documents: upsert(d.documents, doc) });
              return ok;
            }}
          />
        )}
      </div>

      <Modal open={pendingDelete !== null} onClose={() => setPendingDelete(null)} title="ยืนยันการลบ">
        <p className="text-sm text-muted">
          ต้องการลบ &quot;{pendingDelete?.item.title}&quot; หรือไม่? การกระทำนี้ย้อนกลับไม่ได้
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={() => setPendingDelete(null)} className={secondaryButton}>ยกเลิก</button>
          <button type="button" onClick={confirmDelete} className="px-5 py-2.5 bg-alert hover:bg-red-700 text-white rounded-xl text-sm font-semibold">
            ลบ
          </button>
        </div>
      </Modal>
    </>
  );
}
