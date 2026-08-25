"use client";

import { useTransition } from "react";

export function DeleteButton({ action, label = "Supprimer" }: { action: () => Promise<void>; label?: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => action())}
      className="text-muted-foreground hover:text-danger transition-colors disabled:opacity-50 cursor-pointer text-sm"
      aria-label={label}
      title={label}
    >
      ✕
    </button>
  );
}
