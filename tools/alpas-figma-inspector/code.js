/* ALPAS Inspector: reads the current selection only. No document setters or network. */
(() => {
  "use strict";
  const CHANNEL = "alpas-readonly-inspector";
  const VERSION = "1.0.1";
  const MAX_NODES = 500;
  const MAX_DEPTH = 20;
  const MAX_TEXT = 20000;
  let options = { children: true, hidden: false };
  let timer;

  function plain(value, depth = 0) {
    if (value === figma.mixed || typeof value === "symbol") return "MIXED";
    if (value === null || ["string", "boolean", "number"].includes(typeof value)) return value;
    if (depth > 12 || value === undefined || typeof value === "function") return undefined;
    if (Array.isArray(value)) return value.map((item) => plain(item, depth + 1));
    const result = {};
    for (const key of Object.keys(value)) {
      const item = plain(value[key], depth + 1);
      if (item !== undefined) result[key] = item;
    }
    return result;
  }

  function read(node, keys) {
    const result = {};
    for (const key of keys) {
      if (key in node) {
        const value = plain(node[key]);
        if (value !== undefined) result[key] = value;
      }
    }
    return result;
  }

  function hex(color) {
    return (
      "#" +
      ["r", "g", "b"]
        .map((key) =>
          Math.round(Math.max(0, Math.min(1, color[key])) * 255)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")
        .toUpperCase()
    );
  }

  function paints(value) {
    if (!Array.isArray(value)) return plain(value);
    return value.map((paint) => {
      const result = read(paint, ["type", "visible", "opacity", "blendMode", "boundVariables"]);
      if (paint.type === "SOLID") {
        result.hex = hex(paint.color);
        result.color = plain(paint.color);
      } else if (paint.type.startsWith("GRADIENT")) {
        result.gradientStops = paint.gradientStops.map((stop) => ({
          position: stop.position,
          hex: hex(stop.color),
          color: plain(stop.color),
        }));
        result.gradientTransform = plain(paint.gradientTransform);
      } else if (paint.type === "IMAGE") {
        Object.assign(result, read(paint, ["scaleMode", "imageTransform", "scalingFactor"]));
        result.note = "이미지 데이터는 내보내지 않습니다.";
      }
      return result;
    });
  }

  function pathOf(node) {
    const names = [];
    let current = node;
    while (current && current.type !== "DOCUMENT") {
      names.unshift(current.name);
      current = current.parent;
    }
    return names.join(" / ");
  }

  function isVisible(node) {
    let current = node;
    while (current && current.type !== "DOCUMENT") {
      if ("visible" in current && !current.visible) return false;
      current = current.parent;
    }
    return true;
  }

  function inspect(node, depth, warnings) {
    const record = {
      id: node.id,
      name: node.name,
      type: node.type,
      depth,
      path: pathOf(node),
      parentId: node.parent ? node.parent.id : null,
      effectiveVisible: isVisible(node),
      geometry: read(node, [
        "x",
        "y",
        "width",
        "height",
        "rotation",
        "absoluteBoundingBox",
        "absoluteTransform",
      ]),
      appearance: read(node, [
        "visible",
        "opacity",
        "locked",
        "cornerRadius",
        "topLeftRadius",
        "topRightRadius",
        "bottomLeftRadius",
        "bottomRightRadius",
        "cornerSmoothing",
        "strokeWeight",
        "strokeTopWeight",
        "strokeRightWeight",
        "strokeBottomWeight",
        "strokeLeftWeight",
        "strokeAlign",
        "dashPattern",
        "effects",
        "clipsContent",
      ]),
      sizing: read(node, [
        "layoutSizingHorizontal",
        "layoutSizingVertical",
        "layoutAlign",
        "layoutGrow",
        "layoutPositioning",
        "constraints",
        "minWidth",
        "maxWidth",
        "minHeight",
        "maxHeight",
      ]),
    };
    for (const key of ["fills", "strokes"]) {
      if (key in node) record.appearance[key] = paints(node[key]);
    }
    if ("layoutMode" in node) {
      record.autoLayout = { layoutMode: node.layoutMode };
      // Padding/gap on a non-auto-layout frame can be stale; do not present it as CSS padding.
      if (node.layoutMode !== "NONE")
        Object.assign(
          record.autoLayout,
          read(node, [
            "paddingTop",
            "paddingRight",
            "paddingBottom",
            "paddingLeft",
            "itemSpacing",
            "counterAxisSpacing",
            "layoutWrap",
            "primaryAxisAlignItems",
            "counterAxisAlignItems",
            "primaryAxisSizingMode",
            "counterAxisSizingMode",
            "itemReverseZIndex",
            "strokesIncludedInLayout",
          ]),
        );
    }
    if ("boundVariables" in node) record.boundVariables = plain(node.boundVariables);
    if ("variantProperties" in node) record.variantProperties = plain(node.variantProperties);
    if ("componentProperties" in node) record.componentProperties = plain(node.componentProperties);
    if (node.type === "TEXT") {
      record.text = read(node, [
        "fontName",
        "fontSize",
        "fontWeight",
        "lineHeight",
        "letterSpacing",
        "textAlignHorizontal",
        "textAlignVertical",
        "textAutoResize",
        "textTruncation",
        "maxLines",
        "paragraphSpacing",
        "textCase",
        "textDecoration",
      ]);
      const length = node.characters.length;
      record.text.characters = node.characters.slice(0, MAX_TEXT);
      record.text.characterCount = length;
      record.text.truncated = length > MAX_TEXT;
      if (length > MAX_TEXT) warnings.add("긴 텍스트는 레이어마다 처음 20,000자까지만 포함합니다.");
      if (length > 0) {
        try {
          record.text.runs = node
            .getStyledTextSegments(
              ["fontName", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "fills"],
              0,
              Math.min(length, MAX_TEXT),
            )
            .map((segment) => {
              const result = plain(segment);
              result.fills = paints(segment.fills);
              return result;
            });
        } catch (error) {
          record.text.runsError = String(error.message || error);
          warnings.add(
            "일부 텍스트 구간 속성을 읽지 못했습니다. 해당 레이어의 runsError를 확인하세요.",
          );
        }
      } else record.text.runs = [];
    }
    return record;
  }

  // Two-node distances use axis-aligned canvas bounds, NOT auto-layout itemSpacing.
  function pairMeasurement(nodes) {
    if (nodes.length !== 2) return null;
    const a = nodes[0].absoluteBoundingBox,
      b = nodes[1].absoluteBoundingBox;
    if (!a || !b) return null;
    const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
    return {
      basis: "canvas-axis-aligned-bounds",
      ids: nodes.map((node) => node.id),
      horizontalGap: Math.max(0, -overlapX),
      verticalGap: Math.max(0, -overlapY),
      overlapWidth: Math.max(0, overlapX),
      overlapHeight: Math.max(0, overlapY),
      centerDeltaX: b.x + b.width / 2 - a.x - a.width / 2,
      centerDeltaY: b.y + b.height / 2 - a.y - a.height / 2,
      note: "두 축의 간격/겹침을 각각 측정합니다. 회전·그림자·글자 잉크 영역의 간격은 아닙니다.",
    };
  }

  function snapshot() {
    const selection = Array.from(figma.currentPage.selection);
    const warnings = new Set();
    const nodes = [],
      visited = new Set();
    const stack = selection
      .slice()
      .reverse()
      .map((node) => ({ node, depth: 0 }));
    let hiddenSkipped = 0;
    while (stack.length && nodes.length < MAX_NODES) {
      const { node, depth } = stack.pop();
      if (visited.has(node.id)) continue;
      visited.add(node.id);
      if (depth > 0 && !options.hidden && !isVisible(node)) {
        hiddenSkipped++;
        continue;
      }
      try {
        nodes.push(inspect(node, depth, warnings));
      } catch (error) {
        nodes.push({
          id: node.id,
          name: node.name,
          type: node.type,
          depth,
          error: String(error.message || error),
        });
        warnings.add("일부 레이어를 읽지 못했습니다. JSON의 error를 확인하세요.");
      }
      if (options.children && "children" in node && node.children.length) {
        if (depth >= MAX_DEPTH) {
          warnings.add("20단계보다 깊은 하위 레이어는 생략했습니다.");
          continue;
        }
        // Do not copy an arbitrarily large child list into the work queue.
        const remaining = Math.max(0, MAX_NODES - nodes.length - stack.length);
        if (node.children.length > remaining)
          warnings.add("최대 500개 레이어까지만 포함합니다. 더 작은 컴포넌트를 선택하세요.");
        for (let index = Math.min(node.children.length, remaining) - 1; index >= 0; index--) {
          stack.push({ node: node.children[index], depth: depth + 1 });
        }
      }
    }
    if (stack.length) warnings.add("최대 500개 레이어까지만 포함합니다.");
    return {
      schema: "alpas-figma-inspector/v1",
      exportedAt: new Date().toISOString(),
      source: "Figma Plugin API / current selection",
      readOnly: true,
      unit: "figma-design-px",
      page: { id: figma.currentPage.id, name: figma.currentPage.name },
      selection: selection.map((node) => ({ id: node.id, name: node.name, type: node.type })),
      options: plain(options),
      limits: { nodes: MAX_NODES, depth: MAX_DEPTH, textCharacters: MAX_TEXT },
      hiddenSkipped,
      warnings: Array.from(warnings),
      nodes,
      pair: pairMeasurement(selection),
      notes: [
        "현재 선택된 인스턴스의 실제 값을 읽습니다. 라이브러리 원본을 수정하거나 조회 범위를 확장하지 않습니다.",
        "x/y는 부모 기준, absoluteBoundingBox는 캔버스 기준입니다. 화면 확대율과 무관한 디자인 단위입니다.",
        "MIXED는 혼합값, AUTO 행간은 자동입니다. 임의 px 값으로 바꾸지 않습니다.",
        "Auto Layout이 NONE이면 padding/gap은 추정하지 않습니다. 내부 텍스트의 좌표/크기를 함께 확인하세요.",
        "변수는 연결 ID와 현재 해석된 속성값을 기록합니다. 변수 이름/다른 모드를 조회하지 않습니다.",
      ],
    };
  }

  function publish() {
    try {
      figma.ui.postMessage({
        channel: CHANNEL,
        version: VERSION,
        type: "snapshot",
        data: snapshot(),
      });
    } catch (error) {
      figma.ui.postMessage({
        channel: CHANNEL,
        version: VERSION,
        type: "error",
        message: String(error.message || error),
      });
    }
  }
  function schedule() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(publish, 80);
  }

  figma.ui.onmessage = (message) => {
    if (!message || typeof message !== "object" || message.channel !== CHANNEL) return;
    if (message.type === "inspect") {
      if (typeof message.children === "boolean") options.children = message.children;
      if (typeof message.hidden === "boolean") options.hidden = message.hidden;
      publish();
    }
  };
  figma.showUI(__html__, {
    width: 520,
    height: 680,
    themeColors: true,
    title: "ALPAS 수치 확인 · 읽기 전용 · v" + VERSION,
  });
  figma.on("selectionchange", schedule);
  figma.on("currentpagechange", schedule);
  // Figma queues core→UI messages until the iframe loads. Also retain the UI's
  // explicit inspect request so either startup ordering reads the selection.
  publish();
})();
