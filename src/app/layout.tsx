import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConsentManager from "@/components/ConsentManager";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RK-Gaggenau – Professionelle Reinigung in Gaggenau & Region",
    template: "%s | RK-Gaggenau",
  },
  description:
    "RK-Gaggenau bietet professionelle Reinigungs­dienstleistungen in Gaggenau und Umgebung. Qualität, Vertrauen und Zuverlässigkeit seit Jahren.",
  metadataBase: new URL("https://rk-gaggenau.de"),
  openGraph: {
    type: "website",
    siteName: "RK-Gaggenau",
    locale: "de_DE",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "RK-Gaggenau – Professionelle Reinigung",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rkgaggenau",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Local development never sends telemetry unless explicitly opted into a controlled test.
  const localReview = process.env.NODE_ENV !== "production" &&
    (process.env.RK_LOCAL_ENABLE_TRACKING !== "1" || process.env.RK_LOCAL_DISABLE_TRACKING === "1");
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans overflow-x-hidden`}>
        <ConsentManager trackingEnabled={!localReview} />
        {children}
      </body>
    </html>
  );
}
