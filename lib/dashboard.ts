import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  let totalIncome = 0;
  let totalExpense = 0;

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);

    if (transaction.type === "income") totalIncome += amount;
    if (transaction.type === "expense") totalExpense += amount;
  }

  const balance = totalIncome - totalExpense;

  const latestTransactions = transactions.slice(0, 5).map((t) => ({
    ...t,
    amount: Number(t.amount),
  }));

  return { user, totalIncome, totalExpense, balance, latestTransactions };
}