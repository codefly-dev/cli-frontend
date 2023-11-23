import { Archivo, DM_Sans, Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: "700",
  display: "swap",
});

export const dm_sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: "700",
  display: "swap",
});
