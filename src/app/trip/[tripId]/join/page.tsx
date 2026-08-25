import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/identity";
import { Card } from "@/components/ui";
import { JoinByNameForm } from "@/components/join-by-name-form";

export default async function JoinTripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  const existingMember = await getCurrentMember(tripId);
  if (existingMember) {
    redirect(`/trip/${tripId}`);
  }

  return (
    <Card className="p-6 max-w-sm mx-auto mt-6">
      <h2 className="font-medium mb-1">Rejoindre ce voyage</h2>
      <p className="text-sm text-muted-foreground mb-4">Entre ton nom pour accéder à l&apos;itinéraire, au budget et au reste.</p>
      <JoinByNameForm tripId={tripId} />
    </Card>
  );
}
