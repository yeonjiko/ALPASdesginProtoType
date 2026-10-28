import assert from "node:assert/strict";
import test from "node:test";
import {
  canOpenTask,
  hasUnsavedTasks,
  taskId,
  MAX_WORKSPACE_TABS,
} from "../src/workspace/workspaceModel.ts";
import {
  readLoanLayout,
  saveLoanLayout,
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

test("free docking saves nested splits, empty layouts and independent snapshots", () => {
  const layout = {
    grid: {
      width: 1000,
      height: 300,
      orientation: "HORIZONTAL",
      root: {
        type: "branch",
        data: [
          {
            type: "branch",
            size: 500,
            data: [
              {
                type: "leaf",
                size: 150,
                data: { id: "top", views: ["loans"], activeView: "loans" },
              },
              {
                type: "leaf",
                size: 150,
                data: { id: "bottom", views: ["processed"], activeView: "processed" },
              },
            ],
          },
          {
            type: "leaf",
            size: 500,
            data: { id: "side", views: ["reservations"], activeView: "reservations" },
          },
        ],
      },
    },
    panels: {
      loans: { id: "loans" },
      processed: { id: "processed" },
      reservations: { id: "reservations" },
    },
    activeGroup: "side",
  };
  const snapshot = { version: 3, height: "long", layout };
  saveLoanLayout(snapshot);
  assert.deepEqual(readLoanLayout(), snapshot);
  layout.grid.root.data.pop();
  assert.equal(readLoanLayout().layout.grid.root.data.length, 2);
  const loaded = readLoanLayout();
  loaded.layout.panels.loans.id = "changed";
  assert.equal(readLoanLayout().layout.panels.loans.id, "loans");
  saveLoanLayout({
    version: 3,
    height: "normal",
    layout: { ...layout, panels: {}, grid: { ...layout.grid, root: { type: "branch", data: [] } } },
  });
  assert.deepEqual(readLoanLayout().layout.grid.root.data, []);
});
