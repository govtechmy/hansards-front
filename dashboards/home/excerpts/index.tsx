import { DateCard, Section } from "@components/index";
import ExcerptList, {
  Excerpt,
} from "@dashboards/home/excerpts/excerpt-list-item";
import { useTranslation } from "@hooks/useTranslation";
import { ParsedUrlQuery } from "querystring";
import { Dewan } from "@lib/types";
import groupBy from "lodash/groupBy";
import Link from "next/link";

import Paginator from "@components/Paginator";
import { setSearchParams } from "@lib/utils";
import { useRouter } from "next/router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/MydsSelectFix/MydsSelectFix";
// import { Tag } from "@govtechmy/myds-react/tag";
// import { DewanNegaraIcon } from "@icons/dewan/dewan-negara";
// import { DewanRakyatIcon } from "@icons/dewan/dewan-rakyat";

/**
 * Excerpts
 * @overview Status: In-development
 */

export interface ExcerptsProps {
  count: number;
  excerpts: Excerpt[];
  query: ParsedUrlQuery;
}

const Excerpts = ({ count, excerpts, query }: ExcerptsProps) => {
  const { t, i18n } = useTranslation(["enum", "home"]);
  const { q, dewan, page, page_size } = query;

  const excerptsByDate = groupBy(excerpts, "sitting.date");
  const router = useRouter();
  const ITEMS_PER_PAGE = 10;
  const ROWS_PER_PAGE = [ITEMS_PER_PAGE, 25, 50].map(String);

  return (
    <>
      <Section className="space-y-6 lg:space-y-8">
        <h2 className="header">{t("home:excerpts", { count: count })}</h2>
        <ul className="flex flex-col divide-otl-gray-200 sm:divide-y">
          {Object.keys(excerptsByDate).map(date => {
            const excerpt = excerptsByDate[date];
            const sitting = excerpt[0].sitting;

            return (
              <li
                key={date}
                className="flex flex-col gap-3 py-4.5 first:pt-0 sm:gap-6 sm:py-6 lg:flex-row"
              >
                <div className="top-16 flex shrink-0 items-center lg:sticky lg:h-24 lg:max-w-md">
                  <Link
                    href={`hansard/${dewan}/${sitting.date}?search=${q}`}
                    className="group flex items-center gap-3 sm:gap-4.5"
                  >
                    <DateCard date={date} size="sm" />

                    <div className="relative flex flex-col justify-center gap-0.5">
                      <p className="font-semibold sm:group-hover:underline">
                        {new Date(date).toLocaleDateString(i18n.language, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        {`, ${new Date(date).toLocaleDateString(i18n.language, {
                          weekday: "long",
                        })}`}
                      </p>
                      <div>
                        {/* <Tag
                        size="medium"
                        variant="default"
                        mode="pill"
                        className="border-[#134960]/20 bg-[#134960]/10 text-[#134960]"
                      >
                        <DewanRakyatIcon className="size-5" />
                        {t("dewan_rakyat")}
                      </Tag>
                      <Tag
                        size="medium"
                        variant="default"
                        mode="pill"
                        className="border-[#66222A]/20 bg-[#66222A]/10 text-[#66222A]"
                      >
                        <DewanNegaraIcon className="size-5" />
                        {t("dewan_negara")}
                      </Tag> */}
                      </div>
                      <p className="flex gap-1 text-body-xs text-txt-black-700 sm:text-body-sm">
                        {`${t("parlimen", {
                          ordinal: true,
                          count: sitting.term,
                        })} / ${t("penggal", {
                          ordinal: true,
                          count: sitting.session,
                        })} / ${t("mesyuarat_full", {
                          ordinal: true,
                          n: sitting.meeting,
                        })}`}
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="flex max-h-fit w-full flex-col divide-y divide-otl-gray-200 rounded-xl border border-otl-gray-200">
                  {excerpt
                    .sort((a, b) => a.index - b.index)
                    .map((excerpt, i) => (
                      <ExcerptList
                        key={i}
                        dewan={(dewan ?? "dewan-rakyat") as Dewan}
                        excerpt={excerpt}
                        keyword={String(q)}
                      />
                    ))}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="text-dim-500 whitespace-nowrap text-sm">
              {t("home:results_per_page")}
            </span>
            <Select
              multiple={false}
              variant="outline"
              size="medium"
              value={page_size ? String(page_size) : ROWS_PER_PAGE[0]}
              onValueChange={size => {
                const url = setSearchParams(router.asPath, {
                  page: "1",
                  page_size: size,
                });
                router.push(url);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROWS_PER_PAGE.map(rows => (
                  <SelectItem key={rows} value={rows}>
                    {rows}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Paginator
            count={count}
            currentPage={page ? Number(page) : 1}
            onPageChange={page => {
              const url = setSearchParams(router.asPath, {
                page: page.toString(),
              });
              router.push(url);
            }}
            limit={page_size ? Number(page_size) : ITEMS_PER_PAGE}
          />
        </div>
      </Section>
    </>
  );
};

export default Excerpts;
