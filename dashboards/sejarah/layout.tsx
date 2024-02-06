import At from "@components/At";
import Hero from "@components/Hero";
import {
  BuildingLibraryIcon,
  FlagIcon,
  MapIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { routes } from "@lib/routes";
import { OptionType } from "@lib/types";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ReactNode } from "react";

/**
 * Sejarah Layout
 * @overview Status: In-development
 */

const Toast = dynamic(() => import("@components/Toast"), { ssr: false });

interface SejarahLayoutProps {
  children: ReactNode;
  last_updated: string;
}

const SejarahLayout = ({ children, last_updated }: SejarahLayoutProps) => {
  const { t } = useTranslation("sejarah");
  const { pathname } = useRouter();

  const TAB_OPTIONS: Array<OptionType & { icon: ReactNode }> = [
    {
      icon: <UserIcon className="h-4.5 w-4.5" />,
      label: t("by_individu"),
      value: routes.SEJARAH_INDIVIDU,
    },
    {
      icon: <MapIcon className="h-4.5 w-4.5" />,
      label: t("by_kawasan"),
      value: routes.SEJARAH_KAWASAN,
    },
    {
      icon: <BuildingLibraryIcon className="h-4.5 w-4.5" />,
      label: t("by_parlimen"),
      value: routes.SEJARAH_PARLIMEN,
    },
    {
      icon: <FlagIcon className="h-4.5 w-4.5" />,
      label: t("by_parti"),
      value: routes.SEJARAH_PARTI,
    },
  ];

  return (
    <>
      <Toast />
      <Hero
        background="gold"
        category={[t("hero.category"), "text-secondary"]}
        header={[t("hero.header")]}
        description={[t("hero.description")]}
        last_updated={last_updated}
      />

      <nav className="sticky top-14 z-20 flex overflow-hidden border-b border-b-border bg-background justify-start min-[350px]:justify-center lg:static">
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
                    pathname.startsWith(tab.value) && "dark:bg-zinc-800",
                    "relative flex h-full flex-col items-center justify-center p-4"
                  )}
                >
                  <div className="flex gap-1.5 items-center">
                    <div
                      className={cn(
                        pathname.startsWith(tab.value)
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-500"
                      )}
                    >
                      {tab.icon}
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        pathname.startsWith(tab.value)
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-500"
                      )}
                    >
                      <span className="whitespace-nowrap text-base font-medium">
                        {tab.label}
                      </span>
                    </div>
                  </div>
                  {pathname.startsWith(tab.value) && (
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

export default SejarahLayout;
