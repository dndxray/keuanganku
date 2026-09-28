import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string) {
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  // User
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Semua transaksi milik user
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  // Budget bulan ini
  const budget = await prisma.budget.findUnique({
    where: {
      userId_month: {
        userId,
        month: startOfMonth,
      },
    },
  });

  // Total pemasukan dan pengeluaran sepanjang waktu
  let totalIncome = 0;
  let totalExpense = 0;

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);

    if (transaction.type === "income") {
      totalIncome += amount;
    }

    if (transaction.type === "expense") {
      totalExpense += amount;
    }
  }

  // Saldo
  const balance = totalIncome - totalExpense;

  // Transaksi bulan ini
  const monthlyTransactions = transactions.filter(
    (transaction) =>
      transaction.date >= startOfMonth &&
      transaction.date < startOfNextMonth
  );

  // Pengeluaran bulan ini
  const monthlyExpense = monthlyTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  // Jumlah budget
  const budgetAmount = budget
    ? Number(budget.amount)
    : 0;

  // Persentase budget yang sudah digunakan
  const budgetPercentage =
    budgetAmount > 0
      ? (monthlyExpense / budgetAmount) * 100
      : 0;

  // Sisa budget
  const remainingBudget =
    budgetAmount - monthlyExpense;

  // Status budget
  let budgetStatus:
    | "safe"
    | "warning"
    | "danger"
    | "over" = "safe";

  if (budgetAmount === 0) {
    budgetStatus = "safe";
  } else if (budgetPercentage >= 100) {
    budgetStatus = "over";
  } else if (budgetPercentage >= 80) {
    budgetStatus = "danger";
  } else if (budgetPercentage >= 60) {
    budgetStatus = "warning";
  }

  // 5 transaksi terbaru
  const latestTransactions = transactions
    .slice(0, 5)
    .map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
      createdAt: transaction.createdAt,
    }));

  return {
    user,

    // Keuangan
    totalIncome,
    totalExpense,
    balance,

    // Budget
    budgetAmount,
    monthlyExpense,
    budgetPercentage,
    remainingBudget,
    budgetStatus,

    // Transaksi
    totalTransactions: transactions.length,

    incomeCount: transactions.filter(
      (transaction) => transaction.type === "income"
    ).length,

    expenseCount: transactions.filter(
      (transaction) => transaction.type === "expense"
    ).length,

    latestTransactions,
  };
}