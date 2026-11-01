import AdminShell from "@/components/admin/AdminShell";
import { assertAdmin } from "@/lib/admin-guard";
import { dbConfigured } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "AWAN Admin", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await assertAdmin();
  return (
    <AdminShell>
      {!dbConfigured && (
        <p className="mb-6 border border-bronze p-3 text-sm">⚠ DATABASE_URL غير مضبوط — الموقع يعرض البيانات الافتراضية ولن تُحفظ التعديلات. / DATABASE_URL is not set: showing seed data, edits cannot be saved.</p>
      )}
      {children}
    </AdminShell>
  );
}
