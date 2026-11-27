const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");

test("MP search names remove honorifics without stripping parts of words", () => {
  const source = readFileSync(
    resolve(__dirname, "../dashboards/home/excerpts/index.tsx"),
    "utf8"
  );
  const expression = source.match(/const formattedName = ([\s\S]*?);/)[1];
  for (const [name, expected] of [
    ["Tun Dr. Mahathir Mohamad", "Mahathir Mohamad"],
    ["Tunku Tuanku Sri Sari Ahmad", "Ahmad"],
    ["Yang Amat Berhormat Tan Sri Dato’ Haji Ahmad", "Ahmad"],
    ["Datuk Seri Dr. Wan Azizah", "Wan Azizah"],
    ["Datin Paduka Hajah Siti", "Siti"],
    ["YB Prof. Dr. Ahmad", "Ahmad"],
    ["Sarinah Datukman Tunkuish", "Sarinah Datukman Tunkuish"],
    [undefined, undefined],
  ]) {
    assert.equal(runInNewContext(expression, { name }), expected);
  }
});
