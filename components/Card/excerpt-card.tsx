import DateCard from "./date-card";
import Card from "@components/Card";
import ArrowUpRightIcon from "@heroicons/react/24/solid/ArrowUpRightIcon";
import { useTranslation } from "@hooks/useTranslation";

/**
 * Excerpt Card
 * @overview Status: In-development
 */

export type Excerpt = {
  date: string;
  meeting: number;
  session: number;
  term: number;
  quote: string;
};

interface ExcerptCardProps {
  excerpt: Excerpt;
  keyword: string;
}

const ExcerptCard = ({ excerpt, keyword }: ExcerptCardProps) => {
  const { t } = useTranslation("enum");
  const TERM_YEARS = [
    "1959 - 1964",
    "1964 - 1969",
    "1971 - 1974",
    "1974 - 1978",
    "1978 - 1981",
    "1982 - 1986",
    "1986 - 1990",
    "1990 - 1994",
    "1995 - 1999",
    "1999 - 2003",
    "2004 - 2007",
    "2008 - 2012",
    "2013 - 2018",
    "2018 - 2022",
    `2022 - ${t("now", { ns: "enum" })}`,
  ];
  const quotes = excerpt.quote.split(keyword);

  return (
    <>
      <Card className="shadow-button p-6 max-w-3xl group hover:border-slate-400 hover:bg-slate-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50">
        <div className="flex flex-col gap-3 relative">
          <ArrowUpRightIcon className="absolute right-2 h-5 w-5 text-dim opacity-0 transition-[opacity_transform] duration-0 group-hover:translate-x-2 group-hover:opacity-100 group-hover:duration-300" />
          <div className="flex gap-3 lg:gap-6">
            <DateCard date={excerpt.date} size="sm" />

            <div className="flex flex-col w-[calc(100%-94px)]">
              <span className="text-zinc-900 dark:text-white font-bold text-lg truncate">
                {t("meeting", { n: excerpt.meeting })}
              </span>
              <span className="text-dim truncate">
                {`${t("term", { ordinal: true, count: excerpt.term })} (${
                  TERM_YEARS[excerpt.term - 1]
                })`}
              </span>
              <span className="text-dim truncate">
                {t("session", { n: excerpt.session })}
              </span>
            </div>
          </div>
          <span className="text-zinc-900 dark:text-white">
            {quotes.map((q, i) => (
              <>
                {q}
                {i < quotes.length - 1 && (
                  <span className="text-blue-600 bg-blue-600/10 w-fit rounded-md px-[3px] py-0.5">
                    {keyword}
                  </span>
                )}
              </>
            ))}
          </span>
        </div>
      </Card>
    </>
  );
};

export default ExcerptCard;
