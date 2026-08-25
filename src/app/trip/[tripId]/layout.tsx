import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TripHeader } from "@/components/trip-header";
import { TripNav } from "@/components/trip-nav";

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { members: { orderBy: { joinedAt: "asc" } } },
  });

  if (!trip) notFound();

  return (
    <div className="flex-1 flex flex-col sm:flex-col">
      <TripHeader trip={trip} members={trip.members} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">{children}</main>
      </div>
      <TripNav tripId={tripId} />
    </div>
  );
}
