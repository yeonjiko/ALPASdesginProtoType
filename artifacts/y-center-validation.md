# 날짜 입력 / Grid header Y-center 검증

2026-10-21. 실제 대상: `D:/고연지/prototype/ALPASdesginProtoType`.

## 범위와 정정

- 사용자 캡처의 날짜 placeholder 2개와 grid header 글자/체크박스만 수정. 4가지 시안이 사용하는 공통 CSS 적용.
- 앞선 `control-ux-validation.md`의 placeholder 중심오차0px는 라인 박스만 계산한 것으로, 실제 글자의 광학 중심을 검증한 결과가 아니었다. 해당 완료 판정은 이 기록으로 정정한다.
- MUI input/checkbox DOM, 글자 크기·색, 필드92×32px, header42px, glyph18×18px, 클릭영역24×24px 유지. Header/Select/Button UX/Dockview 탭/전환 위젯 위치는 수정하지 않았다.

## Figma 읽기 전용 확인

- 02Components `177:1396`: 시작 입력 x152/y8, 92×32px, radius4, border1px #D1D5DB, text #777777. 수정 전·후 동일값을 재조회했다.
- 03Layout `178:15342`: 현재 checkbox x17/**y12**, 18×18px, radius2, border1px #555555. 이전 기록의 y9가 아니라 현재 y12가 기준이다. 42px header 안에서 상하12px로 중앙이다.
- 03Layout `178:15344`: 번호 text x56/y10, 48×24px, font12px/line20px/#555555. 최신 사용자 지시에 따라 웹의 글자 표시를 중앙에 배치했다. Figma text 레이어 박스와 브라우저 glyph 잉크를 동일한 것으로 간주하지 않는다.
- 브라우저 속성 패널 읽기와 기존 노드 URL 이동만 사용. Figma 생성/편집/표시상태 변경 없음.

## 구현

- 날짜 input에 height/line-height20px와 padding `5px 8px 7px` 적용. 외곽32px는 유지하고, line-height 정규화 후 1px 광학 상향 보정.
- Grid cell을 header 높이100%의 flex 중앙 정렬로 변경. 기존 margin-top9/padding-top1 및 checkbox absolute top6 제거.
- Checkbox는 셀의 세로 중앙 정렬에 참여한다. 기존 가로 x17은 margin-left4px로 보존한다.
- 24px 구분선은 top50%/translateY(-50%)로 중앙 정렬.
- 1차 입력 보정이 1px 과했음을 실제 PNG로 확인해 2차 보정 후 최종 검증했다.

## 실제 PNG 픽셀 검증

Chrome 기본 viewport1920×945, devicePixelRatio1. 실제 페이지를 x244/y126/w720/h165로 캡처했다. 캡처를 변형하지 않았다. 배경/테두리를 제외한 글자 영역에서 RGB 각 채널180 미만 픽셀의 수직 bounds 중앙을 계산했다. Anti-aliasing/글자 모양에 따른 0.5px 반올림 차이를 포함하며, 모든 글꼴/운영체제에서 정확히0px라고 주장하지 않는다.

| 대상 | 변경 전 중앙 편차 | 최종 중앙 편차 (4시안 동일) |
| --- | ---: | ---: |
| 시작 placeholder | +1.5px | -0.5px |
| 종료 placeholder | +2px | 0px |
| 번호/대출자 header 글자 | -0.5px | +0.5px |
| 미선택 checkbox glyph | -3px | 0px |

- DOM: 모든 header cell42px/align-items:center, checkbox center offset0px. 날짜 native input 및 부모 높이32px. 시안 전환 후 동일.
- 캡처: `y-center-before.png`, `y-center-after-a-active.png`, `y-center-after-b-active.png`, `y-center-after-a-active2.png`, `y-center-after-b-active2.png`.
- B Active2에서 숫자 날짜와 한글 입력, checkbox 선택/해제 동작 확인. `y-center-typed-checked.png`. 테스트 입력은 제거하고 checkbox 해제 상태로 복구.
- 1280×631에서 A Active 재검증: app1280×631, 문서 가로 overflow 없음, header/checkbox 중앙 유지. `y-center-1280.png`. 원래 viewport로 복원.
- Switcher fixed/right20px/bottom18px 유지. 앱 전체 화면 유지.
- 최종 TypeScript/Vite build exit0. 기존 번들500kB 경고는 남아 있다.

## 변경량 / 검증 한계

- `src/styles.css`만 수정: +11/-5줄(순증6), 6개 규칙 대상(신규1/기존5). TSX 변경0.
- 전체 CSS292줄/107규칙, MUI 클래스 참조35, Dockview 참조14/테마변수22.
- MUI/Dockview 라이브러리 원본 변경0, 추가 의존성0.
- 이번 작업은 지정된 UI 정렬 검증이다. 모든 폰트 환경, 전체 앱 접근성/확대 reflow, 실서비스 API 기능까지 검증한 것은 아니다. 기존 min-height560 제한은 변경하지 않았다.
