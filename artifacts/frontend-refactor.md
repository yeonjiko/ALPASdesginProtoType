# ALPAS 프론트엔드 규칙 적용 기록

대상: `D:/고연지/prototype/ALPASdesginProtoType`

## 기준

사용자가 제공한 코드작성시고려사항.txt와 ALPAS_공통_네이밍_간결형.md를 개발 기준으로 적용했다. 04_modules.csv와 06_business_names.csv는 기존 업무 용어의 근거 자료로 확인했으며, 기존 약어나 경로를 신규 규칙으로 일괄 복제하지 않았다. 문서의 예시 정책 값은 운영 정책으로 사용하지 않았다.

## 적용

- Prettier: 쌍따옴표, 세미콜론, 공백 2칸, printWidth 100, LF.
- TypeScript: strict 유지, 미사용 선언·인자 검사, switch fallthrough 방지, 파일명 대소문자 검사. src·Storybook·Vite 설정을 검사 범위에 포함.
- ESLint: recommendedTypeChecked, Hooks, Promise 처리, any 금지, type import, 공개 함수 반환 타입, 중첩 삼항 방지.
- 페이지 간 import·re-export 경계 규칙 추가. 같은 페이지 내부와 앱의 페이지 조합은 허용하며 다른 페이지의 내부 구현 참조를 차단.
- TypeScript·Vite의 @/ 경로 별칭과 내부 import 적용.
- memberNo, memberName, accessionNo, callNo, pubYear 등 확인 가능한 내부 업무 이름 정리.
- CSS Modules 로컬 클래스 snake_case 적용. MUI·Dockview 외부 클래스, 기존 사이드바 해시와 localStorage 키 유지.
- 저장 설정 파서를 UI에서 분리. unknown 입력 검증, 손상 데이터 복구, 알 수 없는 ID·중복 제거.
- 드래그 입력의 타입 단언을 실제 ID 검증으로 교체. CSS 사용자 변수는 명시적 타입 객체로 작성.
- 다이얼로그 초안 초기화 effect 제거, 열림 상태 전환 시에만 재설정. 그리드 표시 건수 초기화는 레이아웃 키로 분리.
- Storybook render 함수를 이름 있는 컴포넌트로 변경해 Hooks 규칙 충족.
- 프로젝트 AGENTS.md·CODE_CONVENTIONS.md·VS Code 저장 시 포맷 설정 작성.

## 검증

- npm run check: 통과. Prettier·ESLint(경고 허용 0)·TypeScript·테스트 포함.
- npm run build: 최종 소스 기준 통과.
- npm run build-storybook: 최종 소스 기준 통과.
- 테스트: 저장 데이터 복구·중복 제거·기본값 복사 3건, 페이지 import 경계 테스트 파일 1건(허용 3개·차단 2개 사례).
- 브라우저: 기본 데이터 18건 표시, 그리드 설정 열기·닫기, 저장하지 않은 체크 변경의 재진입 복구, ACTIVE2 전환 후 빈 결과·총 0건 표시 확인.
- 검증 이미지: `alpas-refactor-ui.png`.

## 남은 항목과 예외

- Windows EPERM으로 기존 PascalCase 폴더명 변경이 차단되어 유지했다. 신규 폴더는 camelCase 규칙을 따른다.
- 문서가 참조하는 Task 5 HTML은 제공 경로에서 확인되지 않았다. 최종 FSD 폴더 구조와 업무 담당자 결정 사항은 임의로 확정하지 않았다.
- 번들 크기 경고가 있다. 최종 앱 JS 약 1.41 MB, gzip 약 416 KB. 기능 분할·지연 로딩은 별도 성능 작업이 필요하다.
- 검사 병행 중 한 차례 메모리 부족이 발생했으나 재실행한 최종 검사와 앱 빌드는 통과했다.
- Git 작업 트리 조회가 환경에서 실패했다. 커밋·푸시를 수행하지 않았다.
