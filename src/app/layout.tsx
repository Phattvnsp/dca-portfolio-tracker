import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/shared/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  title: "DCA Portfolio Tracker",
  description: "Track your Dollar-Cost Averaging investments with real-time visibility of total invested, current value, and gain/loss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSansThai.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full">
        <Sidebar />
        <main className="ml-64 min-h-screen p-6 lg:p-8">
          <div className="page-enter">{children}</div>
        </main>
      </body>
    </html>
  );
}
