import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/require-member";
import { addChecklistItem, deleteChecklistItem } from "@/lib/actions/checklist";
import { CHECKLIST_CATEGORIES } from "@/lib/constants";
import { Button, Card, EmptyState, Input, Label, PageHeader, Select } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";
import { ChecklistToggle } from "@/components/checklist-toggle";

export default async function ChecklistPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  await requireMember(tripId);

  const [items, members] = await Promise.all([
    prisma.checklistItem.findMany({ where: { tripId }, include: { assignedTo: true }, orderBy: { createdAt: "asc" } }),
    prisma.member.findMany({ where: { tripId }, orderBy: { joinedAt: "asc" } }),
  ]);

  const done = items.filter((i) => i.done).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Checklist"
        description={items.length > 0 ? `${done} / ${items.length} terminé${done > 1 ? "s" : ""}` : "Bagages, documents et tâches avant le départ."}
      />

      <Card className="p-5">
        <form action={addChecklistItem.bind(null, tripId)} className="space-y-3">
          <div>
            <Label htmlFor="title">Tâche</Label>
            <Input id="title" name="title" placeholder="Réserver la voiture de location" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select id="category" name="category" defaultValue="todo">
                {CHECKLIST_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="assignedToId">Assigné à</Label>
              <Select id="assignedToId" name="assignedToId" defaultValue="">
                <option value="">Personne</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Ajouter
          </Button>
        </form>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="Checklist vide" description="Ajoute une première tâche ci-dessus." />
      ) : (
        <div className="space-y-6">
          {CHECKLIST_CATEGORIES.map((cat) => {
            const catItems = items.filter((i) => i.category === cat.value);
            if (catItems.length === 0) return null;
            return (
              <div key={cat.value}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{cat.label}</h3>
                <Card className="divide-y divide-border">
                  {catItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-3">
                      <ChecklistToggle tripId={tripId} itemId={item.id} done={item.done} />
                      <div className="flex-1 min-w-0">
                        <p className={item.done ? "line-through text-muted-foreground" : ""}>{item.title}</p>
                        {item.assignedTo && <p className="text-xs text-muted-foreground">{item.assignedTo.name}</p>}
                      </div>
                      <DeleteButton action={deleteChecklistItem.bind(null, tripId, item.id)} label="Supprimer la tâche" />
                    </div>
                  ))}
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
