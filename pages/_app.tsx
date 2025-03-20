import Nexti18NextConfig from "../next-i18next.config";
import "../styles/globals.css";
import Layout from "@components/Layout";
import Progress from "@components/Progress";
import { cn } from "@lib/helpers";
import { AppPropsLayout } from "@lib/types";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

// App instance
function App({ Component, pageProps }: AppPropsLayout) {
  const layout =
    Component.layout || ((page: ReactNode) => <Layout>{page}</Layout>);

  return (
    <main
      className={cn(
        inter.className,
        poppins.variable,
        "bg-background text-foreground"
      )}
    >
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {layout(<Component {...pageProps} />, pageProps)}
        <Progress />
      </ThemeProvider>
    </main>
  );
}

export default appWithTranslation(App, Nexti18NextConfig);
