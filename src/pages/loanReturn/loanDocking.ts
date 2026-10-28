import type { DockviewApi, DockviewWillShowOverlayLocationEvent } from "dockview";
import { isLoanPanelId } from "@/pages/loanReturn/loanLayout";

type LoanDropEvent = Pick<DockviewWillShowOverlayLocationEvent, "getData">;

export function allowLoanPanelDrop(api: DockviewApi, event: LoanDropEvent): boolean {
  const transfer = event.getData();
  if (!transfer || transfer.viewId !== api.id) return false;
  const group = api.groups.find((candidate) => candidate.id === transfer.groupId);
  const panels = group?.panels.filter(
    (panel) => transfer.panelId === null || panel.id === transfer.panelId,
  );
  return !!panels?.length && panels.every((panel) => isLoanPanelId(panel.id));
}
