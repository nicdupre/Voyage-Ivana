"use client";

import { useActionState } from "react";
import { createTrip } from "@/lib/actions/trip";
import { Button, Input, Label } from "@/components/ui";

export function CreateTripForm() {
  const [state, formAction, pending] = useActionState(createTrip, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom du voyage</Label>
        <Input id="name" name="name" placeholder="Road trip en Italie" required />
      </div>
      <div>
        <Label htmlFor="yourName">Ton nom</Label>
        <Input id="yourName" name="yourName" placeholder="Ivana" required />
      </div>
      <div>
        <Label htmlFor="destination">Destination</Label>
        <Input id="destination" name="destination" placeholder="Rome, Italie" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="startDate">Départ</Label>
          <Input id="startDate" name="startDate" type="date" />
        </div>
        <div>
          <Label htmlFor="endDate">Retour</Label>
          <Input id="endDate" name="endDate" type="date" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="budget">Budget prévu</Label>
          <Input id="budget" name="budget" type="number" min="0" step="0.01" placeholder="1000" />
        </div>
        <div>
          <Label htmlFor="currency">Devise</Label>
          <Input id="currency" name="currency" defaultValue="EUR" maxLength={3} />
        </div>
      </div>
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Création..." : "Créer le voyage"}
      </Button>
    </form>
  );
}
