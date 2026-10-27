import {
  GRID_CHECKBOX_SELECTION_COL_DEF,
  type GridColumnVisibilityModel,
  type GridColDef,
} from "@mui/x-data-grid";

// 열 정의의 참조를 유지해야 사용자가 조정한 열 너비가 보존됩니다.
export type LoanRow = {
  id: number;
  number: number;
  memberNo: string;
  memberName: string;
  birthDate: string;
  phone: string;
  email: string;
  loanStatus: string;
  accessionNo: string;
  callNo: string;
  title: string;
  room: string;
};
export const gridColumns: GridColDef<LoanRow>[] = (
  [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 48,
      minWidth: 48,
      maxWidth: 48,
      resizable: false,
    },
    { field: "number", headerName: "번호", width: 64, type: "number" },
    { field: "memberNo", headerName: "대출자번호", width: 118 },
    { field: "memberName", headerName: "대출자", width: 84 },
    { field: "birthDate", headerName: "생년월일", width: 104 },
    { field: "phone", headerName: "전화번호", width: 112 },
    { field: "email", headerName: "E-MAIL", width: 112 },
    { field: "loanStatus", headerName: "대출상태", width: 96 },
    { field: "accessionNo", headerName: "등록번호", width: 112 },
    { field: "callNo", headerName: "청구기호", width: 112 },
    { field: "title", headerName: "서명", width: 170 },
    { field: "room", headerName: "자료실", width: 112 },
  ] satisfies GridColDef<LoanRow>[]
).map((column) => ({ ...column, headerAlign: "center" }));

export const configurableGridColumns = gridColumns.filter(
  (column) => column.headerName && column.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field,
);

export const defaultGridColumnVisibilityModel: GridColumnVisibilityModel = Object.fromEntries(
  configurableGridColumns.map((column) => [column.field, true]),
);

// 프로토타입 데이터는 마스킹된 연락처와 예시 이메일만 사용합니다.
export const sampleLoanEntries = [
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

export const sampleLoanRows: LoanRow[] = sampleLoanEntries.map(([memberName, title], index) => {
  const number = index + 1;
  const serial = String(number).padStart(4, "0");
  return {
    id: number,
    number,
    memberNo: `DEMO-${serial}`,
    memberName,
    birthDate: `${1985 + (index % 15)}-**-**`,
    phone: `010-****-${1000 + number}`,
    email: `demo${serial}@example.com`,
    loanStatus: ["대출중", "반납완료", "연체"][index % 3],
    accessionNo: `BK-2026-${serial}`,
    callNo: `813.7-${String(100 + index)}`,
    title,
    room: ["종합자료실", "어린이자료실", "디지털자료실"][index % 3],
  };
});

export const emptyGridRows: LoanRow[] = [];
