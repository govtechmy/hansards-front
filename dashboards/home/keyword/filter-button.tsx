import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "@hooks/useTranslation";
import Button from "@components/Button";
import { WindowContext } from "@lib/contexts/window";
import { cn } from "@lib/helpers";
import { MouseEventHandler, useContext, useMemo } from "react";

/**
 * Keyword - Filter
 * @overview Status: In-development
 */

interface FilterProps {
  onClick?: MouseEventHandler<HTMLDivElement> | (() => void);
}

const Filter = ({ onClick }: FilterProps) => {
  const { t } = useTranslation();
  const { scroll } = useContext(WindowContext);
  const show = useMemo(() => scroll.y > 700, [scroll.y]);

  return (
    <div
      className={cn(
        "btn-default shadow-floating",
        show ? "fixed right-3 top-[120px] z-20 lg:hidden" : "hidden"
      )}
      onClick={onClick}
    >
      <span>{t("filters")}</span>
      <span className="bg-blue-600 dark:bg-primary-dark w-4.5 h-5 rounded-md text-center text-white">
        6
      </span>
      <ChevronDownIcon className="-mx-[5px] h-5 w-5" />
    </div>
  );
};

export default Filter;
