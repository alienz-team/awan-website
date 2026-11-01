import type { ReactNode } from "react";

export function Field({ label, name, defaultValue, type = "text", rows, dir }: { label: string; name: string; defaultValue?: string | number | null; type?: string; rows?: number; dir?: "ltr" | "rtl" }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted">{label}</span>
      {rows ? <textarea name={name} rows={rows} defaultValue={defaultValue ?? ""} dir={dir} className="input" />
        : <input name={name} type={type} defaultValue={defaultValue ?? ""} dir={dir} className="input" />}
    </label>
  );
}
export function Check({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return <label className="flex items-center gap-2 text-sm"><input type="checkbox" name={name} defaultChecked={defaultChecked} className="accent-[rgb(var(--bronze))]" />{label}</label>;
}
export function Card({ title, children, open }: { title: ReactNode; children: ReactNode; open?: boolean }) {
  return (
    <details open={open} className="border border-line bg-surface">
      <summary className="cursor-pointer p-4 text-sm font-medium">{title}</summary>
      <div className="border-t border-line p-4">{children}</div>
    </details>
  );
}
export function H1({ children }: { children: ReactNode }) {
  return <h1 className="mb-6 font-display text-3xl">{children}</h1>;
}
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn(); } catch (e) { console.error("[admin]", e); return fallback; }
}
