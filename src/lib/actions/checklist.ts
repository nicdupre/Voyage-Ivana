"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addChecklistItem(tripId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "todo").trim();
  const assignedToId = String(formData.get("assignedToId") ?? "").trim();

  if (!title) return;

  await prisma.checklistItem.create({
    data: {
      tripId,
      title,
      category: category || "todo",
      assignedToId: assignedToId || null,
    },
  });
  revalidatePath(`/trip/${tripId}/checklist`);
  revalidatePath(`/trip/${tripId}`);
}

export async function toggleChecklistItem(tripId: string, itemId: string, done: boolean) {
  await prisma.checklistItem.updateMany({ where: { id: itemId, tripId }, data: { done } });
  revalidatePath(`/trip/${tripId}/checklist`);
  revalidatePath(`/trip/${tripId}`);
}

export async function deleteChecklistItem(tripId: string, itemId: string) {
  await prisma.checklistItem.deleteMany({ where: { id: itemId, tripId } });
  revalidatePath(`/trip/${tripId}/checklist`);
  revalidatePath(`/trip/${tripId}`);
}
