"use client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Briefcase, ChevronLeft, ChevronRight, Globe, Languages, MapPin, Moon, Phone, Ruler, Sun, Timer, X } from "lucide-react";
import { useApp } from "./Providers";
import { LYD, PROPERTY_FACTOR, RATE_PER_M2, dict, estimate, waLink } from "@/lib/i18n";
import type { Category, HeroSlideT, ProjectT, ServiceT, SettingsT } from "@/lib/seed-data";
import { submitQuote } from "@/app/actions";

type Props = { hero: HeroSlideT[]; services: ServiceT[]; projects: ProjectT[]; settings: SettingsT };
const bi = (lang: string, ar: string, en: string) => (lang === "ar" ? ar : en);

function WaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-1.9 1.3-.5.1-1.1.1-1.8-.1a16 16 0 0 1-5.5-3.4 9 9 0 0 1-1.9-2.8c-.5-1.2-.1-2.3.5-2.9.2-.2.4-.3.6-.3h.4c.2 0 .3 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.4.5c-.1.2-.2.3-.1.5a7 7 0 0 0 3.2 2.8c.3.1.4.1.6-.1l.7-.9c.2-.2.3-.2.5-.1l1.7.8c.2.1.4.2.4.3 0 .2 0 .8-.1 1.3Z" />
    </svg>
  );
}

