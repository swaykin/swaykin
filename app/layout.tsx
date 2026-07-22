import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/shell/AppSidebar";
import { AppTopBar } from "@/components/shell/AppTopBar";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwayKin AI — Influencer Marketing Platform",
  description: "Discover, shortlist and manage Instagram creator outreach.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        <ToastProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <AppTopBar />
              <main className="min-w-0 flex-1">{children}</main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
