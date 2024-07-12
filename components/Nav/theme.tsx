import Button from "@components/Button";
import MoonIcon from "@heroicons/react/20/solid/MoonIcon";
import SunIcon from "@heroicons/react/20/solid/SunIcon";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { t } = useTranslation();

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Button
      title={t("nav.toggle_theme")}
      variant="ghost"
      className="group p-2"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <MoonIcon
        data-state={resolvedTheme === "light" ? "dark" : "light"}
        className="size-4 text-dim animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 group-hover:text-black data-[state=dark]:flex data-[state=light]:hidden"
      />
      <SunIcon
        data-state={resolvedTheme === "light" ? "dark" : "light"}
        className="-m-0.5 size-5 text-dim animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 group-hover:text-white data-[state=light]:flex data-[state=dark]:hidden"
      />
      <div className="sr-only">
        {theme === "light" ? t("nav.toggle_dark") : t("nav.toggle_light")}
      </div>
    </Button>
  );
};

export default ThemeToggle;
