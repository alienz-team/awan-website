import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Cairo, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { getSettings } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";
import type { Lang, Theme } from "@/lib/i18n";

const sans = Cairo({ subsets: ["arabic", "latin"], variable: "--font-sans", display: "swap" });
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-display", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(getSiteUrl()),
    title: s.seoTitle || `${s.brandNameAr} | ${s.brandNameEn}`,
    description: s.seoDescription,
    openGraph: { title: s.seoTitle, description: s.seoDescription, type: "website" },
  };
}
export const viewport: Viewport = { themeColor: "#0D0F12" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const lang: Lang = jar.get("lang")?.value === "en" ? "en" : "ar";
  const theme: Theme = jar.get("theme")?.value === "light" ? "light" : "dark";
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} data-theme={theme} className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <body>
        <Providers initialLang={lang} initialTheme={theme}>{children}</Providers>
      </body>
    </html>
  );
}
