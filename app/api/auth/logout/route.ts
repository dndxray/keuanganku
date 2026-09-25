import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      message: "Logout berhasil.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Logout gagal.",
      },
      { status: 500 }
    );
  }
}