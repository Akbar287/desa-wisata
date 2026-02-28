import type { Metadata } from "next";
import "./globals.css";
import 'nprogress/nprogress.css'
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Playfair } from "next/font/google"
import { ThemeProvider } from "@/provider/theme-provider";
import Providers from "@/provider/auth-providers";
import { getSession } from "@/provider/api";
import { Toaster } from '@/components/ui/sonner'
import { RouteProgress } from '@/lib/router-progress'
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SiteHeader } from "@/components/layouts/site-header";
import { SectionCards } from "@/components/layouts/section-cards";
import { ChartAreaInteractive } from "@/components/layouts/chart-area-interactive";
import { DataTable } from "@/components/layouts/data-table";

const playfair = Playfair({
  subsets: ["latin"],
  variable: "--font-playfair",
})

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

  twitter: {
    card: "summary_large_image",
    title: "Discover Desa Wisata — Jelajahi Pesona Desa Wisata Indonesia",
    description: siteDescription,
    images: ["/assets/og-image.jpg"],
    creator: "@discoverdesa",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    noimageindex: false,
    notranslate: false,
    nosnippet: false,
    'max-image-preview': 'large',
    'max-video-preview': -1,
    'max-snippet': -1,
  },

  category: "travel",
  other: {
    "geo.region": "ID",
    "geo.placename": "Indonesia",
    "rating": "general",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()
  console.log(session)
  return (
    <html lang="id" className={`${playfair.variable} ${playfair.className} antialiased`} suppressHydrationWarning>
      <body>
        <RouteProgress />
        <Providers session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {session ?
              <SidebarProvider
                style={
                  {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                  } as React.CSSProperties
                }
              >
                <AppSidebar variant="inset" />
                <SidebarInset>
                  {children}
                </SidebarInset>
              </SidebarProvider> :
              <>
                <Navbar />
                {children}
                <Footer />
              </>
            }
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3000,
              }}
            />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
