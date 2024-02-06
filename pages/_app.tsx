import Nexti18NextConfig from "../next-i18next.config";
import "../styles/globals.css";
import Layout from "@components/Layout";
import Progress from "@components/Progress";
import { header, body } from "@lib/configs/font";
import { cn } from "@lib/helpers";
import { AppPropsLayout } from "@lib/types";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

// App instance
function App({ Component, pageProps }: AppPropsLayout) {
  const layout =
    Component.layout ||
    ((page: ReactNode) => (
      <Layout className={cn(body.variable, "font-sans")}>{page}</Layout>
    ));

  return (
    <div
      className={cn(
        body.variable,
        header.variable,
        "font-sans dark:bg-zinc-900"
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
    </div>
  );
}

export default appWithTranslation(App, Nexti18NextConfig);
