import Button from "@components/Button";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "@hooks/useTranslation";

interface MobileButtonProps {
  onClick: () => void;
}

const MobileButton = ({ onClick }: MobileButtonProps) => {
  const { t } = useTranslation("hansard");

  return (
    <Button
      variant="outline"
      key="key"
      className="shadow-floating sticky top-32 left-3 lg:hidden z-20 w-fit"
      title={t("show_sidebar")}
      onClick={onClick}
    >
      {t("toc")}
      <ChevronDownIcon className="h-4.5 w-4.5" />
    </Button>
  );
};

export default MobileButton;
