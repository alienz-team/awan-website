import { prisma, dbConfigured } from "@/lib/prisma";
import { saveProject, deleteProject } from "../../actions";
import { Card, Check, Field, H1, safe } from "@/components/admin/ui";
import ImageLines from "@/components/admin/ImageLines";

const CATS = [["VILLAS", "فلل خاصة"], ["APARTMENTS", "شقق سكنية"], ["COMMERCIAL", "مساحات تجارية ومكاتب"], ["RENOVATION", "مطابخ وحمامات / تجديد"]] as const;

type P = Awaited<ReturnType<typeof prisma.project.findMany>>[number];

function ProjectForm({ p }: { p?: P }) {
  const duration = (p?.specs as { duration?: string } | null)?.duration ?? "";
  return (
    <form action={saveProject} className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="id" defaultValue={p?.id ?? ""} />
      <Field label="العنوان (عربي)" name="titleAr" defaultValue={p?.titleAr} />
      <Field label="Title (EN)" name="titleEn" defaultValue={p?.titleEn} dir="ltr" />
      <Field label="الوصف (عربي)" name="descriptionAr" defaultValue={p?.descriptionAr} rows={3} />
      <Field label="Description (EN)" name="descriptionEn" defaultValue={p?.descriptionEn} rows={3} dir="ltr" />
      <label className="block text-sm"><span className="mb-1 block text-muted">التصنيف</span>
        <select name="category" defaultValue={p?.category ?? "VILLAS"} className="input">{CATS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
      <Field label="المساحة م²" name="areaM2" type="number" defaultValue={p?.areaM2 ?? 100} />
      <Field label="الموقع" name="location" defaultValue={p?.location} />
      <Field label="مدة التنفيذ" name="duration" defaultValue={duration} />
      <Field label="الترتيب" name="sortOrder" type="number" defaultValue={p?.sortOrder ?? 0} />
      <div className="flex items-end gap-6"><Check label="مميز" name="isFeatured" defaultChecked={p?.isFeatured} /><Check label="نشط" name="isActive" defaultChecked={p?.isActive ?? true} /></div>
      <div className="md:col-span-2"><ImageLines name="images" label="الصور (رابط في كل سطر)" defaultValue={p?.images.join("\n")} /></div>
      <div className="flex gap-3 md:col-span-2">
        <button className="btn">حفظ</button>
        {p && <button formAction={deleteProject} className="btn-ghost !border-red-500/60 text-red-500" formNoValidate>حذف</button>}
      </div>
    </form>
  );
}

export default async function ProjectsAdmin({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const list = dbConfigured
    ? await safe(() => prisma.project.findMany({ where: cat ? { category: cat as "VILLAS" } : undefined, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }), [])
    : [];
  return (
    <>
      <H1>إدارة المشاريع والأعمال</H1>
      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        <a href="/admin/projects" className={`border px-3 py-1.5 ${!cat ? "border-bronze" : "border-line"}`}>الكل</a>
        {CATS.map(([v, l]) => <a key={v} href={`?cat=${v}`} className={`border px-3 py-1.5 ${cat === v ? "border-bronze" : "border-line"}`}>{l}</a>)}
      </div>
      <div className="space-y-3">
        <Card title="＋ مشروع جديد" open={list.length === 0}><ProjectForm /></Card>
        {list.map((p) => (
          <Card key={p.id} title={<>{p.titleAr} <span className="text-muted">· {p.areaM2} م² {p.isFeatured && "★"} {!p.isActive && "(مخفي)"}</span></>}>
            <ProjectForm p={p} />
          </Card>
        ))}
      </div>
    </>
  );
}
