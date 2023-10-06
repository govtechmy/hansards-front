import { At, Container, Section } from "@components/index";
import { FunctionComponent } from "react";
import ExcerptCard, { Excerpt } from "@components/Card/excerpt-card";
import { useTranslation } from "@hooks/useTranslation";
import Excerpts from "./excerpt";

/**
 * What Did X Say Dashboard
 * @overview Status: In-development
 */

const WhatDidXSay: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <Container className="min-h-screen">
        <Excerpts />
      </Container>
    </>
  );
};

export default WhatDidXSay;
