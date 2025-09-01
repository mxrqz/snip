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
  title: "Snip",
  description: "Encurtador de links profissional com analytics completos. Transforme URLs longas em links curtos e acompanhe o desempenho de suas campanhas em tempo real",
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
          <link rel="icon" type="image/png" sizes="196x196" href="/favicon-196.png" />
          <link rel="apple-touch-icon" href="/apple-icon-180.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
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
