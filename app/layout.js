"use client";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { usePathname } from "next/navigation"; 

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

// ✅ Mona Sans from Google
import { Mona_Sans } from "next/font/google";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({ children }) {
   const pathname = usePathname();

    const hideFooter = pathname === "/login" || pathname === "/signup" || pathname === "/verify-business";
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
        <Header />
        <main className="flex-grow">{children}</main>
        {!hideFooter && <Footer />}
      </body>
    </html>
  );
}

// "use client"; 

// import { Geist, Geist_Mono, Playfair_Display, Mona_Sans } from "next/font/google";
// 
// import "./globals.css";


// // Fonts setup... (same as before)

// export default function RootLayout({ children }) {
//   const pathname = usePathname();

//   // Jin pages par Footer nahi dikhana (Login, Signup, etc.)
//   const hideFooter = pathname === "/login" || pathname === "/signup" || pathname === "/verify-business";

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
//         {/* Header hamesha dikhega */}
//         <Header />
        
//         <main className="flex-grow">{children}</main>
        
//         {/* Footer sirf tab dikhega jab hideFooter false hoga */}
//         {!hideFooter && <Footer />}
//       </body>
//     </html>
//   );
// }