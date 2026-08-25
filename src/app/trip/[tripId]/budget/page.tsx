import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/require-member";
import { addExpense, deleteExpense } from "@/lib/actions/expenses";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { computeBalances, simplifySettlements } from "@/lib/balances";
import { Badge, Button, Card, EmptyState, Input, Label, PageHeader, Select } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";
import { formatDate, formatMoney } from "@/lib/format";

export default async function BudgetPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  await requireMember(tripId);

  const trip = await prisma.trip.findUniqueOrThrow({ where: { id: tripId } });
  const [expenses, members] = await Promise.all([
    prisma.expense.findMany({
      where: { tripId },
      include: { paidBy: true, splitWith: true },
      orderBy: { date: "desc" },
    }),
    prisma.member.findMany({ where: { tripId }, orderBy: { joinedAt: "asc" } }),
  ]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = new Map<string, number>();
  for (const e of expenses) byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);

  const balances = computeBalances(members, expenses);
  const settlements = simplifySettlements(balances);
  const budgetRemaining = trip.budget != null ? trip.budget - total : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Budget" description="Dépenses du voyage et répartition entre participants." />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total dépensé</p>
          <p className="text-xl font-semibold mt-1">{formatMoney(total, trip.currency)}</p>
        </Card>
        {trip.budget != null && (
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Budget restant</p>
            <p className={`text-xl font-semibold mt-1 ${budgetRemaining != null && budgetRemaining < 0 ? "text-danger" : ""}`}>
              {formatMoney(budgetRemaining ?? 0, trip.currency)}
            </p>
          </Card>
        )}
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Dépenses</p>
          <p className="text-xl font-semibold mt-1">{expenses.length}</p>
        </Card>
      </div>

      <Card className="p-5">
        <form action={addExpense.bind(null, tripId)} className="space-y-3">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" placeholder="Courses, essence, hôtel..." required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="amount">Montant ({trip.currency})</Label>
              <Input id="amount" name="amount" type="number" min="0" step="0.01" required />
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select id="category" name="category" defaultValue="Autre">
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="paidById">Payé par</Label>
              <Select id="paidById" name="paidById" defaultValue={members[0]?.id ?? ""}>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
          </div>
          <div>
            <Label>Partagé entre</Label>
            <div className="flex flex-wrap gap-3 mt-1">
              {members.map((m) => (
                <label key={m.id} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    name="splitWith"
                    value={m.id}
                    defaultChecked
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
                  />
                  {m.name}
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Ajouter la dépense
          </Button>
        </form>
      </Card>

      {members.length > 1 && (
        <Card className="p-5">
          <h3 className="font-medium mb-3">Qui doit quoi</h3>
          {expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Pas encore de dépenses à répartir.</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {balances.map((b) => (
                  <div key={b.memberId} className="flex items-center justify-between text-sm bg-muted rounded-lg px-3 py-2">
                    <span>{b.name}</span>
                    <span className={b.net > 0 ? "text-success font-medium" : b.net < 0 ? "text-danger font-medium" : "text-muted-foreground"}>
                      {b.net > 0 ? "+" : ""}
                      {formatMoney(b.net, trip.currency)}
                    </span>
                  </div>
                ))}
              </div>
              {settlements.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border">
                  {settlements.map((s, idx) => (
                    <p key={idx} className="text-sm">
                      <span className="font-medium">{s.fromName}</span> doit{" "}
                      <span className="font-medium text-primary">{formatMoney(s.amount, trip.currency)}</span> à{" "}
                      <span className="font-medium">{s.toName}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {byCategory.size > 0 && (
        <Card className="p-5">
          <h3 className="font-medium mb-3">Par catégorie</h3>
          <div className="space-y-2">
            {[...byCategory.entries()].sort((a, b) => b[1] - a[1]).map(([cat, amount]) => (
              <div key={cat} className="flex items-center justify-between text-sm">
                <span>{cat}</span>
                <span className="text-muted-foreground">{formatMoney(amount, trip.currency)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {expenses.length === 0 ? (
        <EmptyState title="Aucune dépense" description="Ajoute la première dépense de votre voyage ci-dessus." />
      ) : (
        <Card className="divide-y divide-border">
          {expenses.map((e) => (
            <div key={e.id} className="p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{e.description}</p>
                  <Badge>{e.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {formatDate(e.date)}
                  {e.paidBy && ` · payé par ${e.paidBy.name}`}
                  {e.splitWith.length > 0 && ` · partagé entre ${e.splitWith.length}`}
                </p>
              </div>
              <p className="font-semibold whitespace-nowrap">{formatMoney(e.amount, trip.currency)}</p>
              <DeleteButton action={deleteExpense.bind(null, tripId, e.id)} label="Supprimer la dépense" />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
