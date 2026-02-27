import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { ThemeProvider } from "@/components/theme-provider"

const siteUrl = "https://desa-wisata-ui.vercel.app";
const siteName = "Discover Desa Wisata";
const siteDescription =
  "Temukan keindahan desa wisata Indonesia bersama para ahli lokal. Nikmati paket wisata privat & grup, pengalaman budaya autentik, kuliner tradisional, dan itinerari yang disesuaikan untuk petualangan tak terlupakan di pedesaan Indonesia.";

export const metadata: Metadata = {
  title: {
    default: "Discover Desa Wisata — Jelajahi Pesona Desa Wisata Indonesia",
    template: "%s | Discover Desa Wisata",
  },
  description: siteDescription,
  keywords: [
    "desa wisata",
    "wisata indonesia",
    "tourism village",
    "paket wisata",
    "travel indonesia",
    "desa wisata indonesia",
    "wisata budaya",
    "wisata alam",
    "eco tourism",
    "wisata pedesaan",
    "trip desa",
    "liburan desa",
    "wisata autentik",
    "village tour",
    "hidden gem indonesia",
    "wisata lokal",
    "wisata berkelanjutan",
    "sustainable tourism",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: { "id-ID": "/", "en-US": "/en" },
  },

  // ─── Favicon / Icons ───────────────────────────────
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico", sizes: "any" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/favicon_io/site.webmanifest",

  // ─── Open Graph ─────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName,
    title: "Discover Desa Wisata — Jelajahi Pesona Desa Wisata Indonesia",
    description: siteDescription,
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Discover Desa Wisata — Pemandangan Desa Wisata Indonesia",
      },
    ],
  },

  // ─── Twitter ────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Discover Desa Wisata — Jelajahi Pesona Desa Wisata Indonesia",
    description: siteDescription,
    images: ["/assets/og-image.jpg"],
    creator: "@discoverdesa",
  },

  // ─── Robots ─────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── Misc ───────────────────────────────────────────
  category: "travel",
  other: {
    "geo.region": "ID",
    "geo.placename": "Indonesia",
    "rating": "general",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
