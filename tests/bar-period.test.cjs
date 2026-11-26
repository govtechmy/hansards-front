const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");
const ts = require("typescript");
const { format } = require("date-fns");

// `barPeriod` membina tarikh dalam waktu tempatan dengan sengaja, jadi zon
// waktu mesti ditetapkan supaya ujian tidak bergantung pada mesin yang
// menjalankannya.
process.env.TZ = "Asia/Kuala_Lumpur";

function loadBarPeriod() {
  const testModule = { exports: {} };
  const code = ts.transpileModule(
    readFileSync(resolve(__dirname, "../lib/bar-period.ts"), "utf8"),
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
    require,
  });
  return testModule.exports;
}

const ymd = d => format(d, "yyyy-MM-dd");

test("barPeriod maps a monthly label to the whole month", () => {
  const { barPeriod } = loadBarPeriod();

  const march = barPeriod("2024-03");
  assert.equal(ymd(march.from), "2024-03-01");
  assert.equal(ymd(march.to), "2024-03-31");

  // 30-hari, supaya hujung bulan bukan sekadar 31 yang dipukul rata
  const april = barPeriod("2024-04");
  assert.equal(ymd(april.to), "2024-04-30");
});

test("barPeriod handles February in leap and common years", () => {
  const { barPeriod } = loadBarPeriod();

  assert.equal(ymd(barPeriod("2024-02").to), "2024-02-29");
  assert.equal(ymd(barPeriod("2023-02").to), "2023-02-28");
  // Tahun abad: dibahagi 100 tetapi bukan 400, jadi bukan tahun lompat
  assert.equal(ymd(barPeriod("1900-02").to), "1900-02-28");
  assert.equal(ymd(barPeriod("2000-02").to), "2000-02-29");
});

test("barPeriod maps a daily label to that single day", () => {
  const { barPeriod } = loadBarPeriod();

  const day = barPeriod("2024-03-15");
  assert.equal(ymd(day.from), "2024-03-15");
  assert.equal(ymd(day.to), "2024-03-15");

  // 29 Feb sah dalam tahun lompat
  assert.equal(ymd(barPeriod("2024-02-29").from), "2024-02-29");
});

test("barPeriod rejects dates that do not exist", () => {
  const { barPeriod } = loadBarPeriod();

  // Tanpa pengawal `getDate`, Date melimpah ke bulan berikutnya
  assert.equal(barPeriod("2024-02-31"), null);
  assert.equal(barPeriod("2023-02-29"), null);
  assert.equal(barPeriod("2024-04-31"), null);

  // Tanpa pengawal `getMonth`, bulan ini melimpah ke tahun jiran
  assert.equal(barPeriod("2024-13"), null);
  assert.equal(barPeriod("2024-00"), null);
});

test("barPeriod rejects labels that are not a recognised date", () => {
  const { barPeriod } = loadBarPeriod();

  // Bentuk hampir betul: bilangan digit mesti tepat
  assert.equal(barPeriod("2024"), null);
  assert.equal(barPeriod("2024-3"), null);
  assert.equal(barPeriod("2024-03-1"), null);
  assert.equal(barPeriod("2024-03-15T00:00:00"), null);
  assert.equal(barPeriod(""), null);
  assert.equal(barPeriod("tiada"), null);

  // Bentuk Mock API lama ialah milisaat epoch. Versi awal menerimanya, jadi
  // ujian ini merakam dengan sengaja bahawa ia kini ditolak.
  assert.equal(barPeriod(1710460800000), null);
  assert.equal(barPeriod(null), null);
  assert.equal(barPeriod(undefined), null);
  assert.equal(barPeriod(["2024-03"]), null);
});

test("isMonthlySeries reads the shape of the first label", () => {
  const { isMonthlySeries } = loadBarPeriod();

  assert.equal(isMonthlySeries(["2024-01", "2024-02", "2024-03"]), true);
  assert.equal(isMonthlySeries(["2024-01-01", "2024-01-02"]), false);

  // Siri kosong atau label bukan rentetan tidak boleh melemparkan ralat:
  // carta memanggilnya pada setiap render, termasuk keadaan tiada hasil.
  assert.equal(isMonthlySeries([]), false);
  assert.equal(isMonthlySeries([1710460800000]), false);
  assert.equal(isMonthlySeries([null]), false);
});
