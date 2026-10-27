import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactElement } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from "@mui/material";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import Close from "@mui/icons-material/Close";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { DockviewReact, themeLight } from "dockview";
import type {
  DockviewApi,
  IDockviewPanelProps,
  IDockviewPanelHeaderProps,
  IDockviewHeaderActionsProps,
  SerializedDockview,
} from "dockview";
import { WorkspacePanel } from "@/components/WorkspacePanel/WorkspacePanel";
import { LoanReturnPage } from "@/pages/loanReturn/LoanReturnPage";
import { WorkspaceContext, useWorkspace } from "@/workspace/workspaceContext";
import {
  canOpenTask,
  hasUnsavedTasks,
  taskId,
  LOAN_ID,
  DASHBOARD_ID,
} from "@/workspace/workspaceModel";
import type { TaskRequest } from "@/workspace/workspaceModel";
import type { LayoutVariant } from "@/theme/variants";
import type { CssVariables } from "@/styles/styleTypes";
import { createClasses } from "@/styles/classes";
import dockCss from "@/components/dockview/Dockview.module.css";
import css from "@/components/Workspace/Workspace.module.css";
import ux from "@/workspace/WorkspaceUx.module.css";

const cx = createClasses(css);
let savedWorkspace: SerializedDockview | undefined;
let autoWorkspace: SerializedDockview | undefined;

function Dashboard(): ReactElement {
  const { openTask } = useWorkspace();
  return (
    <section className={ux.dashboard}>
      <p>ALPAS · 업무 공간</p>
      <h1>오늘의 도서관 업무</h1>
      <p>좌측 메뉴에서 업무를 선택하세요. 최대 10개 탭을 함께 열 수 있습니다.</p>
      <div className={ux.dashboard_cards}>
        {["대출·반납", "희망자료관리", "구입자료관리"].map((title) => (
          <Button key={title} variant="outlined" onClick={() => openTask(title)}>
            {title} 열기
          </Button>
        ))}
      </div>
      <Alert severity="info">
        업무 탭과 내부 패널의 저장은 서로 독립적이며 새로고침 후에는 초기화됩니다.
      </Alert>
    </section>
  );
}

function TaskDraft({ id, title }: { id: string; title: string }): ReactElement {
  const [memo, setMemo] = useState("");
  const { setDirty } = useWorkspace();
  return (
    <section className={ux.dashboard}>
      <h1>{title}</h1>
      <Alert severity="info">
        업무 화면 준비 영역입니다. 입력 상태와 탭 배치를 확인할 수 있습니다.
      </Alert>
      <TextField
        label="작업 메모"
        multiline
        minRows={4}
        value={memo}
        onChange={(event) => {
          setMemo(event.target.value);
          setDirty(id, true);
        }}
      />
      <Button onClick={() => setDirty(id, false)}>메모 변경 확인</Button>
    </section>
  );
}

export function DockPanel({
  api,
  params,
}: IDockviewPanelProps<{ title: string }>): ReactElement | null {
  const { variant } = useWorkspace();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const update = () => {
      if (api.isVisible && api.width > 0 && api.height > 0) setReady(true);
    };
    const dimensions = api.onDidDimensionsChange(update);
    const visibility = api.onDidVisibilityChange(update);
    update();
    return () => {
      dimensions.dispose();
      visibility.dispose();
    };
  }, [api]);
  if (!ready) return null;
  if (api.id === DASHBOARD_ID) return <Dashboard />;
  if (api.id === LOAN_ID) return <LoanReturnPage />;
  if (params.title === "희망자료관리") return <WorkspacePanel variant={variant} />;
  return <TaskDraft id={api.id} title={params.title} />;
}

function WorkspaceTab({ api }: IDockviewPanelHeaderProps): ReactElement {
  const { requestClose } = useWorkspace();
  return (
    <div className={`${cx("workspace_tab")} ${dockCss.tab_content} dv-default-tab`}>
      <span className="dv-default-tab-content">{api.title}</span>
      <button
        type="button"
        className="dv-default-tab-action"
        aria-label={`${api.title ?? "업무"} 닫기`}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          requestClose([api.id]);
        }}
      >
        <svg width="8" height="8" viewBox="0 0 28 28" aria-hidden="true" className="dv-svg">
          <path d="M2.1 27.3L0 25.2L11.55 13.65L0 2.1L2.1 0L13.65 11.55L25.2 0L27.3 2.1L15.75 13.65L27.3 25.2L25.2 27.3L13.65 15.75L2.1 27.3Z" />
        </svg>
      </button>
    </div>
  );
}

