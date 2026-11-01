"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/admin-guard";
import { COOKIE, SESSION_MAX_AGE, checkCredentials, createToken } from "@/lib/auth";
import { seedHero, seedSettings } from "@/lib/seed-data";

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const n = (f: FormData, k: string) => Number(f.get(k) ?? 0) || 0;
const b = (f: FormData, k: string) => f.get(k) === "on";
const lines = (f: FormData, k: string) => s(f, k).split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, "-").replace(/^-+|-+$/g, "") || `item-${Date.now()}`;

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

/* ---------- auth ---------- */
export async function login(_: unknown, f: FormData) {
  const email = s(f, "email");
  if (!checkCredentials(email, String(f.get("password") ?? ""))) return { error: "بيانات الدخول غير صحيحة / Invalid credentials" };
  const jar = await cookies();
  jar.set(COOKIE, await createToken(email), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_MAX_AGE });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}

/* ---------- projects ---------- */
export async function saveProject(f: FormData) {
  await assertAdmin();
  const id = s(f, "id");
  const titleEn = s(f, "titleEn");
  const data = {
    titleAr: s(f, "titleAr"), titleEn,
    descriptionAr: s(f, "descriptionAr"), descriptionEn: s(f, "descriptionEn"),
    category: s(f, "category") as "VILLAS" | "APARTMENTS" | "COMMERCIAL" | "RENOVATION",
    areaM2: n(f, "areaM2"), location: s(f, "location"), images: lines(f, "images"),
    specs: { duration: s(f, "duration") }, isFeatured: b(f, "isFeatured"), isActive: b(f, "isActive"), sortOrder: n(f, "sortOrder"),
  };
  if (id) await prisma.project.update({ where: { id }, data });
  else await prisma.project.create({ data: { ...data, slug: slugify(titleEn || data.titleAr) + "-" + Date.now().toString(36) } });
  refresh();
}
export async function deleteProject(f: FormData) {
  await assertAdmin();
  await prisma.project.delete({ where: { id: s(f, "id") } });
  refresh();
}

/* ---------- services ---------- */
export async function saveService(f: FormData) {
  await assertAdmin();
  const id = s(f, "id");
  const data = {
    titleAr: s(f, "titleAr"), titleEn: s(f, "titleEn"), descriptionAr: s(f, "descriptionAr"), descriptionEn: s(f, "descriptionEn"),
    featuresAr: lines(f, "featuresAr"), featuresEn: lines(f, "featuresEn"), carouselImages: lines(f, "carouselImages"),
    isFeatured: b(f, "isFeatured"), isActive: b(f, "isActive"), sortOrder: n(f, "sortOrder"),
  };
  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data: { ...data, slug: slugify(data.titleEn || data.titleAr) + "-" + Date.now().toString(36) } });
  refresh();
}
export async function deleteService(f: FormData) {
  await assertAdmin();
  await prisma.service.delete({ where: { id: s(f, "id") } });
  refresh();
}

/* ---------- hero + site content ---------- */
export async function saveHero(f: FormData) {
  await assertAdmin();
  const id = s(f, "id");
  const data = {
    titleAr: s(f, "titleAr"), titleEn: s(f, "titleEn"), subtitleAr: s(f, "subtitleAr"), subtitleEn: s(f, "subtitleEn"),
    imageUrl: s(f, "imageUrl"), ctaTextAr: s(f, "ctaTextAr"), ctaTextEn: s(f, "ctaTextEn"), ctaLink: s(f, "ctaLink") || "#estimator",
    sortOrder: n(f, "sortOrder"), isActive: b(f, "isActive"),
  };
  if (id) await prisma.heroSlide.update({ where: { id }, data });
  else await prisma.heroSlide.create({ data });
  refresh();
}
export async function deleteHero(f: FormData) {
  await assertAdmin();
  await prisma.heroSlide.delete({ where: { id: s(f, "id") } });
  refresh();
}
export async function seedHeroSlides() {
  await assertAdmin();
  if ((await prisma.heroSlide.count()) === 0) {
    await prisma.heroSlide.createMany({ data: seedHero.map(({ id: _id, ...r }) => r) });
  }
  refresh();
}

export async function saveContent(f: FormData) {
  await assertAdmin();
  const data = {
    aboutTextAr: s(f, "aboutTextAr"), aboutTextEn: s(f, "aboutTextEn"),
    promoBannerAr: s(f, "promoBannerAr"), promoBannerEn: s(f, "promoBannerEn"), isPromoActive: b(f, "isPromoActive"),
  };
  await prisma.siteSettings.upsert({ where: { id: "main" }, update: data, create: { ...seedSettings, ...data, id: "main" } });
  refresh();
}

export async function saveSettings(f: FormData) {
  await assertAdmin();
  const data = {
    brandNameAr: s(f, "brandNameAr"), brandNameEn: s(f, "brandNameEn"), sloganAr: s(f, "sloganAr"), sloganEn: s(f, "sloganEn"),
    whatsappNumber: s(f, "whatsappNumber").replace(/\D/g, ""), phoneNumber: s(f, "phoneNumber"), email: s(f, "email"),
    addressAr: s(f, "addressAr"), addressEn: s(f, "addressEn"), tiktokUrl: s(f, "tiktokUrl"),
    seoTitle: s(f, "seoTitle"), seoDescription: s(f, "seoDescription"),
  };
  await prisma.siteSettings.upsert({ where: { id: "main" }, update: data, create: { ...seedSettings, ...data, id: "main" } });
  refresh();
}

/* ---------- quotes ---------- */
export async function setQuoteStatus(f: FormData) {
  await assertAdmin();
  await prisma.quoteRequest.update({ where: { id: s(f, "id") }, data: { status: s(f, "status") as "PENDING" } });
  refresh();
}
export async function deleteQuote(f: FormData) {
  await assertAdmin();
  await prisma.quoteRequest.delete({ where: { id: s(f, "id") } });
  refresh();
}
