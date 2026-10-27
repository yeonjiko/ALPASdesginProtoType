import type {
  DockviewApi,
  DockviewWillDropEvent,
  DockviewWillShowOverlayLocationEvent,
} from "dockview";
import { canDropInLoanRow, isLoanPanelId } from "@/pages/loanReturn/loanLayout";

type LoanDropEvent = Pick<DockviewWillShowOverlayLocationEvent, "getData" | "position" | "kind">;

function getSource(apis: Array<DockviewApi | null>, event: LoanDropEvent) {
  const transfer = event.getData();
  const api = apis.find((candidate) => candidate?.id === transfer?.viewId);
  const group = api?.groups.find((candidate) => candidate.id === transfer?.groupId);
  if (!transfer || !api || !group) return undefined;
  const panels = group.panels.filter(
    (panel) => transfer.panelId === null || panel.id === transfer.panelId,
  );
  if (!panels.length || panels.some((panel) => !isLoanPanelId(panel.id))) return undefined;
  return { api, group, panels };
}

export function allowLoanRowDrop(
  apis: Array<DockviewApi | null>,
  target: DockviewApi,
  event: LoanDropEvent,
): boolean {
  const source = getSource(apis, event);
  if (!source || !apis.includes(target)) return false;
  if (source.api !== target && source.panels.some((panel) => target.getPanel(panel.id)))
    return false;
  const releasesSource =
    source.api === target && source.panels.length === source.group.panels.length;
  const count = target.groups.filter((group) => group.panels.length > 0).length;
  return canDropInLoanRow(event.position, count, releasesSource, event.kind);
}

export function transferLoanRowPanels(
  apis: Array<DockviewApi | null>,
  target: DockviewApi,
  event: DockviewWillDropEvent,
): boolean {
  if (!allowLoanRowDrop(apis, target, event)) return false;
  const source = getSource(apis, event);
  if (!source || source.api === target) return false;
  const header = event.kind === "tab" || event.kind === "header_space";
  let group = event.group;
  const within = header || event.position === "center" || group?.panels.length === 0;
  let index: number | undefined;
  if (header && group)
    index = event.panel ? group.panels.indexOf(event.panel) : group.panels.length;
  const added: string[] = [];
  const activeId = source.group.activePanel?.id;
  try {
    for (const [offset, panel] of source.panels.entries()) {
      const next = target.addPanel({
        id: panel.id,
        component: "list",
        title: panel.title,
        params: { kind: panel.id },
        minimumWidth: 160,
        minimumHeight: 0,
        position: group
          ? {
              referenceGroup: group,
              direction: within || offset > 0 ? "within" : event.position,
              index: index === undefined ? undefined : index + offset,
            }
          : undefined,
      });
      added.push(next.id);
      group = next.group;
    }
  } catch {
    for (const id of added) {
      const panel = target.getPanel(id);
      if (panel) target.removePanel(panel);
    }
    return false;
  }
  for (const panel of source.panels) source.api.removePanel(panel);
  target.getPanel(activeId ?? added[0] ?? "")?.api.setActive();
  return true;
}
