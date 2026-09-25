import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let totalIncome = 0;
  let totalExpense = 0;

  for (const transaction of transactions) {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    }

    if (transaction.type === "expense") {
      totalExpense += transaction.amount;
    }
  }

  const balance = totalIncome - totalExpense;

  const latestTransactions = transactions.slice(0, 5);

  return {
    user,
    totalIncome,
    totalExpense,
    balance,
    latestTransactions,
  };
}