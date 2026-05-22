import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Maatri AI — Maternal & Child Health Intelligence Platform",
  description: "AI-powered public health intelligence platform analyzing maternal and child healthcare disparities across India using NFHS-5 data.",
  keywords: "maternal health, child health, NFHS-5, India, public health, AI analytics, health disparities",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="main-content flex-1 relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
