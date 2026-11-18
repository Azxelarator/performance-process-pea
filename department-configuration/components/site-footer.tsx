import Link from "next/link";
import { Logo } from "./site-header";

const footerLink = "text-on-brand hover:text-gold-soft no-underline";

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-brand-dark text-on-brand mt-auto focus-on-dark">
      <div className="max-w-300 mx-auto px-4 sm:px-6 pt-10 pb-6 flex flex-wrap justify-between gap-8">
        <div className="flex-[1_1_320px] min-w-0 space-y-3">
          <Logo light />
          <address className="not-italic text-[15px] leading-relaxed">
            สำนักงานใหญ่ การไฟฟ้าส่วนภูมิภาค
            <br />
            200 ถนนงามวงศ์วาน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900
            <br />
            โทร 1129 PEA Contact Center
          </address>
        </div>
        <nav aria-label="เมนูส่วนท้าย" className="flex-[0_1_200px] flex flex-col gap-1.5">
          <h2 className="font-bold text-white">เมนู</h2>
          <Link href="/" className={footerLink}>หน้าแรก</Link>
          <Link href="/#departments" className={footerLink}>หน่วยงานภายใน</Link>
          <Link href="/news" className={footerLink}>ข่าวและประกาศ</Link>
          <Link href="/documents" className={footerLink}>เอกสารเผยแพร่</Link>
        </nav>
        <nav aria-label="นโยบาย" className="flex-[0_1_220px] flex flex-col gap-1.5">
          <h2 className="font-bold text-white">นโยบาย</h2>
          <Link href="/policies#website" className={footerLink}>นโยบายเว็บไซต์</Link>
          <Link href="/policies#privacy" className={footerLink}>นโยบายคุ้มครองข้อมูลส่วนบุคคล</Link>
        </nav>
      </div>
      <div className="border-t border-white/20">
        <p className="max-w-300 mx-auto px-4 sm:px-6 py-3.5 text-sm">© 2569 การไฟฟ้าส่วนภูมิภาค สงวนลิขสิทธิ์</p>
      </div>
    </footer>
  );
}
