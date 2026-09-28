import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getMonthlyOverview, isValidMonth, currentMonth } from "@/lib/budget";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") || currentMonth();

    if (!isValidMonth(month)) {
      return NextResponse.json({ error: "Format bulan tidak valid (YYYY-MM)" }, { status: 400 });
    }

    const overview = await getMonthlyOverview(user.id, month);

    return NextResponse.json({ success: true, ...overview });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memuat data anggaran";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
