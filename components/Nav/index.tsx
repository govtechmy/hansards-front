import { useLanguage } from "@hooks/useLanguage";
import { cn } from "@lib/helpers";
import At from "../At";
import Dropdown from "../Dropdown";
import ThemeToggle from "./theme";
import { useRouter } from "next/router";
import { ComponentProps, FunctionComponent, ReactNode, useState } from "react";
import { Button } from "..";

type NavRootProps = {
  children: (close: () => void) => ReactNode;
  stateSelector?: ReactNode;
};

type NavItemProps = {
  icon?: ReactNode;
  title: string;
  link: string;
  onClick: () => void;
  className?: string;
  external?: boolean;
};

type NavFunctionComponent = FunctionComponent<NavRootProps> & {
  Item: typeof Item;
};

const Item: FunctionComponent<NavItemProps> = ({
  link,
  onClick,
  className,
  icon,
  title,
  external = false,
}) => {
  const { pathname } = useRouter();
  return (
    <At
      href={link}
      scroll={false}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-none px-3 py-2 text-sm font-medium transition hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 md:rounded-md md:py-[6px]",
        pathname.startsWith(link) && link !== "/"
          ? "bg-slate-100 dark:bg-zinc-800"
          : "",
        className
      )}
      external={external}
    >
      {icon}
      {title}
    </At>
  );
};

const Nav: NavFunctionComponent = ({ children, stateSelector }) => {
  const [showMobile, setShowMobile] = useState<boolean>(false);
  const { language, onLanguageChange } = useLanguage();
  const languages = [
    { label: "Malay", value: "ms-MY" },
    { label: "English", value: "en-GB" },
  ];

  const close = () => setShowMobile(false);
  const open = () => setShowMobile(true);

  return (
    <div className="flex w-screen items-center justify-end lg:justify-between">
      {/* Desktop */}
      <div className="hidden w-fit gap-1 lg:flex">{children(close)}</div>
      <div className="hidden w-fit gap-4 lg:flex">
        {stateSelector}
        <ThemeToggle />
        <Dropdown
          width="w-fit"
          anchor="right"
          selected={languages.find(lang => lang.value === language)}
          onChange={onLanguageChange}
          options={languages}
        />
      </div>

      {/* Mobile - Header*/}
      <div className="flex w-full items-center justify-end gap-3 lg:hidden">
        {stateSelector}
        <Button
          type="button"
          variant="reset"
          aria-label="Menu"
          className="hamburger -mr-1 rounded p-[5px] active:bg-slate-200 active:dark:bg-zinc-800 lg:hidden"
          onClick={() => setShowMobile(!showMobile)}
        >
          <MenuIcon className={cn(showMobile && "open")} />
        </Button>
      </div>
      {/* Mobile - Menu */}
      <div
        className={cn(
          "absolute left-0 top-14 flex w-screen flex-col gap-0 divide-y bg-white px-4 py-2 shadow-floating backdrop-blur-md dark:divide-zinc-800 dark:bg-zinc-900 lg:hidden",
          showMobile ? "flex" : "hidden"
        )}
      >
        {children(close)}
        <div className="flex justify-between gap-x-3 py-2">
          <ThemeToggle />
          <Dropdown
            width="w-fit"
            selected={languages.find(lang => lang.value === language)}
            onChange={onLanguageChange}
            options={languages}
          />
        </div>
      </div>
    </div>
  );
};

Nav.Item = Item;

export default Nav;

const MenuIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      fill="none"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <g>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16"
        />
      </g>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 12h16"
      />
      <g>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 18h16"
        />
      </g>
    </svg>
  );
};
