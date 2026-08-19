import type { Metadata } from "next";
import { Outfit, Cinzel, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Purohitdham (पुरोहितधाम) — Trusted Vedic & Puja Services at Your Doorstep",
  description:
    "Book verified Pandit Ji for Puja, Havan, Grih Pravesh, Satyanarayan Katha, and all 16 Sanskar Vedic rituals. Convenient online booking with trusted Gurukul-trained Purohits.",
  keywords: [
    "Pandit booking",
    "Puja services",
    "Vedic rituals",
    "Hindu priest",
    "online pandit",
    "Purohit",
    "Havan",
    "Grih Pravesh",
    "Vedic Acharya",
    "Purohitdham",
  ],
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cinzel.variable} ${devanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-amber-50/20 text-foreground selection:bg-amber-200 selection:text-amber-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
