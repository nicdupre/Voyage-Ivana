"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addDocument(tripId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "autre").trim();
  const note = String(formData.get("note") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();

  if (!title) return;

  await prisma.tripDocument.create({
    data: { tripId, title, type: type || "autre", note: note || null, link: link || null },
  });
  revalidatePath(`/trip/${tripId}/documents`);
}

export async function deleteDocument(tripId: string, documentId: string) {
  await prisma.tripDocument.deleteMany({ where: { id: documentId, tripId } });
  revalidatePath(`/trip/${tripId}/documents`);
}
