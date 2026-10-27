const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");
const source = fs.readFileSync(path.join(__dirname, "code.js"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "ui.html"), "utf8");
const uiSource = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const mixed = Symbol("mixed");
const CHANNEL = "alpas-readonly-inspector";
const VERSION = "1.0.1";
const rgb = { r: 254 / 255, g: 215 / 255, b: 170 / 255 };
function node(id, properties = {}) {
  return {
    id,
    name: `Layer ${id}`,
    type: "FRAME",
    x: 0,
    y: 0,
    width: 319,
    height: 40,
    visible: true,
    opacity: 1,
    rotation: 0,
    layoutMode: "NONE",
    cornerRadius: 4,
    fills: [{ type: "SOLID", color: rgb, opacity: 1 }],
    strokes: [],
    absoluteBoundingBox: { x: 0, y: 0, width: 319, height: 40 },
    ...properties,
  };
}
function freeze(value, visited = new WeakSet()) {
  if (!value || typeof value !== "object" || visited.has(value)) return value;
  visited.add(value);
  for (const key of Object.keys(value)) freeze(value[key], visited);
  return Object.freeze(value);
}
function harness(selection = [], hooks = {}) {
  const messages = [],
    callbacks = {},
    timers = [];
  let page;
  const attach = (n, parent) => {
    n.parent = parent;
    (n.children || []).forEach((child) => attach(child, n));
  };
  const setSelection = (selected, name = "02Components") => {
    page = { id: "29:2", name, type: "PAGE", selection: selected };
    selected.forEach((n) => attach(n, page));
    freeze(page);
  };
  setSelection(selection);
  let shown;
  const allowed = {
    mixed,
    get currentPage() {
      return page;
    },
    ui: { postMessage: (message) => messages.push(JSON.parse(JSON.stringify(message))) },
    showUI: (_, options) => {
      shown = options;
      hooks.onShowUI?.(allowed.ui);
    },
    on: (event, callback) => {
      callbacks[event] = callback;
    },
  };
  const unexpected = [];
  const figma = new Proxy(allowed, {
    get(target, key) {
      if (!(key in target)) {
        unexpected.push(key);
        throw new Error(`Forbidden Figma API ${key}`);
      }
      return target[key];
    },
    set(_, key) {
      unexpected.push(key);
      throw new Error(`Forbidden Figma write ${key}`);
    },
  });
  vm.runInNewContext(source, {
    figma,
    __html__: html,
    setTimeout: (callback) => {
      timers.push(callback);
      return timers.length;
    },
    clearTimeout: (id) => {
      timers[id - 1] = null;
    },
  });
  return {
    messages,
    callbacks,
    unexpected,
    shown,
    setSelection,
    inspect: (options = {}) => {
      allowed.ui.onmessage({ channel: CHANNEL, type: "inspect", ...options });
      return messages.at(-1).data;
    },
    message: (message) => allowed.ui.onmessage(message),
    flush: () => {
      timers.splice(0).forEach((callback) => {
        if (callback) callback();
      });
    },
  };
}
function text(id, properties = {}) {
  return node(id, {
    type: "TEXT",
    characters: "대출일",
    fontSize: 14,
    fontName: { family: "Noto Sans KR", style: "Regular" },
    fontWeight: 400,
    lineHeight: { unit: "AUTO" },
    letterSpacing: { unit: "PERCENT", value: 0 },
    getStyledTextSegments: () => [
      {
        start: 0,
        end: 3,
        characters: "대출일",
        fontSize: 14,
        fontName: { family: "Noto Sans KR", style: "Regular" },
        fontWeight: 400,
        lineHeight: { unit: "AUTO" },
        fills: [{ type: "SOLID", color: rgb }],
      },
    ],
    ...properties,
  });
}

