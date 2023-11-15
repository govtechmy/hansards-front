export const routes = {
  HOME: "/",
  KATALOG_DR: "/katalog/dewan-rakyat",
  KATALOG_DN: "/katalog/dewan-negara",
  HANSARD_DR: "/hansard/dewan-rakyat",
  HANSARD_DN: "/hansard/dewan-negara",
  KEHADIRAN_DR: "/kehadiran/dewan-rakyat",
  KEHADIRAN_DN: "/kehadiran/dewan-negara",
  SEJARAH_INDIVIDU: "/sejarah/individu",
  SEJARAH_KAWASAN: "/sejarah/kawasan",
  SEJARAH_PARLIMEN: "/sejarah/parlimen",
  SEJARAH_PARTI: "/sejarah/parti",
};

export const static_routes: string[] = (() => {
  let s_routes = [routes.KATALOG_DR, routes.KATALOG_DN];
  
  s_routes.forEach(route => {
    s_routes.push(`/en-GB${route}`);
  });
  return s_routes;
})();
