import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { TopBar } from "@/components/Nav/TopBar";
import { Footer } from "@/components/Nav/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hantavirus tracker",
    template: "%s · Hantavirus tracker",
  },
  description:
    "An information hub about hantavirus — endemic regions, historical outbreaks, and the 2026 MV Hondius cruise ship cluster. Live news feed from health authorities and major outlets.",
  applicationName: "Hantavirus tracker",
  keywords: [
    "hantavirus",
    "Andes virus",
    "MV Hondius",
    "outbreak tracker",
    "hantavirus pulmonary syndrome",
  ],
  openGraph: {
    type: "website",
    title: "Hantavirus tracker",
    description:
      "Map, news, and explainers about hantavirus and the 2026 MV Hondius cruise ship outbreak.",
    siteName: "Hantavirus tracker",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hantavirus tracker",
    description:
      "Map, news, and explainers about hantavirus and the 2026 MV Hondius cruise ship outbreak.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

// Inline script that runs before React hydration to set the .dark class so
// users with stored or system-preference dark mode don't see a flash of light.
const themeInitScript = `
(function(){
  try{
    var t=localStorage.getItem('hanta-theme');
    var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(d)document.documentElement.classList.add('dark');
  }catch(e){}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded-md focus:bg-brand-primary focus:px-3 focus:py-2 focus:text-text-inverse"
        >
          Skip to content
        </a>
        <TopBar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
