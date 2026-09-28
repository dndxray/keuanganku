"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, ChevronDown, LayoutDashboard, LogOut, Menu, Receipt, User } from "lucide-react";

type Props = {
  userName: string;
  userEmail?: string;
  active: "dashboard" | "transaksi";
  children: React.ReactNode;
};

export default function AppShell({ userName, userEmail, active, children }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const itemClass = (isActive: boolean) =>
    `w-full h-11 rounded-xl flex items-center transition ${
      isOpen ? "gap-3 px-3" : "justify-center"
    } ${
      isActive
        ? "bg-[#3D1414] text-white shadow-inner border border-white/10"
        : "text-rose-200 hover:text-white hover:bg-black/20"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-slate-800 antialiased selection:bg-[#702A2A] selection:text-white">
      {/* ==================== TOP NAVBAR ==================== */}
      <header className="sticky top-0 z-40 w-full bg-[#6B2828] text-white shadow-md">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="font-extrabold text-[#6B2828] text-xl tracking-tighter">K</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-wider text-lg uppercase text-white leading-none">
                KEUANGANKU
              </span>
              <span className="text-[10px] text-rose-200 tracking-wider">
                Catatan Keuangan Pribadi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative p-2 rounded-full text-rose-100 hover:text-white hover:bg-black/10 transition-colors"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 bg-black/15 hover:bg-black/25 transition-all py-1.5 px-3.5 rounded-full border border-white/10"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight">{userName}</span>
                  <span className="text-[10px] text-rose-200">Pengguna</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-rose-200 ml-1" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white text-slate-800 shadow-lg border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold truncate">{userName}</p>
                    <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-rose-50 hover:text-[#6B2828] transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ==================== MAIN LAYOUT WITH SIDEBAR ==================== */}
      <div className="flex-1 flex w-full">
        <aside
          className={`${
            isOpen ? "w-56" : "w-16 sm:w-20"
          } bg-[#561F1F] text-white flex flex-col items-center py-6 justify-between shadow-lg shrink-0 transition-all duration-200`}
        >
          <div className="flex flex-col items-center gap-5 w-full px-3">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-rose-200 hover:text-white hover:bg-black/20 rounded-xl transition cursor-pointer"
              title="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <nav className="flex flex-col items-center gap-4 w-full">
              <Link href="/" className={itemClass(active === "dashboard")} title="Dashboard">
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                {isOpen && <span className="text-sm font-medium">Dashboard</span>}
              </Link>

              <Link
                href="/transaksi"
                className={itemClass(active === "transaksi")}
                title="Manajemen Transaksi"
              >
                <Receipt className="w-5 h-5 shrink-0" />
                {isOpen && <span className="text-sm font-medium">Transaksi</span>}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className={itemClass(false)}
                title="Keluar"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {isOpen && <span className="text-sm font-medium">Keluar</span>}
              </button>
            </nav>
          </div>

          {!isOpen && (
            <div className="w-full flex justify-center opacity-30 select-none pointer-events-none">
              <svg width="40" height="80" viewBox="0 0 40 80" fill="none">
                <path
                  d="M5 80C5 50 35 60 35 30C35 10 20 0 20 0"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M15 80C15 55 40 65 40 40C40 20 30 10 30 10"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </aside>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
