import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mollie-jason-rsvp.vercel.app"),
  title: "Mollie & Jason - RSVP",
  description: "Saturday, 22nd August 2026 — Bathampton Home Farm",
  openGraph: {
    title: "Mollie & Jason - RSVP",
    description: "Saturday, 22nd August 2026 — Bathampton Home Farm",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
