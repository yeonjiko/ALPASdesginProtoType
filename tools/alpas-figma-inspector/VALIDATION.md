# 검증 결과 — 2026-10-21

대상: ALPAS Read-only Inspector 로컬 개발 플러그인.

## v1.0.1 · 선택 정보 미표시 수정

- 사용자 보고: 플러그인 창은 열리지만 프레임을 선택해도 안내만 표시됨. 기존 manifest 등록/실행은 사용자 보고로 확인되었으며 ID 수용 여부는 더 이상 현재 차단 사유가 아님.
- 수정 전 24개 테스트 통과. 추가 회귀 테스트에서 source:null 메시지 미표시와 초기 스냅샷 부재를 각각 재현하여 2개 실패 확인.
- 수정: `event.source === parent` 대신 전용 채널/버전/스냅샷 구조 검증. core의 요청 수신기를 먼저 등록하고 showUI 후 현재 선택을 전송. UI의 명시적 inspect 요청도 유지.
- v1.0.1 표시와 5초 응답 타임아웃 추가. 선택 없음/무응답/읽기 오류/렌더링 오류/버전 불일치 구분. 재조회 중 오래된 결과와 내보내기는 제거/비활성화.
- `node --test --test-reporter=spec inspector.test.cjs`: **34개 통과 / 실패0**. null/상이한 source, 초기 선택, 빠른 초기 요청, 실제 선택 교체 이벤트, 재시도, 잘못된 메시지/데이터, 렌더링 실패, core↔UI 연결 테스트 추가.
- 실제 Figma의 MessageEvent.source를 관찰하지 못함. 로컬 재현은 호환성 결함 증거이지 사용자 환경의 유일한 원인 확정이 아님.
- 실제 Figma 수정본 실행과 시각 검증은 미수행. 사용자가 창을 닫고 다시 실행한 뒤 v1.0.1/선택 개수/치수 표시를 확인해야 함.
- 문서 쓰기/네트워크/새 파일 생성/API키/추가 의존성 없음. manifest와 프로토타입 CSS/TSX 변경 없음.

이하 기록은 최초 버전의 검증 이력이며 위 결과가 최신 상태입니다.

## 완료

- `node --check code.js` 문법 검사 통과.
- `node --test inspector.test.cjs`: 24개 통과 / 실패0.
- Figma 문서 객체를 동결한 mock에서 선택·하위 레이어 읽기 검증. 허용하지 않은 Figma API 접근을 거절하도록 mock 구성.
- 선택/페이지 변경 이벤트, UI 시작 handshake, 하위 트리 포함/제외, 숨김 분기, 최대500노드/깊이20 제한 검증.
- 소수점 치수, RGB→HEX와 별도 opacity, 개별 corner radius, gradient alpha, Auto Layout NONE의 padding 미추정, MIXED 및 텍스트 구간별 스타일, 빈 문자열·긴 문자열·읽기 오류 검증.
- 두 노드 캔버스 축 정렬 간격 검증.
- 간단한 DOM mock으로 JSON/요약 표시, Clipboard 성공·거절 시 수동 복사, 파일 다운로드 요청, 오래된 결과 초기화 검증. 이 검사는 실제 브라우저 시각 검사와 다름.
- manifest `networkAccess.allowedDomains:["none"]`, 문서 생성/삭제/선택 변경/표시 상태 변경/plugin data/relaunch 쓰기 코드 없음.
- 플러그인 실행에 Node/Python/서버/추가 패키지 불필요. Node는 로컬 테스트에만 사용.
- 프로토타입 `src/main.tsx`, `src/styles.css`, MUI/Dockview 원본 및 의존성 수정0. 기존 Select 스타일은 변경하지 않음.

## 아직 확인하지 못한 항목

- Figma 데스크톱의 실제 manifest 등록과 로컬 개발용 ID 수용 여부. ID 발급을 요구하면 README의 Figma 발급 ID 절차 필요.
- 실제 ALPAS Figma 문서의 실행, popup 레이아웃, Clipboard/다운로드 권한, 실제 선택값과 UI 속성 패널의 대조.
- 네 시안의 Select 수정/최종 시각 검증. 사용자가 이 플러그인으로 추출한 최신 JSON을 전달하면 후속 작업 가능.

판정: **로컬 구현·자동 테스트 통과 / 실제 Figma 최초 실행 검증 필요**. Figma 파일 생성·수정·플러그인 게시를 수행하지 않았다.
