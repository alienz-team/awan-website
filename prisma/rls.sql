-- Lock down all tables from the public Supabase API (anon / authenticated roles).
-- The app connects through Prisma as the `postgres` role, which bypasses RLS,
-- so no policies are defined: with RLS enabled and no policies, PostgREST access is denied.
ALTER TABLE "Project"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuoteRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HeroSlide"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSettings" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON "Project", "Service", "QuoteRequest", "HeroSlide", "SiteSettings" FROM anon, authenticated;
