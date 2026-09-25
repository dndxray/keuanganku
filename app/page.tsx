import { getDashboardData } from "@/lib/dashboard";

export default async function Home() {
  const userId = 1;

  const {
    user,
    totalIncome,
    totalExpense,
    balance,
    latestTransactions,
  } = await getDashboardData(userId);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <main className="min-h-screen bg-[#f8f7f5] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Halo, {user?.name ?? user?.username ?? "User"} 
          </h1>

          <p className="mt-2 text-gray-500">
            Berikut ringkasan keuangan kamu.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Saldo */}
          <div className="rounded-2xl bg-[#7f1d1d] p-6 text-white shadow-sm">
            <p className="text-sm text-white/70">
              Saldo
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {formatRupiah(balance)}
            </h2>

            <p className="mt-2 text-sm text-white/70">
              Saldo saat ini
            </p>
          </div>

          {/* Pemasukan */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <p className="text-sm text-gray-500">
              Total Pemasukan
            </p>

            <h2 className="mt-3 text-2xl font-bold text-green-600">
              {formatRupiah(totalIncome)}
            </h2>
          </div>

          {/* Pengeluaran */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <p className="text-sm text-gray-500">
              Total Pengeluaran
            </p>

            <h2 className="mt-3 text-2xl font-bold text-red-600">
              {formatRupiah(totalExpense)}
            </h2>
          </div>
        </div>

        {/* Transaksi Terbaru */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Transaksi Terbaru
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              5 transaksi terakhir kamu
            </p>
          </div>

          {latestTransactions.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              Belum ada transaksi.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                    <th className="pb-3 font-medium">
                      Tanggal
                    </th>

                    <th className="pb-3 font-medium">
                      Deskripsi
                    </th>

                    <th className="pb-3 text-right font-medium">
                      Jumlah
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {latestTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-4 text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </td>

                      <td className="py-4">
                        <p className="font-medium text-gray-900">
                          {transaction.description ??
                            "Tanpa deskripsi"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {transaction.type === "income"
                            ? "Pemasukan"
                            : "Pengeluaran"}
                        </p>
                      </td>

                      <td
                        className={`py-4 text-right font-semibold ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income"
                          ? "+"
                          : "-"}
                        {formatRupiah(
                          transaction.amount
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}