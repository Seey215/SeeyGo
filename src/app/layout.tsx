import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { MainContent } from '@/components/layout/MainContent';
import { Sidebar } from '@/components/layout/Sidebar';
import { CreateTaskProvider } from '@/components/providers/CreateTaskProvider';
import { AppStoreProvider } from '@/stores';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['sans-serif'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['monospace'],
});

export const metadata: Metadata = {
  title: 'SeeyGo Todo - 智能待办事项管理',
  description: '基于 Next.js 构建的现代化待办事项管理应用',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppStoreProvider>
          <CreateTaskProvider>
            <div className="h-screen flex overflow-hidden">
              <Sidebar />
              <MainContent>{children}</MainContent>
            </div>
          </CreateTaskProvider>
        </AppStoreProvider>
      </body>
    </html>
  );
}
