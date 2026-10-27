import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactElement } from "react";
import {
  Alert,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import { DockviewReact, themeLight } from "dockview";
import type { DockviewApi, DockviewDndOverlayEvent, DockviewReadyEvent } from "dockview";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import { Button, Dialog, IconButton, Select, Tooltip } from "@/components/ui";
import dockCss from "@/components/dockview/Dockview.module.css";
import { LoanEntry } from "@/pages/loanReturn/LoanEntry";
import { LoanDockPanel, LoanTab, MemberInfo, MemberMemo } from "@/pages/loanReturn/LoanPanels";
import { LoanContext } from "@/pages/loanReturn/loanContext";
import type { LoanActivity, LoanItem, MemberSearch } from "@/pages/loanReturn/loanContext";
import {
  canDropInLoanRow,
  canSplitLoanRow,
  defaultLoanRows,
  isLoanPanelId,
  loanPanels,
  MAX_LOAN_ROW_SECTIONS,
  readLoanLayout,
  saveLoanLayout,
} from "@/pages/loanReturn/loanLayout";
import type { LoanHeight, LoanPanelId, LoanRowId } from "@/pages/loanReturn/loanLayout";
import { useWorkspace } from "@/workspace/workspaceContext";
import { LOAN_ID } from "@/workspace/workspaceModel";
import css from "@/pages/loanReturn/LoanReturnPage.module.css";

const ROW_IDS: LoanRowId[] = ["lists", "activity"];
const ROW_LABELS: Record<LoanRowId, string> = { lists: "2행 업무목록", activity: "3행 처리목록" };
const DOCK_COMPONENTS = { list: LoanDockPanel };

function panelTitle(id: LoanPanelId, counts: Record<string, number>): string {
  const title = loanPanels.find((panel) => panel.id === id)?.title ?? id;
  return id === "loans" || id === "reservations" || id === "interlibrary"
    ? `${title} (${counts[id] ?? 0})`
    : title;
}

function allowRowDrop(
  api: DockviewApi,
  event: Pick<DockviewDndOverlayEvent, "getData" | "position">,
): boolean {
  const transfer = event.getData();
  if (!transfer || transfer.viewId !== api.id) return false;
  const source = api.groups.find((group) => group.id === transfer.groupId);
  const releasesSource = !!source && (transfer.panelId === null || source.panels.length === 1);
  return canDropInLoanRow(event.position, api.groups.length, releasesSource);
}

function buildDefaultRow(api: DockviewApi, rowId: LoanRowId): void {
  api.clear();
  let previous: string | undefined;
  for (const group of defaultLoanRows()[rowId]) {
    let first: string | undefined;
    for (const id of group) {
      const reference = first ?? previous;
      api.addPanel({
        id,
        component: "list",
        title: panelTitle(id, {}),
        params: { kind: id },
        minimumWidth: 160,
        minimumHeight: 0,
        position: reference
          ? { referencePanel: reference, direction: first ? "within" : "right" }
          : undefined,
      });
      first ??= id;
    }
    previous = first;
  }
  api.getPanel(rowId === "lists" ? "loans" : "processed")?.api.setActive();
}

export function LoanReturnPage(): ReactElement {
  const { setDirty, dirtyIds } = useWorkspace();
  const [initial] = useState(readLoanLayout);
  const [height, setHeight] = useState<LoanHeight>(initial?.height ?? "normal");
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [hasMember, setHasMember] = useState(false);
  const [loadedMemberNo, setLoadedMemberNo] = useState("");
  const [hasWorkChanges, setHasWorkChanges] = useState(false);
  const [memo, setMemo] = useState("");
  const [accessionNo, setAccessionNo] = useState("");
  const [loanDate, setLoanDate] = useState<Dayjs | null>(() => dayjs());
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  const [loans, setLoans] = useState<LoanItem[]>([]);
  const [activity, setActivity] = useState<LoanActivity[]>([]);
  const [searches, setSearches] = useState<MemberSearch[]>([]);
  const [selections, setSelections] = useState<Record<string, GridRowSelectionModel>>({});
  const [selectedPanel, setSelectedPanel] = useState<LoanPanelId>("book");
  const [selectedRow, setSelectedRow] = useState<LoanRowId>("lists");
  const [placement, setPlacement] = useState("section");
  const [rows, setRows] = useState<Record<LoanRowId, { sections: number; titles: string[] }>>({
    lists: { sections: 0, titles: [] },
    activity: { sections: 0, titles: [] },
  });
  const apis = useRef<Record<LoanRowId, DockviewApi | null>>({ lists: null, activity: null });
  const subscriptions = useRef<Array<{ dispose: () => void }>>([]);
  const headingId = useId();
  const settingsId = useId();
  const refreshRows = useCallback(() => {
    const summarize = (id: LoanRowId) => ({
      sections: apis.current[id]?.groups.length ?? 0,
      titles:
        apis.current[id]?.panels.map(
          (panel) => loanPanels.find((definition) => definition.id === panel.id)?.title ?? panel.id,
        ) ?? [],
    });
    setRows({ lists: summarize("lists"), activity: summarize("activity") });
  }, []);
  useEffect(
    () => () => subscriptions.current.forEach((subscription) => subscription.dispose()),
    [],
  );
  useEffect(() => {
    const counts = {
      loans: loans.length,
      reservations: hasMember ? 1 : 0,
      interlibrary: hasMember ? 1 : 0,
    };
    for (const rowId of ROW_IDS)
      for (const panel of apis.current[rowId]?.panels ?? [])
        if (isLoanPanelId(panel.id)) {
          const title = panelTitle(panel.id, counts);
          if (panel.api.title !== title) panel.api.setTitle(title);
        }
  }, [loans.length, hasMember, rows]);

  const markChanged = () => setDirty(LOAN_ID, true);
  const process = (action: "loan" | "return", scannedNumber = accessionNo) => {
    const number = scannedNumber.trim();
    if (!hasMember || !number) {
      setNotice("번호에 DEMO-001을 입력하고 Enter를 눌러 이용자를 먼저 조회하세요.");
      return;
    }
    const existing = loans.find((item) => item.accessionNo === number);
    if (action === "loan" && existing) {
      setNotice("이미 대출목록에 있는 등록번호입니다.");
      return;
    }
    if (action === "return" && !existing) {
      setNotice("대출목록에 있는 등록번호를 입력하세요.");
      return;
    }
    const date = loanDate?.isValid() ? loanDate.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");
    const item = existing ?? {
      id: number,
      accessionNo: number,
      title: "대출 시연 자료",
      loanDate: date,
    };
    if (action === "loan") setLoans((items) => [...items, item]);
    else setLoans((items) => items.filter((loan) => loan.id !== item.id));
    setActivity((items) => [
      ...items,
      {
        ...item,
        id: `${number}-${items.length + 1}`,
        action: action === "loan" ? "대출" : "반납",
        memberName: "김도서",
        returnDate:
          action === "return"
            ? (returnDate?.isValid() ? returnDate : dayjs()).format("YYYY-MM-DD")
            : "",
        processedAt: dayjs().format("HH:mm:ss"),
      },
    ]);
    setHasWorkChanges(true);
    markChanged();
    setAccessionNo("");
    setNotice(
      `${action === "loan" ? "대출" : "반납"} 시연을 처리했습니다. 실제 데이터는 변경되지 않습니다.`,
    );
  };
  const scanNumber = (value: string): boolean => {
    const number = value.trim();
    if (!number) return false;
    if (number === "DEMO-001") {
      if (hasWorkChanges) {
        setNotice("설정에서 현재 업무 변경을 먼저 확인하세요.");
        return false;
      }
      setHasMember(true);
      setSelections({});
      setLoadedMemberNo(number);
      setMemo("");
      setLoans([
        {
          id: "BK-DEMO-001",
          accessionNo: "BK-DEMO-001",
          title: "도서관의 하루",
          loanDate: dayjs().format("YYYY-MM-DD"),
        },
        {
          id: "BK-DEMO-002",
          accessionNo: "BK-DEMO-002",
          title: "자료관리의 이해",
          loanDate: dayjs().format("YYYY-MM-DD"),
        },
      ]);
      setSearches((items) => [
        ...items,
        {
          id: `search-${items.length + 1}`,
          memberName: "김도서",
          memberNo: number,
          searchedAt: dayjs().format("HH:mm:ss"),
          operator: "MA관리자",
        },
      ]);
      setDirty(LOAN_ID, false);
      setNotice("시연 이용자를 조회했습니다. 번호에 등록번호를 입력하면 대출·반납을 시연합니다.");
      return true;
    }
    if (!hasMember) {
      setNotice("시연 이용자번호 DEMO-001을 입력하세요. 실제 이용자 API는 연결되지 않았습니다.");
      return false;
    }
    setAccessionNo(number);
    process(loans.some((item) => item.accessionNo === number) ? "return" : "loan", number);
    return true;
  };
  const handleReady = (rowId: LoanRowId, { api }: DockviewReadyEvent) => {
    apis.current[rowId] = api;
    if (initial) api.fromJSON(initial.rows[rowId]);
    else buildDefaultRow(api, rowId);
    subscriptions.current.push(
      api.onDidLayoutChange(refreshRows),
      api.onWillShowOverlay((event) => {
        if (!allowRowDrop(api, event)) event.preventDefault();
      }),
    );
    refreshRows();
  };
  const addOrMovePanel = () => {
    const target = apis.current[selectedRow];
    if (!target) return;
    const source = ROW_IDS.map((id) => apis.current[id]).find((api) =>
      api?.getPanel(selectedPanel),
    );
    const existing = source?.getPanel(selectedPanel);
    if (
      source === target &&
      existing &&
      placement === "section" &&
      existing.group.panels.length === 1
    ) {
      existing.api.setActive();
      setNotice("선택한 화면은 이미 독립 섹션으로 표시되어 있습니다.");
      return;
    }
    if (placement === "section" && !canSplitLoanRow(target.groups.length)) {
      setNotice(
        "한 행에는 최대 3개 섹션을 배치할 수 있습니다. 탭으로 추가하거나 다른 행을 선택하세요.",
      );
      return;
    }
    const reference = target.activePanel;
    if (existing && source === target && reference) {
      const group =
        placement === "tab"
          ? (target.groups.find((group) => group.id !== existing.group.id) ?? existing.group)
          : reference.group;
      existing.api.moveTo({ group, position: placement === "section" ? "right" : "center" });
    } else {
      target.addPanel({
        id: selectedPanel,
        component: "list",
        title: panelTitle(selectedPanel, {
          loans: loans.length,
          reservations: hasMember ? 1 : 0,
          interlibrary: hasMember ? 1 : 0,
        }),
        params: { kind: selectedPanel },
        minimumWidth: 160,
        minimumHeight: 0,
        position: reference
          ? { referencePanel: reference, direction: placement === "section" ? "right" : "within" }
          : undefined,
      });
      if (existing) source?.removePanel(existing);
    }
    target.getPanel(selectedPanel)?.api.setActive();
    refreshRows();
    setNotice("화면 배치를 적용했습니다.");
  };
  const restore = () => {
    const saved = readLoanLayout();
    if (!saved) {
      setNotice("저장한 내부 배치가 없습니다.");
      return;
    }
    for (const rowId of ROW_IDS)
      apis.current[rowId]?.fromJSON(saved.rows[rowId], { reuseExistingPanels: true });
    setHeight(saved.height);
    refreshRows();
    setNotice("저장한 내부 배치를 복원했습니다.");
  };
  return (
    <LoanContext.Provider
      value={{
        hasMember,
        loadedMemberNo,
        memo,
        setMemo: (value) => {
          setMemo(value);
          setHasWorkChanges(true);
          markChanged();
        },
        accessionNo,
        setAccessionNo: (value) => {
          setAccessionNo(value);
          markChanged();
        },
        loans,
        activity,
        searches,
        selections,
        setSelection: (key, selection) =>
          setSelections((current) => ({ ...current, [key]: selection })),
        process,
      }}
    >
      <article className={`${css.page} ${css[`height_${height}`]}`} aria-labelledby={headingId}>
        <h1 id={headingId} className={css.sr_only}>
          대출·반납
        </h1>
        {notice && !isManagerOpen && (
          <Alert severity="info" className={css.notice} onClose={() => setNotice("")}>
            {notice}
          </Alert>
        )}
        <div className={css.layout}>
          <section className={css.fixed_row} aria-label="1행 기본 패널">
            <div className={css.fixed_row_content}>
              <LoanEntry
                onScan={scanNumber}
                onChange={markChanged}
                onSettings={() => setIsManagerOpen(true)}
                onRfid={() =>
                  setNotice(
                    "RFID 장비는 연결되지 않았습니다. 번호 입력란에서 DEMO-001로 조회를 시연할 수 있습니다.",
                  )
                }
                loanDate={loanDate}
                returnDate={returnDate}
                onLoanDateChange={(date) => {
                  setLoanDate(date);
                  markChanged();
                }}
                onReturnDateChange={(date) => {
                  setReturnDate(date);
                  markChanged();
                }}
              />
              <MemberInfo />
              <MemberMemo />
            </div>
          </section>
          {ROW_IDS.map((rowId) => (
            <section key={rowId} className={css.dock_row} aria-label={ROW_LABELS[rowId]}>
              <div className={css.row_dock}>
                <DockviewReact
                  className={dockCss.dockview}
                  theme={themeLight}
                  components={DOCK_COMPONENTS}
                  defaultTabComponent={LoanTab}
                  defaultRenderer="onlyWhenVisible"
                  disableFloatingGroups
                  dndEdges={false}
                  onReady={(event) => handleReady(rowId, event)}
                  onWillDrop={(event) => {
                    const api = apis.current[rowId];
                    if (!api || !allowRowDrop(api, event)) {
                      event.preventDefault();
                      setNotice(
                        "행 안에서 최대 3개 섹션까지 좌우 도킹할 수 있습니다. 행 이동은 설정에서 선택하세요.",
                      );
                    }
                  }}
                />
              </div>
            </section>
          ))}
        </div>
        <div className={css.page_actions}>
          <Tooltip title="대출·반납 화면 설정">
            <IconButton aria-label="대출·반납 화면 설정" onClick={() => setIsManagerOpen(true)}>
              <SettingsOutlined />
            </IconButton>
          </Tooltip>
        </div>
        <Dialog
          open={isManagerOpen}
          onClose={() => setIsManagerOpen(false)}
          className={css.panel_manager}
          fullWidth
          maxWidth="sm"
          aria-labelledby={settingsId}
        >
          <DialogTitle id={settingsId}>대출·반납 화면 설정</DialogTitle>
          <DialogContent>
            {notice && (
              <Alert severity="info" onClose={() => setNotice("")}>
                {notice}
              </Alert>
            )}
            <p>
              각 행은 최대 {MAX_LOAN_ROW_SECTIONS}개 섹션입니다. 첫 행은 번호 입력, 이용자 정보,
              메모/대출건수의 고정 섹션이며, 간략·상세·도서정보는 가운데 섹션에서 탭으로 전환합니다.
              2·3행은 도킹하거나 같은 섹션에 탭으로 추가할 수 있습니다.
            </p>
            <div className={css.row_summary}>
              <div>
                <strong>1행 기본 패널 · 3/{MAX_LOAN_ROW_SECTIONS} 섹션</strong>
                <p>번호 입력 · 이용자 정보 · 메모/대출건수</p>
              </div>
              {ROW_IDS.map((id) => (
                <div key={id}>
                  <strong>
                    {ROW_LABELS[id]} · {rows[id].sections}/{MAX_LOAN_ROW_SECTIONS} 섹션
                  </strong>
                  <p>{rows[id].titles.join(" · ") || "화면 없음"}</p>
                </div>
              ))}
            </div>
            <div className={css.manager_fields}>
              <FormControl size="small">
                <InputLabel id={`${settingsId}-panel`}>추가할 화면</InputLabel>
                <Select
                  labelId={`${settingsId}-panel`}
                  label="추가할 화면"
                  value={selectedPanel}
                  onChange={(event) => {
                    if (isLoanPanelId(event.target.value)) setSelectedPanel(event.target.value);
                  }}
                >
                  {loanPanels.map((panel) => (
                    <MenuItem key={panel.id} value={panel.id}>
                      {panel.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel id={`${settingsId}-row`}>배치할 행</InputLabel>
                <Select
                  labelId={`${settingsId}-row`}
                  label="배치할 행"
                  value={selectedRow}
                  onChange={(event) => {
                    if (event.target.value === "lists" || event.target.value === "activity")
                      setSelectedRow(event.target.value);
                  }}
                >
                  <MenuItem value="lists">2행 업무목록</MenuItem>
                  <MenuItem value="activity">3행 처리목록</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel id={`${settingsId}-placement`}>추가 방식</InputLabel>
                <Select
                  labelId={`${settingsId}-placement`}
                  label="추가 방식"
                  value={placement}
                  onChange={(event) => setPlacement(event.target.value)}
                >
                  <MenuItem value="section">새 섹션으로 추가</MenuItem>
                  <MenuItem value="tab">기존 섹션에 탭으로 추가</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className={css.actions}>
              <Button variant="contained" onClick={addOrMovePanel}>
                화면 추가 / 이동
              </Button>
              <Button
                variant="outlined"
                disabled={!ROW_IDS.some((id) => apis.current[id]?.getPanel(selectedPanel))}
                onClick={() => {
                  for (const id of ROW_IDS) {
                    const api = apis.current[id];
                    const panel = api?.getPanel(selectedPanel);
                    if (panel) api?.removePanel(panel);
                  }
                  refreshRows();
                }}
              >
                선택 화면 숨기기
              </Button>
            </div>
            <FormControl size="small">
              <InputLabel id={`${settingsId}-height`}>목록 영역 비율</InputLabel>
              <Select<LoanHeight>
                labelId={`${settingsId}-height`}
                label="목록 영역 비율"
                value={height}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "normal" || value === "long" || value === "extra") setHeight(value);
                }}
              >
                <MenuItem value="normal">균등</MenuItem>
                <MenuItem value="long">업무목록 넓게</MenuItem>
                <MenuItem value="extra">처리목록 넓게</MenuItem>
              </Select>
            </FormControl>
            <div className={css.actions}>
              <Button
                onClick={() => {
                  const lists = apis.current.lists;
                  const activityApi = apis.current.activity;
                  if (lists && activityApi) {
                    saveLoanLayout({
                      version: 2,
                      height,
                      rows: { lists: lists.toJSON(), activity: activityApi.toJSON() },
                    });
                    setNotice("내부 배치를 메모리에 저장했습니다. 새로고침하면 초기화됩니다.");
                  }
                }}
              >
                내부 배치 저장
              </Button>
              <Button onClick={restore}>내부 배치 복원</Button>
              <Button
                onClick={() => {
                  for (const id of ROW_IDS) {
                    const api = apis.current[id];
                    if (api) buildDefaultRow(api, id);
                  }
                  setHeight("normal");
                  refreshRows();
                  setNotice(
                    "캡처 기준의 기본 3행 배치로 초기화했습니다. 입력과 업무 결과는 유지합니다.",
                  );
                }}
              >
                기본 배치로 초기화
              </Button>
            </div>
            <p className={css.caption}>
              시연 이용자번호: DEMO-001 · 번호 입력 후 Enter로 조회합니다. 실제 대출·반납과 RFID는
              연결되지 않았습니다.
            </p>
            <Button
              disabled={!dirtyIds.has(LOAN_ID)}
              onClick={() => {
                setHasWorkChanges(false);
                setDirty(LOAN_ID, false);
                setNotice("시연 업무 변경을 확인했습니다. 서버 저장은 수행하지 않습니다.");
              }}
            >
              업무 변경 확인
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsManagerOpen(false)}>완료</Button>
          </DialogActions>
        </Dialog>
      </article>
    </LoanContext.Provider>
  );
}
