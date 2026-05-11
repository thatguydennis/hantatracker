import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TopBar } from "@/components/Nav/TopBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hantavirus tracker",
  description:
    "An information hub about hantavirus — endemic regions, historical outbreaks, and the 2026 MV Hondius cruise ship cluster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-text-primary">
        <TopBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
