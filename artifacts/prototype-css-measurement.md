# 03Layout 프로토타입 CSS 변경량

기준: `src/styles.css`의 정적 선택자·테마 변수 측정. `npm run measure:css`로 재계산한다.

2026-10-20 최종 측정값:

- CSS 전체: 251줄, 85개 규칙
- MUI 클래스 선택자 참조: 30건
- Dockview `.dv-*` 선택자 참조: 12건
- Dockview 테마 변수 지정: 19건
- `node_modules`의 MUI/Dockview 기본 CSS 원본 수정: 0건

해석:

- MUI 30건은 컴포넌트 기능을 바꾸지 않고 높이·간격·색상·아이콘 크기를 시안에 맞춘 범위다.
- Dockview 12건은 실제 런타임의 탭 높이·폰트·구분선·SVG 크기·비활성 닫기 액션만 범위 지정한 것이다.
- Dockview 색상과 상태는 기본 CSS를 복사하지 않고 19개 CSS 변수로 Option A/B를 교체한다.
- 나머지는 ALPAS 전용 래퍼(`app`, `sidebar`, `workspace`, `grid`) 규칙이다.

판정: 라이브러리 원본은 수정하지 않았고, 필요한 시각 보정만 컴포넌트 래퍼와 최소 범위 선택자로 적용했다.

추가 기록:

- Dockview 탭 geometry 보정은 기존 `.dv-tab` / `.dv-default-tab-action` 선택자 안에 선언을 명시한 변경이며, 정적 선택자·규칙 수 측정값은 변하지 않았다.
- 상단 우측 Dockview Header Action 스타일은 변경하지 않았다.
- 탭 내부 닫기 glyph만 `16×16px`에서 `12×12px`로 보정했으며, 클릭 action 영역 `24×24px`와 상단 우측 Header Action은 변경하지 않았다.
- 이번 변경은 기존 `.dv-tab .dv-svg` 선언값만 수정한 것으로 CSS 정적 측정값은 251줄 / 85개 규칙 / MUI 30건 / Dockview 선택자 12건 / 테마 변수 19개로 동일하다.
- 후속 보정으로 탭 내부 닫기 glyph를 `8×8px`로 낮췄으며, CSS 정적 측정값은 동일하다: 251줄 / 85개 규칙 / MUI 30건 / Dockview 선택자 12건 / 테마 변수 19개.
- Figma 100% 대조 후 탭 geometry를 `height: 40px`, `padding: 8px 16px`로 보정했으며, CSS 정적 측정값은 동일하다.
- Figma 탭 블록 폭과 맞추기 위해 `.dv-tab`에 `min-width: 150px`를 추가했으며, 긴 제목 보존을 위해 고정 width는 사용하지 않았다.

2026-10-20 시안별 Dockview 및 패널 여백 보정:

- `Active`는 150px급 탭 블록을 유지하고 `Active2`는 콘텐츠 기반 컴팩트 탭 폭으로 분리했다.
- `Active2` 비활성 탭 배경을 중립 회색 계열로 분리했다.
- Dockview 패널 콘텐츠에 좌·우·하단 `8px` padding을 추가하고 필터·액션 행 수평 padding을 `4px`로 조정했다.
- MUI/Dockview 원본 CSS 파일은 수정하지 않았다. 변경 후 `npm run measure:css`로 정적 수치를 재계산한다.

최종 재측정값 (2026-10-20):

- CSS 전체: 258줄, 87개 규칙
- MUI 클래스 선택자 참조: 30건
- Dockview `.dv-*` 선택자 참조: 13건
- Dockview 테마 변수 지정: 22건
- `node_modules`의 MUI/Dockview 기본 CSS 원본 수정: 0건
- TypeScript 검사: `npx tsc --noEmit` 성공
- 프로덕션 빌드: `npm run build` 성공

Option B Active 수정 후 최종 재측정값 (2026-10-20):

- CSS 전체: 259줄, 88개 규칙
- MUI 클래스 선택자 참조: 30건
- Dockview `.dv-*` 선택자 참조: 14건
- Dockview 테마 변수 지정: 22건
- `node_modules`의 MUI/Dockview 기본 CSS 원본 수정: 0건

Option B 검색 버튼 전경색 수정 후 최종 재측정값 (2026-10-20):

