import Container from "@components/Container";
import Nav from "@components/Nav";
import { useTranslation } from "@hooks/useTranslation";
import { ParlimenIcon } from "@icons/index";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent, ReactNode } from "react";

interface HeaderProps {
  stateSelector?: ReactNode;
}

const Header: FunctionComponent<HeaderProps> = ({ stateSelector }) => {
  const { t } = useTranslation();

  return (
    <div className="dark:border-zinc-800 fixed left-0 top-0 z-30 w-full border-b">
      <Container
        background="bg-white dark:bg-zinc-900"
        className="flex items-center gap-4 py-[11px]"
      >
        <div className="flex w-full items-center gap-1">
          <Link href="/">
            <div className="flex cursor-pointer gap-2.5">
              <div className="flex w-8 items-center justify-center">
              <ParlimenIcon />
              </div>
              <h4 className="whitespace-nowrap">Hansard Parlimen</h4>
            </div>
          </Link>

          <Nav stateSelector={stateSelector}>
            {(close) => (
              <>
                <Nav.Item
                  key={"/"}
                  title={t("nav.home")}
                  link="/"
                  onClick={close}
                />
                <Nav.Item
                  title={t("nav.kehadiran")}
                  link="/kehadiran"
                  key="/kehadiran"
                  onClick={close}
                />
                <Nav.Item
                  title={t("nav.sejarah")}
                  link="/sejarah"
                  key="/sejarah"
                  onClick={close}
                />
                <Nav.Item
                  title={t("nav.katalog")}
                  key="/katalog"
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
