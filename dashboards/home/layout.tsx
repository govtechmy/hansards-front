import At from "@components/At";
import Hero from "@components/Hero";
import { ChatBubbleLeftRightIcon, UsersIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { routes } from "@lib/routes";
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

  const TAB_OPTIONS = [
    {
      icon: <ChatBubbleLeftRightIcon className="h-4.5 w-4.5" />,
      name: t("search_keyword"),
      href: [routes.HOME, routes.CARI],
    },
    {
      icon: <UsersIcon className="h-4.5 w-4.5" />,
      name: t("search_mp"),
      href: [routes.CARI_MP],
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

      <nav className="sticky top-14 z-20 flex justify-start overflow-hidden border-b border-b-border bg-background min-[350px]:justify-center lg:static">
        <div className="hide-scrollbar flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto">
          {TAB_OPTIONS.map(tab => {
            const isPath = tab.href.includes(pathname);
            return (
              <div key={tab.name} className="snap-start">
                <At
                  href={tab.href[0]}
                  scrollTop={false}
                  className="flex h-full min-w-[56px] cursor-pointer items-center justify-center"
                >
                  <div
                    className={cn(
                      isPath && "bg-bg-black-50 dark:bg-bg-black-200",
                      "relative flex h-full flex-col items-center justify-center p-4"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-1.5",
                        isPath ? "text-txt-black-900" : "text-txt-black-500"
                      )}
                    >
                      {tab.icon}
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap text-base font-medium">
                          {tab.name}
                        </span>
                      </div>
                    </div>
                    {isPath && (
                      <div className="absolute bottom-0 inline-flex h-[2px] w-full min-w-[56px] rounded-full bg-secondary" />
                    )}
                  </div>
                </At>
              </div>
            );
          })}
        </div>
      </nav>

      {children}
    </>
  );
};

export default HomeLayout;
