import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, verifyToken } from "@/lib/auth";

export const runtime = "nodejs";
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: NextRequest) {
  if (!(await verifyToken(req.cookies.get(COOKIE)?.value))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  const bucket = process.env.SUPABASE_BUCKET || "awan-media";
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Supabase Storage not configured — paste an image URL instead." }, { status: 501 });

  const file = (await req.formData()).get("file");
  if (!(file instanceof File) || !ALLOWED.includes(file.type) || file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Invalid file (jpg/png/webp/avif, max 8MB)" }, { status: 400 });
  }
  const ext = file.type.split("/")[1];
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": file.type, "x-upsert": "false" },
    body: Buffer.from(await file.arrayBuffer()),
  });
  if (!res.ok) return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  return NextResponse.json({ url: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}` });
}
