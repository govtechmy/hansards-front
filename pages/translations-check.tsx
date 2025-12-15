// import { withi18n } from "@lib/decorators";
// import { useTranslation } from "@hooks/useTranslation";
// import { useEffect, useMemo, useState } from "react";
// import { GetServerSideProps } from "next";

// type NamespaceToKeys = Record<string, string[]>;
// type ComponentTranslations = Record<string, NamespaceToKeys>;

// // NOTE: Intentionally hardcoded. Do not derive from translations_usage.json.
// const COMPONENTS: ComponentTranslations = {
//   "data-catalogue/dates.tsx": {
//     catalogue: ["final", "draft", "cite", "download", "share"],
//   },
//   "data-catalogue/hansard/hansard.tsx": {
//     hansard: ["archive", "header", "shares", "cite", "download"],
//     enum: ["parlimen", "penggal_full", "mesyuarat_full"],
//     common: ["views", "downloads"],
//     catalogue: ["download"],
//   },
//   "pages/katalog/kamar-khas/index.tsx": {
//     catalogue: ["hero.header", "hero.description"],
//   },
//   "pages/katalog/dewan-rakyat/index.tsx": {
//     catalogue: ["hero.header", "hero.description"],
//   },
//   "pages/katalog/dewan-negara/index.tsx": {
//     catalogue: ["hero.header", "hero.description"],
//   },
//   "data-catalogue/layout.tsx": {
//     catalogue: ["hero.category", "hero.header", "hero.description"],
//     common: ["dewan_negara", "dewan_rakyat", "kamar_khas"],
//   },
//   "data-catalogue/folder.tsx": {
//     enum: ["mesyuarat_full"],
//   },
//   "components/Layout/Footer.tsx": {
//     common: [
//       "footer.parlimen",
//       "footer.follow_us",
//       "footer.all_rights_reserved",
//       "footer.open_source",
//       "footer.frontend",
//       "footer.backend",
//       "footer.parser",
//       "footer.ui_ux",
//     ],
//   },
//   "dashboards/home/keyword/index.tsx": {
//     home: [
//       "search_keywords",
//       "timeseries_title",
//       "start_search",
//       "words_related",
//       "most_spoken_by",
//     ],
//     common: ["placeholder.no_results"],
//   },
//   "pages/hansard/dewan-negara/[...date].tsx": {
//     hansard: ["header"],
//   },
//   "dashboards/kehadiran/kehadiran-table.tsx": {
//     kehadiran: ["kehadiran", "name", "total_seats"],
//     common: ["individu", "party"],
//     demografi: ["age", "gender", "ethnicity"],
//   },
//   "dashboards/kehadiran/kehadiran-barmeter.tsx": {
//     kehadiran: ["barmeter_title"],
//     demografi: ["gender", "ethnicity", "age"],
//   },
//   "dashboards/home/mp/mp-filter.tsx": {
//     home: ["group", "search_individual", "current_parlimen", "date", "dewan"],
//     common: [
//       "individu",
//       "clear",
//       "filters",
//       "filter",
//       "clear_all",
//       "placeholder.search",
//     ],
//     demografi: ["all_ages", "all_ethnicities", "both_genders"],
//   },
//   "dashboards/home/keyword/keyword-filter.tsx": {
//     home: ["search_keyword", "current_parlimen", "date", "dewan"],
//     common: [
//       "placeholder.search",
//       "party",
//       "clear",
//       "filters",
//       "filter",
//       "clear_all",
//     ],
//     demografi: [
//       "all_ages",
//       "all_ethnicities",
//       "both_genders",
//       "gender",
//       "age_group",
//       "ethnicity",
//     ],
//   },
//   "components/Search/index.tsx": {
//     common: ["placeholder.search"],
//   },
//   "components/Daterange/index.tsx": {
//     home: ["choose_later_date", "today_or_earlier", "invalid_date"],
//   },
//   "pages/hansard/kamar-khas/[...date].tsx": {
//     hansard: ["header"],
//   },
//   "pages/hansard/dewan-rakyat/[...date].tsx": {
//     hansard: ["header"],
//   },
//   "pages/404.tsx": {
//     error: ["404.title"],
//   },
//   "data-catalogue/share.tsx": {
//     hansard: ["email", "shares", "share_hansard"],
//     demografi: ["other"],
//     common: ["copy", "copied"],
//   },
//   "data-catalogue/penggal.tsx": {
//     enum: ["penggal_full"],
//   },
//   "data-catalogue/index.tsx": {
//     enum: ["parlimen"],
//     common: ["no_entries"],
//   },
//   "data-catalogue/hansard/sidebar.tsx": {
//     hansard: ["toc", "hide_sidebar", "show_sidebar"],
//     common: ["no_entries"],
//   },
//   "data-catalogue/hansard/bubble.tsx": {
//     catalogue: ["download", "csv"],
//   },
//   "data-catalogue/folder-open.tsx": {
//     enum: ["penggal_full", "mesyuarat_full"],
//   },
//   "data-catalogue/cite.tsx": {
//     hansard: ["header", "cite_hansard"],
//     common: ["copy", "footer.parlimen"],
//   },
//   "dashboards/kehadiran/layout.tsx": {
//     kehadiran: ["hero.category", "hero.header", "hero.description"],
//     common: ["dewan_negara", "dewan_rakyat"],
//   },
//   "dashboards/home/mp/index.tsx": {
//     home: [
//       "search_individual_mp",
//       "search_mps",
//       "timeseries_mp",
//       "timeseries_mps",
//       "total_words",
//       "start_search",
//       "most_spoken_words",
//     ],
//     common: ["placeholder.no_results"],
//   },
//   "dashboards/home/layout.tsx": {
//     home: [
//       "search_keyword",
//       "search_mp",
//       "hero.category",
//       "hero.header",
//       "hero.description",
//     ],
//   },
//   "dashboards/home/excerpts/index.tsx": {
//     home: ["excerpts", "results_per_page"],
//     enum: ["parlimen", "penggal", "mesyuarat_full"],
//     common: ["dewan_rakyat", "dewan_negara"],
//   },
//   "components/Slider/index.tsx": {
//     common: ["pause", "play"],
//   },
//   "components/Sidebar/index.tsx": {
//     catalogue: ["no_entries", "full_archive", "hide_sidebar", "show_sidebar"],
//     enum: ["parlimen", "penggal_full"],
//   },
//   "components/Nav/theme.tsx": {
//     common: ["nav.toggle_theme", "nav.toggle_dark", "nav.toggle_light"],
//   },
//   "components/Layout/masthead.tsx": {
//     common: [
//       "masthead.official_gov_website",
//       "masthead.how_to_identify",
//       "masthead.official",
//       "masthead.not_govmy",
//       "masthead.close_site",
//       "masthead.secure",
//       "masthead.find_lock",
//       "masthead.or",
//       "masthead.precaution",
//     ],
//   },
//   "components/Layout/Header.tsx": {
//     common: ["nav.home", "nav.katalog", "nav.kehadiran", "nav.sejarah"],
//   },
//   "components/Hero/index.tsx": {
//     common: ["views", "last_updated"],
//   },
//   "components/Dropdown/index.tsx": {
//     common: ["placeholder.search", "clear"],
//   },
//   "charts/geochoropleth.tsx": {
//     common: ["no_data"],
//   },
//   "pages/sejarah/parti/index.tsx": {
//     sejarah: ["sejarah_parti", "parti.header"],
//   },
//   "pages/sejarah/parlimen/index.tsx": {
//     sejarah: ["sejarah_parlimen", "parlimen.header"],
//   },
//   "pages/sejarah/kawasan/index.tsx": {
//     sejarah: ["sejarah_kawasan", "kawasan.header"],
//   },
//   "pages/sejarah/individu/index.tsx": {
//     sejarah: ["sejarah_individu", "individu.header"],
//   },
//   "pages/kehadiran/dewan-rakyat/index.tsx": {
//     kehadiran: ["hero.header", "hero.description"],
//   },
//   "pages/kehadiran/dewan-negara/index.tsx": {
//     kehadiran: ["hero.header", "hero.description"],
//   },
//   "pages/500.tsx": {
//     error: ["500.title", "500.description", "500.reason"],
//   },
//   "data-catalogue/hansard/mobile-button.tsx": {
//     hansard: ["show_sidebar", "toc"],
//   },
//   "dashboards/sejarah/table.tsx": {
//     election: ["By-Election"],
//   },
//   "dashboards/sejarah/result-badge.tsx": {
//     sejarah: ["won", "won_uncontested", "lost", "lost_deposit"],
//   },
//   "dashboards/sejarah/parti.tsx": {
//     sejarah: [
//       "election",
//       "seats_won",
//       "votes_won",
//       "parti.header",
//       "cari_parti",
//       "parti.title",
//     ],
//     common: ["toast.request_failure", "toast.try_again"],
//   },
//   "dashboards/sejarah/parlimen.tsx": {
//     sejarah: [
//       "parlimen.header",
//       "pilih_parlimen",
//       "seats_won",
//       "votes_won",
//       "seat",
//       "name",
//       "start_date",
//       "end_date",
//       "method",
//       "state",
//     ],
//     enum: ["parlimen"],
//     common: ["dewan_rakyat", "party", "individu", "dewan_negara"],
//   },
//   "dashboards/sejarah/layout.tsx": {
//     sejarah: [
//       "by_individu",
//       "by_kawasan",
//       "by_parlimen",
//       "by_parti",
//       "hero.category",
//       "hero.header",
//       "hero.description",
//     ],
//   },
//   "dashboards/sejarah/kawasan.tsx": {
//     sejarah: [
//       "election",
//       "seat",
//       "name",
//       "majority",
//       "votes_won",
//       "kawasan.header",
//       "cari_kawasan",
//       "kawasan.title",
//     ],
//     common: ["party", "toast.request_failure", "toast.try_again"],
//   },
//   "dashboards/sejarah/individu.tsx": {
//     sejarah: [
//       "election",
//       "seat",
//       "votes_won",
//       "result",
//       "name",
//       "individu.header",
//       "cari_individu",
//       "individu.title",
//       "start_date",
//       "end_date",
//       "method",
//       "state",
//     ],
//     common: [
//       "party",
//       "dewan_rakyat",
//       "dewan_negara",
//       "toast.request_failure",
//       "toast.try_again",
//     ],
//   },
//   "dashboards/sejarah/full-results.tsx": {
//     sejarah: ["election_result", "voting_statistics", "full_result"],
//     common: ["previous", "next"],
//   },
//   "dashboards/kehadiran/kehadiran-dropdown.tsx": {
//     kehadiran: [
//       "all_parlimen",
//       "all_penggal",
//       "all_mesyuarat",
//       "pilih_parlimen",
//       "pilih_penggal",
//       "pilih_mesyuarat",
//     ],
//     enum: ["parlimen", "penggal_full", "mesyuarat_full"],
//     common: ["filters", "filter", "close"],
//   },
//   "dashboards/kehadiran/index.tsx": {
//     kehadiran: ["header"],
//   },
//   "dashboards/kehadiran/filter.tsx": {
//     common: ["filters"],
//   },
//   "dashboards/home/coming-soon.tsx": {
//     home: ["hero.category", "hero.header", "hero.description"],
//   },
//   "components/Section/index.tsx": {
//     common: ["data_of"],
//   },
//   "components/Modal/StateModal.tsx": {
//     common: ["check_out"],
//   },
//   "components/Metadata/index.tsx": {
//     common: ["site.description"],
//   },
//   "components/ErrorStatus/index.tsx": {
//     error: ["output", "disclaimer"],
//   },
//   "components/Combobox/index.tsx": {
//     common: ["placeholder.loading", "placeholder.no_results"],
//   },
//   "components/Chips/index.tsx": {
//     common: ["clear_all"],
//   },
//   "charts/table.tsx": {
//     common: [
//       "sort",
//       "desc_order",
//       "asc_order",
//       "no_entries",
//       "previous",
//       "page_of",
//       "next",
//     ],
//   },
// };

