import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keuanganku",
  description: "Aplikasi pencatatan keuangan pribadi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-[#f8f7f5] text-gray-900">
        {/* Navbar */}
        <header className="fixed left-0 right-0 top-0 z-50 h-20 border-b border-gray-200 bg-white">
          <div className="flex h-full items-center justify-between px-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7f1d1d] text-lg font-bold text-white">
                K
              </div>

              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Keuanganku
                </h1>

                <p className="text-xs text-gray-500">
                  Kelola keuangan dengan mudah
                </p>
              </div>
            </div>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  Elza
                </p>

                <p className="text-xs text-gray-500">
                  Pengguna
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e8e8] font-semibold text-[#7f1d1d]">
                E
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <aside className="fixed bottom-0 left-0 top-20 z-40 w-64 border-r border-gray-200 bg-white">
          <div className="flex h-full flex-col p-5">
            {/* Menu */}
            <div>
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Menu
              </p>

              <nav className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-xl bg-[#7f1d1d] px-4 py-3 text-sm font-semibold text-white"
                >
                  <span className="text-lg">⌂</span>
                  Dashboard
                </Link>

                <Link
                  href="/transaksi"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-[#f8eeee] hover:text-[#7f1d1d]"
                >
                  <span className="text-lg">＋</span>
                  Transaksi
                </Link>

                <Link
                  href="/riwayat"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-[#f8eeee] hover:text-[#7f1d1d]"
                >
                  <span className="text-lg">▤</span>
                  Riwayat
                </Link>

                <Link
                  href="/profil"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-[#f8eeee] hover:text-[#7f1d1d]"
                >
                  <span className="text-lg">◯</span>
                  Profil
                </Link>
              </nav>
            </div>

            {/* Bottom */}
            <div className="mt-auto">
              <div className="rounded-2xl bg-[#f8eeee] p-4">
                <p className="text-sm font-semibold text-[#7f1d1d]">
                  Kelola keuanganmu
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Catat pemasukan dan pengeluaranmu secara teratur.
                </p>
              </div>

              <button
                type="button"
                className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-red-600"
              >
                <span className="text-lg">↪</span>
                Keluar
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="ml-64 pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}