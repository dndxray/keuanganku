"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Login gagal."
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  }

  const registered =
    searchParams.get(
      "registered"
    ) === "true";

  return (
    <main className="min-h-screen bg-[#511E1D] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#511E1D]">
            Keuanganku
          </h1>

          <p className="mt-2 text-gray-500">
            Masuk untuk mengelola
            keuanganmu.
          </p>
        </div>

        {registered && (
          <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            Registrasi berhasil.
            Silakan masuk menggunakan
            akunmu.
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Masukkan email"
              required
              className="w-full px-4 py-3 bg-[#F5F0EC] rounded-lg outline-none focus:ring-2 focus:ring-[#6B2737] text-gray-800"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Masukkan password"
              required
              className="w-full px-4 py-3 bg-[#F5F0EC] rounded-lg outline-none focus:ring-2 focus:ring-[#6B2737] text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#491F1B] text-white font-semibold rounded-lg hover:bg-[#3a141c] transition disabled:opacity-50"
          >
            {loading
              ? "Memproses..."
              : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Belum memiliki akun?{" "}
          <Link
            href="/register"
            className="text-[#6B2737] font-semibold hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </main>
  );
}