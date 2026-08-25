export const EXPENSE_CATEGORIES = [
  "Transport",
  "Hébergement",
  "Nourriture",
  "Activités",
  "Shopping",
  "Autre",
] as const;

export const CHECKLIST_CATEGORIES = [
  { value: "packing", label: "Bagages" },
  { value: "documents", label: "Documents" },
  { value: "todo", label: "À faire" },
] as const;

export const DOCUMENT_TYPES = [
  { value: "billet", label: "Billet" },
  { value: "reservation", label: "Réservation" },
  { value: "passeport", label: "Passeport / ID" },
  { value: "assurance", label: "Assurance" },
  { value: "autre", label: "Autre" },
] as const;
