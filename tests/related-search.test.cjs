const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { runInNewContext } = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

function loadRelatedSearch() {
  const testModule = { exports: {} };
  const code = ts.transpileModule(
    readFileSync(resolve(__dirname, "../lib/related-search.ts"), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }
  ).outputText;
  runInNewContext(code, {
    module: testModule,
    exports: testModule.exports,
    require: () => ({}),
  });
  return testModule.exports;
}

test("related-search rules protect exact and special query syntax", () => {
  const { buildRelatedSearch, suggestableQuery } = loadRelatedSearch();

  assert.equal(suggestableQuery("  minyak  ", false), "minyak");
  assert.equal(suggestableQuery('"minyak masak"', false), null);
  assert.equal(suggestableQuery("minyak:Ali", false), null);
  assert.equal(suggestableQuery(["minyak"], false), null);
  assert.equal(suggestableQuery("minyak", true), null);
  assert.equal(suggestableQuery("x".repeat(201), false), null);

  const related = buildRelatedSearch("minyakk", "minyak", false);
  assert.equal(related.original, "minyakk");
  assert.equal(related.corrected, "minyak");
  assert.equal(buildRelatedSearch("Minyak", "minyak", false), null);
  assert.equal(buildRelatedSearch("minyakk", null, false), null);
  assert.equal(buildRelatedSearch("minyakk", "minyak", true), null);
});