/* ---------- Header + promo ---------- */
function Header({ s }: { s: SettingsT }) {
  const { lang, theme, toggleLang, toggleTheme, t } = useApp();
  const links: [string, readonly [string, string]][] = [["#services", dict.nav.services], ["#projects", dict.nav.projects], ["#estimator", dict.nav.estimator], ["#about", dict.nav.about], ["#contact", dict.nav.contact]];
  return (
    <>
      {s.isPromoActive && (
        <div className="bg-bronze px-4 py-2 text-center text-xs font-medium text-bg">{bi(lang, s.promoBannerAr, s.promoBannerEn)}</div>
      )}
      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="#top" className="font-display text-xl font-semibold tracking-wide">
            {lang === "ar" ? "أوان" : "AWAN"}<span className="text-bronze">.</span>
          </a>
          <nav className="hidden gap-7 text-sm md:flex">
            {links.map(([h, l]) => <a key={h} href={h} className="text-muted transition hover:text-ink">{t(l)}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} aria-label="Language" className="btn-ghost !px-3 !py-2"><Languages size={16} />{lang === "ar" ? "EN" : "ع"}</button>
            <button onClick={toggleTheme} aria-label="Theme" className="btn-ghost !px-3 !py-2">{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button>
          </div>
        </div>
      </header>
    </>
  );
}

/* ---------- Hero ---------- */
function Hero({ slides, s }: { slides: HeroSlideT[]; s: SettingsT }) {
  const { lang, t } = useApp();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [slides.length]);
  const sl = slides[i];
  const Prev = lang === "ar" ? ChevronRight : ChevronLeft;
  const Next = lang === "ar" ? ChevronLeft : ChevronRight;
  return (
    <section id="top" className="relative h-[88vh] min-h-[560px] overflow-hidden bg-black">
      <AnimatePresence mode="sync">
        <motion.div key={sl.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sl.imageUrl} alt={bi(lang, sl.titleAr, sl.titleEn)} className="kenburns h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        </motion.div>
      </AnimatePresence>
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 text-white">
        <AnimatePresence mode="wait">
          <motion.div key={sl.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#c7a06c]">{bi(lang, s.sloganAr, s.sloganEn)}</p>
            <h1 className="font-display text-4xl font-medium leading-tight md:text-6xl">{bi(lang, sl.titleAr, sl.titleEn)}</h1>
            <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">{bi(lang, sl.subtitleAr, sl.subtitleEn)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={sl.ctaLink} className="btn !bg-[#c7a06c] !border-[#c7a06c] !text-black">{bi(lang, sl.ctaTextAr, sl.ctaTextEn)}</a>
              <a href={waLink(s.whatsappNumber, bi(lang, "مرحبًا، أود الاستفسار عن خدمات التشطيب.", "Hello, I'd like to enquire about finishing services."))} className="btn-ghost !border-white/40 !text-white"><WaIcon className="h-4 w-4" />{t(dict.hero.whatsapp)}</a>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-10 flex items-center gap-4">
          <button aria-label="prev" onClick={() => setI((x) => (x - 1 + slides.length) % slides.length)} className="border border-white/30 p-2 hover:border-white"><Prev size={18} /></button>
          <div className="flex gap-2">
            {slides.map((x, n) => (
              <button key={x.id} aria-label={`slide ${n + 1}`} onClick={() => setI(n)} className={`h-[3px] transition-all ${n === i ? "w-10 bg-[#c7a06c]" : "w-5 bg-white/40"}`} />
            ))}
          </div>
          <button aria-label="next" onClick={() => setI((x) => (x + 1) % slides.length)} className="border border-white/30 p-2 hover:border-white"><Next size={18} /></button>
          <span className="ms-auto font-display text-sm text-white/70">{String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
function ServiceCard({ sv, idx }: { sv: ServiceT; idx: number }) {
  const { lang } = useApp();
  const [n, setN] = useState(0);
  const imgs = sv.carouselImages.length ? sv.carouselImages : [];
  useEffect(() => {
    if (imgs.length < 2) return;
    const id = setInterval(() => setN((x) => (x + 1) % imgs.length), 4500 + idx * 400);
    return () => clearInterval(id);
  }, [imgs.length, idx]);
  const feats = lang === "ar" ? sv.featuresAr : sv.featuresEn;
  return (
    <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: idx * 0.08 }} className="group border border-line bg-surface">
      {imgs.length > 0 && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <AnimatePresence mode="sync">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img key={imgs[n]} src={imgs[n]} alt="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }} className="absolute inset-0 h-full w-full object-cover" />
          </AnimatePresence>
        </div>
      )}
      <div className="p-6">
        <span className="font-display text-sm text-bronze">{String(idx + 1).padStart(2, "0")}</span>
        <h3 className="mt-2 text-lg font-semibold">{bi(lang, sv.titleAr, sv.titleEn)}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{bi(lang, sv.descriptionAr, sv.descriptionEn)}</p>
        <ul className="mt-4 space-y-1.5 text-sm">
          {feats.map((f) => <li key={f} className="flex items-center gap-2"><span className="h-px w-4 bg-bronze" />{f}</li>)}
        </ul>
      </div>
    </motion.article>
  );
}

function Services({ items }: { items: ServiceT[] }) {
  const { t } = useApp();
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-bronze">{t(dict.services.eyebrow)}</p>
      <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-5xl">{t(dict.services.title)}</h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((sv, i) => <ServiceCard key={sv.id} sv={sv} idx={i} />)}
      </div>
    </section>
  );
}

/* ---------- Portfolio ---------- */
function ProjectModal({ p, s, onClose }: { p: ProjectT; s: SettingsT; onClose: () => void }) {
  const { lang, t } = useApp();
  const [n, setN] = useState(0);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);
  const duration = p.specs?.duration ?? "—";
  const title = bi(lang, p.titleAr, p.titleEn);
  const msg = bi(lang, `مرحبًا، أود تشطيبًا مشابهًا لمشروع «${title}» (${p.areaM2} م²).`, `Hello, I'd like a finish similar to "${title}" (${p.areaM2} m²).`);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3" onClick={onClose} role="dialog" aria-modal>
      <div className="grid max-h-[94vh] w-full max-w-6xl overflow-auto border border-line bg-bg md:grid-cols-[1.4fr_1fr]" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[n]} alt={title} className="aspect-[4/3] w-full object-cover md:h-full" />
          {p.images.length > 1 && (
            <div className="absolute bottom-3 start-3 flex gap-2">
              {p.images.map((im, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={im + k} src={im} alt="" onClick={() => setN(k)} className={`h-12 w-16 cursor-pointer object-cover ${k === n ? "ring-2 ring-[#c7a06c]" : "opacity-70"}`} />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col p-6">
          <button onClick={onClose} aria-label={t(dict.projects.close)} className="mb-4 self-end border border-line p-2 hover:border-bronze"><X size={16} /></button>
          <h3 className="font-display text-2xl">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{bi(lang, p.descriptionAr, p.descriptionEn)}</p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3"><Ruler size={16} className="text-bronze" /><dt className="text-muted">{t(dict.projects.area)}</dt><dd className="ms-auto">{p.areaM2} m²</dd></div>
            <div className="flex items-center gap-3"><MapPin size={16} className="text-bronze" /><dt className="text-muted">{t(dict.projects.location)}</dt><dd className="ms-auto">{p.location}</dd></div>
            <div className="flex items-center gap-3"><Timer size={16} className="text-bronze" /><dt className="text-muted">{t(dict.projects.duration)}</dt><dd className="ms-auto">{duration}</dd></div>
            <div className="flex items-center gap-3"><Briefcase size={16} className="text-bronze" /><dt className="text-muted">{t(dict.projects.scope)}</dt><dd className="ms-auto">{t(dict.projects[p.category])}</dd></div>
          </dl>
          <a href={waLink(s.whatsappNumber, msg)} target="_blank" rel="noopener noreferrer" className="btn mt-auto !bg-[#25D366] !border-[#25D366] !text-black"><WaIcon className="h-4 w-4" />{t(dict.projects.similar)}</a>
        </div>
      </div>
    </motion.div>
  );
}

function Portfolio({ projects, s }: { projects: ProjectT[]; s: SettingsT }) {
  const { lang, t } = useApp();
  const [cat, setCat] = useState<Category | "ALL">("ALL");
  const [open, setOpen] = useState<ProjectT | null>(null);
  const shown = useMemo(() => (cat === "ALL" ? projects : projects.filter((p) => p.category === cat)), [cat, projects]);
  const cats: (Category | "ALL")[] = ["ALL", "VILLAS", "APARTMENTS", "COMMERCIAL", "RENOVATION"];
  return (
    <section id="projects" className="border-y border-line bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-xs uppercase tracking-[0.3em] text-bronze">{t(dict.projects.eyebrow)}</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-5xl">{t(dict.projects.title)}</h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`border px-4 py-2 text-sm transition ${cat === c ? "border-bronze bg-bronze text-bg" : "border-line hover:border-bronze"}`}>
              {c === "ALL" ? t(dict.projects.all) : t(dict.projects[c])}
            </button>
          ))}
        </div>
        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {shown.map((p) => (
              <motion.button layout key={p.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(p)} className="group relative block overflow-hidden text-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]} alt={bi(lang, p.titleAr, p.titleEn)} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs text-[#c7a06c]">{t(dict.projects[p.category])} · {p.areaM2} m²</p>
                  <h3 className="mt-1 font-display text-xl">{bi(lang, p.titleAr, p.titleEn)}</h3>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>{open && <ProjectModal p={open} s={s} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}

/* ---------- Estimator ---------- */
function Estimator({ s }: { s: SettingsT }) {
  const { lang, t } = useApp();
  const [property, setProperty] = useState<keyof typeof PROPERTY_FACTOR>("apartment");
  const [area, setArea] = useState(150);
  const [level, setLevel] = useState<keyof typeof RATE_PER_M2>("deluxe");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [pending, start] = useTransition();
  const est = estimate(property, area || 0, level);
  const e = dict.est;
  const propLabel = t(e[property]);
  const lvlLabel = t(e[level]);

  function send() {
    const text = bi(lang,
      `طلب عرض سعر\nالاسم: ${name}\nالهاتف: ${phone}\nالمدينة: ${city}\nنوع العقار: ${propLabel}\nالمساحة: ${area} م²\nالمستوى: ${lvlLabel}\nالتقدير: ${LYD(est.low, lang)} – ${LYD(est.high, lang)}`,
      `Quote request\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nProperty: ${propLabel}\nArea: ${area} m²\nLevel: ${lvlLabel}\nEstimate: ${LYD(est.low, lang)} – ${LYD(est.high, lang)}`);
    const win = window.open(waLink(s.whatsappNumber, text), "_blank", "noopener");
    start(async () => {
      await submitQuote({ clientName: name || "—", clientPhone: phone || "—", city, propertyType: property, areaM2: area, finishingLevel: level, budgetLyd: Math.round(est.mid) });
    });
    if (!win) window.location.href = waLink(s.whatsappNumber, text);
  }

  const Opt = <T extends string>({ val, cur, set, label }: { val: T; cur: T; set: (v: T) => void; label: string }) => (
    <button type="button" onClick={() => set(val)} className={`flex-1 border px-3 py-2.5 text-sm transition ${cur === val ? "border-bronze bg-bronze text-bg" : "border-line hover:border-bronze"}`}>{label}</button>
  );

  return (
    <section id="estimator" className="mx-auto max-w-7xl px-4 py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-bronze">{t(e.eyebrow)}</p>
      <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-5xl">{t(e.title)}</h2>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6 border border-line bg-surface p-6">
          <div><label className="mb-2 block text-sm text-muted">{t(e.property)}</label>
            <div className="flex gap-2"><Opt val="villa" cur={property} set={setProperty} label={t(e.villa)} /><Opt val="apartment" cur={property} set={setProperty} label={t(e.apartment)} /><Opt val="shop" cur={property} set={setProperty} label={t(e.shop)} /></div></div>
          <div><label className="mb-2 block text-sm text-muted">{t(e.area)}: <b className="text-ink">{area}</b></label>
            <input type="range" min={20} max={1000} step={5} value={area} onChange={(ev) => setArea(Number(ev.target.value))} className="w-full accent-[rgb(var(--bronze))]" />
            <input type="number" min={10} max={5000} value={area} onChange={(ev) => setArea(Math.max(0, Number(ev.target.value)))} className="input mt-2" /></div>
          <div><label className="mb-2 block text-sm text-muted">{t(e.level)}</label>
            <div className="flex gap-2"><Opt val="luxury" cur={level} set={setLevel} label={t(e.luxury)} /><Opt val="deluxe" cur={level} set={setLevel} label={t(e.deluxe)} /><Opt val="vip" cur={level} set={setLevel} label={t(e.vip)} /></div></div>
        </div>
        <div className="flex flex-col border border-bronze p-6">
          <p className="text-sm text-muted">{t(e.result)}</p>
          <p className="mt-2 font-display text-3xl md:text-4xl">{LYD(est.low, lang)}<br /><span className="text-muted">–</span> {LYD(est.high, lang)}</p>
          <p className="mt-3 text-xs text-muted">{t(e.note)}</p>
          <div className="mt-6 grid gap-3">
            <input className="input" placeholder={t(e.name)} value={name} onChange={(x) => setName(x.target.value)} maxLength={80} />
            <input className="input" placeholder={t(e.phone)} value={phone} onChange={(x) => setPhone(x.target.value)} inputMode="tel" maxLength={25} />
            <input className="input" placeholder={t(e.city)} value={city} onChange={(x) => setCity(x.target.value)} maxLength={60} />
          </div>
          <button onClick={send} disabled={pending || !area} className="btn mt-4 !bg-[#25D366] !border-[#25D366] !text-black"><WaIcon className="h-4 w-4" />{t(e.send)}</button>
        </div>
      </div>
    </section>
  );
}

/* ---------- About + Footer ---------- */
function About({ s }: { s: SettingsT }) {
  const { lang, t } = useApp();
  return (
    <section id="about" className="border-t border-line bg-surface py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2">
        <div><p className="text-xs uppercase tracking-[0.3em] text-bronze">{t(dict.about.eyebrow)}</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">{bi(lang, s.brandNameAr, s.brandNameEn)}</h2></div>
        <p className="text-lg leading-loose text-muted">{bi(lang, s.aboutTextAr, s.aboutTextEn)}</p>
      </div>
    </section>
  );
}

function Footer({ s }: { s: SettingsT }) {
  const { lang, t } = useApp();
  return (
    <footer id="contact" className="border-t border-line px-4 py-14 pb-28 md:pb-14">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div><p className="font-display text-2xl">{bi(lang, s.brandNameAr, s.brandNameEn)}</p><p className="mt-2 text-sm text-muted">{bi(lang, s.sloganAr, s.sloganEn)}</p></div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2"><Phone size={15} className="text-bronze" /><a href={`tel:${s.phoneNumber}`} dir="ltr">{s.phoneNumber}</a></li>
          <li className="flex items-center gap-2"><MapPin size={15} className="text-bronze" />{bi(lang, s.addressAr, s.addressEn)}</li>
          <li className="flex items-center gap-2"><Globe size={15} className="text-bronze" /><a href={s.tiktokUrl} target="_blank" rel="noopener noreferrer">{t(dict.footer.follow)}</a></li>
        </ul>
        <p className="text-sm text-muted md:text-end">© {new Date().getFullYear()} {bi(lang, s.brandNameAr, s.brandNameEn)} — {t(dict.footer.rights)}</p>
      </div>
    </footer>
  );
}

/* ---------- Mobile dock ---------- */
function Dock({ s }: { s: SettingsT }) {
  const { t } = useApp();
  const items = [
    { href: `tel:${s.phoneNumber}`, label: dict.dock.call, icon: <Phone size={18} />, cls: "" },
    { href: waLink(s.whatsappNumber, ""), label: dict.dock.wa, icon: <WaIcon className="h-[18px] w-[18px]" />, cls: "text-[#25D366]", ext: true },
    { href: s.tiktokUrl, label: dict.dock.tiktok, icon: <Globe size={18} />, cls: "", ext: true },
    { href: "#projects", label: dict.dock.works, icon: <Briefcase size={18} />, cls: "" },
    { href: "#top", label: dict.dock.top, icon: <ArrowUp size={18} />, cls: "" },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-bg/95 backdrop-blur md:hidden">
      {items.map((it) => (
        <a key={it.label[1]} href={it.href} {...(it.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] ${it.cls}`}>
          {it.icon}{t(it.label)}
        </a>
      ))}
    </nav>
  );
}

export default function Storefront({ hero, services, projects, settings }: Props) {
  return (
    <>
      <Header s={settings} />
      <main>
        <Hero slides={hero} s={settings} />
        <Services items={services} />
        <Portfolio projects={projects} s={settings} />
        <Estimator s={settings} />
        <About s={settings} />
      </main>
      <Footer s={settings} />
      <Dock s={settings} />
    </>
  );
}
