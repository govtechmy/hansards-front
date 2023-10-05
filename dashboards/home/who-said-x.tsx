import { Container } from "@components/index";
import { FunctionComponent } from "react";
import Excerpts from "./excerpt";

/**
 * Who Said X Dashboard
 * @overview Status: In-development
 */

const WhoSaidX: FunctionComponent = () => {
  return (
    <Container className="min-h-screen">
      <Excerpts />
    </Container>
  );
};

export default WhoSaidX;
