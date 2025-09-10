import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
// import { shadcn } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";

import { Saira } from 'next/font/google';
const saira = Saira({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: "Snip - Encurtador de Links Profissional",
    template: "%s | Snip"
  },
  description: "Encurtador de links profissional com analytics completos. Transforme URLs longas em links curtos e acompanhe o desempenho de suas campanhas em tempo real. Grátis, seguro e com proteção por senha.",
  keywords: [
    "encurtador de links",
    "URL shortener",
    "analytics",
    "link tracking",
    "QR code",
    "campanhas digitais",
    "marketing digital",
    "links protegidos",
    "analytics de links",
    "short URL"
  ],
  authors: [{ name: "Momentum Team" }],
  creator: "Momentum",
  publisher: "Momentum",
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
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://snip.vercel.app",
    siteName: "Snip",
    title: "Snip - Encurtador de Links Profissional",
    description: "Encurtador de links profissional com analytics completos. Transforme URLs longas em links curtos e acompanhe o desempenho de suas campanhas em tempo real.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Snip - Encurtador de Links Profissional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snip - Encurtador de Links Profissional",
    description: "Encurtador de links profissional com analytics completos. Transforme URLs longas em links curtos e acompanhe o desempenho.",
    images: ["/og-image.png"],
    creator: "@momentum",
  },
  verification: {
    google: "google-verification-code", // Adicione seu código de verificação do Google
  },
  alternates: {
    canonical: "https://snip.vercel.app",
  },
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    // appearance={{
    //   theme: shadcn
    // }}
    >
      <html lang="pt-BR" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" type="image/svg+xml" href="/S_white.svg" />
          <link rel="apple-touch-icon" href="/apple-icon-180.png" />
          {/* <meta name="apple-mobile-web-app-capable" content="yes" /> */}
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          
          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "Snip",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Any",
                "description": "Encurtador de links profissional com analytics completos. Transforme URLs longas em links curtos e acompanhe o desempenho de suas campanhas em tempo real.",
                "url": "https://snip.vercel.app",
                "author": {
                  "@type": "Organization",
                  "name": "Momentum"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "BRL",
                  "availability": "https://schema.org/InStock"
                },
                "featureList": [
                  "Encurtamento de URLs",
                  "Analytics completos",
                  "QR Code generator", 
                  "Proteção por senha",
                  "Links com expiração",
                  "Dashboard profissional"
                ]
              })
            }}
          />
        </head>

        <body
          className={`${saira.className} antialiased bg-background flex flex-col  w-full`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
          >
            <Header />

            {children}

            <Footer />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
