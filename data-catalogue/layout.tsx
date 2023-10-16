import { At, Hero } from "@components/index";
import { BuildingLibraryIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { WindowProvider } from "@lib/contexts/window";
import { cn } from "@lib/helpers";
import { routes } from "@lib/routes";
import { OptionType } from "@lib/types";
import { useRouter } from "next/router";
import { FC, ReactNode } from "react";

/**
 * Catalogue Index Layout
 * @overview Status: Live
 */

interface CatalogIndexLayoutProps {
  children: ReactNode;
}

const CatalogIndexLayout: FC<CatalogIndexLayoutProps> = ({ children }) => {
  const { t } = useTranslation("catalogue");
  const { pathname } = useRouter();

  const TAB_OPTIONS: Array<OptionType> = [
    {
      label: t("dewan_rakyat"),
      value: routes.KATALOG.concat("/dewan-rakyat"),
    },
    {
      label: t("dewan_negara"),
      value: routes.KATALOG.concat("/dewan-negara"),
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

      <nav className="sticky top-14 z-20 flex overflow-hidden border-b border-b-outline bg-white dark:border-b-washed-dark dark:bg-black min-[350px]:justify-center lg:static">
        <div className="hide-scrollbar max-[420px]:justify-center, flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto max-sm:justify-start">
          {TAB_OPTIONS.map((tab) => (
            <div key={tab.value} className="snap-start">
              <At
                href={tab.value}
                scrollTop={false}
                className="flex h-full min-w-[56px] cursor-pointer items-center justify-center outline-none"
              >
                <div
                  className={cn(
                    pathname === tab.value && "dark:bg-zinc-800",
                    "relative flex h-full flex-col items-center justify-center p-4"
                  )}
                >
                  <div className="flex gap-1.5 items-center">
                    <BuildingLibraryIcon
                      className={cn(
                        "h-4.5 w-4.5",
                        pathname === tab.value
                          ? "dark:text-white text-zinc-800"
                          : "text-dim"
                      )}
                    />
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        pathname === tab.value
                          ? "text-black dark:text-white"
                          : "text-dim"
                      )}
                    >
                      <span className="whitespace-nowrap text-base font-medium">
                        {tab.label}
                      </span>
                    </div>
                  </div>
                  {pathname === tab.value && (
                    <div className="absolute bottom-0 inline-flex h-[2px] w-full min-w-[56px] rounded-full bg-secondary" />
                  )}
                </div>
              </At>
            </div>
          ))}
        </div>
      </nav>

      <WindowProvider>{children}</WindowProvider>
    </>
  );
};

export default CatalogIndexLayout;
