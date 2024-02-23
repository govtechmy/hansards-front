import { Button, Search } from "@components/index";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useContext, useState } from "react";
import { SearchContext, SearchEventContext } from "./search/context";

/**
 * Hansard Search Bar
 */

export default function HansardSearchBar() {
  const [query, setQuery] = useState<string>("");
  const { searchValue, activeCount, totalCount } = useContext(SearchContext);
  const { onSearchChange, onPrev, onNext } = useContext(SearchEventContext);

  return (
    <div className="border-b-border sticky top-14 z-20 flex items-center justify-between gap-1 lg:gap-3 w-full border-b bg-background py-1.5 lg:px-8">
      <div className="flex gap-3 items-center w-full">
        <Search
          className="border-none py-[3.5px] w-full"
          query={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearchChange(e.target.value);
          }}
        />

        {searchValue && searchValue.length > 0 && (
          <Button
            variant="reset"
            className="h-fit hover:bg-bg-hover text-dim group rounded-full p-1 hover:text-foreground"
            onClick={() => {
              setQuery("");
              onSearchChange("");
            }}
          >
            <XMarkIcon className="text-dim h-5 w-5 group-hover:text-foreground" />
          </Button>
        )}
      </div>
      {searchValue && searchValue.length > 0 && (
        <div className="flex gap-3 items-center">
          <p className="text-zinc-500 max-sm:text-sm whitespace-nowrap">{`${activeCount} of ${totalCount} found`}</p>
          <Button
            variant="reset"
            className="h-fit hover:bg-bg-hover text-zinc-500 group rounded-full p-1 hover:text-foreground"
            onClick={onPrev}
          >
            <ChevronUpIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="reset"
            className="h-fit hover:bg-bg-hover text-zinc-500 group rounded-full p-1 hover:text-foreground"
            onClick={onNext}
          >
            <ChevronDownIcon className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
