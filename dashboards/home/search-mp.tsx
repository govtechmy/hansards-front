import Excerpts, { ExcerptsProps } from "./excerpts";
import { Container } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";

/**
 * Search MP Dashboard
 * @overview Status: In-development
 */

interface Props extends ExcerptsProps {}

const SearchMP = ({ count, excerpts, keyword, query }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Container className="min-h-screen">
        <Excerpts count={count} excerpts={excerpts} keyword={keyword} query={query} />
      </Container>
    </>
  );
};

export default SearchMP;