test("startup handshake and empty selection", () => {
  const h = harness();
  assert.equal(h.messages.length, 1);
  assert.equal(h.messages[0].channel, CHANNEL);
  assert.equal(h.messages[0].version, VERSION);
  const data = h.inspect();
  assert.equal(data.nodes.length, 0);
  assert.equal(data.page.name, "02Components");
  assert.equal(h.shown.width, 520);
});
test("reads current instance and descendant text without a write", () => {
  const h = harness([node("1", { children: [text("2")] })]);
  const data = h.inspect();
  assert.equal(data.nodes.length, 2);
  assert.equal(data.nodes[0].geometry.width, 319);
  assert.equal(data.nodes[1].text.fontSize, 14);
  assert.equal(data.nodes[1].text.lineHeight.unit, "AUTO");
  assert.equal(data.nodes[1].path, "02Components / Layer 1 / Layer 2");
  assert.deepEqual(data.warnings, []);
  assert.deepEqual(h.unexpected, []);
  assert.equal(data.readOnly, true);
});
test("preserves exact fractional units and solid color/alpha", () => {
  const n = node("1", { width: 319.125, opacity: 0.5 });
  const record = harness([n]).inspect().nodes[0];
  assert.equal(record.geometry.width, 319.125);
  assert.equal(record.appearance.fills[0].hex, "#FED7AA");
  assert.equal(record.appearance.opacity, 0.5);
  assert.equal(record.appearance.fills[0].opacity, 1);
});
test("NONE layout never claims stale padding as active padding", () => {
  const data = harness([node("1", { paddingLeft: 20, itemSpacing: 8 })]).inspect();
  assert.deepEqual(data.nodes[0].autoLayout, { layoutMode: "NONE" });
});
test("auto-layout includes real padding, gap, alignments and sizing", () => {
  const data = harness([
    node("1", {
      layoutMode: "HORIZONTAL",
      paddingLeft: 12,
      paddingTop: 6,
      paddingRight: 8,
      paddingBottom: 6,
      itemSpacing: 4,
      primaryAxisAlignItems: "CENTER",
      layoutSizingHorizontal: "HUG",
    }),
  ]).inspect();
  assert.equal(data.nodes[0].autoLayout.itemSpacing, 4);
  assert.equal(data.nodes[0].autoLayout.paddingLeft, 12);
  assert.equal(data.nodes[0].sizing.layoutSizingHorizontal, "HUG");
});
test("mixed text retains per-range styles", () => {
  const data = harness([
    text("1", {
      fontSize: mixed,
      fontName: mixed,
      getStyledTextSegments: () => [
        { start: 0, end: 1, characters: "A", fontSize: 12, fills: [] },
        { start: 1, end: 2, characters: "B", fontSize: 14, fills: [] },
      ],
    }),
  ]).inspect();
  assert.equal(data.nodes[0].text.fontSize, "MIXED");
  assert.deepEqual(
    data.nodes[0].text.runs.map((run) => run.fontSize),
    [12, 14],
  );
});
test("hidden subtree is opt-in; explicitly selected hidden root remains inspectable", () => {
  const h = harness([
    node("1", { children: [node("2", { visible: false, children: [text("3")] })] }),
  ]);
  assert.equal(h.inspect().nodes.length, 1);
  const data = h.inspect({ hidden: true });
  assert.equal(data.nodes.length, 3);
  assert.equal(data.nodes[2].effectiveVisible, false);
  assert.equal(harness([node("hidden", { visible: false })]).inspect().nodes.length, 1);
});
test("turning off descendants limits reading to the root", () => {
  assert.equal(
    harness([node("1", { children: [text("2")] })]).inspect({ children: false }).nodes.length,
    1,
  );
});
test("large tree limit is explicit", () => {
  const data = harness([
    node("root", { children: Array.from({ length: 1000 }, (_, i) => node(`n${i}`)) }),
  ]).inspect();
  assert.equal(data.nodes.length, 500);
  assert.match(data.warnings.join(" "), /500/);
});
test("deep tree limit is explicit", () => {
  let n = node("last");
  for (let i = 0; i < 30; i++) n = node(`n${i}`, { children: [n] });
  const data = harness([n]).inspect();
  assert.equal(data.nodes.length, 21);
  assert.match(data.warnings.join(" "), /20단계/);
});
test("long text is bounded and warning is exported", () => {
  const data = harness([
    text("1", {
      characters: "가".repeat(21000),
      getStyledTextSegments: (fields, start, end) => {
        assert.equal(end, 20000);
        return [];
      },
    }),
  ]).inspect();
  assert.equal(data.nodes[0].text.characters.length, 20000);
  assert.equal(data.nodes[0].text.truncated, true);
  assert.equal(data.nodes[0].text.characterCount, 21000);
});
test("two selections report axis-aligned gaps, not synthetic padding", () => {
  const a = node("1", { absoluteBoundingBox: { x: 10, y: 20, width: 100, height: 32 } });
  const b = node("2", { absoluteBoundingBox: { x: 118, y: 20, width: 60, height: 32 } });
  const pair = harness([a, b]).inspect().pair;
  assert.equal(pair.horizontalGap, 8);
  assert.equal(pair.verticalGap, 0);
  assert.equal(pair.overlapHeight, 32);
  assert.equal(pair.centerDeltaY, 0);
});
test("selection/page events debounce into a fresh snapshot", () => {
  const h = harness([node("1")]);
  h.setSelection([node("new-frame")], "03Layout");
  h.callbacks.selectionchange();
  h.callbacks.currentpagechange();
  h.flush();
  assert.equal(h.messages.length, 2);
  assert.equal(h.messages[1].data.selection[0].id, "new-frame");
  assert.equal(h.messages[1].data.page.name, "03Layout");
});
test("unsupported messages and malformed options are ignored", () => {
  const h = harness([node("1")]);
  h.message({ type: "delete", id: "1" });
  h.message(null);
  h.message({ type: "inspect" });
  h.message({ channel: "unrelated-plugin", type: "inspect" });
  assert.equal(h.messages.length, 1);
  assert.equal(h.inspect({ children: "no" }).options.children, true);
});
test("manifest denies network and plugin entrypoints exist", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "manifest.json"), "utf8"));
  assert.deepEqual(manifest.networkAccess.allowedDomains, ["none"]);
  assert.equal(manifest.documentAccess, "dynamic-page");
  for (const key of ["main", "ui"]) assert.ok(fs.existsSync(path.join(__dirname, manifest[key])));
  assert.doesNotMatch(source, /\b(fetch|XMLHttpRequest|WebSocket)\s*\(/);
  assert.doesNotMatch(
    source,
    /\b(setPluginData|setRelaunchData|remove|appendChild|resize|createFrame|createText)\s*\(/,
  );
});

