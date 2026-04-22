import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import WhatsAppButton from "@/components/ui/whatsapp-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GodProperty — Find Your Perfect Home",
    template: "%s | GodProperty",
  },
  description:
    "Discover rentals and short stays that feel like home. Browse thousands of properties, book instantly, and connect with agents.",
  keywords: ["real estate", "rentals", "airbnb", "short stays", "property", "apartments", "Nigeria"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
