import { prisma, dbConfigured } from "@/lib/prisma";
import { saveService, deleteService } from "../../actions";
import { Card, Check, Field, H1, safe } from "@/components/admin/ui";
import ImageLines from "@/components/admin/ImageLines";

type S = Awaited<ReturnType<typeof prisma.service.findMany>>[number];

function ServiceForm({ s }: { s?: S }) {
  return (
    <form action={saveService} className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="id" defaultValue={s?.id ?? ""} />
      <Field label="العنوان (عربي)" name="titleAr" defaultValue={s?.titleAr} />
      <Field label="Title (EN)" name="titleEn" defaultValue={s?.titleEn} dir="ltr" />
      <Field label="الوصف (عربي)" name="descriptionAr" defaultValue={s?.descriptionAr} rows={3} />
      <Field label="Description (EN)" name="descriptionEn" defaultValue={s?.descriptionEn} rows={3} dir="ltr" />
      <Field label="المزايا (سطر لكل ميزة)" name="featuresAr" defaultValue={s?.featuresAr.join("\n")} rows={3} />
      <Field label="Features (one per line)" name="featuresEn" defaultValue={s?.featuresEn.join("\n")} rows={3} dir="ltr" />
      <div className="md:col-span-2"><ImageLines name="carouselImages" label="صور الكاروسيل (رابط في كل سطر)" defaultValue={s?.carouselImages.join("\n")} /></div>
      <Field label="الترتيب" name="sortOrder" type="number" defaultValue={s?.sortOrder ?? 0} />
      <div className="flex items-end gap-6"><Check label="مميزة" name="isFeatured" defaultChecked={s?.isFeatured} /><Check label="نشطة" name="isActive" defaultChecked={s?.isActive ?? true} /></div>
      <div className="flex gap-3 md:col-span-2">
        <button className="btn">حفظ</button>
        {s && <button formAction={deleteService} formNoValidate className="btn-ghost !border-red-500/60 text-red-500">حذف</button>}
      </div>
    </form>
  );
}

export default async function ServicesAdmin() {
  const list = dbConfigured ? await safe(() => prisma.service.findMany({ orderBy: { sortOrder: "asc" } }), []) : [];
  return (
    <>
      <H1>إدارة الخدمات والأقسام</H1>
      <div className="space-y-3">
        <Card title="＋ خدمة جديدة" open={list.length === 0}><ServiceForm /></Card>
        {list.map((s) => <Card key={s.id} title={s.titleAr}><ServiceForm s={s} /></Card>)}
      </div>
    </>
  );
}
