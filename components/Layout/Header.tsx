import Container from "@components/Container";
import Nav from "@components/Nav";
import { useTranslation } from "@hooks/useTranslation";
import { ParlimenIcon } from "@icons/index";
import Link from "next/link";
import { ReactNode } from "react";

interface HeaderProps {
  stateSelector?: ReactNode;
}

const Header = ({ stateSelector }: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="dark:border-zinc-800 fixed inset-x-0 top-0 z-30 w-screen border-b h-14">
      <Container
        background="bg-background"
        className="flex items-center gap-4 py-[11px]"
      >
        <div className="flex w-full items-center gap-1 lg:gap-4">
          <Link href="/">
            <div className="flex gap-2.5">
              <div className="flex w-8 items-center justify-center">
                <ParlimenIcon />
              </div>
              <div className="header whitespace-nowrap">Hansard Parlimen</div>
            </div>
          </Link>

          <Nav stateSelector={stateSelector}>
            {(close) => (
              <>
                <Nav.Item
                  key="/"
                  title={t("nav.home")}
                  link="/"
                  onClick={close}
                />
                <Nav.Item
                  key="/kehadiran"
                  title={t("nav.kehadiran")}
                  link="/kehadiran/dewan-rakyat"
                  onClick={close}
                />
                <Nav.Item
                  key="/sejarah"
                  title={t("nav.sejarah")}
                  link="/sejarah/individu"
                  onClick={close}
                />
                <Nav.Item
                  key="/katalog"
                  title={t("nav.katalog")}
                  link="/katalog/dewan-rakyat"
                  onClick={close}
                />
              </>
            )}
          </Nav>
        </div>
      </Container>
    </div>
  );
};

export default Header;
