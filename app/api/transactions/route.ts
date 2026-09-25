import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/memoryStore";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get("type");
    const categoryFilter = searchParams.get("category");
    const searchQuery = searchParams.get("search");

    let transactions: Array<{
      id: string;
      userId: string;
      type: "income" | "expense";
      amount: number;
      category: string | null;
      description: string | null;
      date: Date;
      createdAt: Date;
    }> = [];

    let totalIncome = 0;
    let totalExpense = 0;

    try {
      const whereClause: {
        userId: string;
        type?: string;
        category?: string;
        description?: { contains: string; mode: "insensitive" };
      } = {
        userId: user.id,
      };

      if (typeFilter && (typeFilter === "income" || typeFilter === "expense")) {
        whereClause.type = typeFilter;
      }
      if (categoryFilter && categoryFilter !== "all") {
        whereClause.category = categoryFilter;
      }
      if (searchQuery && searchQuery.trim()) {
        whereClause.description = {
          contains: searchQuery.trim(),
          mode: "insensitive",
        };
      }

      const dbTransactions = await prisma.transaction.findMany({
        where: whereClause,
        orderBy: { date: "desc" },
      });

      transactions = dbTransactions.map((t) => ({
        ...t,
        type: t.type as "income" | "expense",
        amount: Number(t.amount),
      }));

      const allUserTransactions = await prisma.transaction.findMany({
        where: { userId: user.id },
        select: { type: true, amount: true },
      });

      for (const t of allUserTransactions) {
        const amt = Number(t.amount) || 0;
        if (t.type === "income") totalIncome += amt;
        if (t.type === "expense") totalExpense += amt;
      }
    } catch {
      // Fallback in-memory
      const allMem = memoryStore.getAll(user.id);
      for (const t of allMem) {
        if (t.type === "income") totalIncome += t.amount;
        if (t.type === "expense") totalExpense += t.amount;
      }

      let filtered = allMem;
      if (typeFilter && (typeFilter === "income" || typeFilter === "expense")) {
        filtered = filtered.filter((t) => t.type === typeFilter);
      }
      if (categoryFilter && categoryFilter !== "all") {
        filtered = filtered.filter((t) => t.category === categoryFilter);
      }
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((t) =>
          (t.description || "").toLowerCase().includes(q)
        );
      }
      transactions = filtered.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    const balance = totalIncome - totalExpense;

    return NextResponse.json({
      success: true,
      currentUser: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      stats: {
        totalIncome,
        totalExpense,
        balance,
        totalTransactions: transactions.length,
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
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, amount, category, description, date } = body;

    if (!type || (type !== "income" && type !== "expense")) {
      return NextResponse.json(
        { error: "Tipe transaksi harus 'income' atau 'expense'" },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Nominal transaksi harus lebih dari 0" },
        { status: 400 }
      );
    }

    const transactionDate = date ? new Date(date) : new Date();
    if (isNaN(transactionDate.getTime())) {
      return NextResponse.json(
        { error: "Format tanggal tidak valid" },
        { status: 400 }
      );
    }

    try {
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
    } catch {
      // Fallback in-memory
      const newTransaction = memoryStore.create({
        userId: user.id,
        type,
        amount: parsedAmount,
        category: category?.trim() || "Lainnya",
        description: description?.trim() || "",
        date: transactionDate,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Transaksi berhasil ditambahkan",
          transaction: newTransaction,
        },
        { status: 201 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menambahkan transaksi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