// const ALL_NAMESPACES = [
//   "catalogue",
//   "common",
//   "demografi",
//   "election",
//   "enum",
//   "error",
//   "hansard",
//   "home",
//   "kehadiran",
//   "party",
//   "sejarah",
// ];

// const StatusPill = ({
//   exists,
//   label,
//   onClick,
//   isActive,
// }: {
//   exists: boolean;
//   label: string;
//   onClick?: () => void;
//   isActive?: boolean;
// }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className={
//       "mb-2 mr-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors " +
//       (exists
//         ? "border-green-300 bg-green-50 text-green-800 hover:bg-green-100"
//         : "border-red-300 bg-red-50 text-red-800 hover:bg-red-100") +
//       (isActive ? " ring-2 ring-blue-400 ring-offset-1" : "")
//     }
//   >
//     {label}
//   </button>
// );

// export default function TranslationsCheckPage() {
//   const { i18n } = useTranslation();
//   const [activeKey, setActiveKey] = useState<string | null>(null);

//   // Ensure both locales and all namespaces are available on client
//   useEffect(() => {
//     // Load both languages and namespaces client-side via backend
//     i18n.loadLanguages(["ms-MY", "en-GB"]);
//     i18n.loadNamespaces(ALL_NAMESPACES);
//   }, [i18n]);

