import type { SerializedDockview } from "dockview";

export const MAX_LOAN_ROW_SECTIONS = 3;
export type LoanHeight = "normal" | "long" | "extra";
export type LoanRowId = "lists" | "activity";
export type LoanPanelId =
  | "loans"
  | "reservations"
  | "interlibrary"
  | "processed"
  | "searches"
  | "family"
  | "book"
  | "photo"
  | "actions";

export const loanPanels: Array<{ id: LoanPanelId; title: string }> = [
  { id: "loans", title: "대출목록" },
  { id: "reservations", title: "예약목록" },
  { id: "interlibrary", title: "상호대차 대출 및 대출대기 목록" },
  { id: "processed", title: "처리목록" },
  { id: "searches", title: "이용자 검색목록" },
  { id: "family", title: "가족정보" },
  { id: "book", title: "도서정보" },
  { id: "photo", title: "이용자 이미지" },
  { id: "actions", title: "기능버튼" },
];

export function isLoanPanelId(value: string): value is LoanPanelId {
  return loanPanels.some((panel) => panel.id === value);
}

export function defaultLoanRows(): Record<LoanRowId, LoanPanelId[][]> {
  return {
    lists: [["reservations", "interlibrary"], ["loans"]],
    activity: [["searches"], ["processed"]],
  };
}

export function canSplitLoanRow(groupCount: number, releasesSourceGroup = false): boolean {
  return groupCount - (releasesSourceGroup ? 1 : 0) < MAX_LOAN_ROW_SECTIONS;
}

export function canDropInLoanRow(
  position: string,
  groupCount: number,
  releasesSourceGroup = false,
  kind: string = "content",
): boolean {
  if (kind === "tab" || kind === "header_space") return true;
  if (position === "center") return true;
  if (position !== "left" && position !== "right") return false;
  return canSplitLoanRow(groupCount, releasesSourceGroup);
}

export type LoanLayoutSnapshot = {
  version: 2;
  height: LoanHeight;
  rows: Record<LoanRowId, SerializedDockview>;
};
let savedLayout: LoanLayoutSnapshot | undefined;

export function saveLoanLayout(snapshot: LoanLayoutSnapshot): void {
  savedLayout = structuredClone(snapshot);
}

export function readLoanLayout(): LoanLayoutSnapshot | undefined {
  return savedLayout ? structuredClone(savedLayout) : undefined;
}
