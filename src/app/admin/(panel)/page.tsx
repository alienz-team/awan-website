import Link from "next/link";
import { prisma, dbConfigured } from "@/lib/prisma";
import { H1, safe } from "@/components/admin/ui";

export default async function Dashboard() {
  const [projects, services, quotes, slides] = dbConfigured
    ? await safe(() => prisma.$transaction([
        prisma.project.count(),
        prisma.service.count({ where: { isActive: true } }),
        prisma.quoteRequest.count({ where: { status: "PENDING" } }),
        prisma.heroSlide.count(),
      ]), [0, 0, 0, 0])
    : [0, 0, 0, 0];
  const kpis = [
    ["إجمالي المشاريع", projects, "/admin/projects"],
    ["الخدمات النشطة", services, "/admin/services"],
    ["طلبات أسعار معلّقة", quotes, "/admin/quotes"],
    ["شرائح الهيرو", slides, "/admin/content"],
  ] as const;
  return (
    <>
      <H1>لوحة الإحصائيات</H1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([l, v, h]) => (
          <Link key={l} href={h} className="border border-line bg-surface p-6 transition hover:border-bronze">
            <p className="text-sm text-muted">{l}</p><p className="mt-2 font-display text-5xl">{v}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/projects" className="btn">+ مشروع جديد</Link>
        <Link href="/admin/quotes" className="btn-ghost">مراجعة الطلبات</Link>
        <Link href="/admin/settings" className="btn-ghost">إعدادات التواصل</Link>
      </div>
    </>
  );
}
