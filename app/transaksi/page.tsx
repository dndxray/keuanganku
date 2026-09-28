import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import TransaksiClient from "@/components/TransaksiClient";

export default async function TransaksiPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Cookie preferensi: filter jenis transaksi terakhir yang dipilih pengguna
  const cookieStore = await cookies();
  const savedFilter = cookieStore.get("keuanganku_filter")?.value;
  const initialFilter = savedFilter === "income" || savedFilter === "expense" ? savedFilter : "all";

  return <TransaksiClient userName={session.user.name} initialFilter={initialFilter} />;
}
