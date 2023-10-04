export const routes = {
  HOME: "/",
  HANSARD_CATALOGUE: "/hansard-catalogue",
};

export const static_routes: string[] = (() => {
  let s_routes = Object.values(routes).filter(route => !["/hansard-catalogue"].includes(route));

  s_routes.forEach(route => {
    s_routes.push(`/en-GB${route}`);
  });
  return s_routes;
})();
