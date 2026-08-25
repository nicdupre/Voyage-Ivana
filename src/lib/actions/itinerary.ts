"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addItineraryItem(tripId: string, formData: FormData) {
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!date || !title) return;

  await prisma.itineraryItem.create({
    data: {
      tripId,
      date: new Date(date),
      time: time || null,
      title,
      location: location || null,
      notes: notes || null,
    },
  });
  revalidatePath(`/trip/${tripId}/itinerary`);
}

export async function deleteItineraryItem(tripId: string, itemId: string) {
  await prisma.itineraryItem.deleteMany({ where: { id: itemId, tripId } });
  revalidatePath(`/trip/${tripId}/itinerary`);
}
