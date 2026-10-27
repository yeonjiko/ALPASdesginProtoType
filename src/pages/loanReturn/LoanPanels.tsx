import { useEffect, useId, useState } from "react";
import type { ReactElement } from "react";
import { Tab, Tabs } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRowSelectionModel, GridValidRowModel } from "@mui/x-data-grid";
import { koKR } from "@mui/x-data-grid/locales";
import type { IDockviewPanelHeaderProps, IDockviewPanelProps } from "dockview";
import { Button, TextField } from "@/components/ui";
import dockCss from "@/components/dockview/Dockview.module.css";
import { useLoan } from "@/pages/loanReturn/loanContext";
import type { LoanActivity, MemberSearch } from "@/pages/loanReturn/loanContext";
import { loanPanels } from "@/pages/loanReturn/loanLayout";
import type { LoanPanelId } from "@/pages/loanReturn/loanLayout";
import css from "@/pages/loanReturn/LoanReturnPage.module.css";
import gridCss from "@/components/ResultsGrid/ResultsGrid.module.css";
import checkboxCss from "@/components/ui/Checkbox/Checkbox.module.css";

const EMPTY_SELECTION: GridRowSelectionModel = { type: "include", ids: new Set() };

type MaterialRow = {
  id: string;
  number: number;
  library: string;
  providingLibrary: string;
  requestingLibrary: string;
  accessionNo: string;
  title: string;
  loanDate: string;
  dueDate: string;
};
const LOAN_COLUMNS: GridColDef<MaterialRow>[] = [
  { field: "number", headerName: "번호", width: 70 },
  { field: "library", headerName: "도서관", width: 120 },
  { field: "accessionNo", headerName: "등록번호", width: 150 },
  { field: "title", headerName: "서명", flex: 1, minWidth: 220 },
  { field: "loanDate", headerName: "대출일", width: 120 },
  { field: "dueDate", headerName: "반납예정일", width: 120 },
];
const INTERLIBRARY_COLUMNS: GridColDef<MaterialRow>[] = [
  { field: "number", headerName: "번호", width: 70 },
  { field: "providingLibrary", headerName: "제공도서관", width: 120 },
  { field: "requestingLibrary", headerName: "요청도서관", width: 120 },
  { field: "accessionNo", headerName: "등록번호", width: 150 },
  { field: "title", headerName: "서명", flex: 1, minWidth: 220 },
];
const SEARCH_COLUMNS: GridColDef<MemberSearch>[] = [
  { field: "number", headerName: "번호", width: 65 },
  { field: "memberName", headerName: "대출자", width: 100 },
  { field: "memberNo", headerName: "대출자번호", width: 140 },
  { field: "searchedAt", headerName: "검색시간", width: 120 },
  { field: "operator", headerName: "작업자", width: 100 },
];
const ACTIVITY_COLUMNS: GridColDef<LoanActivity>[] = [
  { field: "number", headerName: "번호", width: 65 },
  { field: "action", headerName: "처리내용", width: 110 },
  { field: "memberName", headerName: "이용자명", width: 110 },
  { field: "accessionNo", headerName: "등록번호", width: 150 },
  { field: "title", headerName: "서명", flex: 1, minWidth: 220 },
  { field: "loanDate", headerName: "대출일", width: 120 },
  { field: "returnDate", headerName: "반납일", width: 120 },
  { field: "dueDate", headerName: "반납예정일", width: 120 },
  { field: "processedAt", headerName: "처리시간", width: 120 },
];

function LoanGrid<T extends GridValidRowModel>({
  label,
  rows,
  columns,
  selectable = false,
}: {
  label: string;
  rows: T[];
  columns: GridColDef<T>[];
  selectable?: boolean;
}): ReactElement {
  const loan = useLoan();
  return (
    <div className={css.grid_host}>
      <DataGrid<T>
        className={`alpas_grid ${gridCss.alpas_grid} ${css.list_grid}`}
        aria-label={label}
        rows={rows}
        columns={columns}
        checkboxSelection={selectable}
        slotProps={{
          baseCheckbox: {
            material: {
              icon: <span className={checkboxCss.grid_checkbox_icon} />,
            },
          },
          rowCheckbox: {
            material: {
              icon: <span className={checkboxCss.grid_checkbox_icon} />,
            },
          },
        }}
        rowSelection={selectable}
        rowSelectionModel={loan.selections[label] ?? EMPTY_SELECTION}
        onRowSelectionModelChange={(selection) => loan.setSelection(label, selection)}
        disableRowSelectionExcludeModel
        columnHeaderHeight={42}
        rowHeight={42}
        disableRowSelectionOnClick
        hideFooter
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: -1 } } }}
        pageSizeOptions={[{ value: -1, label: "전체" }]}
        localeText={{
          ...koKR.components.MuiDataGrid.defaultProps.localeText,
          noRowsLabel: "결과가 없습니다",
        }}
      />
    </div>
  );
}

