"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "", label: "Aperçu", icon: "🏠" },
  { href: "/itinerary", label: "Itinéraire", icon: "🗓️" },
  { href: "/budget", label: "Budget", icon: "💶" },
  { href: "/checklist", label: "Checklist", icon: "✅" },
  { href: "/documents", label: "Documents", icon: "📄" },
];

export function TripNav({ tripId }: { tripId: string }) {
  const pathname = usePathname();
  const base = `/trip/${tripId}`;

  return (
    <nav className="border-t border-border bg-card sm:border-t-0 sm:border-b sticky bottom-0 sm:top-0 sm:bottom-auto z-10 order-last sm:order-first">
      <div className="max-w-3xl mx-auto flex sm:gap-1 px-2 sm:px-4">
        {TABS.map((tab) => {
          const href = `${base}${tab.href}`;
          const active = tab.href === "" ? pathname === base : pathname.startsWith(href);
          return (
            <Link
              key={tab.href}
              href={href}
              className={`flex-1 sm:flex-none flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-2.5 sm:py-3 px-2 text-xs sm:text-sm font-medium border-t-2 sm:border-t-0 sm:border-b-2 transition-colors ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-base sm:text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
