export const MAX_WORKSPACE_TABS = 10;
export const DASHBOARD_ID = "dashboard";
export const LOAN_ID = "loan-return";

export function taskId(title: string): string {
  if (title === "대시보드") return DASHBOARD_ID;
  if (title === "대출·반납") return LOAN_ID;
  return `task:${title}`;
}

export function canOpenTask(ids: readonly string[], id: string): boolean {
  return ids.includes(id) || ids.length < MAX_WORKSPACE_TABS;
}

export function hasUnsavedTasks(ids: readonly string[], dirtyIds: ReadonlySet<string>): boolean {
  return ids.some((id) => dirtyIds.has(id));
}

export type TaskRequest = { title: string; sequence: number };
