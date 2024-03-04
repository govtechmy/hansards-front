import Nexti18NextConfig from "../next-i18next.config";
import "../styles/globals.css";
import Layout from "@components/Layout";
import Progress from "@components/Progress";
import { cn } from "@lib/helpers";
import { AppPropsLayout } from "@lib/types";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Inter, header } from "styles/font";

// App instance
function App({ Component, pageProps }: AppPropsLayout) {
  const layout =
    Component.layout ||
    ((page: ReactNode) => (
      <Layout className={cn(Inter.variable, "font-inter")}>{page}</Layout>
    ));

  return (
    <main
      className={cn(
        header.variable,
        Inter.variable,
        "font-inter bg-background"
      )}
    >
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        forcedTheme={Component.theme}
      >
        {layout(<Component {...pageProps} />, pageProps)}
        <Progress />
      </ThemeProvider>
    </main>
  );
}

export default appWithTranslation(App, Nexti18NextConfig);
