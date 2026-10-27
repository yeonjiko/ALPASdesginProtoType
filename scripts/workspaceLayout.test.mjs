import assert from "node:assert/strict";
import test from "node:test";
import {
  canOpenTask,
  hasUnsavedTasks,
  taskId,
  MAX_WORKSPACE_TABS,
} from "../src/workspace/workspaceModel.ts";
import {
  canDropInLoanRow,
  canSplitLoanRow,
  defaultLoanRows,
} from "../src/pages/loanReturn/loanLayout.ts";

test("opening an existing singleton remains possible at the ten-tab limit", () => {
  const ids = Array.from({ length: MAX_WORKSPACE_TABS }, (_, index) => taskId(`업무${index}`));
  assert.equal(canOpenTask(ids, ids[0]), true);
  assert.equal(canOpenTask(ids, taskId("새 업무")), false);
  assert.equal(canOpenTask(ids.slice(1), taskId("새 업무")), true);
});
test("close protection considers every selected task in a group or close-all request", () => {
  const dirty = new Set([taskId("대출·반납")]);
  assert.equal(hasUnsavedTasks([taskId("대시보드")], dirty), false);
  assert.equal(hasUnsavedTasks([taskId("대시보드"), taskId("대출·반납")], dirty), true);
  assert.equal(hasUnsavedTasks([], dirty), false);
});
test("default loan rows match the reference and each reset gets an independent layout", () => {
  const rows = defaultLoanRows();
  assert.deepEqual(rows, {
    lists: [["reservations", "interlibrary"], ["loans"]],
    activity: [["searches"], ["processed"]],
  });
  rows.lists[0].pop();
  rows.activity.push(["book"]);
  assert.equal(defaultLoanRows().lists[0].includes("interlibrary"), true);
  assert.equal(defaultLoanRows().activity.length, 2);
});
test("each row accepts a third section but rejects a fourth while tabs remain available", () => {
  assert.equal(canSplitLoanRow(2), true);
  assert.equal(canSplitLoanRow(3), false);
  assert.equal(canSplitLoanRow(4), false);
  assert.equal(canDropInLoanRow("right", 2), true);
  assert.equal(canDropInLoanRow("left", 3), false);
  assert.equal(canDropInLoanRow("center", 3), true);
});
test("moving an existing whole section at the limit stays allowed, splitting a tab does not", () => {
  assert.equal(canDropInLoanRow("right", 3, true), true);
  assert.equal(canDropInLoanRow("left", 3, true), true);
  assert.equal(canDropInLoanRow("right", 3, false), false);
});
test("vertical drops cannot create extra rows or stacked sections", () => {
  for (const position of ["top", "bottom", "unknown"]) {
    assert.equal(canDropInLoanRow(position, 1), false);
    assert.equal(canDropInLoanRow(position, 3, true), false);
  }
});

test("tab headers accept reordering and cross-row tab joins even at the section limit", () => {
  for (const kind of ["tab", "header_space"])
    for (const position of ["left", "right", "center"])
      assert.equal(canDropInLoanRow(position, 3, false, kind), true);
});

test("a section leaving another row does not free space in the target row", () => {
  assert.equal(canDropInLoanRow("right", 3, false, "content"), false);
  assert.equal(canDropInLoanRow("right", 2, false, "content"), true);
  assert.equal(canDropInLoanRow("center", 3, false, "content"), true);
  assert.equal(canDropInLoanRow("center", 0, false, "content"), true);
});
