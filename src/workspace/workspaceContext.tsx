import { createContext, useContext } from "react";
import type { LayoutVariant } from "@/theme/variants";

type WorkspaceContextValue = {
  variant: LayoutVariant;
  dirtyIds: ReadonlySet<string>;
  setDirty: (id: string, isDirty: boolean) => void;
  requestClose: (ids: string[]) => void;
  openTask: (title: string) => void;
  openLayoutControls: (groupId?: string) => void;
};

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace(): WorkspaceContextValue {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("WorkspaceContext가 필요합니다.");
  return value;
}
