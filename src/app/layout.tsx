import type { Metadata } from "next";
import { Caveat, Fredoka, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Panel",
  description:
    "Submit your startup idea and get critiqued by three AI personas — a VC, an Engineer, and a Skeptic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        fredoka.variable,
        caveat.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
