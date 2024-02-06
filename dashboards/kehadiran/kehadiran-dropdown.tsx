import Filter from "./filter";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTrigger,
} from "@components/Dialog";
import { Button, Dropdown, Label } from "@components/index";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { WindowProvider } from "@lib/contexts/window";
import { toDate } from "@lib/helpers";
import { Archive, OptionType } from "@lib/types";
import { useMemo, useState } from "react";

/**
 * Kehadiran - Dropdown
 * @overview Status: In-development
 */

export interface KehadiranDropdownProps {
  dropdown: Archive;
  onLoad: () => void;
  params: Record<"parlimen" | "penggal" | "mesyuarat", string>;
}

const KehadiranDropdown = ({
  dropdown,
  onLoad,
  params,
}: KehadiranDropdownProps) => {
  const { t, i18n } = useTranslation(["kehadiran", "enum"]);
  const [open, setOpen] = useState<boolean>(false);
  const { data, setData } = useData({
    parlimen: params.parlimen ?? "15",
    penggal: params.penggal ?? "all",
    mesyuarat: params.mesyuarat ?? "all",
  });

  const { setFilter } = useFilter({
    parlimen: params.parlimen,
    penggal: params.penggal,
    mesyuarat: params.mesyuarat,
  });

  const PARLIMEN_OPTIONS = useMemo<Array<OptionType>>(() => {
    return [{ label: t("all_parlimen"), value: "all" }].concat(
      Object.keys(dropdown)
        .filter((e) => +e >= 14)
        .reverse()
        .map((parlimen) => {
          const { start_date, end_date } = dropdown[parlimen];
          const start = start_date.substring(0, 4);
          const end = end_date.substring(0, 4);
          const yearRange =
            start === end ? ` (${start})` : ` (${start} - ${end})`;
          return {
            label: t("parlimen", { count: parlimen, ns: "enum" }).concat(
              yearRange
            ),
            value: parlimen,
          };
        })
    );
  }, [i18n.language]);

  const PENGGAL_OPTIONS = useMemo<Array<OptionType>>(() => {
    let _penggal: Array<OptionType> = [];
    if (data.parlimen && data.parlimen !== "all") {
      _penggal = Object.keys(dropdown[data.parlimen])
        .filter((e) => !["start_date", "end_date"].includes(e))
        .filter((e) => (data.parlimen === "14" && +e < 3 ? false : true))
        .reverse()
        .map((penggal) => {
          const { start_date, end_date } = dropdown[data.parlimen][penggal];
          const start = start_date.substring(0, 4);
          const end = end_date.substring(0, 4);
          const yearRange =
            start === end ? ` (${start})` : ` (${start} - ${end})`;
          return {
            label: t("penggal_full", { n: penggal, ns: "enum" }).concat(
              yearRange
            ),
            value: penggal,
          };
        });
    }
    return [{ label: t("all_penggal"), value: "all" }].concat(_penggal);
  }, [data.parlimen, i18n.language]);

  const MESYUARAT_OPTIONS = useMemo<Array<OptionType>>(() => {
    let _mesyuarat: Array<OptionType> = [];
    if (
      data.parlimen &&
      data.penggal &&
      data.parlimen !== "all" &&
      data.penggal !== "all"
    ) {
      _mesyuarat = Object.keys(dropdown[data.parlimen][data.penggal])
        .reverse()
        .filter((e) => !["start_date", "end_date"].includes(e))
        .filter((e) =>
          data.parlimen === "14" && data.penggal === "3" && +e !== 0
            ? false
            : true
        )
        .map((mesyuarat: string) => {
          const { start_date, end_date } =
            dropdown[data.parlimen][data.penggal][mesyuarat];
          const start = toDate(start_date, "MMM yyyy");
          const end = toDate(end_date, "MMM yyyy");
          const yearRange =
            start === end ? ` (${start})` : ` (${start} - ${end})`;
          return {
            label: t("mesyuarat_full", { n: mesyuarat, ns: "enum" }).concat(
              yearRange
            ),
            value: mesyuarat,
          };
        });
    }
    return [{ label: t("all_mesyuarat"), value: "all" }].concat(_mesyuarat);
  }, [data.penggal, i18n.language]);

  return (
    <>
      {/* Mobile */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <WindowProvider>
            <Filter onClick={() => setOpen(!open)} />
          </WindowProvider>
        </DialogTrigger>
        <DialogContent>
          <div className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-y-0">
            <DialogHeader className="px-3 py-4.5 flex justify-between border-b border-slate-200 dark:border-zinc-800">
              <span className="font-bold text-sm text-zinc-900 dark:text-white">
                {t("filters", { ns: "common" }) + ":"}
              </span>
              <DialogClose/>
            </DialogHeader>
              <div className="flex flex-col">
                <div className="bg-white dark:bg-zinc-900">
                  <div className="dark:divide-washed-dark divide-y px-3 pb-3">
                    <div className="dark:border-zinc-700 py-3 space-y-1">
                      <Label label={t("pilih_parlimen") + ":"} />
                      <Dropdown
                        width="w-full"
                        placeholder={t("pilih_parlimen")}
                        options={PARLIMEN_OPTIONS}
                        selected={PARLIMEN_OPTIONS.find(
                          (e) => e.value === data.parlimen
                        )}
                        onChange={(selected) => {
                          if (selected.value === "all") {
                            setData("parlimen", "all");
                            setData("penggal", "all");
                            setData("mesyuarat", "all");
                          } else {
                            setData("parlimen", selected.value);
                            setData("penggal", null);
                            setData("mesyuarat", null);
                          }
                        }}
                      />
                    </div>
                    <div className="dark:border-zinc-700 py-3 space-y-1">
                      <Label label={t("pilih_penggal") + ":"} />
                      <Dropdown
                        width="w-full"
                        anchor="right-0 bottom-10"
                        placeholder={t("pilih_penggal")}
                        options={PENGGAL_OPTIONS}
                        selected={PENGGAL_OPTIONS.find(
                          (e) => e.value === data.penggal
                        )}
                        onChange={(selected) => {
                          if (selected.value === "all") {
                            setData("penggal", "all");
                            setData("mesyuarat", "all");
                          } else {
                            setData("penggal", selected.value);
                            setData("mesyuarat", null);
                          }
                        }}
                        disabled={!data.parlimen || data.parlimen === "all"}
                      />
                    </div>
                    <div className="py-3 space-y-1">
                      <Label label={t("pilih_mesyuarat") + ":"} />
                      <Dropdown
                        width="w-full"
                        anchor="right-0 bottom-10"
                        placeholder={t("pilih_mesyuarat")}
                        options={MESYUARAT_OPTIONS}
                        selected={MESYUARAT_OPTIONS.find(
                          (e) => e.value === data.mesyuarat
                        )}
                        onChange={(selected) => {
                          if (selected.value === "all") {
                            setData("mesyuarat", "all");
                          } else {
                            setData("mesyuarat", selected.value);
                          }
                        }}
                        disabled={!data.penggal || data.penggal === "all"}
                      />
                    </div>
                  </div>
                  <div className="dark:border-washed-dark flex w-full flex-col gap-2 border-t bg-white p-3 dark:bg-black">
                    <Button
                      variant={"primary"}
                      className="w-full justify-center"
                      onClick={() => {
                        onLoad();
                        setFilter(
                          "parlimen",
                          data.parlimen === "all" ? "all" : data.parlimen
                        );
                        setFilter(
                          "penggal",
                          data.penggal === "all" ? null : data.penggal
                        );
                        setFilter(
                          "mesyuarat",
                          data.mesyuarat === "all" ? null : data.mesyuarat
                        );
                        setOpen(false);
                      }}
                    >
                      {t("filter", { ns: "common" })}
                    </Button>
                    <Button
                      className="btn w-full justify-center px-3 py-1.5"
                      onClick={() => setOpen(false)}
                    >
                      {t("close", { ns: "common" })}
                    </Button>
                  </div>
                </div>
              </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Desktop */}
      <div className="mb-8 lg:mb-12 hidden items-center gap-2 lg:flex mx-auto w-fit">
        <Dropdown
          placeholder={t("pilih_parlimen")}
          options={PARLIMEN_OPTIONS}
          selected={PARLIMEN_OPTIONS.find((e) => e.value === data.parlimen)}
          onChange={(selected) => {
            if (selected.value === "all") {
              onLoad();
              setData("parlimen", "all");
              setData("penggal", "all");
              setData("mesyuarat", "all");
              setFilter("parlimen", "all");
              setFilter("penggal", null);
              setFilter("mesyuarat", null);
            } else {
              setData("parlimen", selected.value);
              setData("penggal", null);
              setData("mesyuarat", null);
            }
          }}
        />
        <Dropdown
          placeholder={t("pilih_penggal")}
          options={PENGGAL_OPTIONS}
          selected={PENGGAL_OPTIONS.find((e) => e.value === data.penggal)}
          onChange={(selected) => {
            if (selected.value === "all") {
              onLoad();
              setData("penggal", "all");
              setData("mesyuarat", "all");
              setFilter("parlimen", data.parlimen);
              setFilter("penggal", null);
              setFilter("mesyuarat", null);
            } else {
              setData("penggal", selected.value);
              setData("mesyuarat", null);
            }
          }}
          disabled={!data.parlimen || data.parlimen === "all"}
        />
        <Dropdown
          placeholder={t("pilih_mesyuarat")}
          options={MESYUARAT_OPTIONS}
          selected={MESYUARAT_OPTIONS.find((e) => e.value === data.mesyuarat)}
          onChange={(selected) => {
            onLoad();
            setFilter("parlimen", data.parlimen);
            setFilter("penggal", data.penggal);
            if (selected.value === "all") {
              setData("mesyuarat", "all");
              setFilter("mesyuarat", null);
            } else {
              setData("mesyuarat", selected.value);
              setFilter("mesyuarat", selected.value);
            }
          }}
          disabled={!data.penggal || data.penggal === "all"}
        />
      </div>
    </>
  );
};

export default KehadiranDropdown;
