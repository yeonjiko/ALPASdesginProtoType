# ALPAS 컴포넌트와 스타일 관리

## 실행

- npm run dev: 기존 프로토타입
- npm run storybook: http://localhost:6006
- npm run build: 타입 검사 및 프로토타입 빌드
- npm run build-storybook: Storybook 정적 빌드
- npm run measure:css: 로컬 CSS Modules 포함 스타일 통계

## 작은 공통 UI

src/components/ui/ 아래에 Button, IconButton, TextField, Select, Checkbox, Autocomplete, DatePicker, Tooltip, Dialog를 둡니다. 각 폴더의 Component.tsx, Component.module.css, Component.stories.tsx에서 동작·스타일·상태 예시를 함께 관리합니다. 실제 화면도 동일한 공통 UI를 사용합니다.

Button은 contained/outlined/text, disabled/loading, size, onClick을 지원합니다. 다른 UI도 MUI의 기존 props와 접근성 속성을 유지합니다. Select와 Autocomplete의 제네릭 props, 입력창과 버튼의 ref 전달을 유지합니다.

## 조합 컴포넌트

SearchFilters는 날짜·입력·선택·버튼을 조합하고, WorkspacePanel은 SearchFilters/ActionButtonSettings/ResultsGrid를 배치합니다. Header, Sidebar, Workspace, 각 설정 팝업도 각각 module.css를 사용합니다.

## CSS Modules 규칙

스타일 파일을 .module.css로 만들고 컴포넌트에서 import합니다. createClasses는 의미 있는 기존 클래스명과 해당 모듈의 해시 클래스명을 함께 붙입니다. 기존 클래스명은 테마 상태와 다른 컴포넌트가 배치할 때 사용하는 연결점이며, 자체 스타일 선언은 로컬 해시 클래스를 대상으로 합니다.

:global은 MUI/Dockview 클래스와 명시적인 외부 컴포넌트·테마 연결점에만 사용합니다. 공통 폰트와 문서 초기화만 styles/base.css에 남겨 둡니다. 다른 UI의 크기·배치를 조정하는 규칙은 조합 컴포넌트에, 독립적인 외형과 상태는 해당 UI 모듈에 둡니다. 포털 메뉴·달력 스타일은 Select/DatePicker/Autocomplete 폴더에 있습니다.

src/styles.css는 Dockview 기본 스타일과 문서 초기화만 불러옵니다. main.tsx 및 Storybook preview에서 가장 먼저 import하여 라이브러리 스타일이 컴포넌트 스타일을 덮어쓰지 않도록 합니다.

## Storybook

ALPAS/UI에서 작은 UI를 개별 확인합니다. 버튼 기본·외곽선·텍스트·비활성·로딩, 입력 오류, 체크박스 상태, 선택창·자동완성·날짜·툴팁·팝업 예시를 제공합니다. Button/TextField/Checkbox 기본 스토리에는 실제 클릭·입력 검증도 포함합니다.

상단 도구에서 A/B 및 ACTIVE/ACTIVE2를 전환합니다. Prototype은 기존 화면의 시안 전환 버튼을 사용합니다. 버튼 배치 저장은 기존처럼 브라우저 localStorage를 사용합니다.
