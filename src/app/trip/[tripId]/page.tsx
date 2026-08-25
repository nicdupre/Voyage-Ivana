import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/require-member";
import { Card } from "@/components/ui";
import { formatDate, formatMoney } from "@/lib/format";

export default async function TripDashboardPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const member = await requireMember(tripId);

  const trip = await prisma.trip.findUniqueOrThrow({ where: { id: tripId } });

  const [nextItems, expenseTotal, checklistStats, documentCount] = await Promise.all([
    prisma.itineraryItem.findMany({
      where: { tripId, date: { gte: new Date(new Date().toDateString()) } },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      take: 3,
    }),
    prisma.expense.aggregate({ where: { tripId }, _sum: { amount: true } }),
    prisma.$transaction([
      prisma.checklistItem.count({ where: { tripId } }),
      prisma.checklistItem.count({ where: { tripId, done: true } }),
    ]),
    prisma.tripDocument.count({ where: { tripId } }),
  ]);

  const spent = expenseTotal._sum.amount ?? 0;
  const [totalTasks, doneTasks] = checklistStats;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Bienvenue, {member.name} 👋</p>
        <h1 className="text-xl font-semibold tracking-tight mt-0.5">{trip.name}</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href={`/trip/${tripId}/itinerary`}>
          <Card className="p-4 h-full hover:border-primary/50 transition-colors">
            <p className="text-2xl">🗓️</p>
            <p className="font-medium mt-2">Itinéraire</p>
            <p className="text-sm text-muted-foreground">
              {nextItems.length > 0 ? `Prochain : ${nextItems[0].title}` : "Rien de planifié"}
            </p>
          </Card>
        </Link>
        <Link href={`/trip/${tripId}/budget`}>
          <Card className="p-4 h-full hover:border-primary/50 transition-colors">
            <p className="text-2xl">💶</p>
            <p className="font-medium mt-2">Budget</p>
            <p className="text-sm text-muted-foreground">
              {formatMoney(spent, trip.currency)}
              {trip.budget != null ? ` / ${formatMoney(trip.budget, trip.currency)}` : " dépensés"}
            </p>
          </Card>
        </Link>
        <Link href={`/trip/${tripId}/checklist`}>
          <Card className="p-4 h-full hover:border-primary/50 transition-colors">
            <p className="text-2xl">✅</p>
            <p className="font-medium mt-2">Checklist</p>
            <p className="text-sm text-muted-foreground">
              {totalTasks > 0 ? `${doneTasks} / ${totalTasks} terminé` : "Aucune tâche"}
            </p>
          </Card>
        </Link>
        <Link href={`/trip/${tripId}/documents`}>
          <Card className="p-4 h-full hover:border-primary/50 transition-colors">
            <p className="text-2xl">📄</p>
            <p className="font-medium mt-2">Documents</p>
            <p className="text-sm text-muted-foreground">{documentCount > 0 ? `${documentCount} document${documentCount > 1 ? "s" : ""}` : "Aucun document"}</p>
          </Card>
        </Link>
      </div>

      {nextItems.length > 0 && (
        <Card className="p-5">
          <h3 className="font-medium mb-3">À venir</h3>
          <div className="space-y-3">
            {nextItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground w-24 shrink-0">
                  {formatDate(item.date, { day: "numeric", month: "short" })}
                  {item.time ? ` · ${item.time}` : ""}
                </span>
                <span className="font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
