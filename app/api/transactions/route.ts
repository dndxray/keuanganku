import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get("type");
    const categoryFilter = searchParams.get("category");
    const searchQuery = searchParams.get("search")?.trim();

    const whereClause: {
      userId: string;
      type?: string;
      category?: string;
      description?: { contains: string; mode: "insensitive" };
    } = {
      userId: user.id,
    };

    if (typeFilter === "income" || typeFilter === "expense") {
      whereClause.type = typeFilter;
    }
    if (categoryFilter && categoryFilter !== "all") {
      whereClause.category = categoryFilter;
    }
    if (searchQuery) {
      whereClause.description = {
        contains: searchQuery,
        mode: "insensitive",
      };
    }

    const dbTransactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
    });

    const transactions = dbTransactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    }));

    const allUserTransactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      select: { type: true, amount: true },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const t of allUserTransactions) {
      const amount = Number(t.amount);
      if (t.type === "income") totalIncome += amount;
      if (t.type === "expense") totalExpense += amount;
    }

    return NextResponse.json({
      success: true,
      currentUser: user,
      stats: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        totalTransactions: allUserTransactions.length,
      },
      transactions,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, amount, category, description, date } = body;

    if (type !== "income" && type !== "expense") {
      return NextResponse.json(
        { error: "Tipe transaksi harus 'income' atau 'expense'" },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Nominal transaksi harus lebih dari 0" }, { status: 400 });
    }

    const transactionDate = date ? new Date(date) : new Date();
    if (isNaN(transactionDate.getTime())) {
      return NextResponse.json({ error: "Format tanggal tidak valid" }, { status: 400 });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type,
        amount: parsedAmount,
        category: category?.trim() || "Lainnya",
        description: description?.trim() || "",
        date: transactionDate,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Transaksi berhasil ditambahkan",
        transaction: {
          ...newTransaction,
          amount: Number(newTransaction.amount),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menambahkan transaksi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
