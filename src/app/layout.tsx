import "@/lib/mockStorage";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Satyakasha - Web3 Document Verification",
  description: "Anti-manipulation document verification platform built on Lisk L2",
};

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
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Script 
          src="https://app.sandbox.midtrans.com/snap/snap.js" 
          strategy="beforeInteractive"
          data-client-key={process.env.MIDTRANS_CLIENT_KEY}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
