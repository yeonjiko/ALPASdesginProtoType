# ALPAS 프론트엔드 개발 규칙

코드를 작성하거나 수정하기 전에 CODE_CONVENTIONS.md를 읽고 적용합니다.

기준 문서:

- D:/고연지/9-21-회의후-내용-서치/코드작성시고려사항.txt
- D:/고연지/ChatGPT/알파스 2.0/artifacts/alpas1-naming/ALPAS_공통_네이밍_간결형.md
- 같은 디렉터리의 06_business_names.csv 및 04_modules.csv는 기존 업무 용어 참고용입니다.

React 19, TypeScript strict, CSS Modules, MUI를 사용합니다. 내부 import는 @/ alias를 사용합니다. 업무 용어와 외부 계약을 구분하고 라우팅·저장 키·API 필드를 임의로 바꾸지 않습니다. 신규 폴더는 camelCase이며 기존 폴더명 변경 예외는 CODE_CONVENTIONS.md를 따릅니다. FSD의 최종 구조와 업무 정책의 미정 항목은 임의로 확정하지 않습니다.

변경 후 npm run check와 npm run build를 실행하고, Storybook 변경 시 npm run build-storybook도 실행합니다. 검사 실패를 숨기거나 검사를 끄지 않습니다.
