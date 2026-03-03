"use client";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import WhatsAppButton from "@/app/components/WhatsAppButton";
import ScrollToTop from "@/app/components/ScrollToTop";
import { usePathname } from "next/navigation"; 
import { Mona_Sans } from "next/font/google";
import TranslationProvider from "@/app/components/TranslationProvider";
import LanguageLoader from "@/app/components/LanguageLoader";
import { Suspense } from "react";
import Script from "next/script";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Check if current route is admin route
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // Pages where we don't want to show footer
  const hideFooter = pathname === "/login" || 
                    pathname === "/signup" || 
                    pathname === "/verify-business" ||
                    isAdminRoute;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Ratoomal - Handcrafted Heritage Decor</title>
        <meta name="description" content="Ratoomal's Jaipur Heritage - Handcrafted Statues, Sculptures & Decor since 1955" />
     
    
 <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q1083NJZEW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Q1083NJZEW');
          `}
        </Script>

      </head>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${playfair.variable}
          ${monaSans.variable}
          antialiased min-h-screen flex flex-col
        `}
      >
        <TranslationProvider>
          <ScrollToTop />
          <LanguageLoader />
          {/* Only show website header if NOT admin route */}
          {!isAdminRoute && (
            <Suspense fallback={<div className="h-16 bg-white"></div>}>
              <Header />
            </Suspense>
          )}
          
          <main className="flex-grow">{children}</main>
          
          {/* Only show website footer if NOT admin route and NOT hidden pages */}
          {!hideFooter && !isAdminRoute && <Footer />}
          
          {/* WhatsApp Button - Show on all pages except admin */}
          {!isAdminRoute && <WhatsAppButton />}
        </TranslationProvider>
      </body>
    </html>
  );
}