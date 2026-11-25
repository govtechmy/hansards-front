const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");
const ts = require("typescript");
const { PassThrough } = require("node:stream");

test("the locally served PDF worker matches the installed renderer", () => {
  assert.deepEqual(
    readFileSync(resolve(__dirname, "../public/pdf.worker.min.mjs")),
    readFileSync(require.resolve("pdfjs-dist/build/pdf.worker.min.mjs"))
  );
});

test("changing PDF pages scrolls only the PDF container", () => {
  const source = readFileSync(
    resolve(__dirname, "../data-catalogue/hansard/pdf-viewer.tsx"),
    "utf8"
  );
  assert.equal(source.includes("scrollIntoView"), false);
  assert.match(source, /viewer\.scrollTo\(/);
});

test("PDF viewer renders one page until View all is selected", () => {
  const source = readFileSync(
    resolve(__dirname, "../data-catalogue/hansard/pdf-viewer.tsx"),
    "utf8"
  );
  assert.match(source, /const \[showAll, setShowAll\] = useState\(false\)/);
  assert.match(source, /const pageNumbers = showAll/);
  assert.match(source, /pageNumbers\.map/);
  assert.match(source, /setShowAll\(value => !value\)/);
  assert.match(source, /disableAutoFetch: true/);
  assert.match(source, /disableStream: true/);
  assert.match(source, /export const prefetchPdfPage/);
  assert.match(source, /LazyPdfPage/);
});

test("split view prefetches the hash-linked PDF page", () => {
  const source = readFileSync(
    resolve(__dirname, "../data-catalogue/hansard/hansard.tsx"),
    "utf8"
  );
  assert.match(source, /import\("\.\/pdf-viewer"\)/);
  assert.match(source, /prefetchPdfPage\(filename, page, session\)/);
  assert.match(source, /requestIdleCallback/);
});

test("PDF session shares pending work and cancels it on disposal", async () => {
  const { createPdfSession } = load(
    "data-catalogue/hansard/pdf-session.ts",
    {}
  );
  let starts = 0;
  let destroys = 0;
  let resolvePdf;
  const promise = new Promise(resolve => {
    resolvePdf = resolve;
  });
  const session = createPdfSession();
  const start = () => {
    starts++;
    return {
      promise,
      destroy: async () => {
        destroys++;
      },
    };
  };
  const first = session.load(start);
  assert.equal(session.load(start), first);
  resolvePdf({ numPages: 183 });
  await first;
  assert.equal(session.load(start), first);
  assert.equal(starts, 1);
  session.dispose();
  assert.equal(destroys, 1);
  await assert.rejects(session.load(start), /closed/);
  const pending = createPdfSession();
  pending.load(() => ({
    promise: new Promise(() => {}),
    destroy: async () => {
      destroys++;
    },
  }));
  pending.dispose();
  assert.equal(destroys, 2);
});

test("a failed PDF load is released and reopening can retry", async () => {
  const { createPdfSession } = load(
    "data-catalogue/hansard/pdf-session.ts",
    {}
  );
  const session = createPdfSession();
  let destroyed = 0;
  await assert.rejects(
    session.load(() => ({
      promise: Promise.reject(new Error("Network failed")),
      destroy: async () => {
        destroyed++;
      },
    })),
    /Network failed/
  );
  assert.equal(destroyed, 1);
  const document = { numPages: 183 };
  assert.equal(
    await session.load(() => ({
      promise: Promise.resolve(document),
      destroy: async () => {},
    })),
    document
  );
  session.dispose();
});

test("PDF load errors direct users to the download action", () => {
  for (const locale of ["en-GB", "ms-MY"]) {
    const translations = readFileSync(
      resolve(__dirname, `../public/locales/${locale}/hansard.json`),
      "utf8"
    );
    assert.match(translations, /Download|Muat turun/);
    assert.doesNotMatch(translations, /link above|pautan di atas/);
  }
});

test("speech clicks preserve the inner transcript position", () => {
  const source = readFileSync(
    resolve(__dirname, "../data-catalogue/hansard/hansard.tsx"),
    "utf8"
  );
  assert.match(source, /const scrollTop = transcript\?\.scrollTop \?\? 0/);
  assert.match(source, /transcript\.scrollTop = scrollTop/);
});

test("search navigation scrolls the nearest overflow container", () => {
  const source = readFileSync(
    resolve(__dirname, "../data-catalogue/hansard/search/context.tsx"),
    "utf8"
  );
  assert.match(source, /window\.getComputedStyle\(parent\)/);
  assert.match(source, /parent\.scrollTo\(\{/);
});

function load(file, mocks) {
  const module = { exports: {} };
  const code = ts.transpileModule(
    readFileSync(resolve(__dirname, "..", file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
      },
    }
  ).outputText;
  runInNewContext(code, {
    module,
    exports: module.exports,
    require: name => mocks[name],
  });
  return module.exports;
}

test("PDF route rejects arbitrary paths and methods, and streams byte ranges", async () => {
  let call;
  const stream = new PassThrough();
  const axios = {
    get: async (...args) => {
      call = args;
      return {
        status: 206,
        headers: { "content-range": "bytes 0-3/100", "content-length": "4" },
        data: stream,
      };
    },
    isAxiosError: () => false,
  };
  const handler = load("pages/api/pdf.ts", {
    axios,
    "@lib/downloads": {
      buildDownloadPath: name => `https://storage.example/${name}.pdf`,
    },
  }).default;
  function response() {
    const res = new PassThrough();
    res.headers = {};
    res.setHeader = (key, value) => {
      res.headers[key] = value;
    };
    res.status = value => {
      res.statusCode = value;
      return res;
    };
    res.resume();
    return res;
  }
  for (const filename of [
    "../secret",
    "https://example.com/file",
    ["dr_2026-11-12"],
    undefined,
  ]) {
    const res = response();
    await handler({ method: "GET", query: { filename }, headers: {} }, res);
    assert.equal(res.statusCode, 400);
  }
  const rejected = response();
  await handler({ method: "POST", query: {}, headers: {} }, rejected);
  assert.equal(rejected.statusCode, 405);
  assert.equal(call, undefined);
  const res = response();
  await handler(
    {
      method: "GET",
      query: { filename: "dr_2026-11-12" },
      headers: { range: "bytes=0-3" },
    },
    res
  );
  assert.equal(call[1].headers.Range, "bytes=0-3");
  assert.equal(res.statusCode, 206);
  assert.equal(res.headers["content-range"], "bytes 0-3/100");
  assert.equal(res.headers["Accept-Ranges"], "bytes");
  assert.equal(res.headers["Content-Disposition"], "inline");
  stream.end("%PDF");
});

test("opening follows the hash and conversation clicks update the controlled PDF page", () => {
  const React = require("react");
  const updates = [];
  let resetCalls = 0;
  let desktop = true;
  let stateIndex = 0;
  const target = { closest: () => ({ dataset: { pdfPage: "62" } }) };
  const stub = new Proxy(
    {},
    { get: (_, name) => (name === "__esModule" ? true : String(name)) }
  );
  const mocks = new Proxy(
    {
      "react/jsx-runtime": require("react/jsx-runtime"),
      react: {
        ...React,
        useRef: () => ({ current: null }),
        useEffect: () => {},
        useContext: () => ({ onResetSearch: () => resetCalls++ }),
        useState: initial => {
          const index = stateIndex++;
          return [initial, value => updates.push([index, value])];
        },
      },
      "next/dynamic": { __esModule: true, default: () => "pdf-viewer" },
      "@hooks/useTranslation": { useTranslation: () => ({ t: key => key }) },
      "@hooks/useMediaQuery": { useMediaQuery: () => desktop },
      "@hooks/useAnalytics": { useAnalytics: () => ({ counts: {} }) },
      "@hooks/useDownload": { useDownload: () => ({}) },
      "@lib/helpers": {
        cn: (...values) => values.filter(Boolean).join(" "),
        numFormat: String,
      },
      "@lib/utils": {
        isSpeech: value => "speech" in value,
        isYDP: () => false,
        formatTimestamp: String,
      },
      "./search/context": {
        SearchEventContext: React.createContext({
          onResetSearch: () => resetCalls++,
        }),
      },
      "./search/highlight": {
        highlightKeyword: text => text,
        highlightKeywordMarkdown: text => text,
      },
    },
    { get: (values, name) => values[name] ?? stub }
  );
  const source = readFileSync(
    resolve(__dirname, "../data-catalogue/hansard/hansard.tsx"),
    "utf8"
  );
  const module = { exports: {} };
  runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    {
      module,
      exports: module.exports,
      require: name => mocks[name],
      process,
      window: { scrollY: 100, location: { hash: "#308" } },
      document: { getElementById: id => (id === "308" ? target : null) },
      requestAnimationFrame: () => {},
    }
  );
  const root = module.exports.default({
    cycle: { house: 0 },
    date: "2026-11-12",
    filename: "dr_2026-11-12",
    speeches: [
      {
        speech: "intro",
        author: "Member",
        timestamp: 0,
        index: 307,
        pdf_page_start: 61,
      },
      {
        Section: [
          {
            speech: "text",
            author: "Member",
            timestamp: 0,
            index: 308,
            pdf_page_start: 62,
          },
        ],
      },
    ],
  });
  const nodes = [];
  function visit(node) {
    if (!React.isValidElement(node)) return;
    nodes.push(node);
    React.Children.forEach(node.props.children, visit);
  }
  visit(root.props.children(true));
  nodes
    .find(node => node.props["aria-controls"] === "hansard-pdf")
    .props.onClick();
  assert.deepEqual(updates, [
    [1, 62],
    [0, true],
  ]);
  assert.equal(resetCalls, 1);
  const transcript = nodes.find(
    node => node.type === "div" && node.props.onClick
  );
  transcript.props.onClick({
    target: { closest: () => ({ dataset: { pdfPage: "75" } }) },
  });
  assert.deepEqual(updates.at(-1), [1, 75]);

  desktop = false;
  nodes.length = 0;
  const mobileRoot = module.exports.default({
    cycle: { house: 0 },
    date: "2026-11-12",
    filename: "dr_2026-11-12",
    speeches: [],
  });
  visit(mobileRoot.props.children(true));
  assert.equal(
    nodes.some(node => node.props["aria-controls"] === "hansard-pdf"),
    false
  );
  assert.equal(
    nodes.some(node => node.type === "pdf-viewer"),
    false
  );
});
