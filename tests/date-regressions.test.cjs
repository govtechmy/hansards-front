const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");
const React = require("react");
const ts = require("typescript");
const { format } = require("date-fns");

process.env.TZ = "Asia/Kuala_Lumpur";

function load(file, mocks) {
  const testModule = { exports: {} };
  const code = ts.transpileModule(
    readFileSync(resolve(__dirname, "..", file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }
  ).outputText;
  runInNewContext(code, {
    module: testModule,
    exports: testModule.exports,
    console,
    require: name => (name in mocks ? mocks[name] : require(name)),
  });
  return testModule.exports;
}

function findAll(node, type) {
  if (!React.isValidElement(node)) return [];
  if (node.type === type) return [node.props];
  return React.Children.toArray(node.props.children).flatMap(child =>
    findAll(child, type)
  );
}

test("opening refreshes dates after external selection, without a button click", () => {
  const state = [];
  let cursor = 0;
  const { default: Daterange } = load("components/Daterange/index.tsx", {
    react: {
      ...React,
      useState(initial) {
        const index = cursor++;
        if (!(index in state)) state[index] = initial;
        return [
          state[index],
          value => {
            state[index] =
              typeof value === "function" ? value(state[index]) : value;
          },
        ];
      },
    },
    "@components/Calendar": { __esModule: true, default: "calendar" },
    "@headlessui/react": {
      Popover: Object.assign(() => null, { Button: "trigger", Panel: "panel" }),
      Transition: "transition",
    },
    "@lib/helpers": { cn: (...values) => values.filter(Boolean).join(" ") },
    "next-i18next": {
      useTranslation: () => ({ t: key => key, i18n: { language: "ms" } }),
    },
  });
  let selected;
  function render(numberOfMonths = 2) {
    cursor = 0;
    return Daterange({
      selected,
      numberOfMonths,
      onChange: range => {
        selected = range;
      },
    });
  }
  function open(numberOfMonths = 2) {
    findAll(render(numberOfMonths), "transition")[0].beforeEnter();
    return render(numberOfMonths);
  }
  const dates = tree => findAll(tree, "input").map(input => input.value);
  const months = tree =>
    findAll(tree, "calendar").map(panel =>
      format(panel.defaultMonth, "yyyy-MM")
    );

  render();
  selected = { from: new Date(1990, 0, 1), to: new Date(1991, 11, 31) };
  let tree = open();
  assert.deepEqual(dates(tree), ["1990-01-01", "1991-12-31"]);
  assert.deepEqual(months(tree), ["1990-01", "1991-12"]);
  assert.ok(
    findAll(tree, "calendar").every(panel => panel.selected === selected)
  );

  findAll(tree, "calendar")[1].onSelect({
    from: new Date(1989, 0, 1),
    to: new Date(1989, 1, 20),
  });
  assert.deepEqual(dates(open()), ["1989-01-01", "1989-02-20"]);

  tree = open(1);
  assert.deepEqual(months(tree), ["1989-01"]);

  findAll(tree, "input")[0].onChange({ target: { value: "1950-01-01" } });
  assert.ok(
    findAll(render(1), "p").some(p => p.children === "choose_later_date")
  );
  tree = open(1);
  assert.deepEqual(dates(tree), ["", ""]);
  assert.ok(findAll(tree, "p").every(p => p.children === ""));

  selected = { from: new Date(1990, 11, 31) };
  assert.deepEqual(months(open()), ["1990-12", "1991-01"]);
  selected = undefined;
  assert.deepEqual(dates(open()), ["", ""]);
});

test("MP requests use the archive start while preserving explicit dates and group defaults", async () => {
  const calls = [];
  const { getServerSideProps } = load("pages/cari-mp/index.tsx", {
    "@components/Metadata": {},
    "@dashboards/home/layout": {},
    "@dashboards/home/mp": {},
    "@lib/decorators": { withi18n: (_, handler) => handler },
    "@lib/api": {
      get: async (route, params) => {
        calls.push({ route, params });
        return { data: { top_word_freq: { tamil: 24 } } };
      },
    },
  });
  const cases = [
    [{ uid: "22011", dewan: "semua" }, "1959-08-11"],
    [
      { uid: "22011", tarikh_mula: "1987-01-01", tarikh_akhir: "1991-12-31" },
      "1987-01-01",
    ],
    [{ dewan: "semua" }, undefined],
    [{ dewan: "semua", tarikh_mula: "2020-01-01" }, "2020-01-01"],
  ];
  for (const [query, startDate] of cases) {
    calls.length = 0;
    const result = await getServerSideProps({ query });
    const searches = calls.filter(call => call.route.startsWith("api/search"));
    assert.equal(searches.length, 2);
    for (const { params } of searches) {
      assert.equal(params.start_date, startDate);
      assert.equal(params.end_date, query.tarikh_akhir);
      assert.equal(params.uid, query.uid);
    }
    assert.equal(result.props.top_word_freq.tamil, 24);
  }
});
