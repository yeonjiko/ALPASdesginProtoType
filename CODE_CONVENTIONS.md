# ALPAS 프론트엔드 작성 규칙

사용자가 제공한 코드작성시고려사항.txt와 ALPAS_공통_네이밍_간결형.md를 기준으로 적용합니다. CSV는 기존 코드에서 추출한 참고 자료이며 신규 코드에 기존 약어를 복제하는 규칙이 아닙니다.

- React 19, TypeScript strict, 함수형 컴포넌트. 페이지·컴포넌트·훅·공용 유틸은 function 선언을 사용합니다.
- Prettier: 쌍따옴표, 세미콜론, 공백 2칸, printWidth 100. URL과 분리 불가능한 문자열은 길이 예외입니다.
- 업무 용어: user는 시스템 계정, member는 도서관 이용자. memberNo, accessionNo, callNo, pubYear를 사용합니다.
- 컴포넌트 PascalCase, 페이지 *Page, 모달 *Modal, 다이얼로그 `*Dialog`, 훅 `use*`, API *Api.ts, 타입 *Types.ts, 스토어 use*Store.
- 변수·함수 camelCase, 고정 상수 UPPER_SNAKE_CASE, 이벤트 handle*, 콜백 on*. boolean은 is/has를 기본으로 하며 can/should/requires는 공통 네이밍 문서의 의미 구분을 따릅니다.
- props 타입은 컴포넌트 가까이에 두고 기본값은 구조분해에서 지정합니다. 모순되는 상태는 union으로 표현합니다.
- any 및 오류 회피용 이중 단언 금지. 외부 데이터는 unknown으로 받아 검증합니다. 단언·검사 예외에는 근거 주석이 필요합니다.
- 내부 모듈 import는 @/ alias를 사용합니다. 페이지 간 직접 참조는 금지하며 공통 UI와 업무 모델을 통해 공유합니다.
- 계산 가능한 값은 state나 effect로 복제하지 않습니다. 이벤트·타이머·구독은 cleanup을 제공합니다.
- CSS Modules가 기본이며 CSS 클래스는 snake_case입니다. MUI·Dockview 등의 외부 클래스와 저장 키·라우팅·API 계약은 유지합니다.
- 공용 함수와 API 함수는 반환 타입을 명시합니다. 미처리 Promise와 Hooks 위반은 ESLint 오류입니다.
- 클릭은 button, 이동은 Link, 입력은 label, 이미지에는 alt를 제공합니다. 안정적인 데이터 ID를 key로 사용합니다.
- 업무 API 연결 시 loading/error/empty, 중복 저장 방지, 성공 알림, 오래된 조회 응답 방지를 구현합니다.
- 병합 전 npm run check(포맷·정적 분석·타입·저장 데이터 검증 테스트) 및 npm run build를 실행합니다. Storybook 변경 시 npm run build-storybook도 실행합니다.

## 적용 해석과 미정 사항

- 문서의 undefined 명시 금지는 불필요한 명시를 피하는 것으로 적용합니다. 라이브러리의 선택 속성·타입 정의를 무효화하거나 null로 일괄 치환하지 않습니다.
- FSD 방향과 페이지 격리는 적용 원칙입니다. Task 5 참조 문서가 제공되지 않아 최종 폴더 구조는 확정하지 않았습니다.
- 예시 수치와 대출 정책을 운영 규칙으로 확정하지 않습니다. Zustand·axios는 실제 상태 공유·통신이 필요한 시점에 도입합니다.

- 기존 PascalCase 컴포넌트 폴더는 Windows EPERM으로 이름 변경이 차단되어 유지했습니다. 신규 폴더는 camelCase를 사용합니다.

## IDE 공통 도구 설정

- 지원 Node: 24.22.1 이상인 24.x LTS. 로컬 기준 버전은 .node-version과 .nvmrc의 24.22.1이며 CI도 .node-version을 읽습니다. npm ci 후 npm run check와 npm run build로 검사합니다.
- VS Code와 IntelliJ의 Node 인터프리터는 업데이트한 시스템 Node를 사용합니다. Node 업데이트 후 IDE와 터미널을 다시 시작하고 node --version으로 확인합니다. nvm-windows는 .nvmrc를 자동 적용하지 않으므로 사용할 버전을 명시적으로 선택해야 합니다.
- 두 IDE 모두 프로젝트의 node_modules/prettier와 .prettierrc.json을 기준으로 사용합니다. IDE 기본 정렬기는 최종 포맷 기준으로 사용하지 않습니다.
- VS Code는 프로젝트 저장 시 Prettier와 ESLint fix를 실행하며, 로컬 TypeScript SDK를 사용합니다.
- IntelliJ는 Automatic Prettier configuration과 Run on save를 사용합니다. ESLint도 프로젝트 설정을 자동 탐지합니다.
- package.json과 .gitignore는 기존 항목을 보존하고 필요한 필드와 규칙만 병합합니다. lockfile을 공유하고 재현 설치에는 npm ci를 사용합니다.
- ESLint 설정을 다른 프로젝트로 옮길 때는 scripts/eslint/pageImports.mjs도 함께 필요합니다. 테스트 명령을 옮기면 scripts/*.test.mjs와 연결된 모델도 함께 확인해야 합니다.
