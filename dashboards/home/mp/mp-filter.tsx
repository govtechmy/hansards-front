import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerTrigger,
  DrawerFooter,
} from "@components/Drawer";
import {
  Button,
  ComboBox,
  Daterange,
  Dropdown,
  Label,
  PartyFlag,
} from "@components/index";
import { Tabs, TabsList, TabsTrigger } from "@components/Tabs";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { PARTIES } from "@lib/options";
import { OptionType, Speaker } from "@lib/types";
import { useState, useCallback } from "react";
import { DateRange } from "react-day-picker";
import {
  AGES,
  ALL_AGES,
  ALL_ETHNICITIES,
  ALL_PARTIES,
  BOTH_GENDERS,
  DEWANS,
  ETHNICITIES,
  GENDERS,
} from "../filter-options";
import { useRouter } from "next/router";
import { setSearchParams } from "@lib/utils";
import { ParsedUrlQuery } from "querystring";
import { format } from "date-fns";
import { useMediaQuery } from "@hooks/useMediaQuery";

/**
 * MP - Filter
 * @overview Status: In-development
 */

export interface MPFilterProps {
  ind_or_grp: string;
  speakers: Array<Speaker>;
  onFilter: (e: string) => void;
  onLoad: () => void;
  query: ParsedUrlQuery;
}

