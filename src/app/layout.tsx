import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt 圖書館",
  description: "Prompt 圖書館 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-bg-page antialiased">
        <header className="border-b border-border bg-bg-page">
          <nav className="mx-auto flex max-w-2xl gap-6 px-4 py-3">
            <Link href="/" className="link-primary">
              首頁
            </Link>
            <Link href="/admin" className="link-primary">
              管理
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
