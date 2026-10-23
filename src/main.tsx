import React from "react";
import { createRoot } from "react-dom/client";
import {
  ThemeProvider,
  createTheme,
  Autocomplete,
  Button,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
  Stack,
} from "@mui/material";
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridFooterContainer,
  gridRowSelectionCountSelector,
  useGridApiContext,
  useGridSelector,
  type GridColumnVisibilityModel,
  type GridColDef,
  type GridRowsProp,
} from "@mui/x-data-grid";
import { koKR } from "@mui/x-data-grid/locales";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  PickersCalendarHeader,
  type PickersCalendarHeaderProps,
} from "@mui/x-date-pickers/PickersCalendarHeader";
import type { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import {
  DockviewReact,
  IDockviewHeaderActionsProps,
  IDockviewPanelProps,
} from "dockview";
import "dockview/dist/styles/dockview.css";
import Settings from "@mui/icons-material/Settings";
import RestartAlt from "@mui/icons-material/RestartAlt";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import Close from "@mui/icons-material/Close";
import Search from "@mui/icons-material/Search";
import Refresh from "@mui/icons-material/Refresh";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import "./styles.css";

type LayoutVariant = {
  label: string;
  option: "A" | "B";
  accent: string;
  dark: string;
  surface: string;
  active2: boolean;
};

type SidebarMode = "normal" | "collapsed" | "expanded";

function AlpasCalendarHeader(props: PickersCalendarHeaderProps) {
  const headerProps = {
    ...props,
    format: "YYYY년 M월",
  } as PickersCalendarHeaderProps;

  return <PickersCalendarHeader {...headerProps} />;
}

const variants: LayoutVariant[] = [
  {
    label: "OPTION A · ACTIVE",
    option: "A",
    accent: "#2468EB",
    dark: "#193A7A",
    surface: "#EFF5FF",
    active2: false,
  },
  {
    label: "OPTION B · ACTIVE",
    option: "B",
    accent: "#F97316",
    dark: "#833813",
    surface: "#FFF7ED",
    active2: false,
  },
  {
    label: "OPTION A · ACTIVE2",
    option: "A",
    accent: "#2468EB",
    dark: "#193A7A",
    surface: "#EFF5FF",
    active2: true,
  },
  {
    label: "OPTION B · ACTIVE2",
    option: "B",
    accent: "#F97316",
    dark: "#833813",
    surface: "#FFF7ED",
    active2: true,
  },
];

const menu = [
  ["수서대상관리", "희망자료관리", "희망자료통계"],
  ["구입", "구입자료관리", "검수자료관리", "구입자료출력"],
  ["기증", "기증자료관리", "기증자관리", "기증자료출력"],
  ["등록", "등록자료관리", "원부대장관리"],
  ["정리", "목록생성", "장비처리", "RFID대장"],
  ["열람", "배가일자료기록", "배가자료관리", "장서점검", "작업중통계"],
];

const sidebarItems = menu.flatMap(([, ...items]) => items);
const sidebarItemHref = (item: string) => `#sidebar-${encodeURIComponent(item)}`;
const selectedSidebarItemFromHash = () =>
  sidebarItems.find((item) => window.location.hash === sidebarItemHref(item));

// MUI Popover keeps the configured bottom origin and only shifts the menu
// inside the viewport. Flip the menu when the space below the select is not
// enough, so the menu never covers its trigger near the bottom edge.
function positionSelectMenuForViewport(element: HTMLElement) {
  const activeElement = document.activeElement;
  const activeSelect =
    activeElement instanceof HTMLElement &&
    activeElement.getAttribute("aria-expanded") === "true"
      ? activeElement
      : null;
  const anchor =
    activeSelect ??
    document.querySelector<HTMLElement>(
      '[role="combobox"][aria-expanded="true"]',
    );

  if (!anchor) return;

  const anchorRect = anchor.getBoundingClientRect();
  const menuHeight = element.offsetHeight;
  const viewportMargin = 16;
  const menuGap = 4;
  const menuCssMargin = 4;
  const spaceBelow = window.innerHeight - anchorRect.bottom - viewportMargin;
  const spaceAbove = anchorRect.top - viewportMargin;
  const shouldOpenAbove = menuHeight > spaceBelow && spaceAbove > spaceBelow;

  if (!shouldOpenAbove) return;

  const availableHeight = Math.max(0, Math.min(menuHeight, spaceAbove));
  element.style.maxHeight = `${availableHeight}px`;
  element.style.top = `${Math.round(
    anchorRect.top - availableHeight - menuGap - menuCssMargin,
  )}px`;
  element.style.transformOrigin = "left bottom";
}

const viewportAwareMenuTransitionProps = {
  onEntering: (element: HTMLElement) => {
    // MUI applies its default Popover position after onEntering. Queue the
    // flip so it runs immediately after that calculation and before the next
    // visible interaction frame.
    queueMicrotask(() => positionSelectMenuForViewport(element));
  },
};

// 02Components Select examples: popup below the field, 4px gap when space allows.
const selectMenuProps = {
  anchorOrigin: { vertical: "bottom" as const, horizontal: "left" as const },
  transformOrigin: { vertical: "top" as const, horizontal: "left" as const },
  TransitionProps: viewportAwareMenuTransitionProps,
  slotProps: { paper: { className: "alpas-select-menu" } },
};

const favoriteMenuProps = {
  ...selectMenuProps,
  slotProps: { paper: { className: "alpas-select-menu alpas-favorite-menu" } },
};

const selectionIndicatorMenuProps = {
  ...selectMenuProps,
  slotProps: { paper: { className: "alpas-select-menu alpas-selection-indicator-menu" } },
};

const libraryRoomOptions = ["종합자료실", "어린이자료실", "디지털자료실"];
const searchIndicatorOptions = ["서명", "저자", "자료실"];

const actionButtonDefinitions = [
  { id: "file-search", label: "파일검색", description: "자료 파일을 검색합니다." },
  { id: "member-info", label: "회원정보", description: "선택한 회원의 정보를 확인합니다." },
  { id: "book-detail", label: "책상세보기", description: "선택한 자료의 상세정보를 확인합니다." },
  { id: "notice-print", label: "독촉장출력", description: "선택한 항목의 독촉장을 출력합니다." },
  { id: "branch-notice-print", label: "관별 독촉장출력", description: "관별로 독촉장을 출력합니다." },
  { id: "notice-settings", label: "독촉장출력설정", description: "독촉장 출력 조건을 설정합니다." },
] as const;

type ActionButtonId = (typeof actionButtonDefinitions)[number]["id"];
type ActionButtonLayout = {
  active: ActionButtonId[];
  inactive: ActionButtonId[];
};

const actionButtonById = new Map(
  actionButtonDefinitions.map((action) => [action.id, action]),
);
const defaultActionButtonLayout: ActionButtonLayout = {
  active: actionButtonDefinitions.map((action) => action.id),
  inactive: [],
};
const actionButtonLayoutStorageKey = "alpas-action-button-layout-v1";

function cloneActionButtonLayout(layout: ActionButtonLayout): ActionButtonLayout {
  return { active: [...layout.active], inactive: [...layout.inactive] };
}

function readActionButtonLayout(): ActionButtonLayout {
  try {
    const saved = JSON.parse(
      window.localStorage.getItem(actionButtonLayoutStorageKey) ?? "null",
    ) as Partial<ActionButtonLayout> | null;
    const knownIds = new Set<ActionButtonId>(defaultActionButtonLayout.active);
    const orderedIds = [...(saved?.active ?? []), ...(saved?.inactive ?? [])]
      .filter((id): id is ActionButtonId => knownIds.has(id as ActionButtonId))
      .filter((id, index, values) => values.indexOf(id) === index);
    const missingIds = defaultActionButtonLayout.active.filter(
      (id) => !orderedIds.includes(id),
    );
    if (!saved || (!Array.isArray(saved.active) && !Array.isArray(saved.inactive))) {
      return cloneActionButtonLayout(defaultActionButtonLayout);
    }
    const activeIds = (saved.active ?? []).filter(
      (id): id is ActionButtonId => orderedIds.includes(id as ActionButtonId),
    );
    const inactiveIds = orderedIds.filter((id) => !activeIds.includes(id));
    return { active: [...activeIds, ...missingIds], inactive: inactiveIds };
  } catch {
    return cloneActionButtonLayout(defaultActionButtonLayout);
  }
}

function ActionButtonSettings({ variant }: { variant: LayoutVariant }) {
  const [savedLayout, setSavedLayout] = React.useState(readActionButtonLayout);
  const [draftLayout, setDraftLayout] = React.useState(() =>
    cloneActionButtonLayout(savedLayout),
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [draggedId, setDraggedId] = React.useState<ActionButtonId | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const layout = isEditing ? draftLayout : savedLayout;

  const moveAction = React.useCallback(
    (id: ActionButtonId, target: keyof ActionButtonLayout, beforeId?: ActionButtonId) => {
      setDraftLayout((current) => {
        const next = cloneActionButtonLayout(current);
        next.active = next.active.filter((actionId) => actionId !== id);
        next.inactive = next.inactive.filter((actionId) => actionId !== id);
        const targetList = next[target];
        const targetIndex = beforeId ? targetList.indexOf(beforeId) : -1;
        targetList.splice(targetIndex >= 0 ? targetIndex : targetList.length, 0, id);
        return next;
      });
    },
    [],
  );

  const openSettings = () => {
    setDraftLayout(cloneActionButtonLayout(savedLayout));
    setIsEditing(true);
  };

  const closeSettings = () => {
    setDraftLayout(cloneActionButtonLayout(savedLayout));
    setIsEditing(false);
    setDraggedId(null);
  };

  const saveSettings = () => {
    const nextLayout = cloneActionButtonLayout(draftLayout);
    setSavedLayout(nextLayout);
    window.localStorage.setItem(
      actionButtonLayoutStorageKey,
      JSON.stringify(nextLayout),
    );
    setIsEditing(false);
    setDraggedId(null);
    setSaveDialogOpen(true);
  };

  const renderAction = (
    id: ActionButtonId,
    zone: keyof ActionButtonLayout,
  ) => {
    const action = actionButtonById.get(id)!;
    const isInactive = zone === "inactive";
    return (
      <Tooltip
        key={id}
        title={
          isEditing
            ? `${action.label}: 드래그하여 위치를 변경합니다.`
            : action.description
        }
        placement="bottom"
        arrow
        describeChild
        slotProps={{
          tooltip: { className: "alpas-action-tooltip" },
          arrow: { className: "alpas-action-tooltip-arrow" },
        }}
      >
        <span
          className="action-button-shell"
          onDragOver={(event) => {
            if (!isEditing) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }}
          onDrop={(event) => {
            if (!isEditing) return;
            event.preventDefault();
            event.stopPropagation();
            const droppedId = (event.dataTransfer.getData("text/plain") ||
              draggedId) as ActionButtonId;
            if (actionButtonById.has(droppedId)) moveAction(droppedId, zone, id);
          }}
        >
          <Button
            className={`alpas-button action-with-tooltip${isInactive ? " is-inactive" : ""}${draggedId === id ? " is-dragging" : ""}`}
            size="small"
            variant="outlined"
            disabled={!isEditing && isInactive}
            draggable={isEditing}
            aria-label={
              isEditing
                ? `${action.label}, ${isInactive ? "미사용" : "사용"} 버튼, 드래그하여 이동`
                : undefined
            }
            onDoubleClick={() => {
              if (isEditing) moveAction(id, isInactive ? "active" : "inactive");
            }}
            onDragStart={(event) => {
              if (!isEditing) return;
              setDraggedId(id);
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", id);
            }}
            onDragEnd={() => setDraggedId(null)}
          >
            {action.label}
          </Button>
        </span>
      </Tooltip>
    );
  };

  const renderDropZone = (
    zone: keyof ActionButtonLayout,
    ids: ActionButtonId[],
  ) => (
    <div
      className={`action-drop-zone action-${zone}-zone`}
      data-action-zone={zone}
      onDragOver={(event) => {
        if (!isEditing) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        if (!isEditing) return;
        event.preventDefault();
        const droppedId = (event.dataTransfer.getData("text/plain") ||
          draggedId) as ActionButtonId;
        if (actionButtonById.has(droppedId)) moveAction(droppedId, zone);
      }}
    >
      {ids.map((id) => renderAction(id, zone))}
      {zone === "inactive" && ids.length === 0 && (
        <span className="action-storage-placeholder">
          사용하지 않는 버튼을 이곳에 놓아 주세요.
        </span>
      )}
    </div>
  );

  return (
    <>
      <section
        className={`actions${isEditing ? " is-editing" : ""}${layout.inactive.length ? " has-inactive" : ""}`}
        aria-label="그리드 기능 버튼"
      >
        {renderDropZone("active", layout.active)}
        {isEditing && renderDropZone("inactive", layout.inactive)}
        <Tooltip title={isEditing ? "버튼 설정 닫기" : "버튼 설정"}>
          <IconButton
            className="panel-settings"
            size="small"
            aria-label={isEditing ? "버튼 설정 닫기" : "버튼 설정"}
            aria-pressed={isEditing}
            onClick={isEditing ? closeSettings : openSettings}
          >
            <Settings />
          </IconButton>
        </Tooltip>
        {isEditing && (
          <div className="action-edit-controls">
            <Tooltip title="버튼 설정을 초기화합니다.">
              <IconButton
                className="action-layout-control"
                size="small"
                aria-label="버튼 설정 초기화"
                onClick={() =>
                  setDraftLayout(cloneActionButtonLayout(defaultActionButtonLayout))
                }
              >
                <RestartAlt />
              </IconButton>
            </Tooltip>
            <Tooltip title="현재 버튼 설정을 저장합니다.">
              <IconButton
                className="action-layout-control action-layout-save"
                size="small"
                aria-label="현재 버튼 설정 저장"
                onClick={saveSettings}
              >
                <SaveOutlined />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </section>
      <Dialog
        className={`action-save-dialog option-${variant.option.toLowerCase()}`}
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        aria-labelledby="action-save-dialog-title"
        slotProps={{ paper: { className: "action-save-dialog-paper" } }}
      >
        <DialogTitle className="action-save-dialog-title" id="action-save-dialog-title">
          <Typography component="span">알림</Typography>
          <IconButton
            size="small"
            aria-label="알림 닫기"
            onClick={() => setSaveDialogOpen(false)}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className="action-save-dialog-content">
          <Typography>버튼 배치를 저장했습니다.</Typography>
        </DialogContent>
        <DialogActions className="action-save-dialog-actions">
          <Button
            className="alpas-button"
            type="button"
            variant="contained"
            onClick={() => setSaveDialogOpen(false)}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function Header({ variant }: { variant: LayoutVariant }) {
  return (
    <header
      className={`app-header option-${variant.option.toLowerCase()} ${variant.active2 ? "active2" : "active"}`}
    >
      <div className="logo" style={{ color: variant.accent }}>
        ALPAS
      </div>
      <div className="header-tools">
        <div className="header-search">
          <TextField
            type="text"
            size="small"
            variant="outlined"
            placeholder="검색어 입력"
            inputProps={{ "aria-label": "검색어 입력" }}
          />
          <Button className="alpas-button" type="button" variant="contained">
            검색
          </Button>
        </div>
        <span className="help">문의 : 1599-5478</span>
        <span
          className="avatar"
          style={{ background: variant.surface }}
          aria-hidden="true"
        />
        <span className="user">
          MA관리자님
          <br />
          <small>행복도서관</small>
        </span>
        <span className="header-settings">
          <Tooltip title="환경설정">
            <IconButton size="small" aria-label="환경설정">
              <Settings />
            </IconButton>
          </Tooltip>
        </span>
        <span className="header-logout">
          <Tooltip title="로그아웃">
            <IconButton size="small" color="error" aria-label="로그아웃">
              <PowerSettingsNew />
            </IconButton>
          </Tooltip>
        </span>
      </div>
    </header>
  );
}

function Sidebar({
  variant,
  mode,
  onModeChange,
}: {
  variant: LayoutVariant;
  mode: SidebarMode;
  onModeChange: (mode: SidebarMode) => void;
}) {
  const [activeItem, setActiveItem] = React.useState(
    () => selectedSidebarItemFromHash() ?? "희망자료관리",
  );

  React.useEffect(() => {
    const syncSelection = () => {
      setActiveItem(selectedSidebarItemFromHash() ?? "희망자료관리");
    };
    window.addEventListener("hashchange", syncSelection);
    return () => window.removeEventListener("hashchange", syncSelection);
  }, []);

  return (
    <aside
      className="sidebar"
      data-option={variant.option}
      style={
        {
          background: variant.dark,
          "--sidebar-accent": variant.accent,
          "--sidebar-active-hover": variant.option === "A" ? "#1D56BC" : "#EA580C",
        } as React.CSSProperties
      }
    >
      <div className="sidebar-top">
        <Select
          className="alpas-select"
          size="small"
          value="즐겨찾기"
          IconComponent={ExpandMore}
          inputProps={{ "aria-label": "즐겨찾기" }}
          MenuProps={favoriteMenuProps}
        >
          <MenuItem value="즐겨찾기">즐겨찾기</MenuItem>
        </Select>
        <div className="sidebar-arrows">
          {mode !== "collapsed" && (
            <button
              type="button"
              aria-label={mode === "expanded" ? "사이드바 기본 너비로 복원" : "사이드바 접기"}
              aria-pressed={mode === "expanded"}
              onClick={() => onModeChange(mode === "expanded" ? "normal" : "collapsed")}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
          )}
          {mode !== "expanded" && (
            <button
              type="button"
              aria-label={mode === "collapsed" ? "사이드바 기본 너비로 복원" : "사이드바 전체 화면으로 펼치기"}
              aria-pressed={mode === "collapsed"}
              onClick={() => onModeChange(mode === "collapsed" ? "normal" : "expanded")}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <nav className="quick-nav" aria-label="자료 유형 메뉴">
        <ul>
          <li>
            <a href="#home" aria-label="홈">
              <HomeOutlined aria-hidden="true" />
            </a>
          </li>
          <li><a href="#monographs">단행자료</a></li>
          <li><a href="#serials">연속자료</a></li>
          <li><a href="#shared-resources">공통자료</a></li>
        </ul>
      </nav>
      <div className="sidebar-menu">
        {menu.map(([heading, ...items]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <nav aria-label={`${heading} 메뉴`}>
              <ul>
                {items.map((item) => (
                  <li key={item} className={activeItem === item ? "active-menu" : ""}>
                    <a
                      href={sidebarItemHref(item)}
                      aria-current={activeItem === item ? "location" : undefined}
                      onClick={() => setActiveItem(item)}
                    >
                      {item}
                      {activeItem === item && <ChevronRight aria-hidden="true" />}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        ))}
      </div>
    </aside>
  );
}

// Stable column definitions preserve the DataGrid's user-resized widths on re-render.
const gridColumns: GridColDef[] = [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 48,
    minWidth: 48,
    maxWidth: 48,
    resizable: false,
  },
  { field: "number", headerName: "번호", width: 64, type: "number" as const },
  { field: "borrowerNumber", headerName: "대출자번호", width: 118 },
  { field: "borrower", headerName: "대출자", width: 84 },
  { field: "birthDate", headerName: "생년월일", width: 104 },
  { field: "phone", headerName: "전화번호", width: 112 },
  { field: "email", headerName: "E-MAIL", width: 112 },
  { field: "loanStatus", headerName: "대출상태", width: 96 },
  { field: "registrationNumber", headerName: "등록번호", width: 112 },
  { field: "callNumber", headerName: "청구기호", width: 112 },
  { field: "title", headerName: "서명", width: 170 },
  { field: "room", headerName: "자료실", width: 112 },
].map((column) => ({ ...column, headerAlign: "center" }));
const configurableGridColumns = gridColumns.filter(
  (column) =>
    column.headerName && column.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field,
);
const defaultGridColumnVisibilityModel = Object.fromEntries(
  configurableGridColumns.map((column) => [column.field, true]),
) as GridColumnVisibilityModel;
// Prototype-only fixtures: masked contact details and reserved example.com mailboxes.
const sampleLoanEntries = [
  ["김하늘", "도서관 자료관리 시스템 운영 지침"],
  ["이서준", "한국 도서관의 미래와 이용자 경험"],
  ["박지우", "자료분류 실무 가이드"],
  ["최윤아", "공공도서관 서비스 기획"],
  ["정민재", "독서문화 프로그램 운영"],
  ["한수빈", "정보검색과 데이터 활용"],
  ["오지훈", "어린이 자료실 이야기"],
  ["강예린", "디지털 아카이브 입문"],
  ["조현우", "지역 기록물 관리의 이해"],
  ["윤다은", "도서관 공간 디자인"],
  ["장도윤", "서지정보 작성 실습"],
  ["임유진", "이용자 중심 서비스 설계"],
  ["신태양", "책과 함께하는 마을"],
  ["서아린", "자료 보존과 복원"],
  ["권시우", "메타데이터의 기초"],
  ["배채원", "독서교육 현장 사례"],
  ["문서아", "도서관 통계 활용법"],
  ["백도현", "함께 읽는 인문학"],
] as const;
const sampleLoanRows: GridRowsProp = sampleLoanEntries.map(([borrower, title], index) => {
  const number = index + 1;
  const serial = String(number).padStart(4, "0");
  return {
    id: number,
    number,
    borrowerNumber: `DEMO-${serial}`,
    borrower,
    birthDate: `${1985 + (index % 15)}-**-**`,
    phone: `010-****-${1000 + number}`,
    email: `demo${serial}@example.com`,
    loanStatus: ["대출중", "반납완료", "연체"][index % 3],
    registrationNumber: `BK-2026-${serial}`,
    callNumber: `813.7-${String(100 + index)}`,
    title,
    room: ["종합자료실", "어린이자료실", "디지털자료실"][index % 3],
  };
});
const emptyGridRows: GridRowsProp = [];

type InfiniteGridFooterContextValue = {
  batchSize: number;
  loadedCount: number;
  totalCount: number;
  hasMore: boolean;
  setBatchSize: (value: number) => void;
  openSettings: () => void;
};

const InfiniteGridFooterContext = React.createContext<
  InfiniteGridFooterContextValue | undefined
>(undefined);

function ResultsFooter() {
  const apiRef = useGridApiContext();
  const selected = useGridSelector(apiRef, gridRowSelectionCountSelector);
  const infiniteGrid = React.useContext(InfiniteGridFooterContext);
  if (!infiniteGrid) return null;
  const {
    batchSize,
    loadedCount,
    totalCount,
    hasMore,
    setBatchSize,
    openSettings,
  } = infiniteGrid;
  return (
    <GridFooterContainer className="grid-foot">
      <Typography component="span" variant="inherit">
        총 {totalCount}건 / 선택 항목 {selected}건
      </Typography>
      <div
        className="per-page-control"
        data-loaded-count={loadedCount}
        data-has-more={hasMore}
      >
        <Typography component="span" variant="inherit">
          한 번에
        </Typography>
        <Select
          className="per-page-select"
          size="small"
          value={batchSize}
          onChange={(event) => setBatchSize(Number(event.target.value))}
          IconComponent={ExpandMore}
          inputProps={{ "aria-label": "한 번에 불러올 건수" }}
          MenuProps={selectMenuProps}
        >
          <MenuItem value={25}>25건</MenuItem>
          <MenuItem value={50}>50건</MenuItem>
          <MenuItem value={100}>100건</MenuItem>
        </Select>
      </div>
      <Tooltip title="그리드 설정">
        <IconButton
          className="grid-settings"
          size="small"
          aria-label="그리드 설정"
          onClick={openSettings}
        >
          <Settings />
        </IconButton>
      </Tooltip>
    </GridFooterContainer>
  );
}

type GridSettingsDialogValue = {
  fontSize: number;
  rowHeight: number;
  batchSize: number;
  selectionScope: "현재 화면" | "전체 데이터";
  columnVisibilityModel: GridColumnVisibilityModel;
};

function GridSettingsDialog({
  open,
  value,
  onClose,
  onSave,
}: {
  open: boolean;
  value: GridSettingsDialogValue;
  onClose: () => void;
  onSave: (value: GridSettingsDialogValue) => void;
}) {
  const [draft, setDraft] = React.useState(value);

  React.useEffect(() => {
    if (open) {
      setDraft({
        ...value,
        columnVisibilityModel: { ...value.columnVisibilityModel },
      });
    }
  }, [open, value]);

  const updateDraft = <Key extends keyof GridSettingsDialogValue>(
    key: Key,
    nextValue: GridSettingsDialogValue[Key],
  ) => setDraft((current) => ({ ...current, [key]: nextValue }));

  const resetDraft = () =>
    setDraft({
      fontSize: 14,
      rowHeight: 42,
      batchSize: 25,
      selectionScope: "현재 화면",
      columnVisibilityModel: { ...defaultGridColumnVisibilityModel },
    });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="grid-settings-dialog"
      aria-labelledby="grid-settings-title"
      slotProps={{ paper: { className: "grid-settings-dialog-paper" } }}
    >
      <DialogTitle className="grid-settings-title">
        <Typography id="grid-settings-title" component="h2">
          그리드 설정
        </Typography>
        <IconButton
          className="grid-settings-close"
          size="small"
          aria-label="그리드 설정 닫기"
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className="grid-settings-content">
        <div className="grid-settings-sections">
          <section className="grid-settings-section" aria-labelledby="grid-display-settings-title">
            <Typography
              id="grid-display-settings-title"
              className="grid-settings-section-title"
              component="h3"
            >
              설정
            </Typography>
            <div className="grid-settings-card grid-settings-values">
              <label>
                <span>글자크기</span>
                <Select
                  className="grid-settings-select"
                  size="small"
                  value={draft.fontSize}
                  onChange={(event) => updateDraft("fontSize", Number(event.target.value))}
                  IconComponent={ExpandMore}
                  inputProps={{ "aria-label": "그리드 글자크기" }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={14}>14</MenuItem>
                  <MenuItem value={16}>16</MenuItem>
                </Select>
              </label>
              <label>
                <span>행 높이</span>
                <Select
                  className="grid-settings-select"
                  size="small"
                  value={draft.rowHeight}
                  onChange={(event) => updateDraft("rowHeight", Number(event.target.value))}
                  IconComponent={ExpandMore}
                  inputProps={{ "aria-label": "그리드 행 높이" }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value={36}>좁게</MenuItem>
                  <MenuItem value={42}>보통</MenuItem>
                  <MenuItem value={48}>넓게</MenuItem>
                </Select>
              </label>
              <label>
                <span>한 번에</span>
                <Select
                  className="grid-settings-select"
                  size="small"
                  value={draft.batchSize}
                  onChange={(event) => updateDraft("batchSize", Number(event.target.value))}
                  IconComponent={ExpandMore}
                  inputProps={{ "aria-label": "한 번에 불러올 건수 설정" }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value={25}>25건</MenuItem>
                  <MenuItem value={50}>50건</MenuItem>
                  <MenuItem value={100}>100건</MenuItem>
                </Select>
              </label>
              <label>
                <span>선택 범위</span>
                <Select
                  className="grid-settings-select"
                  size="small"
                  value={draft.selectionScope}
                  onChange={(event) =>
                    updateDraft(
                      "selectionScope",
                      event.target.value as GridSettingsDialogValue["selectionScope"],
                    )
                  }
                  IconComponent={ExpandMore}
                  inputProps={{ "aria-label": "그리드 선택 범위" }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="현재 화면">현재 화면</MenuItem>
                  <MenuItem value="전체 데이터">전체 데이터</MenuItem>
                </Select>
              </label>
            </div>
          </section>
          <section className="grid-settings-section" aria-labelledby="grid-column-settings-title">
            <Typography
              id="grid-column-settings-title"
              className="grid-settings-section-title"
              component="h3"
            >
              컬럼설정
            </Typography>
            <div
              className="grid-settings-card grid-settings-columns"
              role="group"
              aria-label="표시할 컬럼"
            >
              {configurableGridColumns.map((column) => (
                <label key={column.field}>
                  <Checkbox
                    size="small"
                    checked={draft.columnVisibilityModel[column.field] !== false}
                    icon={<span className="grid-checkbox-icon" />}
                    onChange={(event) =>
                      updateDraft("columnVisibilityModel", {
                        ...draft.columnVisibilityModel,
                        [column.field]: event.target.checked,
                      })
                    }
                    inputProps={{ "aria-label": `${column.headerName} 컬럼 표시` }}
                  />
                  <span>{column.headerName}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
      <DialogActions className="grid-settings-actions">
        <Button type="button" variant="outlined" onClick={resetDraft}>
          초기화
        </Button>
        <Button type="button" variant="contained" onClick={() => onSave(draft)}>
          현재 설정 저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type DetailedSearchForm = {
  management: string;
  status: string;
  applicant: string;
  borrowerNumber: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  title: string;
  author: string;
  publisher: string;
  publicationYear: string;
  isbn: string;
  recommendation: string;
  keepManagement: boolean;
  keepStatus: boolean;
  keepDate: boolean;
};

const emptyDetailedSearchForm = (): DetailedSearchForm => ({
  management: "행복도서관",
  status: "신청중",
  applicant: "",
  borrowerNumber: "",
  startDate: null,
  endDate: null,
  title: "",
  author: "",
  publisher: "",
  publicationYear: "",
  isbn: "",
  recommendation: "",
  keepManagement: false,
  keepStatus: false,
  keepDate: false,
});

function DetailedSearchDialog({
  open,
  onClose,
  variant,
}: {
  open: boolean;
  onClose: () => void;
  variant: LayoutVariant;
}) {
  const [draft, setDraft] = React.useState<DetailedSearchForm>(emptyDetailedSearchForm);

  React.useEffect(() => {
    if (open) setDraft(emptyDetailedSearchForm());
  }, [open]);

  const updateDraft = <Key extends keyof DetailedSearchForm>(
    key: Key,
    value: DetailedSearchForm[Key],
  ) => setDraft((current) => ({ ...current, [key]: value }));

  const resetDraft = () => setDraft(emptyDetailedSearchForm());

  const renderTextField = (
    key: Exclude<keyof DetailedSearchForm, "management" | "status" | "startDate" | "endDate" | "keepManagement" | "keepStatus" | "keepDate">,
    label: string,
  ) => (
    <TextField
      className="detailed-search-input"
      size="small"
      value={draft[key]}
      onChange={(event) => updateDraft(key, event.target.value)}
      inputProps={{ "aria-label": label }}
    />
  );

  const renderKeepCheckbox = (
    key: "keepManagement" | "keepStatus" | "keepDate",
    label: string,
  ) => (
    <label className="detailed-search-keep">
      <Checkbox
        size="small"
        checked={draft[key]}
        onChange={(event) => updateDraft(key, event.target.checked)}
        icon={<span className="grid-checkbox-icon" />}
        inputProps={{ "aria-label": `${label} ${key === "keepDate" ? "신청일자" : "조건"} 유지` }}
      />
      <span>{label}</span>
    </label>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={`detailed-search-dialog option-${variant.option.toLowerCase()}`}
      aria-labelledby="detailed-search-title"
      slotProps={{ paper: { className: "detailed-search-dialog-paper" } }}
    >
      <DialogTitle className="detailed-search-title">
        <Typography id="detailed-search-title" component="h2">
          비치희망자료 상세검색
        </Typography>
        <IconButton
          className="detailed-search-close"
          size="small"
          aria-label="상세검색 닫기"
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className="detailed-search-content">
        <div className="detailed-search-form">
          <div className="detailed-search-row">
            <span className="detailed-search-label">관리구분</span>
            <div className="detailed-search-control-group">
              <Select
                className="detailed-search-select"
                size="small"
                value={draft.management}
                onChange={(event) => updateDraft("management", event.target.value)}
                IconComponent={ExpandMore}
                inputProps={{ "aria-label": "관리구분" }}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="행복도서관">행복도서관</MenuItem>
                <MenuItem value="중앙도서관">중앙도서관</MenuItem>
              </Select>
              <Button className="alpas-button" type="button" variant="outlined">
                전관 선택
              </Button>
            </div>
            {renderKeepCheckbox("keepManagement", "유지")}
          </div>
          <div className="detailed-search-row">
            <span className="detailed-search-label">비치상태</span>
            <div className="detailed-search-control-group">
              <Select
                className="detailed-search-select detailed-search-select-wide"
                size="small"
                value={draft.status}
                onChange={(event) => updateDraft("status", event.target.value)}
                IconComponent={ExpandMore}
                inputProps={{ "aria-label": "비치상태" }}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="신청중">신청중</MenuItem>
                <MenuItem value="처리중">처리중</MenuItem>
                <MenuItem value="처리완료">처리완료</MenuItem>
              </Select>
            </div>
            {renderKeepCheckbox("keepStatus", "유지")}
          </div>
          <div className="detailed-search-row">
            <span className="detailed-search-label">신청자명</span>
            {renderTextField("applicant", "신청자명")}
          </div>
          <div className="detailed-search-row">
            <span className="detailed-search-label">대출자번호</span>
            {renderTextField("borrowerNumber", "대출자번호")}
          </div>
          <div className="detailed-search-row">
            <span className="detailed-search-label">신청일자</span>
            <div className="detailed-search-date-range">
              <DesktopDatePicker
                value={draft.startDate}
                onChange={(value) => updateDraft("startDate", value)}
                format="YYYY.MM.DD"
                slots={{
                  openPickerIcon: CalendarMonthOutlined,
                  calendarHeader: AlpasCalendarHeader,
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    className: "detailed-search-date-input",
                    slotProps: { htmlInput: { "aria-label": "신청일자 시작일" } },
                  },
                  popper: {
                    className: `alpas-date-picker-popper option-${variant.option.toLowerCase()}`,
                    placement: "bottom-start",
                  },
                  desktopPaper: { className: "alpas-date-picker-paper" },
                }}
              />
              <span className="detailed-search-date-separator">~</span>
              <DesktopDatePicker
                value={draft.endDate}
                onChange={(value) => updateDraft("endDate", value)}
                format="YYYY.MM.DD"
                slots={{
                  openPickerIcon: CalendarMonthOutlined,
                  calendarHeader: AlpasCalendarHeader,
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    className: "detailed-search-date-input",
                    slotProps: { htmlInput: { "aria-label": "신청일자 종료일" } },
                  },
                  popper: {
                    className: `alpas-date-picker-popper option-${variant.option.toLowerCase()}`,
                    placement: "bottom-start",
                  },
                  desktopPaper: { className: "alpas-date-picker-paper" },
                }}
              />
            </div>
            {renderKeepCheckbox("keepDate", "유지")}
          </div>
          <div className="detailed-search-row">
            <span className="detailed-search-label">서명</span>
            {renderTextField("title", "서명")}
          </div>
          <div className="detailed-search-row">
            <span className="detailed-search-label">저자</span>
            {renderTextField("author", "저자")}
          </div>
          <div className="detailed-search-row">
            <span className="detailed-search-label">발행자</span>
            {renderTextField("publisher", "발행자")}
          </div>
          <div className="detailed-search-row">
            <span className="detailed-search-label">발행년</span>
            {renderTextField("publicationYear", "발행년")}
          </div>
          <div className="detailed-search-row">
            <span className="detailed-search-label">ISBN</span>
            {renderTextField("isbn", "ISBN")}
          </div>
          <div className="detailed-search-row">
            <span className="detailed-search-label">추천의견</span>
            {renderTextField("recommendation", "추천의견")}
          </div>
        </div>
      </DialogContent>
      <DialogActions className="detailed-search-actions">
        <Button className="alpas-button" type="button" variant="outlined" onClick={resetDraft}>
          화면지우기
        </Button>
        <span className="detailed-search-actions-spacer" />
        <Button className="alpas-button" type="button" variant="contained" onClick={onClose}>
          검색
        </Button>
        <Button className="alpas-button" type="button" variant="outlined" onClick={onClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Grid({ variant }: { variant: LayoutVariant }) {
  const allRows = variant.active2 ? emptyGridRows : sampleLoanRows;
  const totalCount = allRows.length;
  const [batchSize, setBatchSizeState] = React.useState(25);
  const [gridFontSize, setGridFontSize] = React.useState(14);
  const [rowHeight, setRowHeight] = React.useState(42);
  const [selectionScope, setSelectionScope] = React.useState<
    GridSettingsDialogValue["selectionScope"]
  >("현재 화면");
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>({
      ...defaultGridColumnVisibilityModel,
    });
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [loadedCount, setLoadedCount] = React.useState(() =>
    Math.min(25, totalCount),
  );
  const gridHostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setLoadedCount(Math.min(batchSize, totalCount));
  }, [batchSize, totalCount, variant.label]);

  React.useEffect(() => {
    const scroller = gridHostRef.current?.querySelector<HTMLElement>(
      ".MuiDataGrid-virtualScroller",
    );
    if (!scroller || loadedCount >= totalCount) return;

    const loadNextBatch = () => {
      const remaining =
        scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
      if (remaining <= 84) {
        setLoadedCount((count) => Math.min(count + batchSize, totalCount));
      }
    };

    scroller.addEventListener("scroll", loadNextBatch, { passive: true });
    const frame = window.requestAnimationFrame(loadNextBatch);
    return () => {
      window.cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", loadNextBatch);
    };
  }, [batchSize, loadedCount, totalCount]);

  const setBatchSize = React.useCallback(
    (value: number) => {
      setBatchSizeState(value);
      setLoadedCount(Math.min(value, totalCount));
    },
    [totalCount],
  );

  const footerContext = React.useMemo(
    () => ({
      batchSize,
      loadedCount,
      totalCount,
      hasMore: loadedCount < totalCount,
      setBatchSize,
      openSettings: () => setSettingsOpen(true),
    }),
    [batchSize, loadedCount, setBatchSize, totalCount],
  );

  const dialogValue = React.useMemo(
    () => ({
      fontSize: gridFontSize,
      rowHeight,
      batchSize,
      selectionScope,
      columnVisibilityModel,
    }),
    [batchSize, columnVisibilityModel, gridFontSize, rowHeight, selectionScope],
  );

  const saveGridSettings = (nextValue: GridSettingsDialogValue) => {
    setGridFontSize(nextValue.fontSize);
    setRowHeight(nextValue.rowHeight);
    setBatchSize(nextValue.batchSize);
    setSelectionScope(nextValue.selectionScope);
    setColumnVisibilityModel({ ...nextValue.columnVisibilityModel });
    setSettingsOpen(false);
  };

  return (
    <InfiniteGridFooterContext.Provider value={footerContext}>
      <div
        ref={gridHostRef}
        className="grid-infinite-host"
        data-infinite-scroll="true"
        data-batch-size={batchSize}
      >
        <DataGrid
          className="alpas-grid"
          aria-label="대출 자료 검색 결과"
          rows={allRows.slice(0, loadedCount)}
          columns={gridColumns}
          columnVisibilityModel={columnVisibilityModel}
          columnHeaderHeight={42}
          rowHeight={rowHeight}
          style={
            { "--alpas-grid-font-size": `${gridFontSize}px` } as React.CSSProperties
          }
          checkboxSelection
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: -1 } },
          }}
          pageSizeOptions={[{ value: -1, label: "전체" }]}
          localeText={{
            ...koKR.components.MuiDataGrid.defaultProps.localeText,
            noRowsLabel: "결과가 없습니다",
          }}
          slots={{ footer: ResultsFooter }}
          slotProps={{
            baseCheckbox: {
              material: {
                icon: <span className="grid-checkbox-icon" />,
              },
            },
            rowCheckbox: {
              material: {
                icon: <span className="grid-checkbox-icon" />,
              },
            },
            noRowsOverlay: { className: "alpas-empty" },
          }}
        />
      </div>
      <GridSettingsDialog
        open={settingsOpen}
        value={dialogValue}
        onClose={() => setSettingsOpen(false)}
        onSave={saveGridSettings}
      />
    </InfiniteGridFooterContext.Provider>
  );
}

function WorkspacePanel({ variant }: { variant: LayoutVariant }) {
  const [dateBasis, setDateBasis] = React.useState("대출일");
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [libraryRoom, setLibraryRoom] = React.useState<string | null>(null);
  const [searchText, setSearchText] = React.useState("");
  const [searchIndicators, setSearchIndicators] = React.useState<string[]>([]);
  const [detailSearchOpen, setDetailSearchOpen] = React.useState(false);
  return (
    <div className="dock-panel-content">
      <div className="filters loan-filters">
        <Select
          className="alpas-select"
          size="small"
          value={dateBasis}
          onChange={(event) => setDateBasis(event.target.value)}
          IconComponent={ExpandMore}
          inputProps={{ "aria-label": "날짜 기준" }}
          MenuProps={selectMenuProps}
        >
          <MenuItem value="대출일">대출일</MenuItem>
          <MenuItem value="반납일">반납일</MenuItem>
        </Select>
        <div className="panel-date-picker-shell start-date-picker">
          <DesktopDatePicker
            value={startDate}
            onChange={setStartDate}
            format="YYYY.MM.DD"
            slots={{
              openPickerIcon: CalendarMonthOutlined,
              calendarHeader: AlpasCalendarHeader,
            }}
            slotProps={{
              textField: {
                size: "small",
                slotProps: {
                  htmlInput: { "aria-label": "시작일" },
                },
              },
              popper: {
                className: `alpas-date-picker-popper option-${variant.option.toLowerCase()}`,
                placement: "bottom-start",
              },
              desktopPaper: {
                className: "alpas-date-picker-paper",
              },
            }}
          />
        </div>
        <span className="date-separator">–</span>
        <div className="panel-date-picker-shell end-date-picker">
          <DesktopDatePicker
            value={endDate}
            onChange={setEndDate}
            format="YYYY.MM.DD"
            slots={{
              openPickerIcon: CalendarMonthOutlined,
              calendarHeader: AlpasCalendarHeader,
            }}
            slotProps={{
              textField: {
                size: "small",
                slotProps: {
                  htmlInput: { "aria-label": "종료일" },
                },
              },
              popper: {
                className: `alpas-date-picker-popper option-${variant.option.toLowerCase()}`,
                placement: "bottom-start",
              },
              desktopPaper: {
                className: "alpas-date-picker-paper",
              },
            }}
          />
        </div>
        <Autocomplete
          className="panel-autocomplete"
          options={libraryRoomOptions}
          value={libraryRoom}
          onChange={(_, value) => setLibraryRoom(value)}
          popupIcon={<ExpandMore />}
          forcePopupIcon
          noOptionsText="검색 결과가 없습니다."
          slotProps={{
            paper: {
              className: `panel-autocomplete-paper option-${variant.option.toLowerCase()}`,
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="자료실 검색 또는 선택"
              inputProps={{
                ...params.inputProps,
                "aria-label": "자료실 검색 또는 선택",
              }}
            />
          )}
        />
        <TextField
          className="loan-search-textfield"
          size="small"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="검색어 입력"
          inputProps={{ "aria-label": "검색어" }}
        />
        <Select
          className="alpas-select search-selection-indicator-select"
          size="small"
          multiple
          displayEmpty
          value={searchIndicators}
          onChange={(event) => {
            const value = event.target.value;
            setSearchIndicators(typeof value === "string" ? value.split(",") : value);
          }}
          renderValue={(selected) => {
            const values = selected as string[];
            return values.length ? values.join(", ") : "태그 선택";
          }}
          IconComponent={ExpandMore}
          inputProps={{ "aria-label": "선택 지표" }}
          MenuProps={selectionIndicatorMenuProps}
        >
          {searchIndicatorOptions.map((option) => (
            <MenuItem className="selection-indicator-option" key={option} value={option}>
              <Checkbox
                size="small"
                checked={searchIndicators.includes(option)}
                icon={<span className="grid-checkbox-icon" />}
                disableRipple
                tabIndex={-1}
                sx={{
                  color: "#9ca3af",
                  "&.Mui-checked": {
                    color: variant.option === "A" ? "#2468eb" : "#f97316",
                  },
                }}
                inputProps={{ "aria-label": `${option} 선택` }}
              />
              <span>{option}</span>
            </MenuItem>
          ))}
        </Select>
        <Button className="alpas-button" type="button" variant="contained">
          <Search />
          검색
        </Button>
        <Button
          className="alpas-button detail-search-button"
          type="button"
          variant="outlined"
          onClick={() => setDetailSearchOpen(true)}
        >
          상세검색
        </Button>
        <Tooltip title="초기화">
          <IconButton
            size="small"
            aria-label="초기화"
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              setLibraryRoom(null);
              setSearchText("");
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </div>
      <ActionButtonSettings variant={variant} />
      <Grid variant={variant} />
      <DetailedSearchDialog
        open={detailSearchOpen}
        onClose={() => setDetailSearchOpen(false)}
        variant={variant}
      />
    </div>
  );
}

function DockPanel({
  api,
  params,
}: IDockviewPanelProps<{ variant: LayoutVariant }>) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    // Mount the virtualized grid only after Dockview has measured its visible panel.
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
  return ready ? <WorkspacePanel variant={params.variant} /> : null;
}

function DockHeaderActions({}: IDockviewHeaderActionsProps & {
  variant: LayoutVariant;
}) {
  return (
    <Stack direction="row" className="dock-header-actions">
      <Tooltip title="복사">
        <IconButton size="small" aria-label="복사">
          <ContentCopyOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="닫기">
        <IconButton size="small" aria-label="닫기">
          <Close />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

function Workspace({ variant }: { variant: LayoutVariant }) {
  const panelTitles = variant.active2
    ? ["희망자료관리", "대출·반납", "대시보드"]
    : ["희망자료관리", "대출·반납"];
  return (
    <main className="workspace">
      <div
        className={`dockview-shell option-${variant.option.toLowerCase()} ${variant.active2 ? "active2" : "active"}`}
        style={
          {
            "--alpas-accent": variant.accent,
            "--alpas-surface": variant.surface,
            "--alpas-row-selected": variant.option === "A" ? "#D3E1FB" : "#FFEDD5",
          } as React.CSSProperties
        }
      >
        <DockviewReact
          key={variant.label}
          className="dockview-theme-light alpas-dockview"
          components={{
            workspace: (props) => (
              <DockPanel {...props} params={{ ...props.params, variant }} />
            ),
          }}
          rightHeaderActionsComponent={(props) => (
            <DockHeaderActions {...props} variant={variant} />
          )}
          onReady={({ api }) => {
            let firstPanel: ReturnType<typeof api.addPanel> | undefined;
            panelTitles.forEach((title, index) => {
              const panel = api.addPanel({
                id: `${variant.label}-${index}`,
                component: "workspace",
                title,
                params: { variant },
              });
              if (index === 0) firstPanel = panel;
            });
            firstPanel?.api.setActive();
          }}
        />
      </div>
    </main>
  );
}

function App() {
  const [selected, setSelected] = React.useState(0);
  const [sidebarMode, setSidebarMode] = React.useState<SidebarMode>("normal");
  const variant = variants[selected];
  const theme = React.useMemo(() => {
    // Keep 03Layout default colors/geometry; use 02Components interaction tokens.
    const states =
      variant.option === "A"
        ? {
            hover: "#1D56BC",
            pressed: "#16408D",
            focus: "#246BE8",
            ink: "#1D56BC",
            subtle: "#EFF5FF",
            down: "#D3E1FB",
            selected: "#BFDBFE",
            menuHover: "#EFF6FF",
          }
        : {
            hover: "#EA580C",
            pressed: "#C2410C",
            focus: "#F97316",
            ink: "#C2410C",
            subtle: "#FFF7ED",
            down: "#FFEDD5",
            selected: "#FED7AA",
            menuHover: "#FFF7ED",
          };
    return createTheme({
      palette: {
        mode: "light",
        primary: { main: variant.accent },
        error: { main: "#D92D20" },
        text: { primary: "#333", secondary: "#555" },
        divider: "#D1D5DB",
        background: { default: "#F4F6FA", paper: "#fff" },
        DataGrid: { bg: "#fff", headerBg: variant.surface },
      },
      typography: { fontFamily: "Noto Sans KR, sans-serif" },
      shape: { borderRadius: 4 },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              "&.alpas-button": {
                boxShadow: "none",
                "&.Mui-focusVisible": {
                  outline: `2px solid ${states.focus}`,
                  outlineOffset: 2,
                },
                "&.MuiButton-contained": {
                  color: "#fff",
                  backgroundColor: variant.accent,
                  "&:hover": { backgroundColor: states.hover },
                  "&:active": { backgroundColor: states.pressed },
                  "&.Mui-disabled": {
                    color: "#9CA3AF",
                    backgroundColor: "#E5E7EB",
                  },
                  "&.MuiButton-loading": {
                    color: "transparent",
                    backgroundColor: variant.accent,
                  },
                  "& .MuiButton-loadingIndicator": { color: "#fff" },
                },
                "&.MuiButton-outlined": {
                  color: "#555",
                  borderColor: "#D1D5DB",
                  backgroundColor: "#fff",
                  "&:hover": {
                    color: states.ink,
                    borderColor: states.focus,
                    backgroundColor: states.subtle,
                  },
                  "&:active": {
                    color: states.pressed,
                    borderColor: states.pressed,
                    backgroundColor: states.down,
                  },
                  "&.Mui-disabled": {
                    color: "#9CA3AF",
                    borderColor: "#E5E7EB",
                    backgroundColor: "#fff",
                  },
                  "&.MuiButton-loading": {
                    color: "transparent",
                    borderColor: states.focus,
                    backgroundColor: "#fff",
                  },
                  "& .MuiButton-loadingIndicator": { color: states.ink },
                },
                "&.MuiButton-outlined.action-with-tooltip": {
                  color: variant.accent,
                  borderColor: variant.accent,
                  backgroundColor: "#fff",
                  "&:hover": {
                    color: states.ink,
                    borderColor: states.focus,
                    backgroundColor: states.subtle,
                  },
                  "&:active": {
                    color: states.pressed,
                    borderColor: states.pressed,
                    backgroundColor: states.down,
                  },
                  "&.Mui-disabled": {
                    color: "#9CA3AF",
                    borderColor: "#E5E7EB",
                    backgroundColor: "#fff",
                  },
                },
              },
            },
          },
        },
        MuiMenu: {
          styleOverrides: {
            paper: {
              "&.alpas-select-menu": {
                marginTop: 4,
                borderRadius: 4,
                boxShadow: "none",
                "& .MuiMenu-list": { padding: "8px 0 7px" },
                "& .MuiMenuItem-root": {
                  minHeight: 36,
                  height: 36,
                  padding: "8px 20px",
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "#000",
                  "&:hover, &.Mui-focusVisible": {
                    backgroundColor: states.menuHover,
                  },
                  "&.Mui-selected, &.Mui-selected:hover, &.Mui-selected.Mui-focusVisible":
                    { backgroundColor: states.selected },
                },
              },
            },
          },
        },
      },
    });
  }, [variant]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <div className={`app sidebar-${sidebarMode}`}>
        <Header variant={variant} />
        <Sidebar variant={variant} mode={sidebarMode} onModeChange={setSidebarMode} />
        <Workspace variant={variant} />
        <div className="switcher">
          <Typography variant="caption">03Layout 시안 전환</Typography>
          <Stack direction="row" spacing={1}>
            {variants.map((item, index) => (
              <Button
                key={item.label}
                size="small"
                variant={selected === index ? "contained" : "outlined"}
                onClick={() => setSelected(index)}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </div>
      </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
