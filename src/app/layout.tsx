import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import MarketingAttributionTracker from "@/components/MarketingAttributionTracker";
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
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        {/* Google tag (gtag.js) – Google Ads AW-18267690559 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18267690559"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18267690559');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans overflow-x-hidden`}>
        <MarketingAttributionTracker />
        {children}
      </body>
    </html>
  );
}
