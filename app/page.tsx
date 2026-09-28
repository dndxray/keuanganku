import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowDownCircle, ArrowUpCircle, Plus, Receipt, Wallet } from "lucide-react";
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
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { user, totalIncome, totalExpense, balance, latestTransactions } = await getDashboardData(
    session.userId
  );

  return (
    <AppShell userName={session.user.name} userEmail={session.user.email} active="dashboard">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6B2828] via-[#5C1F1F] to-[#451414] text-white p-6 sm:p-8 shadow-md">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-rose-200 mb-3 border border-white/10">
              Ringkasan Keuangan
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Halo, {user?.name ?? "Pengguna"}!
            </h1>
            <p className="text-sm sm:text-base text-rose-100 leading-relaxed">
              Berikut ringkasan keuangan pribadimu. Seluruh angka di bawah ini dihitung hanya dari
              transaksi milik akunmu.
            </p>
          </div>
        </div>

        {/* Kartu Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-2 text-emerald-700 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center">
                <ArrowUpCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Total Pemasukan</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{formatRupiah(totalIncome)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Uang masuk</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-2 text-[#8F2828] mb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/70 flex items-center justify-center">
                <ArrowDownCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Total Pengeluaran</span>
            </div>
            <p className="text-2xl font-bold text-[#8F2828]">{formatRupiah(totalExpense)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Total biaya</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-2 text-amber-700 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Saldo</span>
            </div>
            <p
              className={`text-2xl font-bold ${balance < 0 ? "text-rose-700" : "text-amber-900"}`}
            >
              {formatRupiah(balance)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Pemasukan − pengeluaran</p>
          </div>
        </div>

        {/* Transaksi Terbaru */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Transaksi Terbaru</h2>
              <p className="text-xs text-slate-500 mt-1">5 transaksi terakhir milik akunmu.</p>
            </div>
            <Link
              href="/transaksi"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#A03535] hover:bg-[#8B2E2E] text-white text-sm font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Kelola Transaksi
            </Link>
          </div>

          {latestTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-[#6B2828] flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Belum Ada Transaksi</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Mulai catat pemasukan dan pengeluaranmu supaya saldo di atas ikut terisi.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Tanggal</th>
                    <th className="py-3.5 px-6">Deskripsi / Catatan</th>
                    <th className="py-3.5 px-6 text-center">Jenis</th>
                    <th className="py-3.5 px-6 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {latestTransactions.map((transaction) => {
                    const isIncome = transaction.type === "income";

                    return (
                      <tr key={transaction.id} className="hover:bg-rose-50/20 transition-colors">
                        <td className="py-4 px-6 text-xs text-slate-600 font-medium whitespace-nowrap">
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="py-4 px-6 text-slate-800 font-medium max-w-xs truncate">
                          {transaction.description || transaction.category || "-"}
                        </td>
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              isIncome
                                ? "bg-emerald-100/70 text-emerald-800"
                                : "bg-rose-100/70 text-rose-800"
                            }`}
                          >
                            {isIncome ? (
                              <>
                                <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-600" />
                                Pemasukan
                              </>
                            ) : (
                              <>
                                <ArrowDownCircle className="w-3.5 h-3.5 text-rose-600" />
                                Pengeluaran
                              </>
                            )}
                          </span>
                        </td>
                        <td
                          className={`py-4 px-6 text-right font-bold whitespace-nowrap ${
                            isIncome ? "text-emerald-600" : "text-[#8F2828]"
                          }`}
                        >
                          {isIncome ? "+" : "-"} {formatRupiah(transaction.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