- CSS 전체: 270줄, 90개 규칙
- MUI 클래스 선택자 참조: 34건
- Dockview `.dv-*` 선택자 참조: 14건
- Dockview 테마 변수 지정: 22건
- `node_modules`의 MUI/Dockview 기본 CSS 원본 수정: 0건
- 변경 내용: `.option-b` 검색 버튼 두 영역의 텍스트·SVG 전경색을 `#fff`로 지정함.
- `npm run build`: 성공

Four layout Header parity 수정 후 최종 재측정값 (2026-10-20):

- CSS 전체: 270줄, 90개 규칙
- MUI 클래스 선택자 참조: 34건
- Dockview `.dv-*` 선택자 참조: 14건
- Dockview 테마 변수 지정: 22건
- `node_modules`의 MUI/Dockview 기본 CSS 원본 수정: 0건
- Header 변경: 검색 그룹 `324px`, input `260px`, button `64px`; avatar는 시안 surface를 사용함.
- `npm run build`: 성공

## 2026-10-21 · Header 우측 영역 수치 보정

- 전체 CSS: 271줄 / 89개 규칙 (직전 270줄 / 90개 규칙 대비 +1줄 / -1규칙).
- MUI 클래스 참조: 33건 (-1), Dockview 클래스 참조: 14건 (동일), Dockview 테마 변수: 22건 (동일).
- 라이브러리 원본 파일 수정: 0건. 위 수치는 로컬 CSS 정적 통계이며 라이브러리 원본 변경 줄 수가 아님.
- 헤더 검색 그룹: 328px = TextField 260px + 간격 4px + Button 64px. 두 컨트롤 높이 36px 및 독립 radius 4px.
- 항목 간격: 4 / 7 / 17 / 8 / 14 / 12px. 문의 영역 120px, 문의 폰트 12px, 사용자명/기관명 14/12px.
- Avatar·설정·로그아웃: 각각 32×32px. 헤더 설정만 MUI Settings 채워진 아이콘으로 변경.
- 900px 이하에서 입력을 162px로 축소하던 두 규칙을 제거해 지정 크기를 유지함.
- 1920×889 및 1280×631에서 A/B Active/Active2 모두 DOM 실측 일치. 검색 input type=text, button 태그와 시안별 흰색 버튼 텍스트 확인.
- 전환 위젯: fixed, right 20px, bottom 18px 유지. 프로덕션 빌드/타입 검사 성공.
- Figma MCP 한도로 내부 속성 추출은 불가. 03Layout 네 시안은 브라우저 100%로 전후 시각 대조. 일부 기존 Figma(A Active) 차이에는 사용자가 이번에 명시한 공통 수치를 우선 적용.

## 2026-10-21 · 사용자 수정 03Layout Header 속성 직접 반영 (최신)

- 로그인된 Figma 브라우저의 실제 레이어 X/Y/W/H 및 폰트 속성을 읽어 반영했다. 앞선 사용자 메시지의 옛 수치를 재사용하지 않았다.
- CSS diff: 18줄 추가 / 11줄 제거 (순증 7줄). Header의 시안별 세로 위치를 구분하는 JSX class 한 줄 변경.
- 전체 CSS: 278줄 / 92개 규칙. 직전 271줄 / 89개 규칙 대비 +7줄 / +3규칙.
- MUI 클래스 참조33건, Dockview 클래스 참조14건, Dockview 테마 변수22건: 모두 동일.
- MUI/Dockview 라이브러리 원본 수정0건. 변경량은 프로젝트 CSS 기준이며 라이브러리 원본 수정량이 아니다.
- 최신 헤더: input260×36, gap3, button58×36, gap7, 문의107×17/14px, gap17, avatar32×32, gap8, 사용자 최소72×32/14·12px, gap10, 설정32×32, gap13, 로그아웃32×32. 설정 glyph24px, 로그아웃 glyph20px.
- 검색 y: A Active9px, A Active2 11px, B Active/Active2 10px. 우측 여백12px.
- 1920×945 및1280×631에서 네 시안 DOM 실측과 Figma 좌표/크기 일치. input type=text, BUTTON, 흰색 검색 글자, 전환 위젯 fixed/right20/bottom18 보존.
- Figma 100% 화면 최종 대조 및 TypeScript/Vite 빌드 성공. 기존 번들500kB 경고만 남음.
- 이번 범위 밖: 기존 헤더 텍스트 문구/아이콘 원본 모양/색상 차이, 전체 화면 기능 및125%/200% 브라우저 줌 QA. Figma 파일 수정·생성 없음.

## 2026-10-21 · 문의 텍스트 양쪽 간격12px 반영 (최신)

