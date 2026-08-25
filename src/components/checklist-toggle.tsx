"use client";

import { useTransition } from "react";
import { toggleChecklistItem } from "@/lib/actions/checklist";

export function ChecklistToggle({ tripId, itemId, done }: { tripId: string; itemId: string; done: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      defaultChecked={done}
      disabled={pending}
      onChange={(e) => startTransition(() => toggleChecklistItem(tripId, itemId, e.target.checked))}
      className="h-5 w-5 rounded-md border-border text-primary focus:ring-primary/40 cursor-pointer disabled:opacity-50"
    />
  );
}
