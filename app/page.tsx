"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Wallet,
  Receipt,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Pencil,
  Trash2,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Menu,
  Bell,
  ChevronDown,
  ChevronLeft,
  LayoutDashboard,
  FileText,
  User,
  TrendingUp,
  CreditCard,
  Calendar,
  Layers,
  RotateCcw,
} from "lucide-react";

interface Transaction {
  id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: string | null;
  description: string | null;
  date: string;
  createdAt: string;
}

interface Stats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalTransactions: number;
}

const CATEGORIES = [
  "Uang Saku",
  "Gaji & Pendapatan",
  "Makanan & Minuman",
  "Nongkrong & Kafe",
  "Belanja",
  "Transportasi",
  "Kebutuhan Rumah",
  "Hiburan & Rekreasi",
  "Tagihan & Utilitas",
  "Lainnya",
];

export default function TransactionManagementDashboard() {
  const [currentView, setCurrentView] = useState<"dashboard" | "create" | "edit">("dashboard");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalTransactions: 0,
  });
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string }>({
    id: "",
    name: "Princess",
    email: "princess@keuanganku.app",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [activeTypeTab, setActiveTypeTab] = useState<"all" | "income" | "expense">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals / active edit state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "Makanan & Minuman",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (activeTypeTab !== "all") {
        params.append("type", activeTypeTab);
      }
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTransactions(data.transactions || []);
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.currentUser) {
          setCurrentUser(data.currentUser);
        }
      } else {
        showToast(data.error || "Gagal memuat transaksi", "error");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      showToast("Gagal terhubung ke server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTypeTab, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions();
  };

  // Open Create Form View
  const handleOpenCreateForm = () => {
    setFormData({
      type: "expense",
      amount: "",
      category: "Makanan & Minuman",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setCurrentView("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Create Transaction
  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast("Nominal transaksi harus lebih dari 0", "error");
      return;
    }

    try {
      setFormSubmitting(true);
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          amount: Number(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Transaksi berhasil dicatat", "success");
        setCurrentView("dashboard");
        fetchTransactions();
      } else {
        showToast(data.error || "Gagal menambahkan transaksi", "error");
      }
    } catch {
      showToast("Terjadi kesalahan koneksi", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open Edit Form View
  const openEditForm = (t: Transaction) => {
    setSelectedTransaction(t);
    setFormData({
      type: t.type,
      amount: t.amount.toString(),
      category: t.category || "Lainnya",
      description: t.description || "",
      date: new Date(t.date).toISOString().split("T")[0],
    });
    setCurrentView("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Update Transaction
  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast("Nominal transaksi harus lebih dari 0", "error");
      return;
    }

    try {
      setFormSubmitting(true);
      const res = await fetch(`/api/transactions/${selectedTransaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          amount: Number(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Transaksi berhasil diperbarui", "success");
        setCurrentView("dashboard");
        setSelectedTransaction(null);
        fetchTransactions();
      } else {
        showToast(data.error || "Gagal mengubah transaksi", "error");
      }
    } catch {
      showToast("Terjadi kesalahan jaringan", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (t: Transaction) => {
    setSelectedTransaction(t);
    setIsDeleteModalOpen(true);
  };

  // Delete Transaction
  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      setFormSubmitting(true);
      const res = await fetch(`/api/transactions/${selectedTransaction.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Transaksi berhasil dihapus", "success");
        setIsDeleteModalOpen(false);
        setSelectedTransaction(null);
        fetchTransactions();
      } else {
        showToast(data.error || "Gagal menghapus transaksi", "error");
      }
    } catch {
      showToast("Terjadi kesalahan koneksi", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Format IDR Currency
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Format Date Indonesia
  const formatDateIndo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Top spending category
  const topExpenseCategory = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const counts: Record<string, number> = {};
    expenses.forEach((t) => {
      const cat = t.category || "Lainnya";
      counts[cat] = (counts[cat] || 0) + Number(t.amount);
    });
    let topCat = "Belum Ada";
    let maxAmt = 0;
    Object.entries(counts).forEach(([cat, amt]) => {
      if (amt > maxAmt) {
        maxAmt = amt;
        topCat = cat;
      }
    });
    return topCat;
  }, [transactions]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-slate-800 antialiased selection:bg-[#702A2A] selection:text-white">
      {/* ==================== 1. TOP NAVBAR ==================== */}
      <header className="sticky top-0 z-40 w-full bg-[#6B2828] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
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

          {/* Right Header Navigation */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative p-2 rounded-full text-rose-100 hover:text-white hover:bg-black/10 transition-colors"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 bg-black/15 hover:bg-black/25 transition-all py-1.5 px-3.5 rounded-full cursor-pointer border border-white/10">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-rose-200">Pengguna</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-rose-200 ml-1" />
            </div>
          </div>
        </div>
      </header>

      {/* ==================== 2. MAIN LAYOUT WITH SIDEBAR ==================== */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <aside className="w-16 sm:w-20 bg-[#561F1F] text-white flex flex-col items-center py-6 justify-between relative shadow-lg shrink-0">
          <div className="flex flex-col items-center gap-7 w-full">
            {/* Hamburger Toggle */}
            <button
              type="button"
              className="p-2 text-rose-200 hover:text-white hover:bg-black/20 rounded-xl transition"
              title="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Navigation Icons */}
            <nav className="flex flex-col items-center gap-4 w-full px-3">
              <button
                type="button"
                onClick={() => setCurrentView("dashboard")}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition group relative ${
                  currentView === "dashboard"
                    ? "bg-[#3D1414] text-white shadow-inner border border-white/10"
                    : "text-rose-200 hover:text-white hover:bg-black/20"
                }`}
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>

              {/* Transactions Tab */}
              <button
                type="button"
                onClick={() => setCurrentView("dashboard")}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition group relative ${
                  currentView !== "dashboard"
                    ? "bg-[#3D1414] text-white shadow-inner border border-white/10"
                    : "text-rose-200 hover:text-white hover:bg-black/20"
                }`}
                title="Manajemen Transaksi"
              >
                <Receipt className="w-5 h-5 text-rose-300" />
                <span className="absolute -right-1 top-2 w-1.5 h-7 rounded-full bg-rose-400"></span>
              </button>

              <button
                type="button"
                className="w-11 h-11 rounded-xl flex items-center justify-center text-rose-200 hover:text-white hover:bg-black/20 transition group relative"
                title="Laporan & Ringkasan"
              >
                <FileText className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="w-11 h-11 rounded-xl flex items-center justify-center text-rose-200 hover:text-white hover:bg-black/20 transition group relative"
                title="Profil Pengguna"
              >
                <User className="w-5 h-5" />
              </button>
            </nav>
          </div>

          {/* Decorative Bottom Curves */}
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
        </aside>

        {/* ==================== 3. CONTENT AREA ==================== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* VIEW: CREATE / EDIT TRANSACTION FORM (Design Inspired by Reference) */}
          {currentView === "create" || currentView === "edit" ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Form Page Header with Back Button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentView("dashboard")}
                  className="p-2 rounded-xl text-slate-700 hover:text-black hover:bg-slate-200/70 transition cursor-pointer"
                  title="Kembali ke Dashboard"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {currentView === "create"
                    ? "Formulir Tambah Transaksi"
                    : "Formulir Ubah Transaksi"}
                </h1>
              </div>

              {/* Form Card (White Rounded Container with Soft Cream Inputs) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-10">
                <form
                  onSubmit={
                    currentView === "create"
                      ? handleCreateTransaction
                      : handleUpdateTransaction
                  }
                  className="space-y-6"
                >
                  {/* Field 1: Jenis Transaksi */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Jenis Transaksi
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: "income" })}
                        className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                          formData.type === "income"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-[#F8F6F4] text-slate-600 border-[#EAE5E0] hover:bg-[#F2EFEA]"
                        }`}
                      >
                        <ArrowUpCircle className="w-4 h-4" />
                        Pemasukan
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: "expense" })}
                        className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                          formData.type === "expense"
                            ? "bg-[#6B2828] text-white border-[#6B2828] shadow-sm"
                            : "bg-[#F8F6F4] text-slate-600 border-[#EAE5E0] hover:bg-[#F2EFEA]"
                        }`}
                      >
                        <ArrowDownCircle className="w-4 h-4" />
                        Pengeluaran
                      </button>
                    </div>
                  </div>

                  {/* Field 2: Nominal Transaksi */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Nominal Transaksi (Rupiah) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                        Rp
                      </span>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="Contoh: 150000"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-[#F8F6F4] border border-[#EAE5E0] rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6B2828] transition"
                      />
                    </div>
                    {formData.amount && (
                      <span className="text-xs text-emerald-700 font-semibold mt-1.5 block">
                        Terbaca: {formatRupiah(Number(formData.amount))}
                      </span>
                    )}
                  </div>

                  {/* Field 3: Row with Tanggal & Kategori */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tanggal */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Tanggal Transaksi
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F8F6F4] border border-[#EAE5E0] rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6B2828] transition"
                      />
                    </div>

                    {/* Kategori */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Kategori Transaksi
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F8F6F4] border border-[#EAE5E0] rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6B2828] transition"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Field 4: Catatan / Keterangan Transaksi (Textarea like in screenshot) */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Catatan / Keterangan Transaksi
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tuliskan catatan transaksi secara rinci di sini..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F8F6F4] border border-[#EAE5E0] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6B2828] transition resize-y min-h-[110px]"
                    />
                  </div>

                  {/* Bottom Action Buttons (Reset / Batal and Submit Maroon Button) */}
                  <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentView === "create") {
                          setFormData({
                            type: "expense",
                            amount: "",
                            category: "Makanan & Minuman",
                            description: "",
                            date: new Date().toISOString().split("T")[0],
                          });
                        } else {
                          setCurrentView("dashboard");
                        }
                      }}
                      className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-black transition cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {currentView === "create" ? "Reset" : "Batal"}
                    </button>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="px-8 py-2.5 bg-[#A03535] hover:bg-[#8B2E2E] text-white text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      {formSubmitting
                        ? "Menyimpan..."
                        : currentView === "create"
                        ? "Simpan Transaksi"
                        : "Perbarui Transaksi"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* VIEW: DASHBOARD VIEW */
            <div className="space-y-6">
              {/* Welcome Banner Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6B2828] via-[#5C1F1F] to-[#451414] text-white p-6 sm:p-8 shadow-md">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium text-rose-200 mb-3 border border-white/10">
                    Manajemen Keuangan Pribadi
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                    Selamat Datang, {currentUser.name}!
                  </h1>
                  <p className="text-sm sm:text-base text-rose-100 leading-relaxed">
                    Kelola dan pantau seluruh transaksi keuangan pribadimu. Catat pemasukan dan
                    kendalikan pengeluaran harianmu agar keuanganmu tetap seimbang.
                  </p>
                </div>
              </div>

              {/* Dua Kartu Ringkasan */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kartu 1: Manajemen Transaksi & Saldo */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#6B2828] text-white flex items-center justify-center shadow-inner">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">Manajemen Transaksi</h2>
                        <p className="text-xs text-slate-500">
                          Kelola dan verifikasi catatan keuangan pribadi
                        </p>
                      </div>
                    </div>

                    {/* 3 Status Pills */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                      {/* Status 1: Pemasukan */}
                      <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-700 mb-1">
                          <ArrowUpCircle className="w-4 h-4 shrink-0" />
                          <span className="text-[11px] font-semibold">Pemasukan</span>
                        </div>
                        <span className="text-sm sm:text-base font-bold text-emerald-800 truncate">
                          {formatRupiah(stats.totalIncome)}
                        </span>
                        <span className="text-[10px] text-emerald-600 mt-0.5">Uang Masuk</span>
                      </div>

                      {/* Status 2: Pengeluaran */}
                      <div className="bg-rose-50/80 border border-rose-200/70 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center gap-1.5 text-rose-700 mb-1">
                          <ArrowDownCircle className="w-4 h-4 shrink-0" />
                          <span className="text-[11px] font-semibold">Pengeluaran</span>
                        </div>
                        <span className="text-sm sm:text-base font-bold text-rose-800 truncate">
                          {formatRupiah(stats.totalExpense)}
                        </span>
                        <span className="text-[10px] text-rose-600 mt-0.5">Total Biaya</span>
                      </div>

                      {/* Status 3: Saldo */}
                      <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center gap-1.5 text-amber-700 mb-1">
                          <Wallet className="w-4 h-4 shrink-0" />
                          <span className="text-[11px] font-semibold">Sisa Saldo</span>
                        </div>
                        <span
                          className={`text-sm sm:text-base font-bold truncate ${
                            stats.balance < 0 ? "text-rose-700" : "text-amber-900"
                          }`}
                        >
                          {formatRupiah(stats.balance)}
                        </span>
                        <span className="text-[10px] text-amber-700 mt-0.5">Net Keuangan</span>
                      </div>
                    </div>
                  </div>

                  {/* Button Aksi Utama */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleOpenCreateForm}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#A03535] hover:bg-[#8B2E2E] text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Transaksi Baru
                    </button>
                  </div>
                </div>

                {/* Kartu 2: Kontrol Pengeluaran & Anggaran */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#6B2828] text-white flex items-center justify-center shadow-inner">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">
                          Kontrol Pengeluaran & Anggaran
                        </h2>
                        <p className="text-xs text-slate-500">
                          Evaluasi kebiasaan belanja & status pengeluaran harian
                        </p>
                      </div>
                    </div>

                    {/* 3 Status Pills */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                      {/* Status 1: Total Transaksi */}
                      <div className="bg-sky-50/80 border border-sky-200/70 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center gap-1.5 text-sky-700 mb-1">
                          <Layers className="w-4 h-4 shrink-0" />
                          <span className="text-[11px] font-semibold">Aktivitas</span>
                        </div>
                        <span className="text-base font-bold text-sky-900">
                          {transactions.length} Data
                        </span>
                        <span className="text-[10px] text-sky-600 mt-0.5">Tercatat di akunmu</span>
                      </div>

                      {/* Status 2: Pengeluaran Terbesar */}
                      <div className="bg-purple-50/80 border border-purple-200/70 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center gap-1.5 text-purple-700 mb-1">
                          <TrendingUp className="w-4 h-4 shrink-0" />
                          <span className="text-[11px] font-semibold">Kategori Top</span>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-purple-900 truncate">
                          {topExpenseCategory}
                        </span>
                        <span className="text-[10px] text-purple-600 mt-0.5">Pengeluaran sering</span>
                      </div>

                      {/* Status 3: Status Saldo */}
                      <div className="bg-rose-50/80 border border-rose-200/70 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center gap-1.5 text-rose-700 mb-1">
                          <CreditCard className="w-4 h-4 shrink-0" />
                          <span className="text-[11px] font-semibold">Kondisi</span>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-rose-900 truncate">
                          {stats.balance > 1000000
                            ? "Aman Terkendali"
                            : stats.balance >= 0
                            ? "Waspada Hemat"
                            : "Defisit"}
                        </span>
                        <span className="text-[10px] text-rose-600 mt-0.5">Indikator dompet</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daftar Riwayat & Manajemen Transaksi */}
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                {/* Header Section */}
                <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Riwayat & Manajemen Transaksi
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Data transaksi terhubung langsung dengan akun pengguna yang sedang login (hanya kamu
                      yang dapat mengakses & mengelola).
                    </p>
                  </div>

                  {/* Button Tambah Transaksi */}
                  <button
                    type="button"
                    onClick={handleOpenCreateForm}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#A03535] hover:bg-[#8B2E2E] text-white text-sm font-semibold shadow-sm transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Catat Transaksi
                  </button>
                </div>

                {/* Filter Bar */}
                <div className="p-4 sm:p-6 bg-slate-50/60 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                  {/* Type Filter Tabs */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setActiveTypeTab("all")}
                      className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTypeTab === "all"
                          ? "bg-white text-[#6B2828] shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Semua ({stats.totalTransactions})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTypeTab("income")}
                      className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        activeTypeTab === "income"
                          ? "bg-white text-emerald-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Pemasukan
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTypeTab("expense")}
                      className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        activeTypeTab === "expense"
                          ? "bg-white text-rose-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      Pengeluaran
                    </button>
                  </div>

                  {/* Category Filter & Search Box */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Category Dropdown */}
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full sm:w-48 bg-white text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6B2828]"
                    >
                      <option value="all">Semua Kategori</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari deskripsi / catatan..."
                        className="w-full bg-white text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6B2828]"
                      />
                    </form>
                  </div>
                </div>

                {/* List / Table of Transactions */}
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="p-12 text-center text-slate-400">
                      <div className="inline-block animate-spin w-8 h-8 border-4 border-[#6B2828] border-t-transparent rounded-full mb-3"></div>
                      <p className="text-sm font-medium">Memuat data transaksi...</p>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-rose-50 text-[#6B2828] flex items-center justify-center mx-auto mb-4">
                        <Receipt className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-1">
                        Belum Ada Transaksi Ditemukan
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                        {searchQuery || selectedCategory !== "all" || activeTypeTab !== "all"
                          ? "Tidak ada transaksi yang cocok dengan filter yang dipilih."
                          : "Mulai kelola keuangan pribadimu dengan mencatat transaksi pertamamu sekarang."}
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenCreateForm}
                        className="px-5 py-2 bg-[#A03535] text-white text-xs font-semibold rounded-xl shadow-sm hover:bg-[#8B2E2E] transition cursor-pointer"
                      >
                        + Catat Transaksi Baru
                      </button>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          <th className="py-3.5 px-6">Tanggal</th>
                          <th className="py-3.5 px-6">Kategori</th>
                          <th className="py-3.5 px-6">Deskripsi / Catatan</th>
                          <th className="py-3.5 px-6 text-center">Jenis</th>
                          <th className="py-3.5 px-6 text-right">Nominal</th>
                          <th className="py-3.5 px-6 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {transactions.map((t) => {
                          const isIncome = t.type === "income";
                          return (
                            <tr
                              key={t.id}
                              className="hover:bg-rose-50/20 transition-colors group"
                            >
                              {/* Tanggal */}
                              <td className="py-4 px-6 text-xs text-slate-600 font-medium whitespace-nowrap">
                                {formatDateIndo(t.date)}
                              </td>

                              {/* Kategori */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isIncome ? "bg-emerald-500" : "bg-[#6B2828]"
                                    }`}
                                  ></span>
                                  {t.category || "Umum"}
                                </span>
                              </td>

                              {/* Deskripsi */}
                              <td className="py-4 px-6 text-slate-800 font-medium max-w-xs truncate">
                                {t.description || "-"}
                              </td>

                              {/* Jenis Transaksi */}
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

                              {/* Nominal */}
                              <td
                                className={`py-4 px-6 text-right font-bold whitespace-nowrap ${
                                  isIncome ? "text-emerald-600" : "text-[#8F2828]"
                                }`}
                              >
                                {isIncome ? "+" : "-"} {formatRupiah(t.amount)}
                              </td>

                              {/* Aksi */}
                              <td className="py-4 px-6 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditForm(t)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#6B2828] hover:bg-rose-50 transition cursor-pointer"
                                    title="Ubah Transaksi"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openDeleteModal(t)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                    title="Hapus Transaksi"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Table Footer info */}
                <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Menampilkan <strong>{transactions.length}</strong> transaksi aktif
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Otorisasi server aktif (hanya transaksi milik sendiri)
                  </span>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* ==================== 4. MODAL KONFIRMASI HAPUS ==================== */}
      {isDeleteModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Transaksi?</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Apakah kamu yakin ingin menghapus transaksi{" "}
              <strong>&ldquo;{selectedTransaction.description || selectedTransaction.category}&rdquo;</strong>{" "}
              sebesar <strong>{formatRupiah(selectedTransaction.amount)}</strong>?
            </p>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 mb-5 text-[11px] text-rose-800 text-left">
              <strong>Catatan:</strong> Hanya transaksi milik akunmu yang dapat dihapus. Tindakan ini tidak dapat dibatalkan.
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition flex-1 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={formSubmitting}
                onClick={handleDeleteTransaction}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition flex-1 cursor-pointer disabled:opacity-50"
              >
                {formSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 5. LIVE TOAST NOTIFICATION ==================== */}
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
