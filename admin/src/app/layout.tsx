import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jatashankar Admin Panel",
  description: "Institutional admin dashboard for managing courses, faculty, gallery, announcements, and testimonials.",
};

import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </AuthProvider>

        {/* ── Global Toast Notification System ── */}
        <Toaster
          position="top-right"
          expand={false}
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              fontSize: "12px",
              fontWeight: "600",
              borderRadius: "14px",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
              letterSpacing: "0.01em",
              padding: "14px 16px",
            },
            classNames: {
              toast: "group",
              title: "text-slate-900",
              description: "text-slate-500",
              actionButton: "bg-[#9B111E] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5",
              cancelButton: "bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5",
              closeButton: "text-slate-400 hover:text-slate-700 transition-colors",
            },
          }}
        />
      </body>
    </html>
  );
}
