"use client";
import { useRef, useState } from "react";

/** Textarea of image URLs (one per line) with optional Supabase Storage upload. */
export default function ImageLines({ name, defaultValue = "", label, rows = 4 }: { name: string; defaultValue?: string; label: string; rows?: number }) {
  const [val, setVal] = useState(defaultValue);
  const [msg, setMsg] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setMsg("...");
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) { setMsg(j.error || "Upload failed"); return; }
      urls.push(j.url);
    }
    setVal((v) => [v.trim(), ...urls].filter(Boolean).join("\n"));
    setMsg(`✓ ${urls.length}`);
  }

  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted">{label}</span>
      <textarea name={name} rows={rows} value={val} onChange={(e) => setVal(e.target.value)} className="input" dir="ltr" placeholder="https://..." />
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      <button type="button" onClick={() => ref.current?.click()} className="btn-ghost mt-1 !py-1.5 text-xs">رفع صور / Upload</button>
      {msg && <span className="ms-2 text-xs text-muted">{msg}</span>}
    </label>
  );
}
