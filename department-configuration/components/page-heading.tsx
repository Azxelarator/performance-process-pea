import Link from "next/link";
import { Fragment } from "react";

type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "หน้าแรก", href: "/" }, ...items];
  return (
    <nav aria-label="breadcrumb" className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-3.5 text-sm text-muted flex flex-wrap gap-2">
      {all.map((c, i) => (
        <Fragment key={c.label}>
          {i > 0 && <span aria-hidden="true">›</span>}
          {c.href ? (
            <Link href={c.href} className="no-underline">{c.label}</Link>
          ) : (
            <span aria-current={i === all.length - 1 ? "page" : undefined} className={i === all.length - 1 ? "text-ink font-semibold" : ""}>
              {c.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="max-w-300 w-full mx-auto px-4 sm:px-6 pt-4 pb-2">
      <h1 className="text-[28px] sm:text-[34px] font-bold leading-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-muted text-[17px]">{subtitle}</p>}
    </section>
  );
}
