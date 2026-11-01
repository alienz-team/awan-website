const u = (id: string, w = 1800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

export const IMG = {
  living: "1600210492486-724fe5c67fb0",
  kitchen: "1600585154340-be6161a56a0c",
  suite: "1600607687939-ce8a6c25118c",
  bath: "1552321554-5fefe8c9ef14",
  panel: "1618221195710-dd6b41faaea6",
  office: "1497366216548-37526070297c",
  facade: "1600596542815-ffad4c1539a9",
};

export type Category = "VILLAS" | "APARTMENTS" | "COMMERCIAL" | "RENOVATION";
export type HeroSlideT = { id: string; titleAr: string; titleEn: string; subtitleAr: string; subtitleEn: string; imageUrl: string; ctaTextAr: string; ctaTextEn: string; ctaLink: string; sortOrder: number; isActive: boolean };
export type ServiceT = { id: string; titleAr: string; titleEn: string; slug: string; descriptionAr: string; descriptionEn: string; featuresAr: string[]; featuresEn: string[]; carouselImages: string[]; isFeatured: boolean; sortOrder: number; isActive: boolean };
export type ProjectT = { id: string; titleAr: string; titleEn: string; slug: string; descriptionAr: string; descriptionEn: string; category: Category; areaM2: number; location: string; images: string[]; specs: Record<string, string> | null; isFeatured: boolean; sortOrder: number; isActive: boolean };
export type SettingsT = { brandNameAr: string; brandNameEn: string; sloganAr: string; sloganEn: string; aboutTextAr: string; aboutTextEn: string; whatsappNumber: string; phoneNumber: string; email: string; addressAr: string; addressEn: string; tiktokUrl: string; promoBannerAr: string; promoBannerEn: string; isPromoActive: boolean; seoTitle: string; seoDescription: string };

const heroDefs: [string, string, string, string, string][] = [
  [IMG.living, "صالة معيشة معمارية بإضاءة غير مباشرة", "Minimalist Architectural Living Room", "إضاءة مخفية وخامات هادئة تصنع مساحة تُشبهك.", "Indirect lighting and quiet materials shape a space that is yours."],
  [IMG.kitchen, "مطبخ فاخر بجزيرة وتفاصيل ترافرتين", "Luxury Kitchen with Travertine Island", "تصميم مطابخ عصرية بأدق التفاصيل.", "Contemporary kitchens crafted to the finest detail."],
  [IMG.suite, "جناح بالميكروسمنت والخشب الطبيعي", "Micro-Cement & Natural Wood Suite", "ملمس خام ودفء الخشب في تناغم تام.", "Raw texture and warm timber in perfect balance."],
  [IMG.bath, "حمام رئيسي بحوض مستقل ورخام", "Master Bathroom in Marble", "أجنحة استحمام فاخرة بروح المنتجعات.", "Spa-grade bathrooms with freestanding tubs and marble."],
  [IMG.panel, "تكسيات جدارية وأبواب مخفية وخشب مجرّد", "Bespoke Paneling & Fluted Wood", "تفاصيل نجارة مصممة خصيصًا لمساحتك.", "Joinery details made specifically for your space."],
  [IMG.office, "مكاتب تنفيذية وصالات استقبال", "Executive Office & Lounge", "مساحات تجارية تعكس هوية علامتك.", "Commercial interiors that express your brand."],
  [IMG.facade, "واجهات معمارية وإضاءة المناظر الطبيعية", "Architectural Facade & Landscape Lighting", "من الواجهة إلى الحديقة، رؤية متكاملة.", "From facade to garden, one integrated vision."],
];

export const seedHero: HeroSlideT[] = heroDefs.map(([img, ta, te, sa, se], i) => ({
  id: `hero-${i + 1}`, titleAr: ta, titleEn: te, subtitleAr: sa, subtitleEn: se, imageUrl: u(img),
  ctaTextAr: "اطلب عرض سعر", ctaTextEn: "Request a Quote", ctaLink: "#estimator", sortOrder: i, isActive: true,
}));

export const seedServices: ServiceT[] = [
  { id: "s1", slug: "turnkey", titleAr: "التشطيبات المتكاملة وتسليم المفتاح", titleEn: "Turnkey Finishing & Contracting", descriptionAr: "إدارة وتنفيذ التشطيب من العظم إلى السكن بأعلى دقة.", descriptionEn: "Managing and delivering finishing from shell to move-in with exacting precision.", featuresAr: ["إشراف هندسي يومي", "جدول زمني ملتزم", "ضمان على الأعمال"], featuresEn: ["Daily engineering supervision", "Committed timeline", "Workmanship warranty"], carouselImages: [u(IMG.living, 1400), u(IMG.suite, 1400)], isFeatured: true, sortOrder: 0, isActive: true },
  { id: "s2", slug: "interior-architecture", titleAr: "التصميم الداخلي والمخططات التنفيذية", titleEn: "Interior Architecture & 3D Plans", descriptionAr: "تصاميم مودرن وكلاسيك مع مخططات تفصيلية وتوزيع الإضاءة.", descriptionEn: "Modern and classic designs with detailed drawings and lighting layouts.", featuresAr: ["مخططات ثلاثية الأبعاد", "مخططات تنفيذية", "توزيع الإضاءة"], featuresEn: ["3D visualisation", "Execution drawings", "Lighting layout"], carouselImages: [u(IMG.kitchen, 1400), u(IMG.living, 1400)], isFeatured: true, sortOrder: 1, isActive: true },
  { id: "s3", slug: "bespoke-decor", titleAr: "الديكورات الخاصة والأسقف المعلقة", titleEn: "Bespoke Decor & Architectural Lighting", descriptionAr: "جبس بورد، بديل خشب ورخام، إضاءة مخفية، وتكسيات عصرية.", descriptionEn: "Gypsum boards, wood and marble alternatives, concealed lighting and modern cladding.", featuresAr: ["جبس بورد", "بديل رخام وخشب", "إضاءة مخفية"], featuresEn: ["Gypsum ceilings", "Marble & wood alternatives", "Concealed lighting"], carouselImages: [u(IMG.panel, 1400), u(IMG.bath, 1400)], isFeatured: true, sortOrder: 2, isActive: true },
  { id: "s4", slug: "renovation", titleAr: "تجديد وتحديث المباني والمساحات", titleEn: "Renovation & Space Transformation", descriptionAr: "إعادة إحياء الفلل، الشقق، والمقرات التجارية بطابع معاصر.", descriptionEn: "Reviving villas, apartments and commercial premises with a contemporary character.", featuresAr: ["فلل وشقق", "مقرات تجارية", "إعادة تخطيط المساحات"], featuresEn: ["Villas & apartments", "Commercial premises", "Space re-planning"], carouselImages: [u(IMG.facade, 1400), u(IMG.office, 1400)], isFeatured: true, sortOrder: 3, isActive: true },
];

const P = (n: number, cat: Category, ta: string, te: string, loc: string, area: number, imgs: string[], dur: string): ProjectT => ({
  id: `p${n}`, slug: `project-${n}`, titleAr: ta, titleEn: te, category: cat, areaM2: area, location: loc,
  descriptionAr: "تنفيذ متكامل شمل الأرضيات والجدران والأسقف والإضاءة والنجارة وفق مخططات تنفيذية معتمدة.",
  descriptionEn: "Full execution covering floors, walls, ceilings, lighting and joinery from approved drawings.",
  images: imgs.map((x) => u(x, 1600)), specs: { duration: dur }, isFeatured: n <= 3, sortOrder: n, isActive: true,
});
export const seedProjects: ProjectT[] = [
  P(1, "VILLAS", "فيلا خاصة - جنزور", "Private Villa — Janzour", "طرابلس، جنزور", 450, [IMG.living, IMG.panel, IMG.facade], "5 أشهر / 5 months"),
  P(2, "APARTMENTS", "شقة سكنية - زاوية الدهماني", "Apartment — Zawiyat Dahmani", "طرابلس", 180, [IMG.suite, IMG.living], "3 أشهر / 3 months"),
  P(3, "RENOVATION", "مطبخ وحمام فاخر", "Luxury Kitchen & Bath", "طرابلس، الأندلس", 60, [IMG.kitchen, IMG.bath], "6 أسابيع / 6 weeks"),
  P(4, "COMMERCIAL", "مقر شركة ولاونج تنفيذي", "Corporate HQ & Executive Lounge", "طرابلس، وسط المدينة", 320, [IMG.office, IMG.panel], "4 أشهر / 4 months"),
  P(5, "VILLAS", "فيلا بواجهة معمارية", "Villa with Architectural Facade", "طرابلس، تاجوراء", 520, [IMG.facade, IMG.living], "6 أشهر / 6 months"),
  P(6, "APARTMENTS", "شقة بالميكروسمنت", "Micro-Cement Apartment", "طرابلس، غوط الشعال", 140, [IMG.suite, IMG.bath], "10 أسابيع / 10 weeks"),
];

export const seedSettings: SettingsT = {
  brandNameAr: "أوان للتشطيبات والديكور", brandNameEn: "AWAN Interior Design & Finishing",
  sloganAr: "نُشطّب بإتقان، ونُصمّم بروح المكان", sloganEn: "Finished with precision, designed with spirit",
  aboutTextAr: "أوان شركة تشطيبات وديكور في طرابلس، نجمع بين التصميم المعماري والتنفيذ المنضبط لنسلّم مساحات هادئة وفاخرة تدوم.",
  aboutTextEn: "AWAN is a Tripoli-based finishing and décor studio combining architectural design with disciplined execution to deliver calm, lasting luxury spaces.",
  whatsappNumber: "218929491004", phoneNumber: "0929491004", email: "info@awan.local",
  addressAr: "طرابلس، ليبيا", addressEn: "Tripoli, Libya",
  tiktokUrl: "https://www.tiktok.com/@tafseeldecor?_r=1&_t=ZS-9B1g69B61Xo",
  promoBannerAr: "معاينة مجانية داخل طرابلس — احجز موعدك عبر واتساب", promoBannerEn: "Free site visit in Tripoli — book via WhatsApp",
  isPromoActive: true, seoTitle: "أوان للتشطيبات والديكور | AWAN Interiors", seoDescription: "تشطيبات وديكور وتصميم داخلي فاخر في طرابلس، ليبيا.",
};
