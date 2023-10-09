import {
  At,
  Button,
  Container,
  Hero,
  Search,
  Section,
  Sidebar,
} from "@components/index";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { FolderIcon } from "@icons/index";
import { BREAKPOINTS } from "@lib/constants";
import { WindowContext } from "@lib/contexts/window";
import { OptionType } from "@lib/types";
import { Trans } from "next-i18next";
import Link from "next/link";
import {
  FunctionComponent,
  useMemo,
  useRef,
  ForwardRefExoticComponent,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
  useContext,
} from "react";

/**
 * Catalogue Index
 * @overview Status: Live
 */

export interface ArchiveLevel {
  start_date: string;
  end_date: string;
  [key: string]: string;
}

export type Sitting = {
  date: string;
  volume: number;
  filename: string;
  download_count: number;
  view_count: number;
  cite_count: number;
};

interface CatalogueIndexProps {
  data: any;
  collection: Record<string, any>;
}

const CatalogueIndex: FunctionComponent<CatalogueIndexProps> = ({
  data,
  collection,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});
  const filterRef = useRef<CatalogueFilterRef>(null);
  const { size } = useContext(WindowContext);

  const _collection = useMemo<Array<[string, any]>>(() => {
    const resultCollection: Array<[string, Sitting[]]> = [];
    Object.entries(collection).forEach(([category, subcategory]) => {
      Object.entries(subcategory).forEach(([subcategory_title, datasets]) => {
        resultCollection.push([subcategory_title, datasets as Sitting[]]);
      });
    });

    return resultCollection;
  }, [collection]);

  const TERMS = Object.keys(collection).reverse();

  return (
    <>
      <Container className="min-h-screen">
        <Sidebar
          data={collection}
          onSelect={(selected) =>
            scrollRef.current[selected]?.scrollIntoView({
              behavior: "smooth",
              block: size.width <= BREAKPOINTS.LG ? "start" : "center",
              inline: "end",
            })
          }
        >
          <div className="p-8">
            <div className="flex flex-col gap-y-6 lg:gap-y-8">
              <h5>{t("full_archive")}</h5>
              <div className="grid grid-cols-5 gap-x-8 gap-y-12">
                {TERMS.map((term, i) => (
                    <Link href={"/"} className="flex flex-col gap-y-3 items-center">
                      <div className="relative">
                        <FolderIcon />
                        <div className="absolute bottom-1 right-1 bg-slate-400 rounded-md flex gap-0.5 items-center py-0.5 px-1.5">
                          <BookmarkIcon className="text-white h-3.5 w-3.5" />
                          <p className="text-white font-medium">23</p>
                        </div>
                      </div>
                      <div className="flex flex-col text-center">
                        <p className="text-zinc-900 dark:text-white font-medium">
                          {t("term", { ns: "enum", count: term })}
                        </p>
                        <p className="text-slate-500 text-sm">{`(${collection[term].start_date.substring(
                        0,
                        4
                      )} - ${collection[term].end_date.substring(0, 4)})`}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
          {/* <CatalogueFilter
            ref={filterRef}
            query={query}
            sources={sourceOptions}
          /> */}

          {/* {_collection.length > 0 ? (
            _collection.map(([title, datasets]) => {
              return (
                <Section
                  title={title}
                  key={title}
                  ref={(ref) => (scrollRef.current[title] = ref)}
                  className="p-2 max-lg:first-of-type:pb-8 max-lg:first-of-type:pt-14 py-6 lg:p-8"
                >
                  <ul className="columns-1 space-y-3 sm:columns-3">
                    {datasets.map((item: Catalogue, index: number) => (
                      <li key={index}>
                        <At
                          href={`/katalog/${item.id}`}
                          className="text-primary dark:text-secondary no-underline [text-underline-position:from-font] hover:underline"
                          prefetch={false}
                        >
                          {item.catalog_name}
                        </At>
                      </li>
                    ))}
                  </ul>
                </Section>
              );
            })
          ) : (
            <p className="text-zinc-500 p-2 pt-16 lg:p-8">
              {t("common:no_entries")}.
            </p>
          )} */}
        </Sidebar>
      </Container>
    </>
  );
};

/**
 * Catalogue Filter Component
 */
interface CatalogueFilterProps {
  query: Record<string, any>;
  sources: OptionType[];
  ref?: ForwardedRef<CatalogueFilterRef>;
}

interface CatalogueFilterRef {
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

CatalogueFilter.displayName = "CatalogueFilter";

export default CatalogueIndex;
