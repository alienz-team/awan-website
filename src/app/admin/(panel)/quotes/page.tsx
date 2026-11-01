import { prisma, dbConfigured } from "@/lib/prisma";
import { setQuoteStatus, deleteQuote } from "../../actions";
import { H1, safe } from "@/components/admin/ui";
import { waLink } from "@/lib/i18n";

const STATUSES = [["PENDING", "معلّق"], ["CONTACTED", "تم التواصل"], ["SITE_VISIT_SCHEDULED", "معاينة مجدولة"], ["COMPLETED", "مكتمل"], ["CANCELLED", "ملغي"]] as const;

export default async function QuotesAdmin() {
  const list = dbConfigured ? await safe(() => prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 200 }), []) : [];
  return (
    <>
      <H1>طلبات عروض الأسعار والمعاينات</H1>
      {list.length === 0 && <p className="text-muted">لا توجد طلبات بعد.</p>}
      <div className="space-y-3">
        {list.map((q) => {
          const msg = `مرحبًا ${q.clientName}، بخصوص طلبك لتشطيب ${q.propertyType} بمساحة ${q.areaM2} م² (مستوى ${q.finishingLevel}${q.budgetLyd ? `، تقدير ${q.budgetLyd} د.ل` : ""}) من أوان للتشطيبات والديكور. نود تحديد موعد معاينة.`;
          return (
            <div key={q.id} className="grid gap-3 border border-line bg-surface p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="text-sm">
                <p className="text-base font-medium">{q.clientName} <span className="text-muted" dir="ltr">· {q.clientPhone}</span></p>
                <p className="mt-1 text-muted">{q.city || "—"} · {q.propertyType} · {q.areaM2} م² · {q.finishingLevel}{q.budgetLyd ? ` · ≈ ${q.budgetLyd.toLocaleString("en-US")} LYD` : ""}</p>
                <p className="mt-1 text-xs text-muted">{q.createdAt.toLocaleString("ar-LY")}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <form action={setQuoteStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={q.id} />
                  <select name="status" defaultValue={q.status} className="input !w-auto">{STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                  <button className="btn-ghost">تحديث</button>
                </form>
                <a href={waLink(q.clientPhone.startsWith("0") ? "218" + q.clientPhone.slice(1) : q.clientPhone, msg)} target="_blank" rel="noopener noreferrer" className="btn !bg-[#25D366] !border-[#25D366] !text-black">واتساب</a>
                <form action={deleteQuote}><input type="hidden" name="id" value={q.id} /><button className="btn-ghost text-red-500">حذف</button></form>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
