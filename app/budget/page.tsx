"use client";

import { FormEvent, useEffect, useState } from "react";

type Budget = {
  id: string;
  month: string;
  amount: string;
};

export default function BudgetPage() {
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadBudget(selectedMonth: string) {
    if (!selectedMonth) return;

    const response = await fetch(
      `/api/budget?month=${selectedMonth}-01`
    );

    const data = await response.json();

    if (response.ok) {
      setBudget(data.budget);

      if (data.budget) {
        setAmount(String(data.budget.amount));
      } else {
        setAmount("");
      }
    }
  }

  useEffect(() => {
    if (month) {
      loadBudget(month);
    }
  }, [month]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/budget", {
        method: budget ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          budget
            ? {
                budgetId: budget.id,
                amount: Number(amount),
              }
            : {
                month: `${month}-01`,
                amount: Number(amount),
              }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Terjadi kesalahan");
        return;
      }

      setBudget(data.budget);
      setMessage(
        budget
          ? "Budget berhasil diperbarui"
          : "Budget berhasil dibuat"
      );
    } catch {
      setMessage("Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  }

  return (
  <main className="min-h-screen bg-[#f8f6f3] p-6 md:p-10">
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#511E1D]">
          Monthly Budget
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Atur batas pengeluaran bulananmu agar keuangan lebih terkontrol.
        </p>
      </div>

      {/* Budget Card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bulan */}
          <div>
            <label
              htmlFor="month"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Bulan
            </label>

            <input
              id="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#511E1D] focus:ring-2 focus:ring-[#511E1D]/10"
            />
          </div>

          {/* Anggaran */}
          <div>
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Anggaran Pengeluaran
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                Rp
              </span>

              <input
                id="amount"
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Masukkan nominal budget"
                required
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-700 outline-none transition focus:border-[#511E1D] focus:ring-2 focus:ring-[#511E1D]/10"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#511E1D] px-5 py-3 font-semibold text-white transition hover:bg-[#3f1716] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Menyimpan..."
              : budget
                ? "Ubah Budget"
                : "Simpan Budget"}
          </button>

          {/* Message */}
          {message && (
            <div className="rounded-xl bg-[#f5eeee] px-4 py-3 text-sm font-medium text-[#511E1D]">
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Existing Budget */}
      {budget && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Budget bulan yang dipilih
          </p>

          <p className="mt-2 text-2xl font-bold text-[#511E1D]">
            Rp {Number(budget.amount).toLocaleString("id-ID")}
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Budget sudah tersimpan dan dapat diubah kembali.
          </p>
        </div>
      )}
    </div>
  </main>
);
}