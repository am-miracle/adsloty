import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adsloty - Newsletter Advertising Marketplace",
  description:
    "Connect newsletter creators with sponsors. Self-service advertising platform for newsletter monetization and targeted marketing campaigns.",
  keywords: [
    "newsletter advertising",
    "newsletter monetization",
    "sponsored content",
    "email marketing",
    "creator economy",
  ],
  authors: [{ name: "Adsloty" }],
  openGraph: {
    title: "Adsloty - Newsletter Advertising Marketplace",
    description:
      "Connect newsletter creators with sponsors. Self-service advertising platform for newsletter monetization and targeted marketing campaigns.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adsloty - Newsletter Advertising Marketplace",
    description:
      "Connect newsletter creators with sponsors. Self-service advertising platform for newsletter monetization and targeted marketing campaigns.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} font-inter antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
