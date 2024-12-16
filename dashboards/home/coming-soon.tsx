import Hero from "@components/Hero";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";

/**
 * Coming Soon
 * @overview Status: Live
 */

const ComingSoon = () => {
  const { t } = useTranslation("home");

  return (
    <>
      <Hero
        background="gold"
        category={[t("hero.category"), "text-secondary"]}
        header={[t("hero.header")]}
        description={[t("hero.description")]}
      />
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex items-center gap-1.5 rounded-md bg-slate-200 px-3 py-1.5 dark:bg-zinc-800">
          <ClockIcon className="size-5" />
          Coming Soon!
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