- 현재 Figma 네 Header 레이어 속성을 직접 확인: 검색 버튼 x1520/w58, 문의 x1590/w107, avatar x1709/w32 → 양쪽12px.
- 공통 .help의 margin만 `10px 17px 0 7px`에서 `10px 12px 0 12px`로 수정. 선언1개/수치2개, CSS diff +1/-1줄, 순증0줄.
- 전체 CSS278줄/92규칙, MUI 클래스 참조33, Dockview 참조14, Dockview 테마변수22: 모두 동일. 이번 작업의 MUI/Dockview 원본 수정0건.
- 네 시안1920×889 및1280×631에서 양쪽12px 실측. 다른 헤더 요소의 크기·위치·폰트·색상은 변경 전과 동일함. 실제input/BUTTON, full-screen shell 및fixed/right20/bottom18 전환위젯 유지.
- TypeScript/Vite 빌드 성공(기존500kB 경고만 존재). 전체 UI 및125%/200% 줌 QA는 재수행하지 않음.
- Figma 점검 중 B Active2 문의233:211 표시 상태가 실수로 숨김으로 변경됨을 사용자에게 알림. 복구 시도가 보호 규칙으로 차단된 뒤 사용자가 직접 복구를 선택함. 로컬 코드 검증과 Figma 원본 복구 상태를 분리해 기록하며 원본 무변경/복구 완료를 주장하지 않음.

## 2026-10-21 · Dockview 패널 실측 보정

- CSS diff **+56/-35줄(순증21)**. TSX +29/-17줄. 수정은 프로젝트 src/main.tsx 및src/styles.css에 한정.
- 전체 CSS **299줄/110규칙**(이전278/92). MUI 클래스 참조40(+7), Dockview 클래스 참조14(동일), Dockview 테마변수22(동일).
- **MUI/Dockview 라이브러리 원본 파일 수정0건**, 새 의존성0개. 위 diff와 선택자 수는 로컬 스타일 변경량이며 원본 CSS 수정량으로 혼동하지 않음.
- 실제03Layout 속성 기준: 패널 좌우10px/푸터 아래22px, 검색박스48px/입력132·92·92px/검색68×32, 작업 버튼86/86/86/86/118/112×32 및gap8. A Active2 필터만2px 위.
- 그리드header42px/텍스트12px/구분선24px/checkbox18×18·1px 외곽, radius4px, 실제 overflow scrollbar, footer40px/페이지glyph24px/설정32px. shell radius8px.
- 02Components의 예시 필터y74·버튼폭68급/gap6과03Layout의실제y58·폭86급/gap8 차이를 기록하고 화면 배치는03Layout 우선. 단순 캡처 비율 확대/축소를 사용하지 않음.
- 4시안×2화면(1920×889,1280×720) DOM 실측, 실제checkbox 토글/가로스크롤, 브라우저 시각 대조, Figma 재조회 후 행간16px 보정 완료. TypeScript/Vite 최종 빌드 성공(기존500kB 경고).
- Header/Sidebar/전환 위젯 위치/full-viewport app/탭X 및탭디자인은 변경하지 않음. 전체 앱이나 실서비스 기능의 완전일치 판정이 아닌 이번 패널 스타일 범위 검증.
- 상세 근거: artifacts/panel-style-validation.md. 이번 턴 Figma 편집·생성·표시상태 변경 명령 없음. 이전 턴의 원본 복구와 별도 판정.

## 2026-10-21 · Button / Select UX 및 Y축 정렬