// UI contract tests use a deliberately tiny DOM double, not a real browser renderer.
function uiHarness(clipboard, onPost) {
  const messages = [],
    handlers = {},
    elements = new Map();
  const timers = new Map();
  let nextTimer = 0;
  function el(tag = "div") {
    return {
      tag,
      children: [],
      listeners: {},
      value: "",
      disabled: false,
      append(...children) {
        this.children.push(...children);
      },
      replaceChildren(...children) {
        this.children = children;
      },
      addEventListener(event, fn) {
        this.listeners[event] = fn;
      },
      focus() {
        this.focused = true;
      },
      select() {
        this.selected = true;
      },
      click() {},
      remove() {},
    };
  }
  for (const id of [
    "children",
    "hidden",
    "status",
    "warnings",
    "format",
    "copy",
    "save",
    "refresh",
    "copy-status",
    "raw",
    "output",
    "pair",
    "nodes",
  ])
    elements.set(id, el());
  elements.get("children").checked = true;
  elements.get("hidden").checked = false;
  elements.get("format").value = "json";
  const parent = {
    postMessage: (message) => {
      messages.push(message);
      onPost?.(message.pluginMessage);
    },
  };
  const context = {
    parent,
    navigator: { clipboard },
    document: {
      getElementById: (id) => elements.get(id),
      createElement: el,
      body: el("body"),
      execCommand: () => false,
    },
    window: {
      addEventListener: (event, fn) => {
        handlers[event] = fn;
      },
    },
    Blob,
    URL,
    setTimeout: (fn) => {
      timers.set(++nextTimer, fn);
      return nextTimer;
    },
    clearTimeout: (id) => timers.delete(id),
  };
  vm.runInNewContext(uiSource, context);
  return {
    elements,
    messages,
    send: (data, source = parent) =>
      handlers.message({
        source,
        data: { pluginMessage: { channel: CHANNEL, version: VERSION, type: "snapshot", data } },
      }),
    error: () =>
      handlers.message({
        source: parent,
        data: {
          pluginMessage: {
            channel: CHANNEL,
            version: VERSION,
            type: "error",
            message: "test failure",
          },
        },
      }),
    receive: (message) => handlers.message({ source: null, data: { pluginMessage: message } }),
    flush: () => {
      const pending = [...timers.values()];
      timers.clear();
      pending.forEach((fn) => fn());
    },
    fire: (id, event = "click") => elements.get(id).listeners[event](),
  };
}
test("UI handshake, render and summary preserve text safely", () => {
  const ui = uiHarness();
  assert.equal(ui.messages[0].pluginMessage.type, "inspect");
  const data = harness([text("1", { name: "<img onerror=alert(1)>" })]).inspect();
  ui.send(data);
  assert.equal(ui.elements.get("nodes").children.length, 1);
  assert.equal(ui.elements.get("copy").disabled, false);
  ui.elements.get("format").value = "summary";
  ui.fire("format", "change");
  assert.match(ui.elements.get("output").value, /fontSize: 14px/);
  assert.match(ui.elements.get("output").value, /<img onerror=alert\(1\)>/);
  assert.doesNotMatch(uiSource, /innerHTML|insertAdjacentHTML/);
});
test("UI copy success reports the exact copied JSON", async () => {
  let copied;
  const ui = uiHarness({
    writeText: async (text) => {
      copied = text;
    },
  });
  ui.send(harness([node("1")]).inspect());
  await ui.fire("copy");
  assert.equal(JSON.parse(copied).schema, "alpas-figma-inspector/v1");
  assert.match(ui.elements.get("copy-status").textContent, /복사했습니다/);
});
test("UI denied clipboard offers manual copy and never claims success", async () => {
  const ui = uiHarness({
    writeText: async () => {
      throw new Error("denied");
    },
  });
  ui.send(harness([node("1")]).inspect());
  await ui.fire("copy");
  assert.equal(ui.elements.get("raw").open, true);
  assert.equal(ui.elements.get("output").selected, true);
  assert.match(ui.elements.get("copy-status").textContent, /Ctrl\+C/);
});
test("UI error clears stale measurements and disables export", () => {
  const ui = uiHarness();
  ui.send(harness([node("1")]).inspect());
  ui.error();
  assert.equal(ui.elements.get("output").value, "");
  assert.equal(ui.elements.get("copy").disabled, true);
  assert.equal(ui.elements.get("nodes").children.length, 0);
});
test("gradient metadata and per-corner radii remain distinct", () => {
  const data = harness([
    node("1", {
      cornerRadius: mixed,
      topLeftRadius: 2,
      topRightRadius: 4,
      bottomRightRadius: 6,
      bottomLeftRadius: 8,
      fills: [
        {
          type: "GRADIENT_LINEAR",
          gradientStops: [{ position: 0, color: { r: 1, g: 0, b: 0, a: 0.5 } }],
          gradientTransform: [
            [1, 0, 0],
            [0, 1, 0],
          ],
          opacity: 0.7,
        },
      ],
    }),
  ]).inspect();
  assert.equal(data.nodes[0].appearance.cornerRadius, "MIXED");
  assert.equal(data.nodes[0].appearance.bottomLeftRadius, 8);
  assert.equal(data.nodes[0].appearance.fills[0].gradientStops[0].color.a, 0.5);
});
test("text range errors are explicit, not a false complete export", () => {
  const data = harness([
    text("1", {
      getStyledTextSegments: () => {
        throw new Error("range unavailable");
      },
    }),
  ]).inspect();
  assert.equal(data.nodes[0].text.runsError, "range unavailable");
  assert.ok(data.warnings.length);
});
test("empty text does not request an invalid zero-length range", () => {
  const data = harness([
    text("1", {
      characters: "",
      getStyledTextSegments: () => {
        throw new Error("must not call");
      },
    }),
  ]).inspect();
  assert.deepEqual(data.nodes[0].text.runs, []);
  assert.deepEqual(data.warnings, []);
});
test("UI empty selection removes stale data and disables export", () => {
  const ui = uiHarness();
  ui.send(harness([node("1")]).inspect());
  ui.send(harness().inspect());
  assert.equal(ui.elements.get("nodes").children.length, 0);
  assert.equal(ui.elements.get("copy").disabled, true);
  assert.equal(ui.elements.get("save").disabled, true);
});
test("UI file save requests a JSON download", () => {
  const ui = uiHarness();
  ui.send(harness([node("1")]).inspect());
  ui.fire("save");
  assert.match(ui.elements.get("copy-status").textContent, /다운로드를 요청/);
  ui.flush();
});

