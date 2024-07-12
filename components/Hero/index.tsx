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
                        "text-zinc-500 max-xl:max-w-prose xl:w-2/3",
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
                      className="flex gap-2 text-sm text-zinc-500"
                      data-testid="hero-views"
                    >
                      <EyeIcon className="h-4.5 w-4.5 self-center" />
                      {`${numFormat(counts.views, "standard")} ${t("views", {
                        count: counts.views,
                      })}`}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              )}

              {(action || last_updated) && (
                <div className="space-y-3">
                  {action}
                  {last_updated && (
                    <time
                      className="text-sm text-zinc-500"
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
          <Image
            src="/static/images/icons/parlimen.png"
            width={300}
            height={214}
            alt="Parlimen"
            loading="eager"
            priority
          />
        </div>
      </>
    </Container>
  );
};

export default Hero;
