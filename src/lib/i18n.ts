export type Lang = "ar" | "en";
export type Theme = "dark" | "light";

export const dict = {
  nav: { services: ["الخدمات", "Services"], projects: ["الأعمال", "Projects"], estimator: ["حاسبة التكلفة", "Estimator"], about: ["من نحن", "About"], contact: ["تواصل", "Contact"] },
  hero: { scroll: ["اكتشف", "Discover"], whatsapp: ["واتساب", "WhatsApp"] },
  services: { eyebrow: ["ما نقدمه", "Capabilities"], title: ["أربع ركائز لمساحة متكاملة", "Four pillars of a complete space"] },
  projects: {
    eyebrow: ["معرض الأعمال", "Portfolio"], title: ["معرض المشاريع والأعمال المنجزة", "Selected completed works"],
    all: ["الكل", "All"], VILLAS: ["فلل خاصة", "Private Villas"], APARTMENTS: ["شقق سكنية", "Apartments"],
    COMMERCIAL: ["مساحات تجارية ومكاتب", "Commercial & Offices"], RENOVATION: ["مطابخ وحمامات", "Kitchens & Baths"],
    area: ["المساحة", "Area"], location: ["الموقع", "Location"], duration: ["مدة التنفيذ", "Duration"], scope: ["نطاق العمل", "Scope"],
    similar: ["طلب تشطيب مشابه عبر واتساب", "Request a similar finish on WhatsApp"], view: ["عرض المشروع", "View project"], close: ["إغلاق", "Close"],
  },
  est: {
    eyebrow: ["حاسبة التكلفة", "Cost Estimator"], title: ["حاسبة تكلفة التشطيب التقديرية", "Finishing cost estimator"],
    property: ["نوع العقار", "Property type"], villa: ["فيلا", "Villa"], apartment: ["شقة", "Apartment"], shop: ["محل تجاري", "Commercial shop"],
    area: ["المساحة (م²)", "Area (m²)"], level: ["مستوى التشطيب", "Finishing level"],
    luxury: ["لوكس", "Luxury"], deluxe: ["سوبر ديلوكس", "Super Deluxe"], vip: ["VIP ملكي", "Royal VIP"],
    result: ["التكلفة التقديرية", "Estimated cost"], note: ["تقدير أولي غير ملزم، يُحدَّد السعر النهائي بعد المعاينة.", "Indicative only; the final price is set after a site visit."],
    name: ["الاسم", "Name"], phone: ["رقم الهاتف", "Phone"], city: ["المدينة", "City"], send: ["إرسال التفاصيل عبر واتساب", "Send breakdown via WhatsApp"],
  },
  about: { eyebrow: ["من نحن", "About"] },
  footer: { rights: ["جميع الحقوق محفوظة", "All rights reserved"], follow: ["تابعنا على تيك توك", "Follow us on TikTok"] },
  dock: { call: ["اتصال", "Call"], wa: ["واتساب", "WhatsApp"], tiktok: ["تيك توك", "TikTok"], works: ["الأعمال", "Works"], top: ["أعلى", "Top"] },
} as const;

export const pick = (pair: readonly [string, string], lang: Lang) => (lang === "ar" ? pair[0] : pair[1]);
export const waLink = (number: string, text: string) => `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
export const LYD = (n: number, lang: Lang) => `${Math.round(n).toLocaleString(lang === "ar" ? "ar-LY" : "en-US")} ${lang === "ar" ? "د.ل" : "LYD"}`;

export const RATE_PER_M2 = { luxury: 650, deluxe: 900, vip: 1350 } as const;
export const PROPERTY_FACTOR = { villa: 1.1, apartment: 1, shop: 1.15 } as const;
export function estimate(property: keyof typeof PROPERTY_FACTOR, area: number, level: keyof typeof RATE_PER_M2) {
  const base = area * RATE_PER_M2[level] * PROPERTY_FACTOR[property];
  return { low: base * 0.9, high: base * 1.1, mid: base };
}
