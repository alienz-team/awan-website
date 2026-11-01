"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Lang, Theme } from "@/lib/i18n";

type Ctx = { lang: Lang; theme: Theme; toggleLang: () => void; toggleTheme: () => void; t: (p: readonly [string, string]) => string };
const C = createContext<Ctx | null>(null);
export const useApp = () => {
  const v = useContext(C);
  if (!v) throw new Error("useApp outside Providers");
  return v;
};

function persist(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch {}
  document.cookie = `${key}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export default function Providers({ initialLang, initialTheme, children }: { initialLang: Lang; initialTheme: Theme; children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    try {
      const l = localStorage.getItem("lang") as Lang | null;
      const th = localStorage.getItem("theme") as Theme | null;
      if (l === "ar" || l === "en") setLang(l);
      if (th === "dark" || th === "light") setTheme(th);
    } catch {}
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
    el.dataset.theme = theme;
  }, [lang, theme]);

  const toggleLang = useCallback(() => setLang((l) => { const n = l === "ar" ? "en" : "ar"; persist("lang", n); return n; }), []);
  const toggleTheme = useCallback(() => setTheme((t) => { const n = t === "dark" ? "light" : "dark"; persist("theme", n); return n; }), []);
  const t = useCallback((p: readonly [string, string]) => (lang === "ar" ? p[0] : p[1]), [lang]);

  return <C.Provider value={{ lang, theme, toggleLang, toggleTheme, t }}>{children}</C.Provider>;
}
