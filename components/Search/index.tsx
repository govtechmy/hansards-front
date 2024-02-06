import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { ComponentProps, useEffect, useRef } from "react";

type SearchProps = {
  query?: string;
  className?: string;
  placeholder?: string;
};

const Search = ({
  query,
  className,
  placeholder,
  ...props
}: SearchProps & ComponentProps<"input">) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleSlashKeydown = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === "/") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleSlashKeydown);

    return () => window.removeEventListener("keydown", handleSlashKeydown);
  }, []);

  return (
    <div className={cn("relative flex items-center", className)}>
      <input
        ref={searchRef}
        id="search"
        name="search"
        type="search"
        placeholder={placeholder ?? t("placeholder.search")}
        value={query}
        autoComplete="off"
        spellCheck="false"
        className="placeholder:text-zinc-500 text-foreground block w-full bg-inherit pl-10 focus:outline-none py-1.5"
        {...props}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="text-zinc-500 h-4.5 w-4.5" />
      </div>
    </div>
  );
};

export default Search;
