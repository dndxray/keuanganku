import { NextResponse } from "next/server";
import { registerUser } from "@/services/auth.service";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const name =
      body.name?.trim();

    const email =
      body.email?.trim();

    const password =
      body.password;

    const passwordConfirmation =
      body.passwordConfirmation;

    if (
      !name ||
      !email ||
      !password ||
      !passwordConfirmation
    ) {
      return NextResponse.json(
        {
          message:
            "Semua field wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (name.length < 3) {
      return NextResponse.json(
        {
          message:
            "Nama minimal 3 karakter.",
        },
        { status: 400 }
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          message:
            "Format email tidak valid.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          message:
            "Password minimal 8 karakter.",
        },
        { status: 400 }
      );
    }

    if (
      password !==
      passwordConfirmation
    ) {
      return NextResponse.json(
        {
          message:
            "Konfirmasi password tidak sama.",
        },
        { status: 400 }
      );
    }

    const user =
      await registerUser(
        name,
        email,
        password
      );

    return NextResponse.json(
      {
        message:
          "Registrasi berhasil.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "EMAIL_ALREADY_EXISTS"
    ) {
      return NextResponse.json(
        {
          message:
            "Email sudah terdaftar.",
        },
        { status: 409 }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}