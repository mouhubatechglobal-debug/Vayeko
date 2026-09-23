import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ToastContainer } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Vayeko - Le Togo à portée de main",
  description: "Vayeko est la plateforme tout-en-un qui centralise services, commerces, produits, immobilier, emplois, opportunités étudiantes et annonces au Togo. Recherchez, comparez, contactez, commandez.",
  keywords: ["Togo", "Lomé", "Kara", "Sokodé", "commerce", "services", "immobilier", "emploi", "annonces", "Vayeko"],
  openGraph: {
    title: "Vayeko - Le Togo à portée de main",
    description: "La plateforme locale tout-en-un pour le Togo",
    type: "website",
    locale: "fr_TG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FFFEFB] font-sans">
        <Navbar />
        <main className="flex-1 pb-[72px] lg:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <ToastContainer />
      </body>
    </html>
  );
}
