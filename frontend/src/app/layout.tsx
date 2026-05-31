import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "../styles/globals.css";
import { WebsiteSettingsProvider } from "../context/WebsiteSettingsContext";
import { generateWebsiteMetadata } from "../lib/generateMetadata";
import AppLayoutClient from "../components/common/AppLayoutClient";
import GoogleAnalytics from "../components/analytics/GoogleAnalytics";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  return await generateWebsiteMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakarta.variable} ${lora.variable} antialiased`}
      >
        <WebsiteSettingsProvider>
          <GoogleAnalytics />
          <AppLayoutClient>{children}</AppLayoutClient>
        </WebsiteSettingsProvider>
      </body>
    </html>
  );
}
