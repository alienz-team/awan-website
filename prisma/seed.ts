import { PrismaClient } from "@prisma/client";
import { seedHero, seedProjects, seedServices, seedSettings } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({ where: { id: "main" }, update: {}, create: { ...seedSettings, id: "main" } });
  if ((await prisma.heroSlide.count()) === 0) {
    await prisma.heroSlide.createMany({ data: seedHero.map(({ id: _id, ...r }) => r) });
  }
  for (const s of seedServices) {
    const { id: _id, ...data } = s;
    await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: data });
  }
  for (const p of seedProjects) {
    const { id: _id, specs, ...data } = p;
    await prisma.project.upsert({ where: { slug: p.slug }, update: {}, create: { ...data, specs: specs ?? undefined } });
  }
  console.log("Seed complete");
}

main().finally(() => prisma.$disconnect());
