import {
  Container,
  Hero,
  Panel,
  Section,
  Tabs,
  toast,
} from "@components/index";
import { useCache } from "@hooks/useCache";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { slugify } from "@lib/helpers";
import { generateSchema } from "@lib/schema/election-explorer";
import { OptionType } from "@lib/types";
import dynamic from "next/dynamic";
import AreaTable from "./area-table";

/**
 * Search Area Dashboard
 * @overview Status: In-development
 */

const ComboBox = dynamic(() => import("@components/Combobox"), {
  ssr: false,
});

type Seat = {
  seat: string;
  election: string;
  date: string;
  party: string;
  name: string;
};

interface SearchAreaProps {}

const SearchArea = ({}: SearchAreaProps) => {
  const { t } = useTranslation(["sejarah"]);
  const SEAT_OPTIONS: Array<OptionType> = [].map((key) => ({
    label: key,
    value: slugify(key),
  }));

  const DEFAULT_SEAT = "padang-besar-perlis";
  const SEAT_OPTION = SEAT_OPTIONS.find((e) => e.value === DEFAULT_SEAT);

  const { data, setData } = useData({
    seat_option: SEAT_OPTION,
    seat_name: SEAT_OPTION?.label,
    loading: false,
    // elections: elections,
  });

  const seat_schema = generateSchema<Seat>([
    {
      key: "election",
      id: "election",
      header: t("election"),
    },
    { key: "seat", id: "seat", header: t("seat") },
    {
      key: "party",
      id: "party",
      header: t("party"),
    },
    { key: "name", id: "name", header: t("name") },
  ]);

  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex flex-col h-full w-full max-w-screen-2xl px-3 md:px-4.5 lg:px-6 xl:px-0 py-8 lg:py-12 xl:grid xl:grid-cols-12">
        <div className="xl:col-span-10 xl:col-start-2">
          <div className="xl:col-span-10 xl:col-start-2">
            <h4 className="text-center">{t("header")}</h4>
            <div className="mx-auto w-full py-6 sm:w-[500px]">
              <ComboBox
                placeholder={t("search_area")}
                options={SEAT_OPTIONS}
                selected={
                  data.seat_option
                    ? SEAT_OPTIONS.find(
                        (e) => e.value === data.seat_option.value
                      )
                    : null
                }
                onChange={(selected) => {
                  if (selected) {
                    // fetchResult(selected).then((elections) => {
                    //   setData("elections", elections);
                    // });
                  }
                  setData("seat_option", selected);
                }}
              />
            </div>

            <h5 className="py-6">
              {t("title")}
              <span className="text-primary">{data.seat_name}</span>
            </h5>

            <AreaTable
              data={data.elections}
              columns={seat_schema}
              isLoading={data.loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchArea;
