import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/_layout/Navbar";
import ContextProvider from '@/context'
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import GoogleAnalytics from "@/lib/googleanalytics";
import { Provider as JotaiProvider } from "jotai"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const themeFont = localFont({
  src: "./fonts/PixelEmulator.otf",
  variable: "--font-theme",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "predictr.Market",
  description: "The best prediction",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookies = headersList.get('cookie');
  // console.log("Cookies on server",cookies)
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${themeFont.variable} bg-[#0c0c0c] antialiased`}
      >
        <ContextProvider cookies={cookies}>
          <GoogleAnalytics GA_MEASUREMENT_ID="G-XZ9LL5NGH1" />
          <JotaiProvider>
            <Navbar />
            {children}
          </JotaiProvider>
          <Toaster richColors />
        </ContextProvider>
      </body>
    </html>
  );
}