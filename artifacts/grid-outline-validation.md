# Grid outline / radius 검증 — 2026-10-21

## 범위와 순서

실제 프로젝트: `D:/고연지/prototype/ALPASdesginProtoType`.
현재 코드·화면 → Figma02/03 측정 → 공통 CSS 수정 → 네 시안 시각/기능 검증 → Figma02/03 재조회 순서로 수행. Figma 편집 없음.

## 원인 및 수정

- 기존 main의 `outline:1px` / `outline-offset:-1px`는 선언되어 있었지만 내부 레이어에 가려져 외곽선이 화면에 보이지 않았다. radius4도 경계가 없어 식별하기 어려웠다. 이전 선언값 확인은 실제 페인트 검증을 대신하지 못했음.
- main의 기존4px radius와 MUI 기본 overflow:hidden을 유지. main::after에 내부1px border, radius:inherit, z-index:5, pointer-events:none 적용. 셀/헤더/스크롤 영역 치수와 footer 경계를 변경하지 않는다.
- 실제 MUI DataGrid 유지. 추가 HTML wrapper/자체 resize 이벤트/라이브러리 원본 수정/의존성 추가 없음.

## Figma 근거

| 페이지/시안 | 노드 | 크기 | radius | 내부 외곽선 |
| --- | --- | --- | --- | --- |
| 02Components | 177:1430 | 1652×764 | 4px | 1px #D1D5DB |
| 03 A Active | 178:15340 | 1604×740 | 4px | 1px #D1D5DB |
| 03 B Active | 178:15528 | 1604×740 | 4px | 1px #D1D5DB |
| 03 A Active2 | 178:11068 | 1604×740 | 4px | 1px #D1D5DB |
| 03 B Active2 | 178:11262 | 1604×740 | 4px | 1px #D1D5DB |

로그인된 브라우저 속성 패널에서 읽음. 작업 후02/03 A 노드를 다시 읽어 동일 수치 확인. 컨테이너 크기는 사용자 요구대로 viewport에 맞게 유동 유지.

## 결과

- 네 시안1920×945: main x250/y246/1644×621 변경 전후 동일, header42px. 테두리 실제 표시, 상단 양 모서리/좌하단 곡률 확인. 우하단 일부는 기존 fixed 전환 위젯에 가려져 그 위치의 픽셀 시각 검증은 제한되며 공통 border-radius 적용값으로 확인.
- 네 시안 모두 대출자번호 divider를 실제 드래그하여118→178px 확인. pointer-events:none으로 기존 마우스 입력 유지.
- A header #EFF5FF / B #FFF7ED 유지, footer40px 별도 유지. switcher fixed/right20/bottom18 유지.
- 1280×720: 내부 스크롤바 scrollLeft0→205px, 문서 너비1280px, 그리드 폭1004px. 외곽선 고정 유지. 임시 viewport override 해제 및 페이지 새로고침.
- TypeScript/Vite build exit0. 기존500kB 번들 경고만 유지. CSS46.63kB/gzip6.38kB.
- CSS+3/-1줄(주석 포함), 기존1규칙 수정/신규1규칙. 총280줄105규칙/MUI참조50/Dockview참조14/테마변수22. TSX변경0.

## 증거

- grid-outline-before.png
- grid-outline-a-active.png / grid-outline-b-active.png
- grid-outline-a-active2.png / grid-outline-b-active2.png
- grid-outline-1280.png

실데이터 행, 전체 앱 접근성, 모든 해상도는 이번 회귀검사 범위가 아니다.
