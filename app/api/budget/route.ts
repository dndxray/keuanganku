import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getMonthlyOverview, isValidMonth, currentMonth } from "@/lib/budget";
import { createBudget, updateBudget } from "@/services/budget.service";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login terlebih dahulu", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawMonth = searchParams.get("month") || currentMonth();
    const month = rawMonth.length >= 7 ? rawMonth.slice(0, 7) : rawMonth;

    if (!isValidMonth(month)) {
      return NextResponse.json(
        { error: "Format bulan tidak valid (YYYY-MM)", message: "Format bulan tidak valid (YYYY-MM)" },
        { status: 400 }
      );
    }

    const [overview, rawRecord] = await Promise.all([
      getMonthlyOverview(user.id, month),
      prisma.budget.findUnique({
        where: { userId_month: { userId: user.id, month } },
      }),
    ]);

    const budgetRecord = rawRecord
      ? {
          id: rawRecord.id,
          month: rawRecord.month,
          amount: Number(rawRecord.amount),
        }
      : null;

    return NextResponse.json({
      success: true,
      ...overview,
      budget: overview.budget,
      budgetRecord,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memuat data anggaran";
    return NextResponse.json({ error: message, message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login terlebih dahulu", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { month: rawMonth, amount } = body;

    if (!rawMonth || amount === undefined) {
      return NextResponse.json(
        { error: "Bulan dan nominal anggaran wajib diisi", message: "Month and amount are required" },
        { status: 400 }
      );
    }

    const month = rawMonth.length >= 7 ? rawMonth.slice(0, 7) : rawMonth;
    if (!isValidMonth(month)) {
      return NextResponse.json(
        { error: "Format bulan tidak valid (YYYY-MM)", message: "Format bulan tidak valid" },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Nominal harus lebih dari 0", message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    const budget = await createBudget(user.id, month, parsedAmount);

    const formattedBudget = {
      id: budget.id,
      month: budget.month,
      amount: Number(budget.amount),
    };

    return NextResponse.json(
      {
        success: true,
        budget: formattedBudget,
        budgetRecord: formattedBudget,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "INVALID_AMOUNT") {
      return NextResponse.json(
        { error: "Nominal harus lebih dari 0", message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Gagal menyimpan anggaran";
    return NextResponse.json({ error: message, message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login terlebih dahulu", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { budgetId, month: rawMonth, amount } = body;

    if (amount === undefined || (!budgetId && !rawMonth)) {
      return NextResponse.json(
        { error: "ID anggaran / bulan dan nominal wajib diisi", message: "Budget ID and amount are required" },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Nominal harus lebih dari 0", message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    let budget;
    if (budgetId) {
      budget = await updateBudget(user.id, budgetId, parsedAmount);
    } else {
      const month = rawMonth.length >= 7 ? rawMonth.slice(0, 7) : rawMonth;
      budget = await createBudget(user.id, month, parsedAmount);
    }

    const formattedBudget = {
      id: budget.id,
      month: budget.month,
      amount: Number(budget.amount),
    };

    return NextResponse.json({
      success: true,
      budget: formattedBudget,
      budgetRecord: formattedBudget,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "INVALID_AMOUNT") {
        return NextResponse.json(
          { error: "Nominal harus lebih dari 0", message: "Amount must be greater than 0" },
          { status: 400 }
        );
      }
      if (error.message === "BUDGET_NOT_FOUND") {
        return NextResponse.json(
          { error: "Anggaran tidak ditemukan", message: "Budget not found" },
          { status: 404 }
        );
      }
    }

    const message = error instanceof Error ? error.message : "Gagal memperbarui anggaran";
    return NextResponse.json({ error: message, message }, { status: 500 });
  }
}
