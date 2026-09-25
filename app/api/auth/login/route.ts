import { NextResponse } from "next/server";
import { authenticateUser } from "@/services/auth.service";
import { createSession } from "@/lib/auth";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const email =
      body.email?.trim();

    const password =
      body.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          message:
            "Email dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    const user =
      await authenticateUser(
        email,
        password
      );

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      message: "Login berhasil.",
      user,
    });
  } catch (error) {
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