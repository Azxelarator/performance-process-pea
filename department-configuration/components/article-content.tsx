"use client";

import { useState } from "react";
import { sanitizeUrl } from "@/lib/format";
import type { Block, CalloutTone } from "@/lib/types";

const CALLOUT: Record<CalloutTone, { box: string; icon: string; path: string }> = {
  info: {
    box: "border-brand bg-tint",
    icon: "text-brand-ink",
    path: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
  },
  warning: {
    box: "border-amber-400 bg-amber-50",
    icon: "text-amber-600",
    path: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
  },
  success: {
    box: "border-green-400 bg-green-50",
    icon: "text-green-600",
    path: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
  },
};

function BlockImage({ url, caption }: { url: string; caption: string }) {
  const [failed, setFailed] = useState(false);
  const src = sanitizeUrl(url);
  return (
    <figure className="mb-4">
      {failed || src === "#" ? (
        <div className="w-full aspect-[2/1] rounded-lg border border-line bg-tint text-brand-ink text-sm flex items-center justify-center">
          ไม่สามารถโหลดรูปภาพได้
        </div>
      ) : (
        // Arbitrary editor-supplied URLs, so next/image remotePatterns can't be known up front.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={caption}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full rounded-lg border border-line"
        />
      )}
      {caption && <figcaption className="text-sm text-muted mt-2 text-center italic">{caption}</figcaption>}
    </figure>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return <p className="text-ink-2 leading-relaxed mb-4">{block.text}</p>;
    case "callout": {
      const tone = CALLOUT[block.icon] ?? CALLOUT.info;
      return (
        <div className={`border-l-4 p-4 rounded-r-lg mb-4 flex gap-3 ${tone.box}`}>
          <svg className={`w-5 h-5 shrink-0 mt-0.5 ${tone.icon}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d={tone.path} />
          </svg>
          <p className="text-ink-2 leading-relaxed">{block.text}</p>
        </div>
      );
    }
    case "image":
      // key resets the error state when the editor changes the URL
      return <BlockImage key={block.url} url={block.url} caption={block.caption} />;
    case "list": {
      const List = block.style === "ordered" ? "ol" : "ul";
      return (
        <List className={`${block.style === "ordered" ? "list-decimal" : "list-disc"} list-inside space-y-1 mb-4 pl-2`}>
          {block.items.map((item, i) => (
            <li key={i} className="text-ink-2 leading-relaxed">{item}</li>
          ))}
        </List>
      );
    }
    default:
      return null;
  }
}

export function ArticleContent({ blocks }: { blocks: Block[] | undefined }) {
  if (!blocks?.length) return <p className="text-muted italic">ยังไม่มีเนื้อหา</p>;
  return (
    <>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </>
  );
}
