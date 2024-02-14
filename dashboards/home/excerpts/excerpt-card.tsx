import DateCard from "../../../components/Card/date-card";
import Markdown from "@components/Markdown";
import ArrowUpRightIcon from "@heroicons/react/24/solid/ArrowUpRightIcon";
import { useTranslation } from "@hooks/useTranslation";
import { Dewan } from "@lib/types";
import Link from "next/link";
import { useMemo } from "react";
import rehypeRaw from "rehype-raw";

export type Excerpt = {
  index: number;
  speaker: string;
  trimmed_speech: string;
  sitting: {
    date: string;
    term: number;
    session: number;
    meeting: number;
  };
};

interface ExcerptCardProps {
  dewan: Dewan;
  excerpt: Excerpt;
  keyword: string;
}

const ExcerptCard = ({ dewan, excerpt, keyword }: ExcerptCardProps) => {
  const { t } = useTranslation("enum");
  const { index, sitting, speaker, trimmed_speech } = excerpt;
  const [name, title] = speaker.split("[");

  const speech = useMemo<string>(() => {
    const quotes = trimmed_speech.replaceAll("\n\n", " ").replaceAll("== ==", " ").split("==");
    if (quotes.length === 1) {
      return quotes[0];
    } else {
      let str = "";
      for (let i = 0; i < quotes.length; i++) {
        if (!quotes[i]) continue;
        if (keyword.toLowerCase().includes(quotes[i].toLowerCase()))
          str += `<mark>${quotes[i]}</mark>`;
        else str += quotes[i];
      }
      return str;
    }
  }, [excerpt]);

  return (
    <Link
      href={`hansard/${dewan}/${sitting.date}#${index}`}
      prefetch={false}
      className="shadow-button p-6 max-w-3xl group rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-slate-400 hover:bg-slate-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50"
    >
      <div className="flex flex-col gap-3 relative h-full">
        <div className="flex w-auto gap-4.5">
          <DateCard date={sitting.date} size="sm" />

          <div className="flex flex-col w-[calc(100%-164px)] grow justify-evenly">
            <p className="text-zinc-900 dark:text-white font-bold truncate">
              {name}
            </p>
            <p className="text-zinc-500 font-medium truncate">
              {title ? title.slice(0, -1) : ""}
            </p>
          </div>
          <ArrowUpRightIcon className="hidden sm:block shrink-0 h-5 w-5 text-zinc-500 opacity-0 transition-[opacity_transform] duration-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-hover:duration-300" />
        </div>
        <div className="flex-grow">
          <Markdown
            rehypePlugins={[rehypeRaw]}
            components={{
              mark(props) {
                const { node, ...rest } = props;
                return (
                  <span className="bg-[#DDD6B0] text-zinc-900" {...rest} />
                );
              },
            }}
          >
            {speech}
          </Markdown>
        </div>
        <span className="flex text-zinc-500 text-xs gap-1 pt-3 border-t dark:border-zinc-800">
          {`${t("parlimen", {
            ordinal: true,
            count: sitting.term,
          })} / ${t("penggal_full", {
            n: sitting.session,
          })} / ${t("mesyuarat_full", {
            n: sitting.meeting,
          })}`}
        </span>
      </div>
    </Link>
  );
};

export default ExcerptCard;
