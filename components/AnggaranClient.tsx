"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowDownCircle,
  Calendar,
  CheckCircle2,
  PiggyBank,
  Receipt,
} from "lucide-react";

type MonthOption = { value: string; label: string };

type Expense = {
  id: string;
  date: string;
  category: string | null;
  description: string | null;
  amount: number;
};

type Overview = {
  month: string;
  label: string;
  budget: { amount: number; isDefault: boolean };
  totalExpense: number;
  totalTransactions: number;
  expenses: Expense[];
};

type Props = {
  months: MonthOption[];
  currentMonth: string;
};

export default function AnggaranClient({ months, currentMonth: initialMonth }: Props) {
  const router = useRouter();

  const [month, setMonth] = useState(initialMonth);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/budget?month=${month}`);

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        const data = await res.json();

        if (res.ok && data.success) {
          setOverview(data);
        } else {
          showToast(data.error || "Gagal memuat data anggaran", "error");
        }
      } catch {
        showToast("Gagal terhubung ke server", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const formatDateIndo = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header + pilih bulan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Anggaran Bulanan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pilih bulan untuk melihat anggaran dan total pengeluaran pada bulan tersebut.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#6B2828]" />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-white text-sm font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6B2828]"
          >
            {months.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading || !overview ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-[#6B2828] border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm font-medium">Memuat data anggaran...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
              <div className="flex items-center gap-2 text-[#6B2828] mb-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/70 flex items-center justify-center">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Anggaran {overview.label}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#6B2828]">
                {formatRupiah(overview.budget.amount)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {overview.budget.isDefault
                  ? "Belum diatur, memakai anggaran default"
                  : "Anggaran yang tersimpan untuk bulan ini"}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
              <div className="flex items-center gap-2 text-[#8F2828] mb-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/70 flex items-center justify-center">
                  <ArrowDownCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Total Pengeluaran {overview.label}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#8F2828]">
                {formatRupiah(overview.totalExpense)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {overview.totalTransactions} transaksi pengeluaran
              </p>
            </div>
          </div>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Pengeluaran {overview.label}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Hanya transaksi pengeluaran milik akunmu yang dihitung.
              </p>
            </div>

            {overview.expenses.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-[#6B2828] flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Belum Ada Pengeluaran</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Belum ada transaksi pengeluaran di bulan ini.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-6">Tanggal</th>
                      <th className="py-3.5 px-6">Kategori</th>
                      <th className="py-3.5 px-6">Deskripsi / Catatan</th>
                      <th className="py-3.5 px-6 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {overview.expenses.map((item) => (
                      <tr key={item.id} className="hover:bg-rose-50/20 transition-colors">
                        <td className="py-4 px-6 text-xs text-slate-600 font-medium whitespace-nowrap">
                          {formatDateIndo(item.date)}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6B2828]"></span>
                            {item.category || "Umum"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-800 font-medium max-w-xs truncate">
                          {item.description || "-"}
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-[#8F2828] whitespace-nowrap">
                          - {formatRupiah(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Total pengeluaran: <strong>{formatRupiah(overview.totalExpense)}</strong>
              </span>
              <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Hanya data milik akun yang sedang login
              </span>
            </div>
          </section>
        </>
      )}

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold border ${
              toast.type === "success"
                ? "bg-slate-900 text-white border-slate-800"
                : "bg-red-600 text-white border-red-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-300" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