export function DockHeaderActions({
  containerApi,
  group,
}: IDockviewHeaderActionsProps): ReactElement {
  const { requestClose, openLayoutControls } = useWorkspace();
  const isFloating = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        const subscription = group.api.onDidLocationChange(onStoreChange);
        return () => subscription.dispose();
      },
      [group.api],
    ),
    () => group.api.location.type === "floating",
  );
  const actionLabel = isFloating ? "패널 도킹" : "패널 띄우기";
  return (
    <div className={cx("dock_header_actions")}>
      <Tooltip title={`${actionLabel} · 오른쪽 클릭 또는 Shift+F10: 업무 배치 관리`}>
        <IconButton
          aria-label={actionLabel}
          onClick={() => {
            const activePanel = group.activePanel;
            if (!activePanel) return;
            if (isFloating) {
              const target =
                containerApi.groups.find((item) => item.api.location.type === "grid") ??
                containerApi.addGroup({ direction: "right" });
              activePanel.api.moveTo({ group: target, position: "center" });
              return;
            }
            containerApi.addFloatingGroup(activePanel, {
              x: 24,
              y: 24,
              width: Math.min(containerApi.width, Math.max(420, containerApi.width * 0.8)),
              height: Math.min(containerApi.height, Math.max(300, containerApi.height * 0.8)),
            });
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            openLayoutControls(group.id);
          }}
          onKeyDown={(event) => {
            if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
              event.preventDefault();
              event.stopPropagation();
              openLayoutControls(group.id);
            }
          }}
        >
          <ContentCopyOutlined />
        </IconButton>
      </Tooltip>
      <IconButton
        aria-label="현재 그룹 닫기"
        onClick={() => requestClose(group.panels.map((panel) => panel.id))}
      >
        <Close />
      </IconButton>
    </div>
  );
}

function EmptyWorkspace(): ReactElement {
  const { openTask, openLayoutControls } = useWorkspace();
  return (
    <section className={ux.dashboard}>
      <p>좌측 메뉴에서 업무를 열거나 저장한 배치를 복원하세요.</p>
      <div className={ux.dashboard_cards}>
        <Button onClick={() => openTask("대시보드")}>대시보드 열기</Button>
        <Button onClick={() => openLayoutControls()}>업무 배치 관리</Button>
      </div>
    </section>
  );
}

const components = { task: DockPanel };

