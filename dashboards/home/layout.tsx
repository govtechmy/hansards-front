import At from "@components/At";
import Hero from "@components/Hero";
import { ChatBubbleLeftRightIcon, UsersIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { routes } from "@lib/routes";
import { OptionType } from "@lib/types";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ReactNode } from "react";

/**
 * Home Layout
 * @overview Status: Live
 */

const Toast = dynamic(() => import("@components/Toast"), { ssr: false });

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  const { t } = useTranslation("home");
  const { pathname } = useRouter();

  const TAB_OPTIONS: Array<OptionType & { icon: ReactNode }> = [
    {
      icon: <ChatBubbleLeftRightIcon className="h-4.5 w-4.5" />,
      label: t("search_keyword"),
      value: routes.HOME,
    },
    {
      icon: <UsersIcon className="h-4.5 w-4.5" />,
      label: t("search_mp_party"),
      value: routes.CARI_MP,
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
      />

      <nav className="sticky top-14 z-20 flex overflow-hidden border-b border-b-slate-200 bg-white dark:border-b-zinc-800 dark:bg-zinc-900 justify-start min-[350px]:justify-center lg:static">
        <div className="hide-scrollbar flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto">
          {TAB_OPTIONS.map((tab) => (
            <div key={tab.value} className="snap-start">
              <At
                href={tab.value}
                scrollTop={false}
                className="flex h-full min-w-[56px] cursor-pointer items-center justify-center  outline-none"
              >
                <div
                  className={cn(
                    pathname === tab.value && "dark:bg-zinc-800",
                    "relative flex h-full flex-col items-center justify-center p-4"
                  )}
                >
                  <div className="flex gap-1.5 items-center">
                    <div
                      className={cn(
                        pathname === tab.value
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-500"
                      )}
                    >
                      {tab.icon}
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        pathname === tab.value
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-500"
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

      {children}
    </>
  );
};

export default HomeLayout;