//   const languages = useMemo(
//     () => [
//       { code: "ms-MY", label: "ms-MY" },
//       { code: "en-GB", label: "en-GB" },
//     ],
//     []
//   );

//   return (
//     <div className="mx-auto max-w-6xl p-6">
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold">Translation Usage Check</h1>
//         <p className="text-sm text-gray-600">
//           Green = found, Red = missing. Grouped by component.
//         </p>
//         <div className="mt-2">
//           <StatusPill exists={true} label="Found" />
//           <StatusPill exists={false} label="Missing" />
//         </div>
//       </div>

//       <div className="space-y-6">
//         {Object.entries(COMPONENTS).map(([component, namespaces]) => (
//           <div key={component} className="rounded-lg border p-4">
//             <div className="mb-3 font-mono text-sm text-gray-700">
//               {component}
//             </div>
//             <div className="space-y-3">
//               {Object.entries(namespaces).map(([ns, keys]) => (
//                 <div key={`${component}-${ns}`}>
//                   <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
//                     {ns}
//                   </div>
//                   <div>
//                     {keys.map(key => {
//                       const pillId = `${component}|${ns}|${key}`;
//                       const existsMs = Boolean(
//                         i18n.getResource("ms-MY", ns, key as any)
//                       );
//                       return (
//                         <StatusPill
//                           key={pillId}
//                           exists={existsMs}
//                           label={key}
//                           isActive={activeKey === pillId}
//                           onClick={() =>
//                             setActiveKey(prev =>
//                               prev === pillId ? null : pillId
//                             )
//                           }
//                         />
//                       );
//                     })}
//                   </div>