export function Workspace({
  variant,
  request,
}: {
  variant: LayoutVariant;
  request?: TaskRequest;
}): ReactElement {
  const selectedRowColor = variant.option === "A" ? "#bfdbfe" : "#fed7aa";
  const workspaceStyle: CssVariables = {
    "--alpas-accent": variant.accent,
    "--alpas-surface": variant.surface,
    "--alpas-row-selected": selectedRowColor,
  };
  const apiRef = useRef<DockviewApi | null>(null);
  const subscriptions = useRef<Array<{ dispose: () => void }>>([]);
  const dirtyRef = useRef(new Set<string>());
  const [dirtyIds, setDirtyIds] = useState<ReadonlySet<string>>(new Set());
  const [pendingClose, setPendingClose] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [count, setCount] = useState(0);
  const [autoSave, setAutoSave] = useState(true);
  const [controls, setControls] = useState<{ groupId?: string } | null>(null);
  const autoSaveRef = useRef(true);
  const openLayoutControls = useCallback((groupId?: string) => {
    setControls(groupId ? { groupId } : {});
  }, []);
  const setDirty = useCallback((id: string, isDirty: boolean) => {
    if (dirtyRef.current.has(id) === isDirty) return;
    if (isDirty) dirtyRef.current.add(id);
    else dirtyRef.current.delete(id);
    setDirtyIds(new Set(dirtyRef.current));
  }, []);
  const closeNow = useCallback(
    (ids: string[]) => {
      for (const id of ids) {
        const panel = apiRef.current?.getPanel(id);
        if (panel) apiRef.current?.removePanel(panel);
        setDirty(id, false);
      }
      setPendingClose([]);
    },
    [setDirty],
  );
  const requestClose = useCallback(
    (ids: string[]) => {
      if (hasUnsavedTasks(ids, dirtyRef.current)) setPendingClose(ids);
      else closeNow(ids);
    },
    [closeNow],
  );
  const openTask = useCallback((title: string) => {
    const api = apiRef.current;
    if (!api) return;
    const id = taskId(title);
    if (
      !canOpenTask(
        api.panels.map((panel) => panel.id),
        id,
      )
    ) {
      setNotice("업무 탭은 최대 10개까지 열 수 있습니다.");
      return;
    }
    const existing = api.getPanel(id);
    if (existing) {
      existing.api.setActive();
      return;
    }
    api.addPanel({ id, component: "task", title, params: { title }, renderer: "always" });
  }, []);
  useLayoutEffect(() => {
    // Recompute always-rendered panel bounds when a design changes the tab strip height.
    const api = apiRef.current;
    if (api) api.layout(api.width, api.height, true);
  }, [variant.dockviewStyle]);
  useEffect(() => {
    if (request) openTask(request.title);
  }, [request, openTask]);
  useEffect(
    () => () => {
      subscriptions.current.forEach((item) => item.dispose());
    },
    [],
  );
  useEffect(() => {
    const protectRefresh = (event: BeforeUnloadEvent) => {
      if (dirtyRef.current.size) event.preventDefault();
    };
    window.addEventListener("beforeunload", protectRefresh);
    return () => window.removeEventListener("beforeunload", protectRefresh);
  }, []);
  const collect = () => {
    const api = apiRef.current;
    if (!api?.panels.length) return;
    const panels = [...api.panels];
    const target =
      api.groups.find((group) => group.api.location.type === "grid") ??
      api.addGroup({ direction: "right" });
    for (const panel of panels) {
      if (panel.group.id !== target.id) panel.api.moveTo({ group: target, position: "center" });
    }
    panels[0].api.setActive();
  };
  const split = (position: "right" | "bottom") => {
    const api = apiRef.current;
    const panel = api?.activePanel;
    if (!api || !panel) return;
    const reference = api.panels.find((item) => item.id !== panel.id);
    if (!reference) {
      setNotice("함께 볼 업무를 하나 더 열어주세요.");
      return;
    }
    panel.api.moveTo({ group: reference.group, position });
  };
  const restore = () => {
    const snapshot = savedWorkspace ?? autoWorkspace;
    if (!snapshot) {
      setNotice("저장한 전체 업무 배치가 없습니다.");
      return;
    }
    if (dirtyRef.current.size) {
      setNotice("미저장 업무 변경을 먼저 확인한 뒤 배치를 복원해주세요.");
      return;
    }
    apiRef.current?.fromJSON(structuredClone(snapshot), { reuseExistingPanels: true });
    setNotice("전체 업무 배치를 복원했습니다.");
  };
  return (
    <WorkspaceContext.Provider
      value={{ variant, dirtyIds, setDirty, requestClose, openTask, openLayoutControls }}
    >
      <main className={`${cx("workspace")} ${ux.workspace}`} style={workspaceStyle}>
        <Dialog open={controls !== null} onClose={() => setControls(null)} maxWidth="sm" fullWidth>
          <DialogTitle>업무 배치 관리</DialogTitle>
          <DialogContent>
            <p>열린 업무 {count}/10 · 전체 배치는 새로고침 후 초기화됩니다.</p>
            <div className={ux.layout_controls}>
              <Button
                size="small"
                disabled={!controls?.groupId}
                onClick={() => {
                  const api = apiRef.current;
                  const group = api?.groups.find((item) => item.id === controls?.groupId);
                  if (api && group) api.addFloatingGroup(group);
                  setControls(null);
                }}
              >
                현재 그룹 띄우기
              </Button>
              <Button
                size="small"
                disabled={
                  !controls?.groupId ||
                  apiRef.current?.groups.find((item) => item.id === controls.groupId)?.api.location
                    .type === "grid"
                }
                onClick={() => {
                  const api = apiRef.current;
                  const group = api?.groups.find((item) => item.id === controls?.groupId);
                  const target = api?.groups.find((item) => item.api.location.type === "grid");
                  if (group) group.api.moveTo({ group: target, position: "right" });
                  setControls(null);
                }}
              >
                현재 그룹 도킹
              </Button>
              <Button size="small" onClick={() => split("right")}>
                좌우 분할
              </Button>
              <Button size="small" onClick={() => split("bottom")}>
                상하 분할
              </Button>
              <Button
                size="small"
                onClick={() => {
                  const api = apiRef.current;
                  if (api?.activePanel)
                    api.addFloatingGroup(api.activePanel, {
                      x: 30,
                      y: 30,
                      width: Math.max(420, api.width * 0.75),
                      height: Math.max(300, api.height * 0.75),
                    });
                }}
              >
                현재 탭 띄우기
              </Button>
              <Button size="small" onClick={collect}>
                모든 탭 한 그룹
              </Button>
              <Button
                size="small"
                onClick={() => {
                  const api = apiRef.current;
                  if (api)
                    [...api.panels].forEach((panel, index) =>
                      api.addFloatingGroup(panel, {
                        x: 20 + index * 24,
                        y: 20 + index * 24,
                        width: Math.max(420, api.width * 0.7),
                        height: Math.max(300, api.height * 0.7),
                      }),
                    );
                }}
              >
                모든 탭 띄우기
              </Button>
              <Button
                size="small"
                onClick={() => {
                  const panel = apiRef.current?.activePanel;
                  if (panel) requestClose([panel.id]);
                }}
              >
                현재 닫기
              </Button>
              <Button
                size="small"
                onClick={() => requestClose(apiRef.current?.panels.map((panel) => panel.id) ?? [])}
              >
                전체 닫기
              </Button>
              <label className={ux.auto_save}>
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(event) => {
                    setAutoSave(event.target.checked);
                    autoSaveRef.current = event.target.checked;
                  }}
                />
                자동 저장
              </label>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  if (apiRef.current) savedWorkspace = structuredClone(apiRef.current.toJSON());
                  setNotice("전체 업무 배치를 메모리에 저장했습니다.");
                }}
              >
                전체 배치 저장
              </Button>
              <Button size="small" onClick={restore}>
                복원
              </Button>
              <Button
                size="small"
                onClick={() => {
                  if (dirtyRef.current.size) {
                    setNotice("미저장 업무 변경을 먼저 확인해주세요.");
                    return;
                  }
                  apiRef.current?.clear();
                  openTask("대시보드");
                  setNotice("기본 Dashboard로 초기화했습니다.");
                }}
              >
                초기화
              </Button>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setControls(null)}>닫기</Button>
          </DialogActions>
        </Dialog>
        {notice && (
          <Alert severity="info" onClose={() => setNotice("")}>
            {notice}
          </Alert>
        )}
        <div
          data-dockview-style={variant.dockviewStyle ?? "default"}
          className={`${ux.dock_host} ${cx(`dockview_shell option_${variant.option.toLowerCase()} ${variant.isAlternateLayout ? "active2" : "active"}`)}`}
        >
          <DockviewReact
            theme={themeLight}
            className={`${cx("alpas_dockview")} ${dockCss.dockview} ${ux.dock}`}
            defaultRenderer="always"
            components={components}
            defaultTabComponent={WorkspaceTab}
            rightHeaderActionsComponent={DockHeaderActions}
            watermarkComponent={EmptyWorkspace}
            floatingGroupBounds="boundedWithinViewport"
            onWillDrop={(event) => {
              const transfer = event.getData();
              if (transfer && transfer.viewId !== apiRef.current?.id) event.preventDefault();
            }}
            onReady={({ api }) => {
              apiRef.current = api;
              subscriptions.current.forEach((item) => item.dispose());
              subscriptions.current = [
                api.onDidLayoutChange(() => {
                  setCount(api.totalPanels);
                  if (autoSaveRef.current) autoWorkspace = structuredClone(api.toJSON());
                }),
              ];
              openTask("희망자료관리");
              openTask("대출·반납");
              if (variant.isAlternateLayout) openTask("대시보드");
              api.getPanel(taskId("희망자료관리"))?.api.setActive();
              if (request) openTask(request.title);
            }}
          />
        </div>
        <Dialog open={pendingClose.length > 0} onClose={() => setPendingClose([])}>
          <DialogTitle>미저장 변경사항이 있습니다</DialogTitle>
          <DialogContent>
            선택한 업무를 닫으면 저장하지 않은 입력이 사라집니다. 닫으시겠습니까?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPendingClose([])}>계속 작업</Button>
            <Button color="error" onClick={() => closeNow(pendingClose)}>
              변경 버리고 닫기
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </WorkspaceContext.Provider>
  );
}
