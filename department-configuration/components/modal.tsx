"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CloseIcon } from "./icons";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  size?: "md" | "lg";
};

/** Native <dialog>: Escape, focus trapping and the backdrop come from the browser. */
export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Callers usually clear their content when closing; keep the last content so the
  // fade-out animation shows it instead of an empty box.
  const [last, setLast] = useState({ title, children });
  if (open && (last.title !== title || last.children !== children)) setLast({ title, children });
  const shown = open ? { title, children } : last;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`m-auto w-[calc(100%-2rem)] ${size === "lg" ? "max-w-3xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-0 text-ink modal`}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-line bg-tint">
        <h2 id={titleId} className="text-base font-bold text-brand-ink">{shown.title}</h2>
        <button type="button" onClick={onClose} aria-label="ปิด" className="w-10 h-10 -mr-2 rounded-lg flex items-center justify-center text-muted hover:bg-white">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6">{shown.children}</div>
    </dialog>
  );
}
