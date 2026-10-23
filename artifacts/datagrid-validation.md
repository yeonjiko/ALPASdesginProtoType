# MUI X DataGrid 전환 검증

2026-10-21 · 대상 `D:/고연지/prototype/ALPASdesginProtoType`

## 요청과 구현

- 이전 `.grid/.grid-head/.grid-cell`은 MUI Checkbox만 포함한 직접 구현이었다. 이를 공식 `@mui/x-data-grid` **9.16.0 Community**의 `DataGrid`로 교체했다.
- 기존 MUI7.3.11/React19.3.1/Dockview4.13.1과 peer compatibility 확인. 유료 라이선스 도입이나 Premium 정책 확정은 하지 않았다.
- 헤더/열/checkboxSelection/빈 결과 overlay/정렬/내부 스크롤/열 리사이즈는 DataGrid 기본 기능이다. 자체 mousedown/mousemove 리사이즈 코드를 추가하지 않았다.
- `GridColDef`를 모듈 상수로 유지한다. 초기 너비는 기존 시안 값48/64/118/84/104/112/112/96/112/112/170/112px. 데이터 열은 드래그 가능하며 최소 너비는 MUI 기본50px이다. 선택 열만48px 고정이다. 이 값은 최종 업무별 column width 정책의 확정이 아니다.
- Footer는 공식 `footer` 슬롯과 `GridFooterContainer` 사용. 총건수/선택건수/page/pageCount를 Grid selector에서 읽으며 페이지 버튼은 Grid API에 연결했다. 기존 고정0건/동작 없는 pager를 제거했다.
- 빈 데이터는 그대로 유지하며 가짜 업무 데이터는 추가하지 않았다. 새로고침/시안 전환은 초기 너비로 돌아가고, 같은 Dockview 탭을 다녀오는 경우 변경 너비를 유지한다. 영구 저장 기능은 범위 밖이다.
- Dockview 첫 측정 전 DataGrid를 생성하지 않도록 visible+positive dimensions 초기화 gate를 추가했다. 한번 초기화한 패널은 유지해 열 너비 상태를 보존한다.

## 공식 근거

- https://mui.com/x/react-data-grid/ — Community 패키지 및 MUI integration.
- https://mui.com/x/react-data-grid/column-dimensions/ — header separator drag resize 기본 지원, width/minWidth/resizable.
- https://mui.com/x/react-data-grid/components/ — footer slots, useGridApiContext/useGridSelector.
- https://mui.com/x/react-data-grid/quickstart/ — 설치 및 peer dependencies.
- npm 공식 metadata로9.16.0이 Material7.3+/React19를 지원함을 별도 확인했다.

## Figma 읽기 전용 검증

MCP get_design_context는 Starter 호출한도 오류로 차단되어 브라우저 속성 패널과 실제 캔버스를 사용했다. Figma 편집·생성·표시상태 변경 명령은 수행하지 않았다.

- 03Layout header178:15341: 1604×42px, #EFF5FF. 작업 전·후 재조회.
- 02Components grid177:1430: x10/y174,1652×764px,radius4,background#FFF,border1px#D1D5DB.
- Divider178:15363: x1132/y9,1×24px,#D1D5DB.
- Empty178:15365: x692/y356,220×28px,font14/line20/#555. 문구가 전체 grid 중앙에 오도록 공식 noRowsOverlay 슬롯에 padding 보정. 가로 scrollbar의 실제 높이도 계산에 포함한다.
- 현행 A/B surface #EFF5FF/#FFF7ED,42px header,12px/20px bold heading,18px checkbox,40px footer 유지. 데이터 행 정책은 새로 확정하지 않았다.
- Native MUI resize hit area10px 및 hover/drag accent는 보존. 단순 장식 구분선으로 덮거나 pointer-events를 차단하지 않았다.
- Scrollbar는 실제 overflow가 있을 때 나타나는 MUI 기본 스크롤바다. 과거의 항상 표시되는 장식성 트랙 CSS는 제거했다.

## 브라우저 동작 검증

