import { Geist, Playfair_Display, Mona_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ClientLayout from "@/app/components/ClientLayout";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
// Playfair: only weights actually used in the UI
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});
const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.ratoomals.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Preconnect to Cloudflare R2 for product images */}
        <link rel="preconnect" href="https://pub-a7812a845df148fe9eec1889ce42d836.r2.dev" />
        {/* Preconnect GTM (analytics) */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* Preload LCP hero image so browser discovers it immediately */}
        <link
          rel="preload"
          href="/images/hero1.png"
          as="image"
          fetchPriority="high"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q1083NJZEW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-Q1083NJZEW');`}
        </Script>
        {/* Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="PVHnG0y1VmOSkRHUfja5sg"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${playfair.variable} ${monaSans.variable} antialiased min-h-screen flex flex-col`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

