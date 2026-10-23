# ALPAS Read-only Inspector

Figma에서 컴포넌트를 클릭하면 크기, 내부 텍스트, 글꼴 크기/행간, Auto Layout padding/gap, 색상, 외곽선, radius가 나타나는 로컬 개발 플러그인입니다.

## v1.0.1 — 선택해도 안내만 보이는 경우

1. 열려 있는 Inspector 플러그인 창을 닫습니다.
2. `Plugins → Development → ALPAS Read-only Inspector`를 다시 실행합니다.
3. 상단에 **v1.0.1**이 보이는지 확인합니다. 이전 화면이면 이 폴더의 `manifest.json`으로 등록한 플러그인이 맞는지 확인합니다. manifest ID는 변경할 필요가 없습니다.
4. 캔버스 또는 왼쪽 레이어 목록에서 프레임 하나를 선택합니다. 이미 선택되어 있으면 실행 직후에도 읽습니다.
5. 정상 수신 시 `페이지명 · 선택 1개 · 읽은 레이어 N개`와 크기 W × H 등이 표시됩니다. 자동 갱신되지 않으면 **다시 읽기**를 누릅니다.

상태 문구는 아래처럼 구분됩니다.

- **연결됨 · 선택 0개**: Figma가 현재 페이지의 빈 선택 목록을 반환했습니다. 캔버스/레이어 목록에서 실제 레이어를 선택합니다.
- **Figma 응답 없음**: 5초 동안 응답이 없었습니다. 다시 읽기 또는 플러그인 재실행 후, 반복되면 상태 문구와 화면 캡처를 전달합니다.
- **읽기 실패 / 표시 실패**: 상세 오류를 표시합니다. 기존 결과를 지우고 복사/저장을 비활성화하므로 오래된 수치를 새 값으로 오해하지 않도록 합니다.
- **플러그인 파일 버전이 다릅니다**: code.js와 ui.html이 같은 버전인지 확인하고 재실행합니다.

v1.0.1은 수신 메시지의 `event.source === parent` 전제를 제거하고 전용 채널·버전·데이터 형식을 확인합니다. 초기 선택도 명시적으로 전송합니다. 실제 사용자 환경의 이벤트를 직접 관찰하지 못했으므로 이 조건이 유일한 장애 원인이라고 확정하지 않습니다.

## 처음 한 번 등록

1. **Figma 데스크톱 앱**에서 기존 ALPAS 파일을 엽니다. 새 디자인 파일은 만들 필요가 없습니다.
2. `Plugins → Development → Import plugin from manifest…`에서 이 폴더의 `manifest.json`을 선택합니다.
3. `Plugins → Development → ALPAS Read-only Inspector`를 실행합니다.

현재 사용자는 등록 후 플러그인 창이 열리는 것까지 확인했습니다. 기존 등록을 유지하며 ID를 바꾸거나 새 Figma 파일을 만들 필요가 없습니다. 커뮤니티에 게시하지 않습니다.

Node 서버, Python, npm 설치, 빌드, API 키가 필요 없습니다. 세 파일 `manifest.json`, `code.js`, `ui.html`만 실행에 사용합니다.

## Select 확인

1. 02Components에서 Select 전체 프레임 또는 인스턴스를 선택합니다.
2. **하위 레이어 포함**을 켜면 선택값과 옵션 텍스트의 실제 fontSize가 각각 나타납니다. 혼합 글꼴은 MIXED와 구간별 값으로 구별합니다.
3. `JSON · 전체 수치 → 복사` 또는 `파일 저장`으로 데이터를 전달합니다. 복사 권한이 막히면 펼쳐진 텍스트에서 Ctrl+C를 사용할 수 있습니다.
4. 03Layout의 A Active/B Active/A Active2/B Active2에서도 해당 Select를 선택하여 각각 내보냅니다. 컴포넌트 예시와 실제 화면 인스턴스의 크기를 혼동하지 않도록 페이지·노드 ID가 함께 기록됩니다.
5. 두 레이어를 동시에 선택하면 캔버스 축 기준 가로/세로 간격과 중심 차이도 JSON에 포함됩니다. Auto Layout gap과는 별개 값입니다.

선택/페이지 변경 시 자동 갱신합니다. **같은 레이어의 속성을 수정한 뒤에는 ‘다시 읽기’를 누릅니다.**

## 읽기 전용 범위

- 레이어 생성·삭제·이동·속성 변경·선택 변경·표시 변경·relaunch/plugin data 저장 코드 없음.
- manifest에서 네트워크 차단. 외부 서비스나 이 대화로 자동 전송하지 않습니다. 사용자가 복사/저장한 결과만 공유합니다.
- 현재 선택한 하위 트리만 읽습니다. 다른 페이지 로드/전체 파일 검색 없음.
- 최대500개 레이어/깊이20/텍스트20,000자. 제한에 걸리면 경고합니다. 숨김 하위 레이어는 기본 제외합니다.
- AUTO 행간을 임의의 px로 변환하지 않습니다. Auto Layout이 없으면 padding/gap을 추정하지 않습니다. 회전된 노드의 두 레이어 간격은 축 정렬 bounding box 기준입니다.
- Figma의 디자인 단위이며 브라우저 CSS 계산값이나 실제 글자 잉크 영역을 측정하는 도구가 아닙니다.

## 검증

`node --test inspector.test.cjs`로 읽기 전용 mock API 테스트를 실행합니다. Node는 개발 검증에만 필요하며 플러그인 실행에는 필요 없습니다.

자동 테스트와 실제 Figma 실행 검증은 다릅니다. 사용자가 기존 버전의 창 실행을 확인했으나 선택값 미표시를 보고했습니다. v1.0.1의 34개 로컬 테스트는 통과했지만 실제 Figma 재실행·복사 권한·실제 문서 수치 대조는 사용자 환경에서 확인이 필요합니다. 프로토타입 Select 스타일은 추출한 최신 수치를 받은 뒤 별도로 수정합니다.

## 공식 근거

- [UI 메시지 전달과 초기 메시지 큐](https://developers.figma.com/docs/plugins/creating-ui/)
- [Plugin manifest / 네트워크 차단](https://developers.figma.com/docs/plugins/manifest/)
- [선택 변경 이벤트](https://developers.figma.com/docs/plugins/api/properties/figma-on/)
- [구간별 텍스트 스타일](https://developers.figma.com/docs/plugins/api/properties/TextNode-getstyledtextsegments/)
- [Figma 데스크톱에서 manifest 가져오기](https://help.figma.com/hc/en-us/articles/38457121114263-Create-a-Figma-Design-plugin-with-the-Figma-MCP-server-and-agentic-tools)
