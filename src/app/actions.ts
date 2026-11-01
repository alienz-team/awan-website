"use server";
import { prisma, dbConfigured } from "@/lib/prisma";

type QuoteInput = { clientName: string; clientPhone: string; city?: string; propertyType: string; areaM2: number; finishingLevel: string; budgetLyd?: number; notes?: string };

const clip = (v: unknown, n: number) => String(v ?? "").slice(0, n);

/** Public quote submission. Never throws: WhatsApp hand-off must work even without a database. */
export async function submitQuote(input: QuoteInput) {
  if (!dbConfigured) return { ok: false };
  try {
    await prisma.quoteRequest.create({
      data: {
        clientName: clip(input.clientName, 80),
        clientPhone: clip(input.clientPhone, 25),
        city: clip(input.city, 60) || null,
        propertyType: clip(input.propertyType, 20),
        areaM2: Math.max(0, Math.min(100000, Math.round(Number(input.areaM2) || 0))),
        finishingLevel: clip(input.finishingLevel, 20),
        budgetLyd: input.budgetLyd ? Math.round(Number(input.budgetLyd)) : null,
        notes: clip(input.notes, 500) || null,
      },
    });
    return { ok: true };
  } catch (e) {
    console.error("[submitQuote]", e);
    return { ok: false };
  }
}
