import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/require-member";
import { addItineraryItem, deleteItineraryItem } from "@/lib/actions/itinerary";
import { Button, Card, EmptyState, Input, Label, PageHeader, Textarea } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";
import { formatDate } from "@/lib/format";

export default async function ItineraryPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  await requireMember(tripId);

  const items = await prisma.itineraryItem.findMany({
    where: { tripId },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const key = item.date.toISOString().slice(0, 10);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Itinéraire" description="L'organisation de votre voyage, jour par jour." />

      <Card className="p-5">
        <form action={addItineraryItem.bind(null, tripId)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div>
              <Label htmlFor="time">Heure</Label>
              <Input id="time" name="time" type="time" />
            </div>
          </div>
          <div>
            <Label htmlFor="title">Activité</Label>
            <Input id="title" name="title" placeholder="Visite du Colisée" required />
          </div>
          <div>
            <Label htmlFor="location">Lieu</Label>
            <Input id="location" name="location" placeholder="Rome" />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Réservation, infos pratiques..." rows={2} />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Ajouter à l&apos;itinéraire
          </Button>
        </form>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="Aucune étape planifiée" description="Ajoute la première activité de ton voyage ci-dessus." />
      ) : (
        <div className="space-y-6">
          {[...groups.entries()].map(([dateKey, dayItems]) => (
            <div key={dateKey}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                {formatDate(dateKey, { weekday: "long", day: "numeric", month: "long" })}
              </h3>
              <Card className="divide-y divide-border">
                {dayItems.map((item) => (
                  <div key={item.id} className="p-4 flex items-start gap-3">
                    <div className="text-sm font-mono text-primary w-14 shrink-0 pt-0.5">{item.time || "—"}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{item.title}</p>
                      {item.location && <p className="text-sm text-muted-foreground">📍 {item.location}</p>}
                      {item.notes && <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>}
                    </div>
                    <DeleteButton action={deleteItineraryItem.bind(null, tripId, item.id)} label="Supprimer l'étape" />
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
