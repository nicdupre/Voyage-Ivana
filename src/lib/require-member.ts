import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/identity";

export async function requireMember(tripId: string) {
  const member = await getCurrentMember(tripId);
  if (!member) {
    redirect(`/trip/${tripId}/join`);
  }
  return member;
}
