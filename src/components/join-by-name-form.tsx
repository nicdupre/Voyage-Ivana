"use client";

import { useActionState } from "react";
import { joinTripById, type ActionState } from "@/lib/actions/trip";
import { Button, Input, Label } from "@/components/ui";

export function JoinByNameForm({ tripId }: { tripId: string }) {
  const boundAction = async (prevState: ActionState, formData: FormData) => joinTripById(tripId, prevState, formData);
  const [state, formAction, pending] = useActionState(boundAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Ton nom</Label>
        <Input id="name" name="name" placeholder="Ton prénom" required autoFocus />
      </div>
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Connexion..." : "Rejoindre le voyage"}
      </Button>
    </form>
  );
}
