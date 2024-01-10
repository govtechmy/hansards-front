import Button from "@components/Button";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";

interface MobileButtonProps {
  mobileSidebar: boolean;
  onClick: () => void;
}

const MobileButton = ({ mobileSidebar, onClick }: MobileButtonProps) => {
  const { t } = useTranslation("hansard");

  return (
    <Button
      variant="default"
      key="key"
      className={cn(
        "shadow-floating sticky top-32 left-3 lg:hidden z-50 w-fit",
        mobileSidebar && "hidden"
      )}
      title={mobileSidebar ? t("hide_sidebar") : t("show_sidebar")}
      onClick={onClick}
    >
      {t("toc")}
      <ChevronDownIcon className="h-4.5 w-4.5" />
    </Button>
  );
};

export default MobileButton;
