import { prisma } from "@/lib/prisma";

export const DEFAULT_BUDGET = 2000000;
export const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export function isValidMonth(value: string | null | undefined): value is string {
  return !!value && MONTH_PATTERN.test(value);
}

// Bulan dihitung pakai zona waktu Jakarta supaya gak geser di akhir/awal bulan
export function currentMonth() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());
}

export function shiftMonth(month: string, diff: number) {
  const [year, index] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, index - 1 + diff, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(month: string) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00.000Z`));
}

export function monthRange(month: string) {
  return {
    start: new Date(`${month}-01T00:00:00.000Z`),
    end: new Date(`${shiftMonth(month, 1)}-01T00:00:00.000Z`),
  };
}

export function listMonths(total = 12) {
  const month = currentMonth();

  return Array.from({ length: total }, (_, i) => {
    const value = shiftMonth(month, -i);
    return { value, label: monthLabel(value) };
  });
}

export async function getMonthlyOverview(userId: string, month: string) {
  const { start, end } = monthRange(month);

  const [budget, expenses] = await Promise.all([
    prisma.budget.findUnique({
      where: { userId_month: { userId, month } },
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        type: "expense",
        date: { gte: start, lt: end },
      },
      orderBy: { date: "desc" },
    }),
  ]);

  const list = expenses.map((t) => ({ ...t, amount: Number(t.amount) }));

  return {
    month,
    label: monthLabel(month),
    budget: {
      amount: budget ? Number(budget.amount) : DEFAULT_BUDGET,
      isDefault: !budget,
    },
    totalExpense: list.reduce((sum, t) => sum + t.amount, 0),
    totalTransactions: list.length,
    expenses: list,
  };
}