const MPFilter = ({
  ind_or_grp,
  speakers,
  onFilter,
  onLoad,
  query,
}: MPFilterProps) => {
  const { t } = useTranslation(["home", "common", "demografi", "party"]);
  const [open, setOpen] = useState<boolean>(false);

  const { uid, dewan, tarikh_mula, tarikh_akhir, umur, etnik, parti, gender } =
    query;

  const INDIVIDU_OPTIONS: OptionType[] = speakers
    .map(({ name, new_author_id }) => ({
      label: name,
      value: String(new_author_id),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const { data, setData } = useData({
    uid: uid ? String(uid) : "",
    individu_option: uid
      ? INDIVIDU_OPTIONS.find(option => option.value === String(uid))
      : undefined,
    dewan: dewan ? String(dewan) : "dewan-negara",
    age: umur ? String(umur) : ALL_AGES,
    etnik: etnik ? String(etnik) : ALL_ETHNICITIES,
    party: parti ? String(parti) : ALL_PARTIES,
    gender: gender ? String(gender) : BOTH_GENDERS,
  });

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(() => {
    if (!tarikh_mula && !tarikh_akhir) return undefined;
    return {
      from: tarikh_mula ? new Date(String(tarikh_mula)) : undefined,
      to: tarikh_akhir ? new Date(String(tarikh_akhir)) : undefined,
    };
  });

  const INDIVIDU_OR_GROUP: OptionType[] = [
    {
      label: t("individu", { ns: "common" }),
      value: "individu",
    },
    {
      label: t("group", { ns: "home" }),
      value: "group",
    },
  ];

  const DEWAN_OPTIONS: OptionType[] = DEWANS.map((key: string) => ({
    label: t(key.replace("-", "_"), { ns: "common" }),
    value: key,
  }));

  const PARTY_OPTIONS: OptionType[] = [
    { label: t(ALL_PARTIES), value: ALL_PARTIES },
  ].concat(
    PARTIES.map((key: string) => ({
      label: t(key, { ns: "party" }),
      value: key,
    }))
  );

  const AGE_OPTIONS: OptionType[] = [
    { label: t(ALL_AGES, { ns: "demografi" }), value: ALL_AGES },
  ].concat(
    AGES.map((key: string) => ({
      label: key + (key === "70" ? "+" : ""),
      value: key,
    }))
  );

  const GENDER_OPTIONS: OptionType[] = GENDERS.map((key: string) => ({
    label: t(key, { ns: "demografi" }),
    value: key,
  }));

  const ETNIK_OPTIONS: OptionType[] = ETHNICITIES.map((key: string) => ({
    label: t(key, { ns: "demografi" }),
    value: key,
  }));

  const isTablet = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const formatDate = (date?: Date) => (!date ? "" : format(date, "yyyy-MM-dd"));

  const handleSearch = (params: Record<string, string | null>) => {
    onLoad();
    router.push(setSearchParams(router.asPath, params));
  };

  const handleClear = () => {
    handleSearch({
      uid: "",
      parti: "",
      umur: "",
      etnik: "",
      gender: "",
      tarikh_akhir: "",
      tarikh_mula: "",
    });
    setSelectedDateRange(undefined);
    setData("party", ALL_PARTIES);
    setData("age", ALL_AGES);
    setData("etnik", ALL_ETHNICITIES);
    setData("gender", BOTH_GENDERS);
  };

  const getFilterParams = useCallback(
    () => ({
      uid: ind_or_grp === "individu" ? data.uid : "",
      dewan: data.dewan,
      parti: data.party !== ALL_PARTIES ? data.party : "",
      gender: data.gender !== BOTH_GENDERS ? data.gender : "",
      umur: data.age !== ALL_AGES ? data.age : "",
      etnik: data.etnik !== ALL_ETHNICITIES ? data.etnik : "",
      tarikh_mula: formatDate(selectedDateRange?.from),
      tarikh_akhir: formatDate(selectedDateRange?.to),
    }),
    [ind_or_grp, data, selectedDateRange, formatDate]
  );

  const handleClearDateRange = () => {
    // If date exists in the current query, remove it while keeping other filters
    if (router.query.tarikh_mula || router.query.tarikh_akhir) {
      handleSearch({
        tarikh_akhir: "",
        tarikh_mula: "",
      });
    }
    setSelectedDateRange(undefined);
  };

  const className = {
    dropdown_ind_grp:
      "link p-0 border-none shadow-none active:bg-inherit active:dark:bg-inherit hover:bg-inherit hover:dark:bg-inherit",
    dropdown_demo: "text-blue-600 dark:text-primary-dark rounded-full",
  };

  return (
    <>
      <div className="space-y-6 pb-3 sm:pt-6">
        {/* Dewan Selector */}
        <div className="mx-auto hidden w-fit rounded-full border border-border bg-background p-1 sm:block">
          <Tabs
            value={data.dewan}
            onValueChange={dewan => {
              setData("dewan", dewan);
              if (ind_or_grp === "individu" && data.uid) {
                handleSearch({ dewan, uid: data.uid });
              } else if (ind_or_grp === "group") {
                handleSearch({ dewan, uid: "" });
              }
            }}
            defaultValue="dewan-rakyat"
          >
            <TabsList className="flex-nowrap">
              {DEWAN_OPTIONS.map(dewan => (
                <TabsTrigger key={dewan.value} value={dewan.value}>
                  {dewan.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Search Bar */}
        {ind_or_grp === "individu" ? (
          <>
            <div className="mx-auto w-full sm:w-[500px]">
              <ComboBox
                placeholder={t("search_individual")}
                options={INDIVIDU_OPTIONS}
                selected={
                  data.individu_option
                    ? INDIVIDU_OPTIONS.find(
                        e => e.value === data.individu_option?.value
                      )
                    : undefined
                }
                dropdown={
                  <div className="flex self-center pl-4.5">
                    <Dropdown
                      className={className.dropdown_ind_grp}
                      width="w-fit"
                      options={INDIVIDU_OR_GROUP}
                      selected={INDIVIDU_OR_GROUP.find(
                        e => e.value === ind_or_grp
                      )}
                      onChange={(e: { value: string }) => {
                        onFilter(e.value);
                        if (e.value === "individu") handleClear();
                        else if (e.value === "group") {
                          setData("uid", "");
                          setData("individu_option", undefined);
                        }
                      }}
                    />
                  </div>
                }
                onChange={selected => {
                  setData("individu_option", selected);
                  if (selected) {
                    setData("uid", selected.value);
                    handleSearch({
                      uid: selected.value,
                    });
                  }
                }}
              />
            </div>
            <div className="hidden justify-center gap-2 md:flex">
              <Daterange
                className="text-txt-primary"
                placeholder={t("current_parlimen")}
                label={t("date", { ns: "home" })}
                selected={selectedDateRange}
                onChange={dateRange => {
                  setSelectedDateRange(dateRange);
                  if (data.uid && dateRange?.from && dateRange?.to) {
                    handleSearch({
                      tarikh_mula: formatDate(dateRange.from),
                      tarikh_akhir: formatDate(dateRange.to),
                    });
                  }
                }}
                numberOfMonths={isTablet ? 2 : 1}
              />
              {selectedDateRange && (
                <Button
                  variant="ghost"
                  className="w-fit justify-center"
                  onClick={handleClearDateRange}
                >
                  <XMarkIcon className="size-4.5" />
                  {t("clear", { ns: "common" })}
                </Button>
              )}
            </div>

            {/* Mobile Drawer */}
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto shadow-button md:hidden"
                  onClick={() => setOpen(true)}
                >
                  <span>{t("filters", { ns: "common" })}</span>
                  <span className="w-4.5 rounded-md bg-blue-600 text-center leading-5 text-white dark:bg-primary-dark">
                    2
                  </span>
                  <ChevronDownIcon className="-mx-[5px] size-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="flex justify-between border-b border-slate-200 dark:border-zinc-700">
                  <span className="font-semibold text-foreground">
                    {t("filters", { ns: "common" }) + ":"}
                  </span>
                  <DrawerClose />
                </DrawerHeader>
                <div className="flex flex-col divide-y bg-background px-4 dark:divide-zinc-800">
                  <div className="space-y-1 py-3">
                    <Label label={t("dewan", { ns: "home" }) + ":"} />
                    <Dropdown
                      options={DEWAN_OPTIONS}
                      selected={DEWAN_OPTIONS.find(e => e.value === data.dewan)}
                      onChange={e => setData("dewan", e.value)}
                    />
                  </div>

                  <div className="space-y-1 py-3">
                    <Label label={t("date") + ":"} />
                    <Daterange
                      className="w-full"
                      numberOfMonths={1}
                      placeholder={t("current_parlimen")}
                      selected={selectedDateRange}
                      onChange={setSelectedDateRange}
                    />
                  </div>
                </div>

                <DrawerFooter>
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={() => {
                      setOpen(false);
                      handleSearch({
                        uid: data.uid,
                        dewan: data.dewan,
                        tarikh_mula: formatDate(selectedDateRange?.from),
                        tarikh_akhir: formatDate(selectedDateRange?.to),
                      });
                    }}
                  >
                    {t("filter", { ns: "common" })}
                  </Button>
                  <Button
                    className="btn w-full justify-center px-3 py-1.5"
                    onClick={() => {
                      handleClear();
                      setOpen(false);
                    }}
                  >
                    {t("clear_all", { ns: "common" })}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto flex w-full justify-between rounded-full border border-otl-gray-200 py-2 pl-4.5 pr-1.5 sm:w-fit">
              <div className="flex self-center">
                <Dropdown
                  className={className.dropdown_ind_grp}
                  width="w-fit"
                  options={INDIVIDU_OR_GROUP}
                  selected={INDIVIDU_OR_GROUP.find(e => e.value === ind_or_grp)}
                  onChange={(e: { value: string }) => onFilter(e.value)}
                />
              </div>
              <div className="hidden gap-x-1 px-2.5 md:flex">
                <Dropdown
                  className={className.dropdown_demo}
                  width="w-fit"
                  enableFlag
                  flag={party =>
                    party === ALL_PARTIES ? (
                      <></>
                    ) : (
                      <PartyFlag party={party} children={() => true} />
                    )
                  }
                  options={PARTY_OPTIONS}
                  selected={PARTY_OPTIONS.find(e => e.value === data.party)}
                  onChange={e => setData("party", e.value)}
                />
                <Dropdown
                  className={className.dropdown_demo}
                  width="w-fit"
                  options={GENDER_OPTIONS}
                  selected={GENDER_OPTIONS.find(e => e.value === data.gender)}
                  onChange={e => setData("gender", e.value)}
                />
                <Dropdown
                  className={className.dropdown_demo}
                  width="w-fit"
                  options={AGE_OPTIONS}
                  selected={AGE_OPTIONS.find(e => e.value === data.age)}
                  onChange={e => setData("age", e.value)}
                />
                <Dropdown
                  className={className.dropdown_demo}
                  width="w-fit"
                  options={ETNIK_OPTIONS}
                  selected={ETNIK_OPTIONS.find(e => e.value === data.etnik)}
                  onChange={e => setData("etnik", e.value)}
                />
                {(data.party !== ALL_PARTIES ||
                  data.gender !== BOTH_GENDERS ||
                  data.age !== ALL_AGES ||
                  data.etnik !== ALL_ETHNICITIES) && (
                  <Button
                    variant="ghost"
                    className="group flex justify-center rounded-full p-0 sm:-mr-1.5 sm:h-8 sm:w-8"
                    onClick={handleClear}
                  >
                    <XMarkIcon className="size-5 text-zinc-500 group-hover:text-foreground" />
                  </Button>
                )}
              </div>
              <div className="self-center">
                <Button
                  variant="primary"
                  className="h-9 rounded-full"
                  onClick={() => handleSearch(getFilterParams())}
                >
                  <MagnifyingGlassIcon className="size-5 text-white" />
                  {t("placeholder.search", { ns: "common" })}
                </Button>
              </div>
            </div>

            <div className="hidden flex-wrap justify-center gap-2 md:flex">
              <Daterange
                className="text-blue-600 dark:text-primary-dark"
                placeholder={t("current_parlimen")}
                label={t("date", { ns: "home" })}
                selected={selectedDateRange}
                onChange={setSelectedDateRange}
              />

              {selectedDateRange && (
                <Button
                  variant="ghost"
                  className="w-fit justify-center"
                  onClick={handleClearDateRange}
                >
                  <XMarkIcon className="size-4.5" />
                  {t("clear", { ns: "common" })}
                </Button>
              )}
            </div>

            {/* Mobile Drawer */}
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto shadow-button md:hidden"
                  onClick={() => setOpen(true)}
                >
                  <span>{t("filters", { ns: "common" })}</span>
                  <span className="w-4.5 rounded-md bg-blue-600 text-center leading-5 text-white dark:bg-primary-dark">
                    6
                  </span>
                  <ChevronDownIcon className="-mx-[5px] size-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="flex justify-between border-b border-slate-200 dark:border-zinc-700">
                  <span className="font-semibold text-foreground">
                    {t("filters", { ns: "common" }) + ":"}
                  </span>
                  <DrawerClose />
                </DrawerHeader>
                <div className="flex flex-col divide-y bg-background px-4 dark:divide-zinc-800">
                  <div className="space-y-1 py-3">
                    <Label label={t("dewan", { ns: "home" }) + ":"} />
                    <Dropdown
                      options={DEWAN_OPTIONS}
                      selected={DEWAN_OPTIONS.find(e => e.value === data.dewan)}
                      onChange={e => setData("dewan", e.value)}
                    />
                  </div>

                  <div className="space-y-1 py-3">
                    <Label label={t("date") + ":"} />
                    <Daterange
                      className="w-full"
                      numberOfMonths={1}
                      placeholder={t("current_parlimen")}
                      selected={selectedDateRange}
                      onChange={setSelectedDateRange}
                    />
                  </div>

                  <div className="w-full space-y-1 py-3">
                    <Label label={t("party", { ns: "common" }) + ":"} />
                    <Dropdown
                      enableFlag
                      flag={party =>
                        party === ALL_PARTIES ? (
                          <></>
                        ) : (
                          <PartyFlag party={party} children={() => true} />
                        )
                      }
                      anchor="left"
                      options={PARTY_OPTIONS}
                      selected={PARTY_OPTIONS.find(e => e.value === data.party)}
                      onChange={e => setData("party", e.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 py-3">
                    <div className="w-full space-y-1">
                      <Label label={t("age", { ns: "demografi" }) + ":"} />
                      <Dropdown
                        anchor="left bottom-10"
                        options={AGE_OPTIONS}
                        selected={AGE_OPTIONS.find(e => e.value === data.age)}
                        onChange={e => setData("age", e.value)}
                      />
                    </div>

                    <div className="w-full space-y-1">
                      <Label label={t("gender", { ns: "demografi" }) + ":"} />
                      <Dropdown
                        options={GENDER_OPTIONS}
                        selected={GENDER_OPTIONS.find(
                          e => e.value === data.gender
                        )}
                        onChange={e => setData("gender", e.value)}
                      />
                    </div>
                  </div>

                  <div className="w-full space-y-1 py-3">
                    <Label label={t("ethnicity", { ns: "demografi" }) + ":"} />
                    <Dropdown
                      anchor="left bottom-10"
                      options={ETNIK_OPTIONS}
                      selected={ETNIK_OPTIONS.find(e => e.value === data.etnik)}
                      onChange={e => setData("etnik", e.value)}
                    />
                  </div>
                </div>

                <DrawerFooter>
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={() => {
                      setOpen(false);
                      handleSearch(getFilterParams());
                    }}
                  >
                    {t("filter", { ns: "common" })}
                  </Button>
                  <Button
                    className="btn w-full justify-center px-3 py-1.5"
                    onClick={() => {
                      handleClear();
                      setOpen(false);
                    }}
                  >
                    {t("clear_all", { ns: "common" })}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        )}
      </div>
    </>
  );
};

export default MPFilter;
