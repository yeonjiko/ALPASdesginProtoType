import test from "node:test";
import assert from "node:assert/strict";
import {
  parseActionButtonLayout,
  defaultActionButtonLayout,
} from "../src/components/ActionButtonSettings/actionButtonLayout.ts";
test("missing, malformed and structurally invalid saved layouts restore defaults", () => {
  for (const saved of [null, "{", "null", "5", "[]", '{"active":"broken","inactive":[]}']) {
    assert.deepEqual(parseActionButtonLayout(saved), defaultActionButtonLayout);
  }
});
test("saved order survives while unknown and duplicate actions are removed", () => {
  const layout = parseActionButtonLayout(
    JSON.stringify({
      active: ["book-detail", "book-detail", "unknown", null],
      inactive: ["book-detail", "file-search", "file-search"],
    }),
  );
  assert.equal(layout.active[0], "book-detail");
  assert.deepEqual(layout.inactive, ["file-search"]);
  const ids = [...layout.active, ...layout.inactive];
  assert.equal(ids.length, new Set(ids).size);
  assert.deepEqual([...ids].sort(), [...defaultActionButtonLayout.active].sort());
});
test("default layouts are independent copies", () => {
  const first = parseActionButtonLayout(null);
  first.active.length = 0;
  assert.ok(parseActionButtonLayout(null).active.length > 0);
});
