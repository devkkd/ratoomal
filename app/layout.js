// "use client";
// import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
// import "./globals.css";
// import Header from "@/app/components/Header";
// import Footer from "@/app/components/Footer";
// import { usePathname } from "next/navigation"; 

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const playfair = Playfair_Display({
//   variable: "--font-playfair",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// // ✅ Mona Sans from Google
// import { Mona_Sans } from "next/font/google";

// const monaSans = Mona_Sans({
//   variable: "--font-mona-sans",
//   subsets: ["latin"],
//   weight: ["400", "700"],
// });

// export default function RootLayout({ children }) {
//    const pathname = usePathname();

//     const hideFooter = pathname === "/login" || pathname === "/signup" || pathname === "/verify-business";
//   return (
//     <html lang="en">
//       <body
//         className={`
//           ${geistSans.variable}
//           ${geistMono.variable}
//           ${playfair.variable}
//           ${monaSans.variable}
//           antialiased min-h-screen flex flex-col
//         `}
//       >
//         <Header />
//         <main className="flex-grow">{children}</main>
//         {!hideFooter && <Footer />}
//       </body>
//     </html>
//   );
// }


"use client";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { usePathname } from "next/navigation"; 
import { Mona_Sans } from "next/font/google";
import TranslationProvider from "@/app/components/TranslationProvider";
import LanguageLoader from "@/app/components/LanguageLoader";

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
          <LanguageLoader />
          {/* Only show website header if NOT admin route */}
          {!isAdminRoute && <Header />}
          
          <main className="flex-grow">{children}</main>
          
          {/* Only show website footer if NOT admin route and NOT hidden pages */}
          {!hideFooter && !isAdminRoute && <Footer />}
        </TranslationProvider>
      </body>
    </html>
  );
}