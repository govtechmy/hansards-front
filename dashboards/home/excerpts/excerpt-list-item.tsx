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

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\\/-]/g, "\\$&");
}

function normalizeExactText(value: string, stripMarkSyntax = false) {
  return (stripMarkSyntax ? value.replace(/==/g, "") : value)
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s*([^\p{L}\p{N}\s])\s*/gu, "$1")
    .toLowerCase();
}

function markedWordPattern(word: string) {
  const parts = word.split(/([^\p{L}\p{N}]+)/u).filter(Boolean);
  const wholeWord = `==\\s*${escapeRegExp(word)}\\s*==`;

  if (parts.length === 1) return wholeWord;

  const splitWord = parts
    .map(part => {
      const isPunctuation = /^[^\p{L}\p{N}]+$/u.test(part);
      return isPunctuation
        ? `\\s*${escapeRegExp(part)}\\s*`
        : `==\\s*${escapeRegExp(part)}\\s*==`;
    })
    .join("");

  return `(?:${wholeWord}|${splitWord})`;
}

function mergeExactPhraseMarks(text: string, keyword: string) {
  const words = keyword.split(/\s+/).filter(Boolean);
  if (words.length < 2) return text;

  const escapedWords = words.map(escapeRegExp);
  const completeMark = `==\\s*${escapedWords.join("\\s+")}\\s*==`;
  const splitMarks = escapedWords
    .map((_, index) => markedWordPattern(words[index]))
    .join("\\s+");
  const phraseMarks = new RegExp(`(?:${completeMark}|${splitMarks})`, "gi");

  return text.replace(phraseMarks, match => {
    const phrase = normalizeExactText(match, true);
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
  const exactKeyword = normalizeExactText(
    keyword.trim().replace(/^"(.*)"$/, "$1")
  );
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
        const markedText = normalizeExactText(children.join(""));

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