//                   {keys.map(key => {
//                     const pillId = `${component}|${ns}|${key}`;
//                     if (activeKey !== pillId) return null;

//                     return (
//                       <div
//                         key={`${pillId}-details`}
//                         className="mt-2 rounded-md border bg-gray-50 p-3 text-sm"
//                       >
//                         <div className="mb-2 font-medium">{key}</div>
//                         <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//                           {languages.map(lang => {
//                             const resource = i18n.getResource(
//                               lang.code,
//                               ns,
//                               key as any
//                             );
//                             const exists =
//                               resource !== undefined && resource !== null;
//                             const displayValue = exists
//                               ? typeof resource === "string"
//                                 ? resource
//                                 : JSON.stringify(resource)
//                               : "Not found";
//                             return (
//                               <div
//                                 key={`${pillId}-${lang.code}`}
//                                 className="rounded border bg-white p-2"
//                               >
//                                 <div className="mb-1 text-xs uppercase text-gray-500">
//                                   {lang.label}
//                                 </div>
//                                 <div
//                                   className={
//                                     exists ? "text-gray-900" : "text-red-700"
//                                   }
//                                 >
//                                   {displayValue}
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export const getServerSideProps: GetServerSideProps = withi18n(
//   ALL_NAMESPACES,
//   async () => {
//     return {
//       props: {},
//     } as any;
//   }
// );
