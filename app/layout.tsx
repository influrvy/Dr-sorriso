import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"] });
const sans = Manrope({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const publicUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl),
  title: "Dr. Sorriso | Odontologia e Estética em Santa Tereza",
  description: "Clínica odontológica completa em Santa Tereza, Boa Vista. Agende sua avaliação na Dr. Sorriso.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "Dr. Sorriso — Cuidado de verdade para o seu sorriso", description: "Odontologia completa e estética em Santa Tereza, Boa Vista.", type: "website", locale: "pt_BR", images: [{ url: "/og.png", width: 1792, height: 896, alt: "Dr. Sorriso — Cuidado de verdade para o seu sorriso" }] },
  twitter: { card: "summary_large_image", title: "Dr. Sorriso", description: "Cuidado de verdade para o seu sorriso.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
