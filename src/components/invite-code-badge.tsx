"use client";

import { useState } from "react";

export function InviteCodeBadge({ code, tripId }: { code: string; tripId: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/trip/${tripId}/join`;
    const text = `Rejoins mon voyage sur Voyage Ivana !\nCode : ${code}\nLien : ${url}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable, ignore silently
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copier le code et le lien d'invitation"
      className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 text-accent-foreground px-3 py-1.5 text-xs font-medium hover:bg-accent/25 transition-colors cursor-pointer"
    >
      <span className="font-mono tracking-widest">{code}</span>
      <span>{copied ? "Copié !" : "🔗 Inviter"}</span>
    </button>
  );
}
