import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  Receipt,
  Wallet,
  PiggyBank,
  TrendingDown,
  ExternalLink,
  CalendarDays,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import AppShell from "@/components/AppShell";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const {
    user,
    totalIncome,
    totalExpense,
    balance,
    latestTransactions,
    budgetAmount,
    monthlyExpense,
    budgetPercentage,
    remainingBudget,
    budgetStatus,
  } = await getDashboardData(session.userId);

  return (
    <AppShell
      userName={session.user.name}
      userEmail={session.user.email}
      active="dashboard"
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {/* =========================================================
            WELCOME
        ========================================================= */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6B2828] to-[#4D1717] text-white shadow-sm">
          <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute right-20 -bottom-28 w-72 h-72 rounded-full bg-white/5" />

          <div className="relative p-6 sm:p-8">
            <p className="text-xs font-medium text-rose-200 mb-2">
              Ringkasan Keuangan
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Halo, {user?.name ?? "Pengguna"}!
            </h1>

            <p className="text-sm text-rose-100 max-w-xl leading-relaxed">
              Pantau kondisi keuanganmu, mulai dari pemasukan,
              pengeluaran, saldo, hingga penggunaan budget bulan ini.
            </p>
          </div>
        </section>

        {/* =========================================================
            RINGKASAN KEUANGAN
        ========================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Pemasukan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Pemasukan
                </p>

                <p className="text-2xl font-bold text-emerald-700 mt-1">
                  {formatRupiah(totalIncome)}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <ArrowUpCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Uang masuk
            </div>
          </div>

          {/* Pengeluaran */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Pengeluaran
                </p>

                <p className="text-2xl font-bold text-[#8F2828] mt-1">
                  {formatRupiah(totalExpense)}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center">
                <ArrowDownCircle className="w-5 h-5 text-[#8F2828]" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-[#A03535]" />
              Total biaya
            </div>
          </div>

          {/* Saldo */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Saldo
                </p>

                <p
                  className={`text-2xl font-bold mt-1 ${
                    balance < 0
                      ? "text-rose-700"
                      : "text-amber-800"
                  }`}
                >
                  {formatRupiah(balance)}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-amber-700" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Pemasukan − pengeluaran
            </div>
          </div>
        </section>

        {/* =========================================================
            BUDGET BULAN INI
        ========================================================= */}
        <section
          className={`rounded-2xl border shadow-sm overflow-hidden ${
            budgetStatus === "over"
              ? "border-rose-200 bg-rose-50"
              : budgetStatus === "danger"
              ? "border-orange-200 bg-orange-50"
              : budgetStatus === "warning"
              ? "border-amber-200 bg-amber-50"
              : "border-slate-200 bg-white"
          }`}
        >
          {/* Budget Header */}
          <div
            className={`px-5 sm:px-6 py-5 border-b ${
              budgetStatus === "over"
                ? "bg-rose-100/70 border-rose-200"
                : budgetStatus === "danger"
                ? "bg-orange-100/70 border-orange-200"
                : budgetStatus === "warning"
                ? "bg-amber-100/70 border-amber-200"
                : "bg-emerald-50 border-emerald-100"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    budgetStatus === "over"
                      ? "bg-rose-200 text-rose-700"
                      : budgetStatus === "danger"
                      ? "bg-orange-200 text-orange-700"
                      : budgetStatus === "warning"
                      ? "bg-amber-200 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {budgetStatus === "over" ? (
                    <TrendingDown className="w-6 h-6" />
                  ) : (
                    <PiggyBank className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Budget Bulan Ini
                  </p>

                  <h2
                    className={`text-xl font-bold mt-0.5 ${
                      budgetStatus === "over"
                        ? "text-rose-800"
                        : budgetStatus === "danger"
                        ? "text-orange-800"
                        : budgetStatus === "warning"
                        ? "text-amber-800"
                        : "text-emerald-800"
                    }`}
                  >
                    {budgetStatus === "over"
                      ? "Melebihi Budget"
                      : budgetStatus === "danger"
                      ? "Hampir Habis"
                      : budgetStatus === "warning"
                      ? "Perlu Diperhatikan"
                      : "Dalam Batas Aman"}
                  </h2>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Terpakai
                </p>

                <p
                  className={`text-3xl font-bold ${
                    budgetStatus === "over"
                      ? "text-rose-700"
                      : budgetStatus === "danger"
                      ? "text-orange-700"
                      : budgetStatus === "warning"
                      ? "text-amber-700"
                      : "text-emerald-700"
                  }`}
                >
                  {Math.round(budgetPercentage)}%
                </p>
              </div>
            </div>
          </div>

          {/* Budget Content */}
          <div className="p-5 sm:p-6">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-1">
                  Total Budget
                </p>

                <p className="text-lg font-bold text-slate-800">
                  {formatRupiah(budgetAmount)}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-1">
                  Pengeluaran Bulan Ini
                </p>

                <p className="text-lg font-bold text-[#8F2828]">
                  {formatRupiah(monthlyExpense)}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500 mb-1">
                  Sisa Budget
                </p>

                <p
                  className={`text-lg font-bold ${
                    remainingBudget < 0
                      ? "text-rose-700"
                      : "text-emerald-700"
                  }`}
                >
                  {formatRupiah(remainingBudget)}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-600">
                  Penggunaan Budget
                </span>

                <span className="text-xs text-slate-500">
                  {formatRupiah(monthlyExpense)} /{" "}
                  {formatRupiah(budgetAmount)}
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    budgetStatus === "over"
                      ? "bg-rose-600"
                      : budgetStatus === "danger"
                      ? "bg-orange-500"
                      : budgetStatus === "warning"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${Math.min(budgetPercentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            TRANSAKSI TERBARU
        ========================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Header transaksi */}
          <div className="px-5 sm:px-6 py-5 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-[#6B2828]" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Transaksi Terbaru
                    </h2>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Aktivitas keuangan terakhirmu
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/transaksi"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Lihat Semua
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* =======================================================
              EMPTY STATE
          ======================================================= */}
          {latestTransactions.length === 0 ? (
            <div className="px-6 py-14 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Receipt className="w-7 h-7 text-slate-400" />
              </div>

              <h3 className="font-bold text-slate-800">
                Belum ada transaksi
              </h3>

              <p className="text-xs text-slate-500 mt-1 mb-5">
                Transaksi yang kamu catat akan muncul di sini.
              </p>

              <Link
                href="/transaksi"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A03535] hover:bg-[#8B2E2E] text-white text-sm font-semibold transition"
              >
                <Plus className="w-4 h-4" />
                Catat Transaksi
              </Link>
            </div>
          ) : (
            <>
              {/* =====================================================
                  DESKTOP TABLE
              ===================================================== */}
              <div className="hidden md:block overflow-x-auto">

                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">

                      <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Transaksi
                      </th>

                      <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Kategori
                      </th>

                      <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Tanggal
                      </th>

                      <th className="text-center px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Jenis
                      </th>

                      <th className="text-right px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Nominal
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {latestTransactions.map((transaction) => {
                      const isIncome =
                        transaction.type === "income";

                      return (
                        <tr
                          key={transaction.id}
                          className="hover:bg-slate-50/70 transition"
                        >

                          {/* Transaksi */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">

                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                  isIncome
                                    ? "bg-emerald-50"
                                    : "bg-rose-50"
                                }`}
                              >
                                {isIncome ? (
                                  <ArrowUpCircle
                                    className="w-4 h-4 text-emerald-600"
                                  />
                                ) : (
                                  <ArrowDownCircle
                                    className="w-4 h-4 text-[#A03535]"
                                  />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate max-w-[240px]">
                                  {transaction.description ||
                                    transaction.category ||
                                    "Transaksi"}
                                </p>

                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {transaction.description
                                    ? transaction.category || "Umum"
                                    : "Catatan transaksi"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Kategori */}
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                              {transaction.category || "Umum"}
                            </span>
                          </td>

                          {/* Tanggal */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-xs text-slate-600 whitespace-nowrap">
                              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                              {formatDate(transaction.date)}
                            </div>
                          </td>

                          {/* Jenis */}
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                isIncome
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {isIncome ? (
                                <>
                                  <ArrowUpCircle className="w-3 h-3" />
                                  Pemasukan
                                </>
                              ) : (
                                <>
                                  <ArrowDownCircle className="w-3 h-3" />
                                  Pengeluaran
                                </>
                              )}
                            </span>
                          </td>

                          {/* Nominal */}
                          <td
                            className={`px-6 py-4 text-right font-bold text-sm whitespace-nowrap ${
                              isIncome
                                ? "text-emerald-600"
                                : "text-[#8F2828]"
                            }`}
                          >
                            {isIncome ? "+" : "-"}{" "}
                            {formatRupiah(transaction.amount)}
                          </td>

                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              </div>

              {/* =====================================================
                  MOBILE LIST
              ===================================================== */}
              <div className="md:hidden divide-y divide-slate-100">

                {latestTransactions.map((transaction) => {
                  const isIncome =
                    transaction.type === "income";

                  return (
                    <div
                      key={transaction.id}
                      className="px-5 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">

                        <div className="flex items-center gap-3 min-w-0">

                          <div
                            className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                              isIncome
                                ? "bg-emerald-50"
                                : "bg-rose-50"
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpCircle className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <ArrowDownCircle className="w-5 h-5 text-[#A03535]" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {transaction.description ||
                                transaction.category ||
                                "Transaksi"}
                            </p>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] text-slate-500">
                                {transaction.category || "Umum"}
                              </span>

                              <span className="text-slate-300">
                                •
                              </span>

                              <span className="text-[11px] text-slate-400">
                                {formatDate(transaction.date)}
                              </span>
                            </div>
                          </div>

                        </div>

                        <div className="text-right shrink-0">

                          <p
                            className={`text-sm font-bold ${
                              isIncome
                                ? "text-emerald-600"
                                : "text-[#8F2828]"
                            }`}
                          >
                            {isIncome ? "+" : "-"}{" "}
                            {formatRupiah(transaction.amount)}
                          </p>

                          <span
                            className={`inline-block mt-1 text-[10px] font-semibold ${
                              isIncome
                                ? "text-emerald-600"
                                : "text-rose-600"
                            }`}
                          >
                            {isIncome
                              ? "Pemasukan"
                              : "Pengeluaran"}
                          </span>

                        </div>

                      </div>
                    </div>
                  );
                })}

              </div>

              {/* =====================================================
                  FOOTER
              ===================================================== */}
              <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <p className="text-xs text-slate-500">
                  Menampilkan{" "}
                  <span className="font-semibold text-slate-700">
                    {latestTransactions.length}
                  </span>{" "}
                  transaksi terbaru
                </p>

                <Link
                  href="/transaksi"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B2828] hover:text-[#8B2E2E] transition"
                >
                  Lihat seluruh transaksi
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

              </div>
            </>
          )}
        </section>

      </div>
    </AppShell>
  );
}