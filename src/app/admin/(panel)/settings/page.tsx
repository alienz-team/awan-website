import { prisma, dbConfigured } from "@/lib/prisma";
import { saveSettings } from "../../actions";
import { Field, H1, safe } from "@/components/admin/ui";
import { seedSettings } from "@/lib/seed-data";

export default async function SettingsAdmin() {
  const s = (dbConfigured ? await safe(() => prisma.siteSettings.findUnique({ where: { id: "main" } }), null) : null) ?? seedSettings;
  return (
    <>
      <H1>إعدادات المنصة والتواصل</H1>
      <form action={saveSettings} className="grid gap-4 border border-line bg-surface p-4 md:grid-cols-2">
        <Field label="اسم العلامة (عربي)" name="brandNameAr" defaultValue={s.brandNameAr} />
        <Field label="Brand (EN)" name="brandNameEn" defaultValue={s.brandNameEn} dir="ltr" />
        <Field label="الشعار (عربي)" name="sloganAr" defaultValue={s.sloganAr} />
        <Field label="Slogan (EN)" name="sloganEn" defaultValue={s.sloganEn} dir="ltr" />
        <Field label="واتساب (بصيغة دولية 218…)" name="whatsappNumber" defaultValue={s.whatsappNumber} dir="ltr" />
        <Field label="الهاتف" name="phoneNumber" defaultValue={s.phoneNumber} dir="ltr" />
        <Field label="البريد" name="email" defaultValue={s.email} dir="ltr" />
        <Field label="تيك توك" name="tiktokUrl" defaultValue={s.tiktokUrl} dir="ltr" />
        <Field label="العنوان (عربي)" name="addressAr" defaultValue={s.addressAr} />
        <Field label="Address (EN)" name="addressEn" defaultValue={s.addressEn} dir="ltr" />
        <Field label="SEO Title" name="seoTitle" defaultValue={s.seoTitle} />
        <Field label="SEO Description" name="seoDescription" defaultValue={s.seoDescription} rows={2} />
        <div className="md:col-span-2"><button className="btn">حفظ ونشر على الموقع</button></div>
      </form>
    </>
  );
}
