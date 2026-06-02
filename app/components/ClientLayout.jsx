"use client";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import WhatsAppButton from "@/app/components/WhatsAppButton";
import ScrollToTop from "@/app/components/ScrollToTop";
import TranslationProvider from "@/app/components/TranslationProvider";
import LanguageLoader from "@/app/components/LanguageLoader";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const hideFooter =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/verify-business" ||
    isAdminRoute;

  return (
    <TranslationProvider>
      <ScrollToTop />
      <LanguageLoader />
      {!isAdminRoute && (
        <Suspense fallback={<div className="h-20 bg-[#FFF6EB]" />}>
          <Header />
        </Suspense>
      )}
      {/* Spacer so content doesn't hide behind the fixed header */}
      {!isAdminRoute && <div className="h-20 lg:h-[110px]" />}
      <main className="flex-grow">{children}</main>
      {!hideFooter && !isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </TranslationProvider>
  );
}
