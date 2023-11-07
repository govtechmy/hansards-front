import { Hero } from "@components/index";
import { UserIcon, MapIcon } from "@heroicons/react/20/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { OptionType } from "@lib/types";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

/**
 * Sejarah Layout
 * @overview Status: In-development
 */

const Toast = dynamic(() => import("@components/Toast"), { ssr: false });

interface SejarahLayoutProps {
  children: (tab: string) => ReactNode;
}

const SejarahLayout = ({ children }: SejarahLayoutProps) => {
  const { t } = useTranslation("sejarah");

  const TAB_OPTIONS: Array<OptionType & { icon: ReactNode }> = [
    {
      icon: <UserIcon className="h-4.5 w-4.5" />,
      label: t("search_mp"),
      value: "mp",
    },
    {
      icon: <MapIcon className="h-4.5 w-4.5" />,
      label: t("search_area"),
      value: "area",
    },
  ];

  const { data, setData } = useData({
    tab: TAB_OPTIONS[0].value,
  });

  return (
    <>
      <Toast />
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
              <div
                className="flex h-full min-w-[56px] cursor-pointer items-center justify-center  outline-none"
                onClick={() => setData("tab", tab.value)}
              >
                <div
                  className={cn(
                    data.tab === tab.value && "dark:bg-zinc-800",
                    "relative flex h-full flex-col items-center justify-center p-4"
                  )}
                >
                  <div className="flex gap-1.5 items-center">
                    <div
                      className={cn(
                        data.tab === tab.value
                          ? "dark:text-white text-zinc-800"
                          : "text-dim"
                      )}
                    >
                      {tab.icon}
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        data.tab === tab.value
                          ? "text-black dark:text-white"
                          : "text-dim"
                      )}
                    >
                      <span className="whitespace-nowrap text-base font-medium">
                        {tab.label}
                      </span>
                    </div>
                  </div>
                  {data.tab === tab.value && (
                    <div className="absolute bottom-0 inline-flex h-[2px] w-full min-w-[56px] rounded-full bg-secondary" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {children(data.tab)}
    </>
  );
};

export default SejarahLayout;