test("UI accepts a plugin snapshot delivered without a parent WindowProxy source", () => {
  const ui = uiHarness();
  ui.send(harness([node("selected-frame")]).inspect(), null);
  assert.equal(ui.elements.get("nodes").children.length, 1);
  assert.match(ui.elements.get("status").textContent, /선택 1개/);
});

test("core publishes the already selected frame without waiting for an initial UI request", () => {
  const h = harness([node("selected-frame")]);
  assert.equal(h.messages[0]?.data.selection[0].id, "selected-frame");
});

test("core installs the request listener before the UI can request inspection", () => {
  const h = harness([node("preselected")], {
    onShowUI: (ui) => {
      assert.equal(typeof ui.onmessage, "function");
      ui.onmessage({ channel: CHANNEL, type: "inspect", children: false });
    },
  });
  assert.equal(h.messages.length, 2);
  assert.equal(h.messages[0].data.options.children, false);
});

test("UI accepts bridge delivery with a different source object", () => {
  const ui = uiHarness();
  ui.send(harness([node("frame")]).inspect(), {});
  ui.flush();
  assert.match(ui.elements.get("status").textContent, /선택 1개/);
});

test("UI distinguishes no reply from an empty selection and supports retry", () => {
  const ui = uiHarness();
  assert.match(ui.elements.get("status").textContent, /읽는 중/);
  ui.flush();
  assert.match(ui.elements.get("status").textContent, /응답 없음/);
  assert.equal(ui.elements.get("copy").disabled, true);
  ui.fire("refresh");
  assert.equal(ui.messages.length, 2);
  ui.send(harness().inspect());
  ui.flush();
  assert.match(ui.elements.get("status").textContent, /연결됨 · 선택 0개/);
});

