import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-2xl font-bold text-ink">ไม่พบหน้าที่ต้องการ</h1>
      <p className="text-sm text-muted">ลิงก์อาจไม่ถูกต้อง หรือหน่วยงานนี้ถูกนำออกจากระบบแล้ว</p>
      <Link href="/" className="mt-2 px-5 py-2 rounded-xl bg-brand hover:bg-brand-ink text-white hover:text-white text-sm font-semibold">
        กลับหน้าแรก
      </Link>
    </div>
  );
}
