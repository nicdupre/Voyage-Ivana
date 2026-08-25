"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateInviteCode, colorForIndex } from "@/lib/codes";
import { rememberMembership } from "@/lib/identity";

export type ActionState = { error?: string } | undefined;

export async function createTrip(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const yourName = String(formData.get("yourName") ?? "").trim();
  const destination = String(formData.get("destination") ?? "").trim();
  const startDateRaw = String(formData.get("startDate") ?? "").trim();
  const endDateRaw = String(formData.get("endDate") ?? "").trim();
  const currency = String(formData.get("currency") ?? "EUR").trim() || "EUR";
  const budgetRaw = String(formData.get("budget") ?? "").trim();

  if (!name || !yourName) {
    return { error: "Le nom du voyage et ton nom sont requis." };
  }

  let inviteCode = generateInviteCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await prisma.trip.findUnique({ where: { inviteCode } });
    if (!existing) break;
    inviteCode = generateInviteCode();
  }

  const trip = await prisma.trip.create({
    data: {
      name,
      destination: destination || null,
      startDate: startDateRaw ? new Date(startDateRaw) : null,
      endDate: endDateRaw ? new Date(endDateRaw) : null,
      currency,
      budget: budgetRaw ? Number(budgetRaw) : null,
      inviteCode,
      members: {
        create: { name: yourName, color: colorForIndex(0) },
      },
    },
    include: { members: true },
  });

  const member = trip.members[0];
  await rememberMembership(trip.id, member.id);
  redirect(`/trip/${trip.id}`);
}

export async function joinTripByCode(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const name = String(formData.get("name") ?? "").trim();

  if (!code || !name) {
    return { error: "Le code du voyage et ton nom sont requis." };
  }

  const trip = await prisma.trip.findUnique({ where: { inviteCode: code }, include: { members: true } });
  if (!trip) {
    return { error: "Aucun voyage ne correspond à ce code." };
  }

  const member = await prisma.member.create({
    data: { tripId: trip.id, name, color: colorForIndex(trip.members.length) },
  });
  await rememberMembership(trip.id, member.id);
  redirect(`/trip/${trip.id}`);
}

export async function joinTripById(tripId: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Ton nom est requis." };
  }

  const trip = await prisma.trip.findUnique({ where: { id: tripId }, include: { members: true } });
  if (!trip) {
    return { error: "Voyage introuvable." };
  }

  const member = await prisma.member.create({
    data: { tripId: trip.id, name, color: colorForIndex(trip.members.length) },
  });
  await rememberMembership(trip.id, member.id);
  redirect(`/trip/${trip.id}`);
}
