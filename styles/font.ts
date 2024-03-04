import { Poppins } from "next/font/google";
import localFont from "next/font/local";

const header = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-header",
});

const Inter = localFont({
  src: "./Inter-Variable.ttf",
  variable: "--font-inter",
  weight: "400 500 700",
  adjustFontFallback: "Arial",
  display: "swap",
  style: "normal",
});

export { header, Inter };
