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
  List,
  PartyFlag,
} from "@components/index";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { PARTIES } from "@lib/options";
import { OptionType } from "@lib/types";
import { UID_TO_NAME_DR } from "@lib/uid";
import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  AGES,
  ALL_AGES,
  ALL_ETHNICITIES,
  ALL_PARTIES,
  BOTH_SEXES,
  DEWANS,
  DEWAN_ENUM,
  DEWAN_IDX_ENUM,
  ETHNICITIES,
  SEXES,
} from "../filter-options";

/**
 * MP - Filter
 * @overview Status: In-development
 */

export interface MPFilterProps {
  ind_or_grp: string;
  onFilter: (e: string) => void;
  onLoad: () => void;
  uid: string;
  dewan?: string;
  party: string;
  sex: string;
  age: string;
  ethnic: string;
  start?: Date;
  end?: Date;
}

const MPFilter = ({
  ind_or_grp,
  onFilter,
  onLoad,
  uid,
  dewan,
  party,
  age,
  sex,
  ethnic,
  start,
  end,
}: MPFilterProps) => {
  const { t } = useTranslation(["home", "common", "demografi", "party"]);
  const [open, setOpen] = useState<boolean>(false);

  const INDIVIDU_OPTIONS: OptionType[] = Object.keys(UID_TO_NAME_DR).map(
    (key: string) => {
      return { label: UID_TO_NAME_DR[key], value: key };
    }
  );

  const { data, setData } = useData({
    uid: uid,
    individu_option: uid
      ? INDIVIDU_OPTIONS.find((option) => option.value === String(uid))
      : undefined,
    dewan_idx: dewan ? DEWAN_IDX_ENUM[dewan] : 0,
    dewan: dewan ?? "dewan-rakyat",
    age: age,
    ethnic: ethnic,
    party: party,
    sex: sex,
  });

  const [selectedDateRange, setSelectedDateRange] =
    useState<DateRange | undefined>(
      start || end ? { from: start, to: end } : undefined
    );

  const { setFilter } = useFilter({
    dewan: dewan,
    uid: uid,
    tarikh_mula: start ?? "",
    tarikh_akhir: end ?? "",
    umur: data.age === ALL_AGES ? "" : data.age,
    etnik: data.ethnic === ALL_ETHNICITIES ? "" : data.ethnic,
    parti: data.party === ALL_PARTIES ? "" : data.party,
    jantina: data.sex === BOTH_SEXES ? "" : data.sex,
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

  const SEX_OPTIONS: OptionType[] = SEXES.map((key: string) => ({
    label: t(key, { ns: "demografi" }),
    value: key,
  }));

  const ETNIK_OPTIONS: OptionType[] = ETHNICITIES.map((key: string) => ({
    label: t(key, { ns: "demografi" }),
    value: key,
  }));

  const handleIndividuSearch = (dewan: string, uid: string, dateRange?: DateRange) => {
    onLoad()
    setFilter("dewan", dewan);
    setFilter("uid", uid);
    setFilter("umur", "");
    setFilter("etnik", "");
    setFilter("parti", "");
    setFilter("jantina", "");
    // setFilter(
    //   "tarikh_mula",
    //   dateRange?.from
    //     ? format(dateRange.from, "yyyy-MM-dd")
    //     : ""
    // );
    // setFilter(
    //   "tarikh_akhir",
    //   dateRange?.to
    //     ? format(dateRange.to, "yyyy-MM-dd")
    //     : dateRange?.from
    //       ? format(dateRange.from, "yyyy-MM-dd")
    //       : ""
    // );
  }

  const handleGroupSearch = (dewan: string) => {
    onLoad();
    setFilter("dewan", dewan);
    setFilter("uid", "");
    setFilter("umur", data.age === ALL_AGES ? "" : data.age);
    setFilter("etnik", data.ethnic === ALL_ETHNICITIES ? "" : data.ethnic);
    setFilter("parti", data.party === ALL_PARTIES ? "" : data.party);
    setFilter("jantina", data.sex === BOTH_SEXES ? "" : data.sex);
    setFilter(
      "tarikh_mula",
      selectedDateRange?.from
        ? format(selectedDateRange.from, "yyyy-MM-dd")
        : ""
    );
    setFilter(
      "tarikh_akhir",
      selectedDateRange?.to
        ? format(selectedDateRange.to, "yyyy-MM-dd")
        : selectedDateRange?.from
          ? format(selectedDateRange.from, "yyyy-MM-dd")
          : ""
    );
  };

  const handleClear = () => {
    setData("party", ALL_PARTIES);
    setData("age", ALL_AGES);
    setData("ethnic", ALL_ETHNICITIES);
    setData("sex", BOTH_SEXES);
  };

  const className = {
    dropdown_ind_grp: "link p-0 border-none shadow-none active:bg-inherit active:dark:bg-inherit hover:bg-inherit hover:dark:bg-inherit",
    dropdown_demo: "text-blue-600 dark:text-primary-dark rounded-full",
  };

  return (
    <>
      <div className="sm:pt-6 pb-3 space-y-6">
        {/* Dewan Selector */}
        <div className="mx-auto sm:block hidden w-fit rounded-full p-1 bg-background border border-border">
          <List
            className="flex-nowrap"
            options={DEWAN_OPTIONS.map((item) => item.label)}
            current={data.dewan_idx}
            onChange={(i) => {
              setData("dewan", DEWAN_ENUM[i]);
              setData("dewan_idx", i);
              if (ind_or_grp === "individu") {
                if (uid) handleIndividuSearch(DEWAN_ENUM[i], data.uid, selectedDateRange)
              }
              else if (ind_or_grp === "group") handleGroupSearch(DEWAN_ENUM[i])
            }}
          />
        </div>

        {/* Search Bar */}
        {ind_or_grp === "individu" ? (
          <>
            <div className="w-full sm:w-[500px] mx-auto">
              <ComboBox
                placeholder={t("search_individual")}
                options={INDIVIDU_OPTIONS}
                selected={
                  INDIVIDU_OPTIONS.find(
                    (e) => data.individu_option
                      ? e.value === data.individu_option.value
                      : undefined
                  )
                }
                dropdown={
                  <div className="flex self-center pl-4.5">
                    <Dropdown
                      className={className.dropdown_ind_grp}
                      width="w-fit"
                      options={INDIVIDU_OR_GROUP}
                      selected={INDIVIDU_OR_GROUP.find(
                        (e) => e.value === ind_or_grp
                      )}
                      onChange={(e: { value: string }) => {
                        onFilter(e.value)
                        if (e.value === "individu") handleClear()
                        else if (e.value === "group") {
                          setData("uid", "");
                          setData("individu_option", undefined);
                        }
                      }}
                    />
                  </div>
                }
                onChange={(selected) => {
                  setData("individu_option", selected);
                  if (selected) {
                    setData("uid", selected.value);
                    handleIndividuSearch(data.dewan, selected.value, selectedDateRange)
                  }
                }}
              />
            </div>
            <div className="justify-center hidden sm:flex gap-2">
              <Daterange
                className="text-blue-600 dark:text-primary-dark"
                placeholder={t("current_parlimen")}
                label={t("date", { ns: "home" })}
                selected={selectedDateRange}
                onChange={(dateRange) => {
                  setSelectedDateRange(dateRange);
                  if (data.uid && dateRange && dateRange?.from && dateRange?.to)
                    handleIndividuSearch(data.dewan, data.uid, dateRange);
                }}
              />
              {selectedDateRange && (
                <Button
                  variant="ghost"
                  className="w-fit justify-center"
                  onClick={() => setSelectedDateRange(undefined)}
                >
                  <XMarkIcon className="size-4.5" />
                  {t("clear", { ns: "common" })}
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="pl-4.5 pr-1.5 py-2 flex mx-auto w-full sm:w-fit rounded-full border border-border justify-between">
              <div className="flex self-center">
                <Dropdown
                  className={className.dropdown_ind_grp}
                  width="w-fit"
                  options={INDIVIDU_OR_GROUP}
                  selected={INDIVIDU_OR_GROUP.find(
                    (e) => e.value === ind_or_grp
                  )}
                  onChange={(e: { value: string }) => onFilter(e.value)}
                />
              </div>
              <div className="hidden md:flex gap-x-1 px-2.5">
                <Dropdown
                  className={className.dropdown_demo}
                  width="w-fit"
                  enableFlag
                  flag={(party) => {
                    if (party === ALL_PARTIES) return <></>;
                    else
                      return <PartyFlag party={party} children={() => true} />;
                  }}
                  options={PARTY_OPTIONS}
                  selected={PARTY_OPTIONS.find((e) => e.value === data.party)}
                  onChange={(e) => setData("party", e.value)}
                />
                <Dropdown
                  className={className.dropdown_demo}
                  width="w-fit"
                  options={SEX_OPTIONS}
                  selected={SEX_OPTIONS.find((e) => e.value === data.sex)}
                  onChange={(e) => setData("sex", e.value)}
                />
                <Dropdown
                  className={className.dropdown_demo}
                  width="w-fit"
                  options={AGE_OPTIONS}
                  selected={AGE_OPTIONS.find((e) => e.value === data.age)}
                  onChange={(e) => setData("age", e.value)}
                />
                <Dropdown
                  className={className.dropdown_demo}
                  width="w-fit"
                  options={ETNIK_OPTIONS}
                  selected={ETNIK_OPTIONS.find((e) => e.value === data.ethnic)}
                  onChange={(e) => setData("ethnic", e.value)}
                />
                {(data.party !== ALL_PARTIES ||
                  data.sex !== BOTH_SEXES ||
                  data.age !== ALL_AGES ||
                  data.ethnic !== ALL_ETHNICITIES) && (
                    <Button
                      variant="ghost"
                      className="group flex sm:-mr-1.5 sm:h-8 sm:w-8 p-0 justify-center rounded-full"
                      onClick={handleClear}
                    >
                      <XMarkIcon className="text-zinc-500 size-5 group-hover:text-foreground" />
                    </Button>
                  )}
              </div>
              <div className="self-center">
                <Button
                  variant="primary"
                  className="rounded-full h-9"
                  onClick={() => handleGroupSearch(data.dewan)}
                >
                  <MagnifyingGlassIcon className="size-5 text-white" />
                  {t("placeholder.search", { ns: "common" })}
                </Button>
              </div>
            </div>

            <div className="justify-center hidden md:flex flex-wrap gap-2">
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
                  onClick={() => setSelectedDateRange(undefined)}
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
                  className="shadow-button ml-auto md:hidden"
                  onClick={() => setOpen(true)}
                >
                  <span>{t("filters", { ns: "common" })}</span>
                  <span className="bg-blue-600 dark:bg-primary-dark w-4.5 leading-5 rounded-md text-center text-white">
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
                <div className="flex flex-col bg-background dark:divide-zinc-800 divide-y px-4">
                  <div className="py-3 space-y-1">
                    <Label label={t("dewan", { ns: "home" }) + ":"} />
                    <Dropdown
                      options={DEWAN_OPTIONS}
                      selected={DEWAN_OPTIONS.find(
                        (e) => e.value === data.dewan
                      )}
                      onChange={(e) => setData("dewan", e.value)}
                    />
                  </div>

                  <div className="py-3 space-y-1">
                    <Label label={t("date") + ":"} />
                    <Daterange
                      className="w-full"
                      numberOfMonths={1}
                      placeholder={t("current_parlimen")}
                      selected={selectedDateRange}
                      onChange={setSelectedDateRange}
                    />
                  </div>

                  <div className="py-3 space-y-1 w-full">
                    <Label label={t("party", { ns: "common" }) + ":"} />
                    <Dropdown
                      enableFlag
                      flag={(party) => {
                        if (party === ALL_PARTIES) return <></>;
                        else
                          return (
                            <PartyFlag party={party} children={() => true} />
                          );
                      }}
                      anchor="left"
                      options={PARTY_OPTIONS}
                      selected={PARTY_OPTIONS.find(
                        (e) => e.value === data.party
                      )}
                      onChange={(e) => setData("party", e.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 py-3">
                    <div className="space-y-1 w-full">
                      <Label label={t("age", { ns: "demografi" }) + ":"} />
                      <Dropdown
                        anchor="left bottom-10"
                        options={AGE_OPTIONS}
                        selected={AGE_OPTIONS.find((e) => e.value === data.age)}
                        onChange={(e) => setData("age", e.value)}
                      />
                    </div>

                    <div className="space-y-1 w-full">
                      <Label label={t("sex", { ns: "demografi" }) + ":"} />
                      <Dropdown
                        options={SEX_OPTIONS}
                        selected={SEX_OPTIONS.find((e) => e.value === data.sex)}
                        onChange={(e) => setData("sex", e.value)}
                      />
                    </div>
                  </div>

                  <div className="py-3 space-y-1 w-full">
                    <Label label={t("ethnicity", { ns: "demografi" }) + ":"} />
                    <Dropdown
                      anchor="left bottom-10"
                      options={ETNIK_OPTIONS}
                      selected={ETNIK_OPTIONS.find(
                        (e) => e.value === data.ethnic
                      )}
                      onChange={(e) => setData("ethnic", e.value)}
                    />
                  </div>
                </div>

                <DrawerFooter>
                  <Button
                    variant={"primary"}
                    className="w-full justify-center"
                    onClick={() => {
                      setOpen(false);
                      handleGroupSearch(data.dewan);
                    }}
                  >
                    {t("filter", { ns: "common" })}
                  </Button>
                  <Button
                    className="btn w-full justify-center px-3 py-1.5"
                    onClick={handleClear}
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
