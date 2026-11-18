"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

export const inputClass =
  "w-full border border-field rounded-xl px-3.5 py-2 text-sm bg-white focus:ring-2 focus:ring-brand focus:border-brand disabled:bg-line-soft disabled:text-muted aria-invalid:border-alert aria-invalid:ring-1 aria-invalid:ring-alert";

export const primaryButton =
  "px-5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl text-sm font-semibold shadow-md transition-colors disabled:opacity-60 disabled:cursor-wait";

export const secondaryButton =
  "px-5 py-2.5 border border-field text-ink-2 rounded-xl text-sm font-medium hover:bg-canvas transition-colors";

// ─── Form validation (WCAG 3.3.1) ───────────────────────────────────
// Errors appear under the field, the field is marked aria-invalid and points at its
// message, and focus moves to the first invalid field so screen readers announce it.

export type FormErrors<K extends string = string> = Partial<Record<K, string>>;

const errorId = (id: string) => `${id}-error`;

/** Props for an input/select/textarea that can show an inline error. */
export function invalidProps(id: string, error: string | undefined) {
  return { id, "aria-invalid": error ? true : undefined, "aria-describedby": error ? errorId(id) : undefined };
}

/** Focuses the first field (in `order`) that has an error. */
export function focusFirstError<K extends string>(errors: FormErrors<K>, order: K[], idFor: (key: K) => string) {
  const first = order.find((key) => errors[key]);
  if (first) requestAnimationFrame(() => document.getElementById(idFor(first))?.focus());
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={errorId(id)} className="mt-1 text-xs font-semibold text-alert">
      {error}
    </p>
  );
}

type FieldProps = { label: string; required?: boolean; hint?: ReactNode; children: ReactNode; errorFor?: string; error?: string };

export function Field({ label, required, hint, children, errorFor, error }: FieldProps) {
  return (
    <div>
      <label className="block">
        <span className="block text-xs font-medium text-ink-2 mb-1">
          {label} {required && <span className="text-alert">*</span>}
        </span>
        {children}
        {hint && <span className="block text-[11px] text-muted mt-1 font-medium">{hint}</span>}
      </label>
      {errorFor && <FieldError id={errorFor} error={error} />}
    </div>
  );
}

export function Card({ title, children, className = "" }: { title?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-line p-6 ${className}`}>
      {title && <h3 className="text-base font-bold text-ink mb-4 pb-2 border-b border-line-soft">{title}</h3>}
      {children}
    </div>
  );
}

// ─── Toast ──────────────────────────────────────────────────────────

type Toast = { message: string; tone: "success" | "error" };
const ToastContext = createContext<(message: string, tone?: Toast["tone"]) => void>(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback((message: string, tone: Toast["tone"] = "success") => {
    clearTimeout(timer.current);
    setToast({ message, tone });
    // Errors stay until dismissed so nobody misses them; success messages fade after 3s.
    if (tone === "success") timer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="fixed bottom-6 right-6 z-[200] max-w-sm">
        {toast && (
          <div
            role={toast.tone === "error" ? "alert" : "status"}
            className={`flex items-start gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-fade-in ${toast.tone === "error" ? "bg-alert" : "bg-green-700"}`}
          >
            <span className="flex-1">{toast.message}</span>
            {toast.tone === "error" && (
              <button type="button" onClick={() => setToast(null)} className="-mr-2 -my-1 px-2 py-1 rounded underline underline-offset-2 hover:bg-white/15">
                ปิด
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
