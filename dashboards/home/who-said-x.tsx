import { Container } from "@components/index";
import Excerpts, { ExcerptsProps } from "./excerpts";

/**
 * Who Said X Dashboard
 * @overview Status: In-development
 */

interface WhoSaidXProps extends ExcerptsProps {}

const WhoSaidX = ({ count, excerpts, keyword }: WhoSaidXProps) => (
  <Container className="min-h-screen">
    <Excerpts count={count} excerpts={excerpts} keyword={keyword} />
  </Container>
);

export default WhoSaidX;
