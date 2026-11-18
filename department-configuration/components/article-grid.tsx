"use client";

import { useState } from "react";
import { categoryName, formatDate, sanitizeUrl } from "@/lib/format";
import type { Article, Block } from "@/lib/types";
import { ArticleContent } from "./article-content";
import { MapIcon } from "./icons";
import { Modal } from "./modal";

function excerpt(blocks: Block[]): string {
  const first = blocks.find((b) => b.type === "paragraph" || b.type === "callout");
  return first && "text" in first ? first.text : "";
}

function Cover({ blocks }: { blocks: Block[] }) {
  const image = blocks.find((b) => b.type === "image");
  const [failed, setFailed] = useState(false);
  const src = image ? sanitizeUrl(image.url) : "#";

  if (!image || failed || src === "#") {
    return (
      <span className="h-44 flex items-center justify-center text-brand-ink/60 bg-[repeating-linear-gradient(45deg,#f1e8ee_0_12px,#f8f5f7_12px_24px)]">
        <MapIcon className="w-12 h-12" strokeWidth={1.4} />
      </span>
    );
  }
  return (
    // Editor-supplied URL, so next/image remotePatterns can't be known up front.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="h-44 w-full object-cover" />
  );
}

/** Design A "works" cards; clicking opens the full article (kept from the original app). */
export function ArticleGrid({ articles }: { articles: Article[] }) {
  const [selected, setSelected] = useState<Article | null>(null);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
        {articles.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setSelected(a)}
            className="text-left bg-white border border-line rounded-xl overflow-hidden flex flex-col hover:shadow-md motion-safe:hover:-translate-y-0.5 transition duration-200 group"
          >
            <Cover blocks={a.blocks ?? []} />
            <span className="p-[18px] flex flex-col gap-1.5">
              <span className="flex items-center gap-2 text-[13px] text-muted">
                {formatDate(a.updatedAt)}
                <span className="bg-chip text-chip-ink px-2 rounded-full">{categoryName(a.category)}</span>
              </span>
              <span className="font-bold text-lg leading-snug group-hover:text-brand-ink">{a.title}</span>
              <span className="text-[15px] text-muted line-clamp-2">{excerpt(a.blocks ?? [])}</span>
            </span>
          </button>
        ))}
      </div>

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected ? categoryName(selected.category) : ""} size="lg">
        {selected && (
          <article>
            <h1 className="text-2xl md:text-3xl font-bold leading-snug">{selected.title}</h1>
            <p className="text-sm text-muted mt-2 mb-6 pb-4 border-b border-line">อัปเดตเมื่อ {formatDate(selected.updatedAt)}</p>
            <ArticleContent blocks={selected.blocks} />
          </article>
        )}
      </Modal>
    </>
  );
}