const INFO_TABS = [
  { id: "summary", title: "간략정보" },
  { id: "details", title: "상세정보" },
  { id: "book", title: "도서정보" },
] as const;

export function MemberInfo(): ReactElement {
  const [infoTab, setInfoTab] = useState<(typeof INFO_TABS)[number]["id"]>("summary");
  const id = useId();
  return (
    <section className={`${css.fixed_card} ${css.member_card}`} aria-label="이용자 및 도서정보">
      <Tabs
        className={css.member_tabs}
        value={infoTab}
        onChange={(...[, value]: [unknown, unknown]) => {
          if (value === "summary" || value === "details" || value === "book") setInfoTab(value);
        }}
        selectionFollowsFocus
        variant="fullWidth"
        textColor="inherit"
        aria-label="이용자 및 도서정보 보기"
      >
        {INFO_TABS.map((tab) => (
          <Tab
            key={tab.id}
            id={`${id}-tab-${tab.id}`}
            aria-controls={`${id}-panel-${tab.id}`}
            value={tab.id}
            label={tab.title}
          />
        ))}
      </Tabs>
      {INFO_TABS.map((tab) => (
        <div
          key={tab.id}
          id={`${id}-panel-${tab.id}`}
          className={css.member_panel}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${tab.id}`}
          hidden={infoTab !== tab.id}
          tabIndex={0}
        >
          {tab.id === "book" ? <BookInfo /> : <MemberFacts detailed={tab.id === "details"} />}
        </div>
      ))}
    </section>
  );
}

function MemberFacts({ detailed = false }: { detailed?: boolean }): ReactElement {
  const loan = useLoan();
  return (
    <section
      className={`${css.info_content} ${detailed ? "" : css.member_summary}`}
      aria-label={detailed ? "이용자 상세정보" : "이용자 간략정보"}
    >
      <dl className={css.member_facts}>
        <dt>직급</dt>
        <dd>{loan.hasMember ? "일반" : ""}</dd>
        <dt>소속</dt>
        <dd>{loan.hasMember ? "행복도서관" : ""}</dd>
        <dt>아이디</dt>
        <dd>{loan.loadedMemberNo}</dd>
        <dt>휴대폰</dt>
        <dd className={css.phone_flag}>Y</dd>
        <dt>이메일</dt>
        <dd />
      </dl>
    </section>
  );
}

function BookInfo(): ReactElement {
  const loan = useLoan();
  const book = loan.loans.find((item) => item.accessionNo === loan.accessionNo);
  return (
    <section className={css.info_content} aria-label="도서정보">
      {book && (
        <>
          <h3>{book.title}</h3>
          <p>{book.accessionNo}</p>
        </>
      )}
    </section>
  );
}

export function MemberMemo(): ReactElement {
  const loan = useLoan();
  return (
    <section className={`${css.fixed_card} ${css.memo_card}`} aria-label="이용자 메모 및 대출건수">
      <TextField
        multiline
        minRows={2}
        fullWidth
        value={loan.memo}
        onChange={(event) => loan.setMemo(event.target.value)}
        slotProps={{ htmlInput: { "aria-label": "이용자 메모" } }}
      />
      <table className={css.count_table} aria-label="대출 및 기타 건수">
        <thead>
          <tr>
            <th colSpan={2}>대출</th>
            <th colSpan={2}>기타</th>
          </tr>
          <tr>
            <th>자관</th>
            <th>통합</th>
            <th>예약</th>
            <th>연체</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{loan.hasMember ? loan.loans.length : "/"}</td>
            <td>{loan.hasMember ? loan.loans.length : "/"}</td>
            <td>{loan.hasMember ? 1 : "/"}</td>
            <td>{loan.hasMember ? 0 : "/"}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function PanelContent({ kind }: { kind: LoanPanelId }): ReactElement {
  const loan = useLoan();
  if (kind === "processed" || kind === "searches") {
    const searches = loan.searches.map((row, index) => ({ ...row, number: index + 1 }));
    if (kind === "searches")
      return <LoanGrid label="이용자 검색목록" rows={searches} columns={SEARCH_COLUMNS} />;
    const activity = loan.activity.map((row, index) => ({
      ...row,
      number: index + 1,
      dueDate: "",
    }));
    return (
      <div className={css.processing_content}>
        <LoanGrid label="처리목록 이용자 검색내역" rows={searches} columns={SEARCH_COLUMNS} />
        <LoanGrid label="처리목록 자료 처리내역" rows={activity} columns={ACTIVITY_COLUMNS} />
      </div>
    );
  }
  if (kind === "book") return <BookInfo />;
  if (kind === "photo")
    return (
      <section className={css.info_content}>
        <div className={css.avatar} role="img" aria-label="이용자 기본 이미지">
          {loan.hasMember ? "김" : ""}
        </div>
      </section>
    );
  if (kind === "family")
    return (
      <section className={css.info_content}>
        <h3>가족정보</h3>
        <p>{loan.hasMember ? "박자료 · 가족 이용자 (시연)" : "이용자를 먼저 조회하세요."}</p>
      </section>
    );
  if (kind === "actions")
    return (
      <section className={css.info_content}>
        <TextField
          label="등록번호"
          size="small"
          fullWidth
          value={loan.accessionNo}
          onChange={(event) => loan.setAccessionNo(event.target.value)}
        />
        <div className={css.actions}>
          <Button
            variant="contained"
            disabled={!loan.hasMember || !loan.accessionNo.trim()}
            onClick={() => loan.process("loan")}
          >
            대출 시연
          </Button>
          <Button
            variant="outlined"
            disabled={!loan.hasMember || !loan.accessionNo.trim()}
            onClick={() => loan.process("return")}
          >
            반납 시연
          </Button>
        </div>
      </section>
    );
  let materials = loan.loans;
  if (kind !== "loans") {
    materials = [];
    if (loan.hasMember)
      materials = [
        {
          id: kind,
          accessionNo: kind === "reservations" ? "R-DEMO-001" : "I-DEMO-001",
          title: kind === "reservations" ? "예약 자료 시연" : "상호대차 자료 시연",
          loanDate: "",
        },
      ];
  }
  const rows: MaterialRow[] = materials.map((row, index) => ({
    ...row,
    number: index + 1,
    library: "행복도서관",
    providingLibrary: "중앙도서관",
    requestingLibrary: "행복도서관",
    dueDate: "",
  }));
  return (
    <LoanGrid
      label={`${loanPanels.find((panel) => panel.id === kind)?.title ?? "자료"} 자료 목록`}
      rows={rows}
      columns={kind === "interlibrary" ? INTERLIBRARY_COLUMNS : LOAN_COLUMNS}
      selectable
    />
  );
}

export function LoanDockPanel({
  api,
  params,
}: IDockviewPanelProps<{ kind: LoanPanelId }>): ReactElement {
  // Mount grids only after their visible dock group has usable dimensions.
  const [isReady, setIsReady] = useState(api.isVisible && api.width > 0 && api.height > 0);
  useEffect(() => {
    const update = () => setIsReady(api.isVisible && api.width > 0 && api.height > 0);
    const subscriptions = [api.onDidDimensionsChange(update), api.onDidVisibilityChange(update)];
    update();
    return () => subscriptions.forEach((subscription) => subscription.dispose());
  }, [api]);
  return <div className={css.panel_content}>{isReady && <PanelContent kind={params.kind} />}</div>;
}

export function LoanTab({ api }: IDockviewPanelHeaderProps): ReactElement {
  const [title, setTitle] = useState(api.title);
  useEffect(() => {
    const subscription = api.onDidTitleChange((event) => setTitle(event.title));
    return () => subscription.dispose();
  }, [api]);
  return <span className={`${dockCss.tab_content} ${css.inner_tab}`}>{title}</span>;
}