test("unrelated messages do not cancel the connection timeout", () => {
  const ui = uiHarness();
  ui.receive(null);
  ui.receive({
    channel: "other-plugin",
    type: "snapshot",
    data: harness([node("fake")]).inspect(),
  });
  ui.receive({ channel: CHANNEL, type: "unrelated" });
  ui.flush();
  assert.equal(ui.elements.get("nodes").children.length, 0);
  assert.match(ui.elements.get("status").textContent, /응답 없음/);
});

test("invalid snapshots and rendering failures clear stale measurements", () => {
  const ui = uiHarness();
  ui.send(harness([node("1")]).inspect());
  ui.send({ schema: "wrong" });
  assert.match(ui.elements.get("status").textContent, /표시 실패/);
  assert.equal(ui.elements.get("copy").disabled, true);
  const broken = harness([node("2")]).inspect();
  delete broken.nodes[0].geometry;
  assert.doesNotThrow(() => ui.send(broken));
  assert.equal(ui.elements.get("output").value, "");
  assert.equal(ui.elements.get("nodes").children.length, 0);
  assert.match(ui.elements.get("status").textContent, /표시 실패/);
});

test("mismatched plugin files surface a version error instead of selection guidance", () => {
  const ui = uiHarness();
  ui.receive({ channel: CHANNEL, version: "0.0.0", type: "snapshot", data: harness().inspect() });
  assert.match(ui.elements.get("status").textContent, /버전이 다릅니다/);
  ui.flush();
  assert.match(ui.elements.get("status").textContent, /버전이 다릅니다/);
});

test("manual refresh clears stale data before waiting for a new snapshot", () => {
  const ui = uiHarness();
  ui.send(harness([node("old")]).inspect());
  ui.fire("refresh");
  assert.equal(ui.elements.get("nodes").children.length, 0);
  assert.equal(ui.elements.get("output").value, "");
  assert.equal(ui.elements.get("save").disabled, true);
  ui.flush();
  ui.send(harness([node("fresh")]).inspect());
  assert.match(ui.elements.get("output").value, /fresh/);
});

test("core and UI integrate through queued startup, selection change and refresh", () => {
  const core = harness([node("first")]);
  const ui = uiHarness(undefined, (message) => core.message(message));
  const deliver = () => core.messages.splice(0).forEach((message) => ui.receive(message));
  deliver();
  ui.flush();
  assert.match(ui.elements.get("output").value, /first/);
  core.setSelection([node("second", { width: 132, children: [text("label")] })], "03Layout");
  core.callbacks.selectionchange();
  core.flush();
  deliver();
  assert.match(ui.elements.get("status").textContent, /03Layout · 선택 1개 · 읽은 레이어 2개/);
  assert.equal(JSON.parse(ui.elements.get("output").value).nodes[0].geometry.width, 132);
  ui.elements.get("children").checked = false;
  ui.fire("children", "change");
  deliver();
  ui.flush();
  assert.equal(JSON.parse(ui.elements.get("output").value).nodes.length, 1);
  core.setSelection([]);
  core.callbacks.selectionchange();
  core.flush();
  deliver();
  assert.match(ui.elements.get("status").textContent, /선택 0개/);
  assert.equal(ui.elements.get("nodes").children.length, 0);
  assert.deepEqual(core.unexpected, []);
});
