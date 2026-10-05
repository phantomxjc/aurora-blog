import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Webhook: notify frontend to revalidate
export async function notifyFrontend(event: string, slug?: string) {
  const webhookUrl = process.env.REVALIDATE_URL;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, slug }),
    });
  } catch {
    // silent fail
  }
}
