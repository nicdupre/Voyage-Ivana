"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addExpense(tripId: string, formData: FormData) {
  const description = String(formData.get("description") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const category = String(formData.get("category") ?? "Autre").trim();
  const paidById = String(formData.get("paidById") ?? "").trim();
  const dateRaw = String(formData.get("date") ?? "").trim();
  const splitWith = formData.getAll("splitWith").map(String);

  const amount = Number(amountRaw);
  if (!description || !Number.isFinite(amount) || amount <= 0) return;

  await prisma.expense.create({
    data: {
      tripId,
      description,
      amount,
      category: category || "Autre",
      paidById: paidById || null,
      date: dateRaw ? new Date(dateRaw) : new Date(),
      splitWith: splitWith.length > 0 ? { connect: splitWith.map((id) => ({ id })) } : undefined,
    },
  });
  revalidatePath(`/trip/${tripId}/budget`);
  revalidatePath(`/trip/${tripId}`);
}

export async function deleteExpense(tripId: string, expenseId: string) {
  await prisma.expense.deleteMany({ where: { id: expenseId, tripId } });
  revalidatePath(`/trip/${tripId}/budget`);
  revalidatePath(`/trip/${tripId}`);
}
