import type { Metadata } from "next";
import { Prompt, Sarabun } from "next/font/google";
import "./globals.css";

// PEA Brand Bible 2022: Prompt for online media (headings, logo text).
const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

// Body text stays in Sarabun, which reads more comfortably in long Thai paragraphs.
const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "พอร์ทัลหน่วยงานภายใน — การไฟฟ้าส่วนภูมิภาค",
    template: "%s — พอร์ทัลหน่วยงานภายใน กฟภ.",
  },
  description: "ศูนย์รวมข่าวสาร ประกาศ ผลงาน และเอกสารเผยแพร่ของทุกหน่วยงาน การไฟฟ้าส่วนภูมิภาค",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${prompt.variable} ${sarabun.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