- CSS diff **+3/-16줄(순감13)**, TSX **+58/-10줄**. 전체 CSS **286줄/106규칙**, MUI 클래스참조34, Dockview 참조14/테마변수22. CSS-in-JS Theme override2개(Button/Menu)도 TSX 변경량에 포함.
- MUI/Dockview 라이브러리 원본 수정0건, 추가 의존성0개. 로컬 CSS/Theme override와 라이브러리 원본 수정량을 구분함.
- 네 시안의 버튼·placeholder·Select·탭·footer 텍스트는 라인 박스 기준 중심오차0px. Grid 제목은 Figma와 같은 -1px. Header input의36.125px 내부 높이를36px로 정규화.
- 03Layout 기본색/geometry는 보존,02Components 상태값을 scoped MUI Theme로 적용. 인라인 검색 배경 제거. Focus2px+offset2, Hover/Pressed/Disabled/Loading 스타일 정의. B 보조Hover 텍스트는 재대조 후 #C2410C로 보정.
- Select 메뉴행44px/좌우20px/글자14px, 필드아래4px, radius4. A selected#BFDBFE/hover#EFF6FF, B selected#FED7AA/hover#FFF7ED. 기존1개씩의 업무 옵션은 추가하지 않음.
- 네 시안1280×631 및1920px 화면 실측/시각 확인, Enter/Escape/ArrowDown 검사, Figma 속성 재조회, 최종 빌드 성공. 실제input type=text/BUTTON 유지. fixed전환기 위치 및 full-viewport 유지.
- Pressed/Disabled/Loading 및 비선택 Select hover는 현재 앱에서 해당 상태가 노출되지 않아 소스검증 범위. 기존 확대 리플로/최소높이 제약과 HMR경고는 control-ux-validation.md에 별도 기록.
- 상세 근거: artifacts/control-ux-validation.md. 이번 턴 Figma는 읽기 전용으로만 조회함.

## 2026-10-21 · Placeholder / Grid header 세로 중앙 보정

- CSS만 **+11/-5줄(순증6)**, 신규 규칙1/기존 규칙5 수정. TSX0줄, 라이브러리 원본0, 신규 의존성0.
- 전체 **292줄/107규칙**, MUI 클래스참조35, Dockview참조14/테마변수22.
- 날짜 input height/line-height20px + padding5px8px7px, 총32px 보존. 실제 glyph 광학 정렬을 위해 상향1px 보정.
- grid cell 높이100%/flex 중앙 정렬, checkbox absolute top6 제거, separator24px 중앙 정렬. glyph18×18/클릭영역24×24/가로위치 유지.
- 기존 placeholder0px 판정은 line-box만 계산했던 것으로 정정. 최종 실제 캡처 픽셀에서 네 시안 모두 시작-0.5px/종료0px, 번호·대출자+0.5px, checkbox0px.
- 최신 Figma02 input92×32 및03 checkboxy12/18×18 조회. Figma 수정0. 사용자 요청 범위 외 header/전환위치/fullviewport/Dockview tabs 유지.
- 실제 입력/체크 동작,4시안 시각검증,1280×631 A Active 및 최종 TypeScript/Vite build exit0. 기존 번들경고 유지.
- 상세 근거·검증 한계·캡처: artifacts/y-center-validation.md.

## 2026-10-21 · 공식 MUI X DataGrid로 교체

- 이전 div/CSS Grid는 MUI X가 아니었음. 실제 `@mui/x-data-grid@9.16.0` Community 설치 후 DataGrid로 대체. 자체 마우스 resize 이벤트0개.
- **CSS+15/-29줄(순감14)**, **TSX+77/-32줄(순증45)**. CSS총278줄/104규칙/MUI참조49/Dockview참조14/테마변수22.
- 정적 MUI 클래스 참조 증가는 DataGrid 슬롯 스타일 때문이며 원본 라이브러리 수동수정은0건. Palette.DataGrid bg/headerBg2값 추가. 기존Button/Menu overrides유지.
- 직접의존성1개추가(전이패키지14개). 라이브러리설치와로컬CSSoverride를원본소스패치와구분함.
- 헤더42px/제목12·20px/glyph18px/divider1×24px 유지. width는GridColDef초기값,드래그는MUI기본기능. 선택열만48px고정.
- 네 시안118→178px실제drag,최소50px,탭재방문너비유지,1280×631내부scroll검증. Figma02/03속성재확인,원본수정없음.최종빌드exit0.
- JSraw1208.68kB/gzip353.80kB로증가.실데이터및전체운영적합성은별도검증필요.
- 상세검증/한계/캡처: artifacts/datagrid-validation.md.

## 2026-10-21 · Grid 외곽선·radius 복원

- CSS **+3/-1줄(순증2, 주석 포함)**. 기존1규칙 수정/신규1규칙. 전체280줄/105규칙/MUI클래스참조50/Dockview참조14/테마변수22.
- TSX수정0,의존성추가0,라이브러리 원본수정0. 기존가려진 inset outline 제거,main::after에 내부1px #D1D5DB/4px radius/pointer-events:none 적용.
- Figma02/03 네시안 확인 후 수정,시각검사 및02/03재대조. 네시안drag118→178,1280×720내부scroll0→205,빌드exit0. 위젯위치/viewport/그리드치수보존.
- 상세범위·우하단가림 한계·캡처: artifacts/grid-outline-validation.md.
