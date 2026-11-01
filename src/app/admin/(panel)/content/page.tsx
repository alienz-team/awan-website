import { prisma, dbConfigured } from "@/lib/prisma";
import { saveHero, deleteHero, saveContent, seedHeroSlides } from "../../actions";
import { Card, Check, Field, H1, safe } from "@/components/admin/ui";
import { seedSettings } from "@/lib/seed-data";

type H = Awaited<ReturnType<typeof prisma.heroSlide.findMany>>[number];

function HeroForm({ h }: { h?: H }) {
  return (
    <form action={saveHero} className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="id" defaultValue={h?.id ?? ""} />
      <Field label="العنوان (عربي)" name="titleAr" defaultValue={h?.titleAr} />
      <Field label="Title (EN)" name="titleEn" defaultValue={h?.titleEn} dir="ltr" />
      <Field label="العنوان الفرعي (عربي)" name="subtitleAr" defaultValue={h?.subtitleAr} rows={2} />
      <Field label="Subtitle (EN)" name="subtitleEn" defaultValue={h?.subtitleEn} rows={2} dir="ltr" />
      <div className="md:col-span-2"><Field label="رابط الصورة (بدون أشخاص)" name="imageUrl" defaultValue={h?.imageUrl} dir="ltr" /></div>
      <Field label="نص الزر (عربي)" name="ctaTextAr" defaultValue={h?.ctaTextAr ?? "اطلب عرض سعر"} />
      <Field label="CTA text (EN)" name="ctaTextEn" defaultValue={h?.ctaTextEn ?? "Request a Quote"} dir="ltr" />
      <Field label="رابط الزر" name="ctaLink" defaultValue={h?.ctaLink ?? "#estimator"} dir="ltr" />
      <Field label="الترتيب (الأصغر أولًا)" name="sortOrder" type="number" defaultValue={h?.sortOrder ?? 0} />
      <Check label="نشطة" name="isActive" defaultChecked={h?.isActive ?? true} />
      <div className="flex gap-3 md:col-span-2">
        <button className="btn">حفظ</button>
        {h && <button formAction={deleteHero} formNoValidate className="btn-ghost !border-red-500/60 text-red-500">حذف</button>}
      </div>
    </form>
  );
}

export default async function ContentAdmin() {
  const [slides, settings] = dbConfigured
    ? await safe(() => prisma.$transaction([prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }), prisma.siteSettings.findUnique({ where: { id: "main" } })]), [[], null] as const)
    : ([[], null] as const);
  const st = settings ?? seedSettings;
  return (
    <>
      <H1>محرر محتوى الواجهة والهيرو</H1>
      <h2 className="mb-3 text-lg">من نحن وشريط الإعلان</h2>
      <form action={saveContent} className="mb-10 grid gap-4 border border-line bg-surface p-4 md:grid-cols-2">
        <Field label="من نحن (عربي)" name="aboutTextAr" defaultValue={st.aboutTextAr} rows={4} />
        <Field label="About (EN)" name="aboutTextEn" defaultValue={st.aboutTextEn} rows={4} dir="ltr" />
        <Field label="شريط الإعلان (عربي)" name="promoBannerAr" defaultValue={st.promoBannerAr} />
        <Field label="Announcement (EN)" name="promoBannerEn" defaultValue={st.promoBannerEn} dir="ltr" />
        <Check label="تفعيل شريط الإعلان" name="isPromoActive" defaultChecked={st.isPromoActive} />
        <div className="md:col-span-2"><button className="btn">حفظ</button></div>
      </form>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg">شرائح الهيرو ({slides.length})</h2>
        {slides.length === 0 && dbConfigured && <form action={seedHeroSlides}><button className="btn-ghost">تحميل الشرائح السبع الافتراضية</button></form>}
      </div>
      <div className="space-y-3">
        <Card title="＋ شريحة جديدة"><HeroForm /></Card>
        {slides.map((h) => <Card key={h.id} title={<>{h.sortOrder}. {h.titleAr}</>}><HeroForm h={h} /></Card>)}
      </div>
    </>
  );
}
