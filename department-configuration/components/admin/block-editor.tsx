"use client";

import { ArrowDownIcon, ArrowUpIcon, CloseIcon } from "@/components/icons";
import type { Block, BlockType } from "@/lib/types";
import { inputClass } from "./ui";

const BLOCK_META: Record<BlockType, { label: string; color: string; button: string; create: () => Block }> = {
  paragraph: {
    label: "ย่อหน้า",
    color: "text-brand-ink",
    button: "bg-tint hover:bg-tint text-brand-ink border-line",
    create: () => ({ type: "paragraph", text: "" }),
  },
  callout: {
    label: "กรอบข้อความ",
    color: "text-amber-600",
    button: "bg-amber-50 hover:bg-amber-100 text-muted border-amber-200",
    create: () => ({ type: "callout", icon: "info", text: "" }),
  },
  image: {
    label: "รูปภาพ",
    color: "text-green-600",
    button: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200",
    create: () => ({ type: "image", url: "", caption: "" }),
  },
  list: {
    label: "รายการ",
    color: "text-blue-600",
    button: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
    create: () => ({ type: "list", style: "unordered", items: [""] }),
  },
};

const iconButton = "p-1 rounded hover:bg-line transition-colors disabled:opacity-30 disabled:cursor-not-allowed";

export function BlockEditor({ blocks, onChange }: { blocks: Block[]; onChange: (blocks: Block[]) => void }) {
  const update = (index: number, block: Block) => onChange(blocks.map((b, i) => (i === index ? block : b)));
  const remove = (index: number) => onChange(blocks.filter((_, i) => i !== index));
  const move = (index: number, delta: -1 | 1) => {
    const next = [...blocks];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange(next);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-line">
        {(Object.keys(BLOCK_META) as BlockType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange([...blocks, BLOCK_META[type].create()])}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${BLOCK_META[type].button}`}
          >
            + เพิ่ม{BLOCK_META[type].label}
          </button>
        ))}
      </div>

      {blocks.length === 0 ? (
        <p className="text-center py-8 text-muted text-xs">คลิกปุ่มด้านบนเพื่อเริ่มเพิ่มเนื้อหาทีละบล็อก</p>
      ) : (
        <ol className="space-y-4">
          {blocks.map((block, index) => (
            <li key={index} className="border border-line rounded-xl p-4 bg-canvas">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-line">
                <span className={`text-xs font-semibold uppercase tracking-wider ${BLOCK_META[block.type].color}`}>
                  {BLOCK_META[block.type].label}
                </span>
                <div className="flex items-center gap-1">
                  <button type="button" className={iconButton} disabled={index === 0} onClick={() => move(index, -1)} aria-label="เลื่อนขึ้น">
                    <ArrowUpIcon className="w-4 h-4" />
                  </button>
                  <button type="button" className={iconButton} disabled={index === blocks.length - 1} onClick={() => move(index, 1)} aria-label="เลื่อนลง">
                    <ArrowDownIcon className="w-4 h-4" />
                  </button>
                  <button type="button" className={`${iconButton} text-red-500 hover:bg-red-100`} onClick={() => remove(index)} aria-label="ลบบล็อก">
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <BlockFields block={block} onChange={(b) => update(index, b)} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function BlockFields({ block, onChange }: { block: Block; onChange: (block: Block) => void }) {
  switch (block.type) {
    case "paragraph":
      return (
        <textarea
          aria-label="เนื้อหาย่อหน้า"
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="พิมพ์เนื้อหาย่อหน้า..."
          className={`${inputClass} resize-y min-h-20`}
        />
      );
    case "callout":
      return (
        <div className="space-y-2">
          <select
            aria-label="รูปแบบกรอบข้อความ"
            value={block.icon}
            onChange={(e) => onChange({ ...block, icon: e.target.value as typeof block.icon })}
            className={`${inputClass} sm:w-48`}
          >
            <option value="info">ข้อมูล (Info)</option>
            <option value="warning">คำเตือน (Warning)</option>
            <option value="success">สำเร็จ (Success)</option>
          </select>
          <textarea
            aria-label="ข้อความในกรอบ"
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="พิมพ์ข้อความในกรอบ..."
            className={`${inputClass} resize-y min-h-16`}
          />
        </div>
      );
    case "image":
      return (
        <div className="space-y-2">
          <input
            type="url"
            aria-label="URL รูปภาพ"
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className={inputClass}
          />
          <input
            aria-label="คำอธิบายใต้ภาพ"
            value={block.caption}
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
            placeholder="คำอธิบายใต้ภาพ"
            className={inputClass}
          />
        </div>
      );
    case "list": {
      const setItems = (items: string[]) => onChange({ ...block, items });
      return (
        <div className="space-y-2">
          <select
            aria-label="รูปแบบรายการ"
            value={block.style}
            onChange={(e) => onChange({ ...block, style: e.target.value as typeof block.style })}
            className={`${inputClass} sm:w-48`}
          >
            <option value="unordered">หัวข้อย่อย (Bullet)</option>
            <option value="ordered">ลำดับเลข (Numbered)</option>
          </select>
          {block.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-muted text-xs w-6 text-right shrink-0">{block.style === "ordered" ? `${i + 1}.` : "•"}</span>
              <input
                aria-label={`รายการที่ ${i + 1}`}
                value={item}
                onChange={(e) => setItems(block.items.map((v, j) => (j === i ? e.target.value : v)))}
                placeholder={`รายการที่ ${i + 1}`}
                className={`${inputClass} py-1.5 text-xs`}
              />
              <button
                type="button"
                className={`${iconButton} text-red-400 hover:bg-red-50`}
                disabled={block.items.length <= 1}
                onClick={() => setItems(block.items.filter((_, j) => j !== i))}
                aria-label="ลบรายการ"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setItems([...block.items, ""])}
            className="text-blue-600 hover:text-blue-800 text-xs font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
          >
            + เพิ่มรายการ
          </button>
        </div>
      );
    }
  }
}
