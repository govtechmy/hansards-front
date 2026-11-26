const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { runInNewContext } = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

function load(file, mocks, extra = "", globals = {}) {
  const testModule = { exports: {} };
  const code = ts.transpileModule(
    readFileSync(resolve(__dirname, "..", file), "utf8") + extra,
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        ...(file.endsWith(".tsx") && { jsx: ts.JsxEmit.ReactJSX }),
      },
    }
  ).outputText;
  runInNewContext(code, {
    module: testModule,
    exports: testModule.exports,
    require: name => mocks[name],
    ...globals,
  });
  return testModule.exports;
}

test("analytics 503 responses are treated as optional-service outages", () => {
  const errors = [];
  const { reportAnalyticsError } = load(
    "lib/contexts/analytics.tsx",
    {
      "@lib/api": {
        get: () => Promise.resolve(),
        post: () => Promise.resolve(),
      },
      react: {
        createContext: () => ({ Provider: "provider" }),
        useEffect: () => {},
        useState: () => [{}, () => {}],
      },
      "react/jsx-runtime": { jsx: () => null },
    },
    "\nexport { reportAnalyticsError };",
    { console: { error: (...args) => errors.push(args) } }
  );

  reportAnalyticsError("analytics", { response: { status: 503 } });
  assert.equal(errors.length, 0);

  reportAnalyticsError("analytics", { response: { status: 500 } });
  assert.equal(errors.length, 1);
});

test("Tinybird view failures do not emit one warning per request", async () => {
  const warnings = [];
  let fetchCalls = 0;
  const { recordView } = load(
    "lib/tinybird.ts",
    {
      "next/server": {
        userAgent: () => ({
          ua: "test",
          browser: {},
          engine: {},
          os: {},
          device: {},
          cpu: {},
          isBot: false,
        }),
      },
      "./utils": {
        capitalize: value => value,
        getDomainWithoutWWW: value => value,
      },
    },
    "",
    {
      process: { env: { POST_TOKEN: "token", POST_VIEW: "view" } },
      fetch: async () => {
        fetchCalls++;
        return { ok: false, status: 503, json: async () => ({}) };
      },
      console: { warn: (...args) => warnings.push(args) },
    }
  );

  await recordView({
    nextUrl: { pathname: "/hansard" },
    headers: { get: () => null },
  });

  assert.equal(fetchCalls, 1);
  assert.equal(warnings.length, 0);
});

test("highlightKeyword does not render an extra mark after the final match", () => {
  const searchContext = {};
  const eventContext = {};
  const { highlightKeyword } = load(
    "data-catalogue/hansard/search/highlight.tsx",
    {
      "./context": {
        SearchContext: searchContext,
        SearchEventContext: eventContext,
      },
      "./match-text": {
        getMatchText: () => ({ slices: ["before", ""], matches: ["hit"] }),
      },
      remarkable: { Remarkable: class {} },
      "remarkable-react": class {},
      "@lib/helpers": { cn: (...values) => values.filter(Boolean).join(" ") },
      react: {
        useContext: context =>
          context === searchContext
            ? { activeId: "", searchValue: "hit" }
            : { onUpdateMatchList: () => {} },
        useEffect: () => {},
        useMemo: callback => callback(),
      },
      "react/jsx-runtime": {
        Fragment: "Fragment",
        jsx: (type, props) => ({ type, props }),
        jsxs: (type, props) => ({ type, props }),
      },
    }
  );

  const result = highlightKeyword("before hit", "speech");
  const children = result.props.children;
  const marks = children
    .flatMap(child => child.props.children)
    .filter(child => child && child.type === "mark");

  assert.equal(marks.length, 1);
  assert.equal(marks[0].props.children, "hit");
});

test("analytics API returns 503 when its credentials are unavailable", async () => {
  const { default: handler } = load(
    "pages/api/count.ts",
    {
      "@lib/api": {
        get: () => {
          throw new Error("GET should not run");
        },
        post: () => {
          throw new Error("POST should not run");
        },
      },
    },
    "",
    { process: { env: {} } }
  );

  const response = () => ({
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    setHeader() {},
    end() {},
  });

  const getResponse = response();
  await handler({ method: "GET", query: { id: "/hansard" } }, getResponse);
  assert.equal(getResponse.statusCode, 503);
  assert.equal(getResponse.body.message, "Analytics unavailable");

  const postResponse = response();
  await handler(
    { method: "POST", query: { event: "download" }, body: {} },
    postResponse
  );
  assert.equal(postResponse.statusCode, 503);
  assert.equal(postResponse.body.message, "Analytics unavailable");
});
