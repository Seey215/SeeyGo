import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/context";
import { Sidebar, Navbar, MainContent } from "@/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SeeyGo Todo - 智能待办事项管理",
  description: "基于 Next.js 构建的现代化待办事项管理应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex overflow-hidden">
              <Sidebar />
              <MainContent>
                {children}
              </MainContent>
            </div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
