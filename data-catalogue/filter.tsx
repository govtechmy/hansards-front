import { Button, Search } from "@components/index";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { OptionType } from "@lib/types";
import {
  ForwardRefExoticComponent,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
} from "react";

/**
 * Catalogue Filter Component
 */
interface CatalogueFilterProps {
  query: Record<string, any>;
  sources: OptionType[];
  ref?: ForwardedRef<CatalogueFilterRef>;
}

export interface CatalogueFilterRef {
  setFilter: (key: string, value: any) => void;
}

const CatalogueFilter: ForwardRefExoticComponent<CatalogueFilterProps> =
  forwardRef(({ query }, ref) => {
    const { t } = useTranslation(["catalogue", "common"]);

    const { filter, setFilter, actives } = useFilter({
      search: query.search ?? "",
    });

    const reset = () => {
      setFilter("search", "");
    };

    useImperativeHandle(ref, () => {
      return { setFilter };
    });

    return (
      <div className="dark:border-zinc-800 sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-3 dark:bg-zinc-900 lg:pl-2">
        <div className="flex-1">
          <Search
            className="border-none py-1.5"
            placeholder={t("common:placeholder.search")}
            query={filter.search}
            onChange={(e) => setFilter("search", e)}
          />
        </div>
        {actives.length > 0 &&
          actives.findIndex((active) => active[0] !== "source") !== -1 && (
            <Button
              variant="reset"
              className="hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-500 group block rounded-full p-1 hover:text-zinc-900 dark:hover:text-white xl:hidden"
              disabled={!actives.length}
              onClick={reset}
            >
              <XMarkIcon className="text-zinc-500 h-5 w-5 group-hover:text-zinc-900 dark:group-hover:text-white" />
            </Button>
          )}
        <div className="hidden gap-2 pr-6 xl:flex">
          {actives.length > 0 &&
            actives.findIndex((active) => active[0] !== "source") !== -1 && (
              <Button
                className="btn-ghost text-zinc-500 group hover:text-zinc-900 dark:hover:text-white"
                disabled={!actives.length}
                onClick={reset}
              >
                <XMarkIcon className="text-zinc-500 h-5 w-5 group-hover:text-zinc-900 dark:group-hover:text-white" />
                {t("common:clear_all")}
              </Button>
            )}
        </div>
      </div>
    );
  });

export default CatalogueFilter;
