import { prisma, dbConfigured } from "./prisma";
import { seedHero, seedProjects, seedServices, seedSettings, type HeroSlideT, type ProjectT, type ServiceT, type SettingsT } from "./seed-data";

export type SiteData = { hero: HeroSlideT[]; services: ServiceT[]; projects: ProjectT[]; settings: SettingsT; live: boolean };

const fallback: SiteData = { hero: seedHero, services: seedServices, projects: seedProjects, settings: seedSettings, live: false };

/** Loads storefront data in one transaction; any gap or failure falls back to rich seed data. */
export async function getSiteData(): Promise<SiteData> {
  if (!dbConfigured) return fallback;
  try {
    const [hero, services, projects, settings] = await prisma.$transaction([
      prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.service.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.project.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
      prisma.siteSettings.findUnique({ where: { id: "main" } }),
    ]);
    return {
      hero: hero.length ? hero : seedHero,
      services: services.length ? services : seedServices,
      projects: (projects.length ? projects : seedProjects) as ProjectT[],
      settings: settings ?? seedSettings,
      live: true,
    };
  } catch (e) {
    console.error("[getSiteData] falling back to seed data", e);
    return fallback;
  }
}

export async function getSettings(): Promise<SettingsT> {
  return (await getSiteData()).settings;
}
