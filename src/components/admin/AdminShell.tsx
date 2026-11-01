import Link from "next/link";
import { BarChart3, FileText, FolderKanban, LayoutTemplate, LogOut, Settings, Wrench } from "lucide-react";
import { logout } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "لوحة الإحصائيات", icon: BarChart3 },
  { href: "/admin/projects", label: "المشاريع والأعمال", icon: FolderKanban },
  { href: "/admin/services", label: "الخدمات والأقسام", icon: Wrench },
  { href: "/admin/content", label: "محتوى الواجهة والهيرو", icon: LayoutTemplate },
  { href: "/admin/quotes", label: "طلبات الأسعار والمعاينات", icon: FileText },
  { href: "/admin/settings", label: "إعدادات المنصة والتواصل", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-bg text-ink md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-surface p-4 md:min-h-screen md:border-b-0 md:border-e">
        <p className="mb-4 font-display text-xl">أوان<span className="text-bronze">.</span> <span className="text-sm text-muted">Admin</span></p>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {NAV.map(({ href, label, icon: I }) => (
            <Link key={href} href={href} className="flex shrink-0 items-center gap-2 px-3 py-2.5 text-sm hover:bg-bg"><I size={16} className="text-bronze" />{label}</Link>
          ))}
          <Link href="/" target="_blank" className="flex shrink-0 items-center gap-2 px-3 py-2.5 text-sm text-muted hover:bg-bg">↗ الموقع</Link>
        </nav>
        <form action={logout} className="mt-4"><button className="btn-ghost w-full !py-2"><LogOut size={14} />خروج</button></form>
      </aside>
      <main className="min-w-0 p-4 md:p-8">{children}</main>
    </div>
  );
}
