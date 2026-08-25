export type ExpenseForBalance = {
  amount: number;
  paidById: string | null;
  splitWith: { id: string }[];
};

export type MemberLite = { id: string; name: string };

export type Balance = { memberId: string; name: string; net: number };
export type Settlement = { fromId: string; fromName: string; toId: string; toName: string; amount: number };

/** Computes each member's net balance: positive = is owed money, negative = owes money. */
export function computeBalances(members: MemberLite[], expenses: ExpenseForBalance[]): Balance[] {
  const net = new Map<string, number>(members.map((m) => [m.id, 0]));

  for (const expense of expenses) {
    const participants = expense.splitWith.length > 0 ? expense.splitWith : members;
    if (participants.length === 0) continue;
    const share = expense.amount / participants.length;

    for (const participant of participants) {
      if (!net.has(participant.id)) continue;
      net.set(participant.id, (net.get(participant.id) ?? 0) - share);
    }
    if (expense.paidById && net.has(expense.paidById)) {
      net.set(expense.paidById, (net.get(expense.paidById) ?? 0) + expense.amount);
    }
  }

  return members.map((m) => ({ memberId: m.id, name: m.name, net: Math.round((net.get(m.id) ?? 0) * 100) / 100 }));
}

/** Greedy debt simplification: matches biggest debtors with biggest creditors. */
export function simplifySettlements(balances: Balance[]): Settlement[] {
  const EPSILON = 0.01;
  const creditors = balances.filter((b) => b.net > EPSILON).map((b) => ({ ...b })).sort((a, b) => b.net - a.net);
  const debtors = balances.filter((b) => b.net < -EPSILON).map((b) => ({ ...b })).sort((a, b) => a.net - b.net);

  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(-debtor.net, creditor.net);

    if (amount > EPSILON) {
      settlements.push({
        fromId: debtor.memberId,
        fromName: debtor.name,
        toId: creditor.memberId,
        toName: creditor.name,
        amount: Math.round(amount * 100) / 100,
      });
    }

    debtor.net += amount;
    creditor.net -= amount;

    if (Math.abs(debtor.net) < EPSILON) i++;
    if (Math.abs(creditor.net) < EPSILON) j++;
  }

  return settlements;
}
