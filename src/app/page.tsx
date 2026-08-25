import { Card } from "@/components/ui";
import { CreateTripForm } from "@/components/create-trip-form";
import { JoinTripForm } from "@/components/join-trip-form";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl mb-2">
            ✈️
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Voyage Ivana</h1>
          <p className="text-muted-foreground text-sm">
            Planifiez votre voyage à plusieurs : itinéraire, budget, checklist et documents, le tout partagé.
          </p>
        </div>

        <Card className="p-6">
          <h2 className="font-medium mb-4">Créer un nouveau voyage</h2>
          <CreateTripForm />
        </Card>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          ou
          <div className="h-px flex-1 bg-border" />
        </div>

        <Card className="p-6">
          <h2 className="font-medium mb-4">Rejoindre un voyage existant</h2>
          <JoinTripForm />
        </Card>
      </div>
    </main>
  );
}
