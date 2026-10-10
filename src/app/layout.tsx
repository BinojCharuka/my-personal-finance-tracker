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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Expense Tracker",
  }
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
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
      <head>
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={`${inter.className} bg-[#0a0a0a] text-zinc-100 antialiased pb-20 md:pb-0 md:pl-64`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
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
