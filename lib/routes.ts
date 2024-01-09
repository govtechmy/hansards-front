export const routes = {
  HOME: "/",
  CARI_MP: "/cari-mp",
  KATALOG_DR: "/katalog/dewan-rakyat",
  KATALOG_DN: "/katalog/dewan-negara",
  KATALOG_KK: "/katalog/kamar-khas",
  HANSARD_DR: "/hansard/dewan-rakyat",
  HANSARD_DN: "/hansard/dewan-negara",
  HANSARD_KK: "/hansard/kamar-khas",
  KEHADIRAN_DR: "/kehadiran/dewan-rakyat",
  KEHADIRAN_DN: "/kehadiran/dewan-negara",
  SEJARAH_INDIVIDU: "/sejarah/individu",
  SEJARAH_KAWASAN: "/sejarah/kawasan",
  SEJARAH_PARLIMEN: "/sejarah/parlimen",
  SEJARAH_PARTI: "/sejarah/parti",
};

export const static_routes: string[] = (() => {
  let s_routes = [routes.KATALOG_DR, routes.KATALOG_DN, routes.KATALOG_KK];
  
  s_routes.forEach(route => {
    s_routes.push(`/en-GB${route}`);
  });
  return s_routes;
})();
