import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Keuanganku - Kelola Keuangan Pribadi",
  description: "Aplikasi pencatatan keuangan pribadi dan manajemen pengeluaran harian",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F5F6F8] text-[#1E293B] font-sans">
        {children}
      </body>
    </html>
  );
}
