import i18nextConfig from "../next-i18next.config";
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
// import Script from "next/script";

class HTMLDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }
  currentLocale =
    this.props.__NEXT_DATA__.locale || i18nextConfig.i18n.defaultLocale;

  render() {
    return (
      <Html lang={this.currentLocale}>
        <Head>
          {/* <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.1/dist/leaflet.css"
            integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14="
            crossOrigin=""
          /> */}
          {/* Google Analytics */}
          {/* <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TAG}`}
          />
          <Script
            id="gtag"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', '${process.env.NEXT_PUBLIC_GA_TAG}', {
                  page_path: window.location.pathname,
                  debug_mode: ${process.env.NEXT_PUBLIC_APP_ENV === "development"}
              });
          `,
            }}
          /> */}

          {/* PWA setting */}
          <meta name="application-name" content="hansard.parlimen.gov.my" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta
            name="apple-mobile-web-app-title"
            content="hansard.parlimen.gov.my"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          {/* <meta name="msapplication-config" content="/icons/browserconfig.xml" /> */}
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />

          <link
            rel="apple-touch-icon"
            href="/static/images/icons/touch-icon-iphone.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/static/images/icons/touch-icon-ipad.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/images/icons/touch-icon-iphone-retina.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/static/images/icons/touch-icon-ipad-retina.png"
          />

          {/* <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/images/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/images/icons/favicon-16x16.png"
          /> */}
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />

          {/* Apple Splash Screen */}
          <link
            rel="apple-touch-startup-image"
            href="/static/images/icons/apple_splash_2048.png"
            media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            sizes="2048x2732"
          />
          <link
            rel="apple-touch-startup-image"
            href="/static/images/icons/apple_splash_1668.png"
            media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            sizes="1668x2224"
          />
          <link
            rel="apple-touch-startup-image"
            href="/static/images/icons/apple_splash_1536.png"
            media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            sizes="1536x2048"
          />
          <link
            rel="apple-touch-startup-image"
            href="/static/images/icons/apple_splash_1125.png"
            media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            sizes="1125x2436"
          />
          <link
            rel="apple-touch-startup-image"
            href="/static/images/icons/apple_splash_1242.png"
            media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            sizes="1242x2208"
          />
          <link
            rel="apple-touch-startup-image"
            href="/static/images/icons/apple_splash_750.png"
            media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            sizes="750x1334"
          />
          <link
            rel="apple-touch-startup-image"
            href="/static/images/icons/apple_splash_640.png"
            media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            sizes="640x1136"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default HTMLDocument;
