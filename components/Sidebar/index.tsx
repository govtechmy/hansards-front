import { ComponentProps, FunctionComponent, ReactNode, useState } from "react";
import { Transition } from "@headlessui/react";
import Button from "@components/Button";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Sitting } from "@data-catalogue/index";

type Term =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15";

type Session = "1" | "2" | "3" | "4" | "5" | "6";

type Meeting = "0" | "1" | "2" | "3" | "4" | "5" | "6";

type Cycle = {
  start_date: string;
  end_date: string;
};

interface SidebarProps {
  children: ReactNode;
  data: Record<
    Term,
    Cycle & Record<Session, Cycle & Record<Meeting, Sitting[]>>
  >;
  onSelect: (index: string) => void;
}

const Sidebar: FunctionComponent<SidebarProps> = ({
  children,
  data,
  onSelect,
}) => {
  const { t } = useTranslation(["catalogue", "common", "enum"]);
  const [selected, setSelected] = useState<string>();
  const [show, setShow] = useState<boolean>(false);
  const styles = {
    base: "px-4 lg:px-5 py-1.5 w-full rounded-none text-start leading-tight",
    active:
      "text-sm bg-slate-100 text-zinc-900 font-medium dark:bg-zinc-800 dark:text-white",
    default: "text-sm text-zinc-500",
  };

  const TERMS = Object.keys(data).reverse();
  return (
    <>
      <div className="flex w-full flex-row">
        {/* Desktop */}
        <div className="dark:border-r-slate-800  hidden border-r lg:block lg:w-1/4 xl:w-1/5">
          <ul className="sticky top-14 flex h-[90vh] flex-col overflow-auto pt-8">
            <li className="flex px-5 justify-between">
              <h5>{t("full_archive")}</h5>
              <Button variant="default" className="p-1.5 shadow-button">
                <ChevronRightIcon className="h-4.5 w-4.5" />
              </Button>
            </li>
            {TERMS.length > 0 ? (
              TERMS.map((term) => (
                <li key={term} title={t("term", { ns: "enum", count: term })}>
                  <Button
                    className={cn(
                      styles.base,
                      selected === term ? styles.active : styles.default
                    )}
                    onClick={() => {
                      setSelected(term);
                      // onSelect(`${term}: ${subcategory[0]}`);
                    }}
                  >
                    {t("term", { ns: "enum", count: term }).concat(
                      ` (${data[term as Term].start_date.substring(
                        0,
                        4
                      )} - ${data[term as Term].end_date.substring(0, 4)})`
                    )}
                  </Button>
                  {/* <ul className="ml-5 space-y-1">
                    {subcategory.length &&
                      subcategory.map((title) => (
                        <li key={title} title={title}>
                          <Button
                            className={cn(
                              styles.base,
                              selected === title
                                ? styles.active
                                : styles.default
                            )}
                            onClick={() => {
                              setSelected(title);
                              onSelect(`${category}: ${title}`);
                            }}
                          >
                            {title}
                          </Button>
                          <div className="relative">
                            <SidebarL className="absolute" />
                            <SidebarT className="absolute" />
                          </div>
                        </li>
                      ))}
                  </ul> */}
                </li>
              ))
            ) : (
              <p className={cn(styles.base, "text-zinc-500 text-sm italic")}>
                {t("no_entries")}
              </p>
            )}
          </ul>
        </div>

        {/* Mobile */}
        <div className="relative w-full">
          <>
            <div className="absolute top-[72px] block lg:hidden">
              <Button
                className="btn-default sticky top-36 z-10"
                icon={<Bars3BottomLeftIcon className="h-4 w-4" />}
                onClick={() => setShow(true)}
              >
                {t("category")}
              </Button>
            </div>
            <Transition
              show={show}
              as="div"
              className="dark:border-zinc-800 shadow-floating fixed left-0 top-14 z-30 flex h-screen w-2/3 flex-col border border-r bg-white dark:bg-zinc-900 sm:w-1/3"
              enter="transition-opacity duration-75"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ul className="flex flex-col gap-1 overflow-auto pt-2">
                <li className="flex items-baseline justify-between">
                  <h5 className={styles.base}>{t("category")}</h5>

                  <Button
                    className="hover:bg-slate-100 dark:hover:bg-zinc-800 group absolute right-2 top-2 flex h-8 w-8 items-center rounded-full"
                    onClick={() => setShow(false)}
                  >
                    <XMarkIcon className="text-zinc-500 absolute right-1.5 h-5 w-5 group-hover:text-zinc-900 dark:group-hover:text-white" />
                  </Button>
                </li>

                {/* {terms.length > 0 ? (
                  terms.map(([category, subcategory]) => (
                    <li key={`${category}: ${subcategory[0]}`} title={category}>
                      <Button
                        className={cn(
                          styles.base,
                          selected === category ? styles.active : styles.default
                        )}
                        onClick={() => {
                          setSelected(category);
                          onSelect(`${category}: ${subcategory[0]}`);
                        }}
                      >
                        {category}
                      </Button>
                      <ul className="ml-4">
                        {subcategory.length &&
                          subcategory.map((title) => (
                            <li key={title}>
                              <Button
                                className={cn(
                                  styles.base,
                                  selected === title
                                    ? styles.active
                                    : styles.default
                                )}
                                onClick={() => {
                                  setSelected(title);
                                  onSelect(`${category}: ${title}`);
                                }}
                              >
                                {title}
                              </Button>
                            </li>
                          ))}
                              </ul>
                    </li>
                  ))
                ) : (
                  <p
                    className={cn(styles.base, "text-zinc-500 text-sm italic")}
                  >
                    {t("no_entries")}
                  </p>
                )}*/}
              </ul>
            </Transition>
          </>
          {/* Content */}
          {children}
        </div>
      </div>
    </>
  );
};

const SidebarL = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="15"
      height="27"
      viewBox="0 0 15 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M1 0V14C1 20.6274 6.37258 26 13 26H15" stroke="#94A3B8" />
    </svg>
  );
};

const SidebarT = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="2"
      height="52"
      viewBox="0 0 2 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M1 0V52" stroke="#94A3B8" />
    </svg>
  );
};
export default Sidebar;
