import Excerpts, { ExcerptsProps } from "./excerpts";
import MP, { MPProps } from "./mp";
import { Container } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";

/**
 * Search MP Dashboard
 * @overview Status: In-development
 */

interface SearchMPProps extends ExcerptsProps, MPProps {}

const SearchMP = ({
  count,
  excerpts,
  individu_list,
  query,
  timeseries,
}: SearchMPProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Container className="min-h-screen">
        <MP
          individu_list={individu_list}
          query={query}
          timeseries={timeseries}
        />
        {count > 0 && (
          <>
            <Excerpts count={count} excerpts={excerpts} query={query} />
          </>
        )}
      </Container>
    </>
  );
};

export default SearchMP;
