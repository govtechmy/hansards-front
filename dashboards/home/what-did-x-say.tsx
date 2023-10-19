import Excerpts, { ExcerptsProps } from "./excerpts";
import { Container } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";

/**
 * What Did X Say Dashboard
 * @overview Status: In-development
 */

interface Props extends ExcerptsProps {}

const WhatDidXSay = ({ count, excerpts, keyword }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Container className="min-h-screen">
        <Excerpts count={count} excerpts={excerpts} keyword={keyword} />
      </Container>
    </>
  );
};

export default WhatDidXSay;
