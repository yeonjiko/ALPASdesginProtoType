import { createContext, useContext } from "react";
import type { GridRowSelectionModel } from "@mui/x-data-grid";

export type LoanItem = {
  id: string;
  accessionNo: string;
  title: string;
  loanDate: string;
};
export type LoanActivity = LoanItem & {
  action: string;
  memberName: string;
  returnDate: string;
  processedAt: string;
};
export type MemberSearch = {
  id: string;
  memberName: string;
  memberNo: string;
  searchedAt: string;
  operator: string;
};
export type LoanContextValue = {
  hasMember: boolean;
  loadedMemberNo: string;
  memo: string;
  setMemo: (value: string) => void;
  accessionNo: string;
  setAccessionNo: (value: string) => void;
  loans: LoanItem[];
  activity: LoanActivity[];
  searches: MemberSearch[];
  selections: Record<string, GridRowSelectionModel>;
  setSelection: (key: string, selection: GridRowSelectionModel) => void;
  process: (action: "loan" | "return", number?: string) => void;
};
export const LoanContext = createContext<LoanContextValue | null>(null);

export function useLoan(): LoanContextValue {
  const value = useContext(LoanContext);
  if (!value) throw new Error("LoanContext가 필요합니다.");
  return value;
}
