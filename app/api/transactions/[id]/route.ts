import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/memoryStore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "ID transaksi tidak disertakan" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { type, amount, category, description, date } = body;

    if (type && type !== "income" && type !== "expense") {
      return NextResponse.json(
        { error: "Tipe transaksi harus 'income' atau 'expense'" },
        { status: 400 }
      );
    }

    let parsedAmount: number | undefined;
    if (amount !== undefined) {
      const num = Number(amount);
      if (isNaN(num) || num <= 0) {
        return NextResponse.json(
          { error: "Nominal harus berupa angka lebih dari 0" },
          { status: 400 }
        );
      }
      parsedAmount = num;
    }

    let parsedDate: Date | undefined;
    if (date) {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return NextResponse.json(
          { error: "Format tanggal tidak valid" },
          { status: 400 }
        );
      }
      parsedDate = d;
    }

    try {
      const existingTransaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!existingTransaction) {
        return NextResponse.json(
          { error: "Transaksi tidak ditemukan" },
          { status: 404 }
        );
      }

      if (existingTransaction.userId !== user.id) {
        return NextResponse.json(
          {
            error: "Forbidden: Anda tidak memiliki akses untuk mengubah transaksi milik pengguna lain!",
          },
          { status: 403 }
        );
      }

      const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data: {
          type: type ?? existingTransaction.type,
          amount: parsedAmount ?? existingTransaction.amount,
          category: category !== undefined ? category.trim() : existingTransaction.category,
          description: description !== undefined ? description.trim() : existingTransaction.description,
          date: parsedDate ?? existingTransaction.date,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Transaksi berhasil diperbarui",
        transaction: {
          ...updatedTransaction,
          amount: Number(updatedTransaction.amount),
        },
      });
    } catch {
      // Fallback in-memory
      const existingMem = memoryStore.findById(id);
      if (!existingMem) {
        return NextResponse.json(
          { error: "Transaksi tidak ditemukan" },
          { status: 404 }
        );
      }

      if (existingMem.userId !== user.id && existingMem.userId !== "user-default-01") {
        return NextResponse.json(
          {
            error: "Forbidden: Anda tidak memiliki akses untuk mengubah transaksi milik pengguna lain!",
          },
          { status: 403 }
        );
      }

      const updated = memoryStore.update(id, {
        ...(type && { type }),
        ...(parsedAmount !== undefined && { amount: parsedAmount }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(parsedDate && { date: parsedDate }),
      });

      return NextResponse.json({
        success: true,
        message: "Transaksi berhasil diperbarui",
        transaction: updated,
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui transaksi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "ID transaksi tidak disertakan" },
        { status: 400 }
      );
    }

    try {
      const existingTransaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!existingTransaction) {
        return NextResponse.json(
          { error: "Transaksi tidak ditemukan" },
          { status: 404 }
        );
      }

      if (existingTransaction.userId !== user.id) {
        return NextResponse.json(
          {
            error: "Forbidden: Anda tidak memiliki hak untuk menghapus transaksi milik pengguna lain!",
          },
          { status: 403 }
        );
      }

      await prisma.transaction.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: "Transaksi berhasil dihapus secara permanen",
      });
    } catch {
      // Fallback in-memory
      const existingMem = memoryStore.findById(id);
      if (!existingMem) {
        return NextResponse.json(
          { error: "Transaksi tidak ditemukan" },
          { status: 404 }
        );
      }

      if (existingMem.userId !== user.id && existingMem.userId !== "user-default-01") {
        return NextResponse.json(
          {
            error: "Forbidden: Anda tidak memiliki hak untuk menghapus transaksi milik pengguna lain!",
          },
          { status: 403 }
        );
      }

      memoryStore.delete(id);

      return NextResponse.json({
        success: true,
        message: "Transaksi berhasil dihapus secara permanen",
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal menghapus transaksi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
