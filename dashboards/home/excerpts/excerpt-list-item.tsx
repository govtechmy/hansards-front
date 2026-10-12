import { Dewan } from "@lib/types";
import Link from "next/link";
import { Remarkable } from "remarkable";
import RemarkableReactRenderer from "remarkable-react";

export type Excerpt = {
  index: number;
  speaker: string;
  trimmed_speech: string;
  sitting: {
    date: string;
    term: number;
    session: number;
    meeting: number;
    house?: number;
  };
};

// Helper function to escape special regex characters
function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// Helper function to merge exact phrase marks
function mergeExactPhraseMarks(text: string, keyword: string) {
  const words = keyword.split(/\s+/).filter(Boolean);
  if (words.length < 2) return text;

  const escapedWords = words.map(escapeRegExp);
  const completeMark = `==\\s*${escapedWords.join("\\s+")}\\s*==`;
  const splitMarks = escapedWords
    .map(word => `==\\s*${word}\\s*==`)
    .join("\\s+");
  const phraseMarks = new RegExp(`(?:${completeMark}|${splitMarks})`, "gi");

  return text.replace(phraseMarks, match => {
    const phrase = match.replace(/==/g, " ").replace(/\s+/g, " ").trim();
    return `==${phrase}==`;
  });
}

interface ExcerptListItemProps {
  dewan: Dewan;
  excerpt: Excerpt;
  keyword: string;
  isExactMatch?: boolean;
}

const ExcerptListItem = ({
  dewan,
  excerpt,
  keyword,
  isExactMatch = false,
}: ExcerptListItemProps) => {
  const { index, sitting, speaker, trimmed_speech } = excerpt;
  const exactKeyword = keyword
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .toLowerCase();
  // If it's an exact match, merge the exact phrase marks in the speech
  const speech = isExactMatch
    ? mergeExactPhraseMarks(trimmed_speech, exactKeyword)
    : trimmed_speech;
  // const [name, title] = speaker.split("[");

  const md = new Remarkable();
  md.inline.ruler.enable(["mark"]);
  md.renderer = new RemarkableReactRenderer({
    components: {
      mark: ({ children }: { children: string[] }) => {
        const markedText = children.join("").trim().toLowerCase();

        if (isExactMatch && markedText !== exactKeyword) {
          return <>{children}</>;
        }

        return <mark className="bg-[#DDD6B0] text-black">{children}</mark>;
      },
    },
  }) as any;

  const HOUSE_TO_DEWAN: Record<number, string> = {
    0: "dewan-rakyat",
    1: "dewan-negara",
    2: "kamar-khas",
  };

  const houseDewan =
    sitting.house !== undefined
      ? HOUSE_TO_DEWAN[sitting.house]
      : HOUSE_TO_DEWAN[0];

  return (
    <Link
      href={`hansard/${houseDewan}/${sitting.date}?q=${encodeURIComponent(keyword)}#${index}`}
      prefetch={false}
      className="group p-3 first:rounded-t-xl last:rounded-b-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 sm:p-4"
    >
      <div className="relative flex h-full flex-col gap-1">
        <p className="line-clamp-1 text-body-sm font-medium">{speaker}</p>
        <div className="line-clamp-2 text-body-xs text-txt-black-700 sm:text-body-sm">
          {md.render(speech)}
        </div>
      </div>
    </Link>
  );
};

export default ExcerptListItem;