| 시안 | 대출자번호 너비 드래그 | 헤더 높이 | 배경 | checkbox glyph |
| --- | --- | ---: | --- | --- |
| A Active |118→178px (+60)|42px|#EFF5FF|18×18px|
| B Active |118→178px (+60)|42px|#FFF7ED|18×18px|
| A Active2 |118→178px (+60)|42px|#EFF5FF|18×18px|
| B Active2 |118→178px (+60)|42px|#FFF7ED|18×18px|

- 실제 마우스 drag로 확인. A Active에서 Dockview 대출·반납 탭으로 이동했다 돌아와도178px 유지.
- B Active2에서 과도한 축소는50px에서 제한됨.
- Native header checkbox와 heading 중앙 유지. checkbox 중심은 MUI1px header border로 인해 전체42px 박스 대비-0.5px. 시각 캡처로 확인했으며 정확히0px라고 주장하지 않는다.
- 번호 header 클릭 후 `aria-sort=ascending` 확인. 검증 후 정렬 초기화.
- 1280×631 B Active2에서 내부 scrollbar0→172px 이동. Header/Sidebar x0 유지, 문서 가로 overflow 없음. viewport 원복.
- 실제 DOM에 DataGrid role=grid/columnheader 존재, 기존 `.grid-head`0개. 전환기 fixed/right20/bottom18 및 viewport shell 유지.
- 새로고침 후 최종 오류·경고 로그0건. 초기 HMR 의존성 갱신 실패와0px 높이 경고는 수정/재로딩 전 기록이며 최종 오류와 구분한다.
- 최종 TypeScript/Vite build exit0. DataGrid 추가로 JS raw687.20→1208.68kB, gzip198.30→353.80kB. 기존500kB 번들 경고가 계속 있으므로 운영 적용 시 code splitting 검토 필요.

## 수정량

- CSS **+15/-29줄(순감14)**, TSX **+77/-32줄(순증45)**.
- CSS292→278줄,107→104규칙. MUI 클래스참조35→49, Dockview14/변수22 유지. 참조 수는 정적 카운트이지 라이브러리 원본 수정량이 아니다.
- CSS-in-JS: Palette.DataGrid의bg/headerBg2개 값. 기존 Button/Menu Theme override는 변경하지 않음.
- 직접 의존성1개 추가. npm lock에 전이 패키지14개 추가, yaml hoisting으로root1.10.3→2.9.1 및cosmiconfig 내부1.x 보존. MUI/React/Dockview 기존 버전 변경 없음.
- MUI/Dockview 라이브러리 원본에 수동 패치0건. npm 정상 설치와 로컬 override만 수행. 캐시는D: 프로젝트 `.npm-cache` 사용.

## 범위와 한계

- 판정: 요청한 DataGrid 전환/드래그/스타일 범위 PASS. 전체 ALPAS 운영 적합성 확정이 아니다.
- rows=[] 화면이므로 실데이터 selection count, 여러 페이지 이동, 서버 API/오류/로딩/편집 상태는 시각 동작검증하지 않았다. 연결 코드 및 타입 빌드만 확인했다.
- 기존 우하단 시안 전환 위젯이 footer 오른쪽 설정을 가리는 문제는 위치 변경 금지 요청 때문에 그대로다. footer 설정 팝업의 실제 클릭은 이번에 검증하지 않았다.
- 기존 min-height560에 따른 확대 reflow 제약과 모든 업무 열의 폭/행 높이 정책은 변경하지 않았다.125%/200% 전체 앱 접근성 PASS로 확대 해석하지 않는다.
- Community와 ALPAS 문서의 Premium 목표는 구별한다. 실제 서비스에서 필요한 고급 기능·행/페이지 제약·라이선스는 별도 결정 사항이다.

## 캡처

- `datagrid-a-active.png`, `datagrid-b-active.png`, `datagrid-a-active2.png`, `datagrid-b-active2.png`
- `datagrid-resize-result.png`: 실제118→178px drag 직후 화면. 이후 원래118px로 복원.
- `datagrid-scroll-1280.png`: 좁은 화면에서 내부 scrollbar 이동.
