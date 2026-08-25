import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "voyage_identity";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type IdentityMap = Record<string, string>; // tripId -> memberId

async function readIdentityMap(): Promise<IdentityMap> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export async function getMemberIdForTrip(tripId: string): Promise<string | null> {
  const map = await readIdentityMap();
  return map[tripId] ?? null;
}

/** Returns the current member for a trip, validated against the database. */
export async function getCurrentMember(tripId: string) {
  const memberId = await getMemberIdForTrip(tripId);
  if (!memberId) return null;
  const member = await prisma.member.findFirst({ where: { id: memberId, tripId } });
  return member;
}

/** Must be called from a Server Action or Route Handler (writes a cookie). */
export async function rememberMembership(tripId: string, memberId: string) {
  const map = await readIdentityMap();
  map[tripId] = memberId;
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(map), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}
