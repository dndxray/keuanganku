import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { currentMonth, listMonths } from "@/lib/budget";
import AnggaranClient from "@/components/AnggaranClient";

export default async function AnggaranPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <AnggaranClient months={listMonths()} currentMonth={currentMonth()} />;
}
