import { At, Hero } from "@components/index";
import { BuildingLibraryIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { DewanNegaraIcon } from "@icons/dewan/dewan-negara";
import { DewanRakyatIcon } from "@icons/dewan/dewan-rakyat";
import { cn } from "@lib/helpers";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { ReactNode } from "react";

/**
 * Catalogue Index Layout
 * @overview Status: Live
 */

const CatalogIndexLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation("catalogue");
  const { pathname } = useRouter();

  const TAB_OPTIONS = [
    {
      icon: DewanNegaraIcon,
      name: "dewan_negara",
      path: routes.KATALOG_DN,
    },
    {
      icon: DewanRakyatIcon,
      name: "dewan_rakyat",
      path: routes.KATALOG_DR,
    },
    {
      icon: BuildingLibraryIcon,
      name: "kamar_khas",
      path: routes.KATALOG_KK,
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

      <nav className="sticky top-14 z-20 flex h-14 justify-start overflow-hidden border-b border-b-border bg-background min-[350px]:justify-center">
        <div className="hide-scrollbar flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto max-sm:justify-start">
          {TAB_OPTIONS.map(tab => (
            <div key={tab.path} className="snap-start">
              <At
                href={tab.path}
                scrollTop={false}
                className="flex h-full min-w-[56px] cursor-pointer items-center justify-center"
              >
                <div
                  className={cn(
                    pathname.includes(tab.path) && "dark:bg-zinc-800",
                    "relative flex h-full flex-col items-center justify-center p-4"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <tab.icon
                      className={cn(
                        "size-6",
                        pathname.includes(tab.path)
                          ? "text-txt-black-900"
                          : "text-zinc-500"
                      )}
                    />
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        pathname.includes(tab.path)
                          ? "text-txt-black-900"
                          : "text-zinc-500"
                      )}
                    >
                      <span className="whitespace-nowrap text-base font-medium">
                        {t(tab.name, { ns: "common" })}
                      </span>
                    </div>
                  </div>
                  {pathname.includes(tab.path) && (
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
