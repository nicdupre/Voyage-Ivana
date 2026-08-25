import Link from "next/link";
import { InviteCodeBadge } from "@/components/invite-code-badge";
import { formatDateRange } from "@/lib/format";

type TripHeaderProps = {
  trip: {
    id: string;
    name: string;
    destination: string | null;
    startDate: Date | null;
    endDate: Date | null;
    inviteCode: string;
  };
  members: { id: string; name: string; color: string }[];
};

export function TripHeader({ trip, members }: TripHeaderProps) {
  const dateRange = formatDateRange(trip.startDate, trip.endDate);

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-3xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={`/trip/${trip.id}`} className="font-semibold tracking-tight hover:opacity-80">
            {trip.name}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">
            {[trip.destination, dateRange].filter(Boolean).join(" · ") || "Aucune date pour le moment"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((m) => (
              <div
                key={m.id}
                title={m.name}
                className="h-7 w-7 rounded-full border-2 border-card flex items-center justify-center text-[11px] font-semibold text-white"
                style={{ backgroundColor: m.color }}
              >
                {m.name.slice(0, 1).toUpperCase()}
              </div>
            ))}
            {members.length > 5 && (
              <div className="h-7 w-7 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-medium">
                +{members.length - 5}
              </div>
            )}
          </div>
          <InviteCodeBadge code={trip.inviteCode} tripId={trip.id} />
        </div>
      </div>
    </header>
  );
}
