import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export async function generateMetadata(): Promise<Metadata> {
  let settings: Record<string, string> = {};
  try { settings = await getSettings(); } catch {}
  return {
    title: settings.siteName || "Aurora Blog",
    description: settings.siteDescription || "一个设计精美的前后端分离博客系统",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${lora.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-white via-aurora-50/30 to-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
