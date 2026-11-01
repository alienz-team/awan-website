import Storefront from "@/components/Storefront";
import { getSiteData } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const { hero, services, projects, settings } = await getSiteData();
  return <Storefront hero={hero} services={services} projects={projects} settings={settings} />;
}
