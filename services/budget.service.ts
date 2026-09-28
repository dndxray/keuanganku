import { prisma } from "@/lib/prisma";

export async function getBudget(
  userId: string,
  month: Date
) {
  return await prisma.budget.findUnique({
    where: {
      userId_month: {
        userId,
        month,
      },
    },
  });
}

export async function createBudget(
  userId: string,
  month: Date,
  amount: number
) {
  if (amount <= 0) {
    throw new Error("INVALID_AMOUNT");
  }

  return await prisma.budget.create({
    data: {
      userId,
      month,
      amount,
    },
  });
}

export async function updateBudget(
  userId: string,
  budgetId: string,
  amount: number
) {
  if (amount <= 0) {
    throw new Error("INVALID_AMOUNT");
  }

  const budget = await prisma.budget.findFirst({
    where: {
      id: budgetId,
      userId,
    },
  });

  if (!budget) {
    throw new Error("BUDGET_NOT_FOUND");
  }

  return await prisma.budget.update({
    where: {
      id: budgetId,
    },
    data: {
      amount,
    },
  });
}