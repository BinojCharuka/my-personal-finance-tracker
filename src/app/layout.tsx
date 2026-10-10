import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import SmoothScroll from "@/components/SmoothScroll";
import RealtimeRefresher from "@/components/RealtimeRefresher";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Expense Tracker",
  description: "A lightweight personal student money tracker.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Expense Tracker",
  }
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-zinc-100 antialiased pb-20 md:pb-0 md:pl-64`}>
        <RealtimeRefresher />
        <SmoothScroll>
          <Navigation />
          <main className="max-w-5xl mx-auto min-h-screen">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}
