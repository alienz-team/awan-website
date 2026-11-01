# AWAN | أوان للتشطيبات والديكور

Luxury interior finishing & décor platform (Tripoli, Libya), inspired by dustsheet.framer.website.

## Stack
Next.js 15 (App Router, TS), Tailwind 3, Framer Motion, Lucide, Prisma 5 (Postgres), Vercel (`dub1`).

## Dynamic URL resolution (never hardcode a domain)
`src/lib/site.ts` → `process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000')`

## Photography rule (STRICT)
Architectural interior photography only (Unsplash, `?auto=format&fit=crop&w=1800&q=85`). **No people, models or workers in any image** — living rooms, kitchens, micro-cement, marble, lighting, plasterwork, fixtures. Applies to admin uploads too.

## Database
`DATABASE_URL` must keep `?connection_limit=3&pool_timeout=20`. `DIRECT_URL` is used for migrations (`npm run db:push`).
Storefront reads via `prisma.$transaction([...])` in `src/lib/data.ts` and falls back to rich seed data (`src/lib/seed-data.ts`) when no DB is configured or a query fails, so the site works out of the box.

## Admin (`/admin`)
- Login: `admin@awan.local` (also `awan@awan.local`) / `0929491004` (override with `ADMIN_EMAIL` / `ADMIN_PASSWORD`; set `ADMIN_SESSION_SECRET` in production).
- Protected by `middleware.ts` (signed HttpOnly cookie) and `assertAdmin()` in the panel layout and every Server Action.
- Modules: dashboard, projects, services, content (hero/about/announcement), quotes (WhatsApp reply), settings. Saves call `revalidatePath('/')`.
- Image upload (`/api/admin/upload`) uses Supabase Storage when `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set; otherwise paste URLs.

## Contact
WhatsApp/Phone `0929491004` (`218929491004`), TikTok https://www.tiktok.com/@tafseeldecor

## Commands
`npm install` → `npm run db:push` (with DB) → `npm run dev` / `npm run build`.
Security headers (6) live in `next.config.ts`.
