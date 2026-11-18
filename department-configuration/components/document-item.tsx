import { sanitizeUrl } from "@/lib/format";
import type { DocumentItem } from "@/lib/types";
import { DownloadIcon } from "./icons";

const FILE_BADGE: Record<string, string> = {
  pdf: "bg-file-pdf",
  docx: "bg-file-docx",
  xlsx: "bg-file-xlsx",
};

/** "PDF · 2.4 MB" so people know what they are about to download. */
export function fileInfo(doc: DocumentItem): string {
  return [doc.fileType?.toUpperCase(), doc.fileSize].filter(Boolean).join(" · ");
}

/** Paper-shaped badge with the extension at the bottom. */
export function FileBadge({ fileType, small = false }: { fileType?: string; small?: boolean }) {
  const type = (fileType || "pdf").toLowerCase();
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 flex items-end justify-center rounded-md text-white font-bold ${
        small ? "w-[34px] h-[42px] text-[10px] pb-[5px]" : "w-10 h-12 text-[11px] pb-1.5"
      } ${FILE_BADGE[type] ?? "bg-muted"}`}
    >
      {type.toUpperCase()}
    </span>
  );
}

/** "คู่มือ.pdf": title plus extension, without characters Windows forbids in file names. */
export function downloadName(doc: DocumentItem): string {
  const base = doc.title.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim() || "document";
  return doc.fileType ? `${base}.${doc.fileType.toLowerCase()}` : base;
}

export function DownloadButton({ doc }: { doc: DocumentItem }) {
  return (
    <a
      href={sanitizeUrl(doc.fileUrl)}
      // Browsers only honour this for same-origin files; cross-origin links keep the server's name.
      download={downloadName(doc)}
      aria-label={`ดาวน์โหลด ${doc.title}${doc.fileSize ? ` (${doc.fileType.toUpperCase()} ${doc.fileSize})` : ""}`}
      className="shrink-0 w-11 h-11 rounded-lg border border-line bg-white inline-flex items-center justify-center text-brand-ink transition-colors hover:bg-brand hover:text-white hover:border-brand active:scale-95"
    >
      <DownloadIcon className="w-[18px] h-[18px]" />
    </a>
  );
}

/** List row used in sidebars and on mobile. `meta` defaults to department · date. */
export function DocumentRow({ doc, meta }: { doc: DocumentItem; meta?: string }) {
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-line-soft last:border-b-0">
      <FileBadge fileType={doc.fileType} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[15px] leading-snug">{doc.title}</div>
        <div className="text-[13px] text-muted">
          {meta ?? [doc.deptName, doc.dateText || doc.publishedAt].filter(Boolean).join(" · ")}
          {doc.fileSize && <span className="whitespace-nowrap"> · {fileInfo(doc)}</span>}
        </div>
      </div>
      <DownloadButton doc={doc} />
    </div>
  );
}
