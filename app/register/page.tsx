"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (name.trim().length < 3) {
      setError(
        "Nama minimal 3 karakter."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password minimal 8 karakter."
      );
      return;
    }

    if (
      password !==
      passwordConfirmation
    ) {
      setError(
        "Konfirmasi password tidak sama."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
              passwordConfirmation,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Registrasi gagal."
        );
        return;
      }

      router.push(
        "/login?registered=true"
      );
    } catch {
      setError(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#511E1D] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#511E1D]">
            Expense Tracker
          </h1>

          <p className="mt-2 text-gray-500">
            Buat akun untuk mulai
            mengelola keuanganmu.
          </p>
        </div>

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
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nama
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Masukkan nama"
              required
              className="w-full px-4 py-3 bg-[#F5F0EC] rounded-lg outline-none focus:ring-2 focus:ring-[#6B2737] text-gray-800"
            />
          </div>

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
              placeholder="Minimal 8 karakter"
              required
              className="w-full px-4 py-3 bg-[#F5F0EC] rounded-lg outline-none focus:ring-2 focus:ring-[#6B2737] text-gray-800"
            />
          </div>

          <div>
            <label
              htmlFor="passwordConfirmation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Konfirmasi Password
            </label>

            <input
              id="passwordConfirmation"
              type="password"
              value={
                passwordConfirmation
              }
              onChange={(e) =>
                setPasswordConfirmation(
                  e.target.value
                )
              }
              placeholder="Ketik ulang password"
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
              ? "Mendaftarkan..."
              : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Sudah memiliki akun?{" "}
          <Link
            href="/login"
            className="text-[#6B2737] font-semibold hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}