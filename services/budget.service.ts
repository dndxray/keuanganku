import { prisma } from "@/lib/prisma";

export async function getBudget(
  userId: string,
  month: string
) {
  const normalizedMonth = month.length >= 7 ? month.slice(0, 7) : month;

  return await prisma.budget.findUnique({
    where: {
      userId_month: {
        userId,
        month: normalizedMonth,
      },
    },
  });
}

export async function createBudget(
  userId: string,
  month: string,
  amount: number
) {
  if (amount <= 0) {
    throw new Error("INVALID_AMOUNT");
  }

  const normalizedMonth = month.length >= 7 ? month.slice(0, 7) : month;

  return await prisma.budget.upsert({
    where: {
      userId_month: {
        userId,
        month: normalizedMonth,
      },
    },
    update: {
      amount,
    },
    create: {
      userId,
      month: normalizedMonth,
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