import { At, Hero } from "@components/index";
import { BuildingLibraryIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { routes } from "@lib/routes";
import { OptionType } from "@lib/types";
import { useRouter } from "next/router";
import { ReactNode } from "react";

/**
 * Catalogue Index Layout
 * @overview Status: Live
 */

const CatalogIndexLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation("catalogue");
  const { pathname } = useRouter();

  const TAB_OPTIONS: Array<OptionType> = [
    {
      label: t("dewan_rakyat", { ns: "common" }),
      value: routes.KATALOG_DR,
    },
    {
      label: t("dewan_negara", { ns: "common" }),
      value: routes.KATALOG_DN,
    },
    {
      label: t("kamar_khas", { ns: "common" }),
      value: routes.KATALOG_KK,
    },
  ];

  return (
    <>
      <Hero
        background="gold"
        category={[t("hero.category"), "text-secondary"]}
        header={[t("hero.header")]}
        description={[t("hero.description")]}
      />

      <nav className="h-14 sticky top-14 z-20 flex overflow-hidden border-b border-b-border bg-background justify-start min-[350px]:justify-center">
        <div className="hide-scrollbar flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto max-sm:justify-start">
          {TAB_OPTIONS.map((tab) => (
            <div key={tab.value} className="snap-start">
              <At
                href={tab.value}
                scrollTop={false}
                className="flex h-full min-w-[56px] cursor-pointer items-center justify-center"
              >
                <div
                  className={cn(
                    pathname.includes(tab.value) && "dark:bg-zinc-800",
                    "relative flex h-full flex-col items-center justify-center p-4"
                  )}
                >
                  <div className="flex gap-1.5 items-center">
                    <BuildingLibraryIcon
                      className={cn(
                        "h-4.5 w-4.5",
                        pathname.includes(tab.value)
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-500"
                      )}
                    />
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        pathname.includes(tab.value)
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-500"
                      )}
                    >
                      <span className="whitespace-nowrap text-base font-medium">
                        {tab.label}
                      </span>
                    </div>
                  </div>
                  {pathname.includes(tab.value) && (
                    <div className="absolute bottom-0 inline-flex h-[2px] w-full min-w-[56px] rounded-full bg-secondary" />
                  )}
                </div>
              </At>
            </div>
          ))}
        </div>
      </nav>

      {children}
    </>
  );
};

export default CatalogIndexLayout;
