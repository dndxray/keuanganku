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
    <main>
      <h1>Monthly Budget</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="month">
            Bulan
          </label>

          <input
            id="month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="amount">
            Anggaran
          </label>

          <input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Masukkan nominal budget"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Menyimpan..."
            : budget
              ? "Ubah Budget"
              : "Simpan Budget"}
        </button>
      </form>

      {message && (
        <p>{message}</p>
      )}
    </main>
  );
}