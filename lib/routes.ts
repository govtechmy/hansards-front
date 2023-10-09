export const routes = {
  HOME: "/",
  KATALOG: "/katalog",
};

export const static_routes: string[] = (() => {
  let s_routes = Object.values(routes).filter(route => !["/katalog"].includes(route));

  s_routes.forEach(route => {
    s_routes.push(`/en-GB${route}`);
  });
  return s_routes;
})();
