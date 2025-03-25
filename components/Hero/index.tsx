import Container from "@components/Container";
import { EyeIcon } from "@heroicons/react/20/solid";
import { AnalyticsContext } from "@lib/contexts/analytics";
import { cn, numFormat, toDate } from "@lib/helpers";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { FunctionComponent, ReactNode, useContext, useMemo } from "react";

type ConditionalHeroProps =
  | {
      children?: ReactNode;
      category?: never;
      header?: never;
      description?: never;
      action?: never;
      last_updated?: never;
    }
  | HeroDefault;

type HeroDefault = {
  children?: never;
  category?: [text: string, className?: string];
  header?: [text: string, className?: string];
  description?: [text: string, className?: string] | ReactNode;
  action?: ReactNode;
  last_updated?: string | number;
};

type HeroProps = {
  background?: "gold" | string;
  className?: string;
} & ConditionalHeroProps;

const Hero: FunctionComponent<HeroProps> = ({
  background = "gold",
  className,
  children,
  category,
  header,
  description,
  action,
  last_updated,
}) => {
  const { t, i18n } = useTranslation();

  const { counts } = useContext(AnalyticsContext);

  const background_style = useMemo<string>(() => {
    switch (background) {
      case "gold":
        return "bg-gradient-radial from-[#DDD6B0] to-slate-50 dark:from-[#3E3713] dark:to-zinc-900";
      default:
        return background;
    }
  }, [background]);

  return (
    <Container
      background={cn(background_style, "border-b dark:border-zinc-800")}
      className={cn("relative overflow-hidden", className)}
    >
      <>
        {children ? (
          children
        ) : (
          <>
            <div className="space-y-6 py-12 xl:w-full">
              {category && (
                <div className="relative flex justify-between">
                  {category && (
                    <span
                      className={cn("font-semibold uppercase", category[1])}
                      data-testid="hero-category"
                    >
                      {category[0]}
                    </span>
                  )}
                </div>
              )}

              {(header || description || counts.views) && (
                <div className="space-y-3">
                  {header && (
                    <h1
                      className={cn(
                        "font-poppins text-3xl font-bold leading-[38px] text-foreground",
                        header[1]
                      )}
                      data-testid="hero-header"
                    >
                      {header[0]}
                    </h1>
                  )}

                  {description && Array.isArray(description) ? (
                    <p
                      className={cn(
                        "text-txt-black-500 max-xl:max-w-prose xl:w-2/3",
                        description[1]
                      )}
                      data-testid="hero-description"
                    >
                      {description[0]}
                    </p>
                  ) : (
                    description
                  )}

                  {counts.views >= 0 ? (
                    <p
                      className="flex gap-2 text-sm text-txt-black-500"
                      data-testid="hero-views"
                    >
                      <EyeIcon className="h-4.5 w-4.5 self-center" />
                      {`${numFormat(counts.views, "standard")} ${t("views", {
                        count: counts.views,
                      })}`}
                    </p>
                  ) : (
                    <p className="h-5 w-full"></p>
                  )}
                </div>
              )}

              {(action || last_updated) && (
                <div className="space-y-3">
                  {action}
                  {last_updated && (
                    <time
                      className="text-sm text-txt-black-500"
                      data-testid="hero-last-updated"
                    >
                      {t("last_updated", {
                        date: toDate(
                          last_updated,
                          "dd MMM yyyy, HH:mm",
                          i18n.language
                        ),
                      })}
                    </time>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Parlimen Icon */}
        <div className="pointer-events-none absolute -bottom-8 -right-14 opacity-20 sm:bottom-0 sm:right-0">
          <svg
            width="300"
            height="214"
            viewBox="0 0 300 214"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M300 179.656L298.355 186.237H288.482L283.546 196.11H245.625L239.043 184.554H225.842L220.102 191.441L216.773 188.686V184.554H214.554V188.686H210.995V184.554H208.737V188.686H205.179V184.554H202.959V188.686H199.362V184.554H197.143V188.686H193.546V184.554H191.327V188.686H187.73V184.554H185.51V188.686H181.952V184.554H179.732V188.686H176.173V184.554H173.916V188.686L170.931 190.179L168.138 184.592H110.434V191.174L108.788 194.464H8.26531L5.77806 191.174H105.497V184.592H1.64541L0 179.656H300ZM279.337 188.686V184.554H277.117V188.686H279.337ZM273.52 188.686V184.554H271.301V188.686H273.52ZM267.704 188.686V184.554H265.485V188.686H267.704ZM261.888 188.686V184.554H259.668V188.686H261.888ZM256.11 188.686V184.554H253.89V188.686H256.11ZM250.293 188.686V184.554H248.074V188.686H250.293Z"
              fill="#7B6F33"
            />
            <path
              d="M276.926 207.667H253.852V214.248H276.926V207.667Z"
              fill="#7B6F33"
            />
            <path
              d="M247.232 201.084H217.577V214.285H247.232V201.084Z"
              fill="#7B6F33"
            />
            <path
              d="M220.102 191.48L217.577 194.465H173.074L170.931 190.179L173.916 188.686H185.51H187.73H191.327H193.546H197.143H208.737H216.773L220.102 191.48Z"
              fill="#7B6F33"
            />
            <path
              d="M210.995 201.085V212.641L18.9796 210.996L15.6888 206.059H32.9847V201.123H12.398L9.91077 197.832H108.788V194.541L110.434 191.251H115.37L117.015 189.605H141.773L148.355 197.832L172.844 199.133L210.995 201.085ZM110.434 206.021V201.085H102.742V206.021H110.434ZM96.4286 206.021V201.085H92.87V206.021H96.4286ZM87.5511 206.021V201.085H83.9924V206.021H87.5511ZM78.6735 206.021V201.085H75.1149V206.021H78.6735ZM69.796 206.021V201.085H66.2373V206.021H69.796ZM60.8802 206.021V201.085H57.3215V206.021H60.8802ZM52.0026 206.021V201.085H48.4439V206.021H52.0026ZM43.1251 206.021V201.085H39.5664V206.021H43.1251Z"
              fill="#7B6F33"
            />
            <path
              d="M215.511 176.365L194.924 126.888L174.299 176.365H168.138L194.924 112.079L221.71 176.365H215.511Z"
              fill="#7B6F33"
            />
            <path
              d="M194.924 136.798L188.725 151.607H201.084L194.924 136.798Z"
              fill="#7B6F33"
            />
            <path
              d="M191.212 174.72L191.326 157.385L180.497 174.72H191.212Z"
              fill="#7B6F33"
            />
            <path
              d="M198.712 174.72L198.635 157.385L209.426 174.72H198.712Z"
              fill="#7B6F33"
            />
            <path
              d="M241.722 130.332L243.826 138.138L240.574 137.181L238.393 129.031L234.337 127.424L236.671 136.072L233.418 135.115L231.008 126.123L226.951 124.516L229.477 133.967L226.263 133.049L223.622 123.215L219.605 121.646H219.643L222.398 131.901L219.145 130.982L216.314 120.345L210.459 118.049L213.482 129.337L210.268 128.38L207.13 116.748L199.439 113.725L225.803 176.365H258.788L245.587 131.862L241.722 130.332Z"
              fill="#7B6F33"
            />
            <path
              d="M164.847 15L173.074 17.9082V9.87245L145.064 0L85.7148 13.1633V21.199L145.064 8.03572L159.911 13.2781L159.873 19.7066L145.064 14.4643L85.7148 27.6658V35.7015L145.064 22.5L159.911 27.7423L159.873 34.1709L145.064 28.9286L85.7148 42.1301V50.1658L145.064 37.0026L159.911 42.2066L159.873 48.6352L145.064 43.4311L85.7148 56.5944V64.6301L145.064 51.4668L159.911 56.7092L159.873 63.1378L145.064 57.8954L85.7148 71.0969V79.1327L145.064 65.9311L159.911 71.1735L159.873 77.6021L145.064 72.3597L85.7148 85.5612V93.5969L145.064 80.4337L159.911 85.6378L159.873 92.1046L145.064 86.8623L85.7148 100.026V108.1L145.064 94.898L159.911 100.14L159.873 106.569L145.064 101.327L85.7148 114.528V122.564L145.064 109.362L159.911 114.605L159.873 121.033L145.064 115.791L85.7148 128.992V137.028L145.064 123.865L159.873 129.069L159.911 135.536L145.064 130.293L85.7148 143.457V151.531L145.064 138.329L159.873 143.571L159.911 150L145.064 144.758L85.7148 157.959V165.995L145.064 152.793L159.873 158.036L159.911 164.464L145.064 159.222L85.7148 172.424V180.459L145.064 167.296L173.074 177.168V169.133L164.847 166.225V159.796L173.074 162.704V154.668L164.771 151.722L164.847 145.293L173.074 148.202V140.166L164.847 137.258V130.829L173.074 133.737V125.702L164.771 122.755L164.847 116.365L173.074 119.273V111.237L164.847 108.329V101.862L173.074 104.77V96.7347L164.771 93.7883L164.847 87.398L173.074 90.3061V82.2704L164.847 79.3623V72.9337L173.074 75.8419V67.7679L164.847 64.8597V58.4311L173.074 61.3393V53.3036L164.847 50.3954V43.9668L173.074 46.875V38.8393L164.847 35.9311V29.5026L173.074 32.4107V24.3367L164.847 21.4286V15Z"
              fill="#7B6F33"
            />
          </svg>
        </div>
      </>
    </Container>
  );
};

export default Hero;
