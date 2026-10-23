# Button / Select UX 검증 · 2026-10-21

## 범위와 순서

현재 소스 확인 → 네 시안 Y축 정렬 실측 → 02Components/03Layout 읽기 전용 확인 → 프로토타입 수정 → 브라우저 확인 → Figma 재대조.
Figma 원본 수정 금지. 브라우저 꽉 채움과 고정 시안 전환기 위치 유지. 라이브러리 원본 수정/추가 의존성 없음.

## 수정 전 정렬

네 시안 모두 버튼, input placeholder, Select, Dockview 탭, footer 건수의 CSS 라인 박스 중심 오차 0px.
그리드 제목은 42px header 내부 y=10/line-height=20으로 중심보다 1px 위. Figma 178:15344와 일치하여 유지.
글꼴의 실제 잉크 영역은 라인 박스와 다를 수 있음. placeholder는 독립 DOM 텍스트가 아니므로 input 콘텐츠 박스와 동일 상하 padding을 측정하고 화면으로 확인.

## 원본 근거

Figma MCP Starter 호출 제한으로 브라우저 속성 패널과 실제 캔버스를 조회함.

| 역할 | 원본 노드 | 값 |
|---|---|---|
| A Primary hover/pressed | 47:21 / 47:25 | #1D56BC / #16408D |
| B Primary hover/pressed | 47:79 / 47:83 | #EA580C / #C2410C |
| Disabled 표면/글자 | 47:34 / 47:35 | #E5E7EB / #9CA3AF |
| Focus ring | 47:30 | 2px, offset 2px, #246BE8 |
| A Secondary hover/pressed | 47:50 / 47:54 | #EFF5FF/#246BE8, #D3E1FB/#16408D |
| B Secondary hover / pressed | 47:108 / 47:112 | #FFF7ED/#F97316, #FFEDD5/#C2410C; 부모 행은 원본에서 숨김, 표시 상태를 변경하지 않고 속성만 조회 |
| B Secondary hover text | 47:109 | #C2410C. 최초 적용 #EA580C를 최종 재대조에서 수정 |
| A Secondary hover group | 47:49 | text #1D56BC, border #246BE8, fill #EFF5FF |
| A Select selected/hover | 168:44 / 169:52 | #BFDBFE / #EFF6FF, 행 44px |
| B Select selected/hover | 169:60 / 169:61 | #FED7AA / #FFF7ED, 행 44px |
| Select popup | 52:695 | 흰색, radius 4, 320×191; 4개 예제 항목 |
| Select text | 52:696 | 14px, 검정, x inset 20 |
| 03Layout A search | 178:15311 | 68×32, radius4, #2468EB |

02Components 보드의 240×48 버튼을 화면에 확대 적용하지 않는다. 03Layout의 36/32px 높이와 기본색(특히 A #2468EB)을 유지하고 상태 디자인만 매핑한다.
기존 업무 옵션은 추가/변경하지 않는다. 현재 Select는 각 1개 항목만 가지므로 새 업무 선택지를 임의로 만들지 않는다.

## 구현 / 후속 검증

MUI Button의 인라인 배경을 제거하고 scope된 Theme styleOverrides로 hover/active/focus/disabled/loading을 정의한다.
MUI Select의 실제 메뉴/키보드 동작을 유지하고 popup 및 MenuItem에 A/B 색상과 간격을 적용한다.
시안 전환기는 새로운 Button 스타일 범위에서 제외한다. 검색 입력은 type=text, 검색 동작 요소는 native button.
## 완료 검증

- 4시안 × 기본1920px/1280×631: 버튼, 입력 placeholder, Select의 라인 박스 중심 오차0px. 탭/하단 건수도 중앙. Grid 제목은 원본과 같은 -1px 유지.
- Header input 내부 기본 em 높이로 생긴36.125px을 명시적20px 콘텐츠 높이 + 상하8px padding으로36px 정규화. TextField 외곽/버튼 높이36px 유지.
- 검색 버튼: 68×32/헤더58×36 유지. A Hover rgb(29,86,188), B rgb(234,88,12), 전경white 확인.
- 네 시안 보조 버튼 hover, Tab focus 2px/offset2 확인. B Active/Active2는 최종 rgb(194,65,12) 텍스트로 재검증.
- 실제 MUI Select popup: 44px 행, 12px 20px padding, 14px/20px 글꼴, 중심오차0px, 아래간격4px, radius4, 그림자없음. 너비는 기존 필드132px에 맞춤(320px 디자인 예시를 강제 확대하지 않음).
- A selected rgb(191,219,254), B selected rgb(254,215,170). 사이드바 Select에도 동일 메뉴 스타일 적용 확인. ArrowDown/Enter/Escape 열기·선택·닫기 확인.
- 기존 Select가 각1항목이라 비선택 항목 hover 화면은 발생하지 않음. 해당 스타일은 원본값과 코드로 대조했으며 선택지/업무 데이터를 임의 추가하지 않음.
- Pressed/Disabled/Loading은 소스 상태 규칙 및 빌드로 확인. 지속 누름/비활성/비동기 로딩의 실제 화면 전환은 이번 앱에 해당 상태가 없어 시각 검증하지 않음. 실제 백엔드·비동기 기능을 구현했다는 뜻이 아님.
- 02Components 재조회47:21/169:60/47:49/47:108/47:109와03Layout178:15311 재조회 후 비교. B Hover 텍스트 보정 뒤47:109를 다시 읽어 #C2410C 일치 확인.
- 1280×631 document 가로 넘침false. app은 viewport와 동일. fixed switcher right20/bottom18 유지. 원래900px 이하 규칙(right10/bottom10)도 변경하지 않음.
- 최종 TypeScript/Vite 빌드 성공. 기존500kB 번들 경고(687.20kB)가 남음. 개발 HMR 중 기존 createRoot 중복 경고3회가 기록됐고, 최종 새로고침 이후 새 오류는 관찰되지 않음.
- 실제 캡처4개는 전환 중간 색상을 제거하고 안정된 A/B 색상을 다시 확인해 저장. 예: control-ux-a-active.png, control-ux-b-hover-final.png. 생성형 이미지가 아님.
- 이번 턴 Figma 생성·편집·표시상태 변경 없음. 과거 문의 레이어 사고와는 별도 기록.

## 변경량과 남은 제약

- styles.css: +3/-16줄, 순감13. 299→286줄,110→106규칙, MUI 클래스참조40→34. Dockview 참조14/변수22 동일.
- main.tsx: +58/-10줄. MUI Button/Menu의 scoped Theme override2개, Select 메뉴 설정 및 실제input/button 사용. CSS-in-JS 변경도 이 수치에 포함하며 CSS파일 감소만으로 커스터마이징이 사라졌다고 주장하지 않음.
- MUI/Dockview 원본 수정0, 새 의존성0.
- 125%/200% 확대에 상당하는1024×505/640×315 CSS viewport로 리플로 점검. 실제 브라우저 줌 조작 검사는 아님. 기존 min-height560 때문에 viewport보다 앱이 높고640px에서는 헤더/작업행도 잘림. 기존 전체 앱 반응형 제약으로 이번 상태 스타일 범위 밖에 보존. 기본 viewport로 복원함.
- 판정: 이번 정렬 검사 및 Button/Select 스타일 매핑 완료. 전체 앱의200% 접근성/운영 배포 준비가 완료됐다는 판정은 아님.
