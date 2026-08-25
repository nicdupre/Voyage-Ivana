"use client";

import { useActionState } from "react";
import { joinTripByCode } from "@/lib/actions/trip";
import { Button, Input, Label } from "@/components/ui";

export function JoinTripForm() {
  const [state, formAction, pending] = useActionState(joinTripByCode, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="code">Code d&apos;invitation</Label>
        <Input
          id="code"
          name="code"
          placeholder="ABC123"
          maxLength={6}
          className="uppercase tracking-widest font-mono"
          required
        />
      </div>
      <div>
        <Label htmlFor="joinName">Ton nom</Label>
        <Input id="joinName" name="name" placeholder="Marco" required />
      </div>
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" variant="secondary" disabled={pending} className="w-full">
        {pending ? "Connexion..." : "Rejoindre le voyage"}
      </Button>
    </form>
  );
}
