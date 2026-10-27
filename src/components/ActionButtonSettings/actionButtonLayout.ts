export const actionButtonDefinitions = [
  {
    id: "file-search",
    label: "파일검색",
    description: "자료 파일을 검색합니다.",
  },
  {
    id: "member-info",
    label: "회원정보",
    description: "선택한 회원의 정보를 확인합니다.",
  },
  {
    id: "book-detail",
    label: "책상세보기",
    description: "선택한 자료의 상세정보를 확인합니다.",
  },
  {
    id: "notice-print",
    label: "독촉장출력",
    description: "선택한 항목의 독촉장을 출력합니다.",
  },
  {
    id: "branch-notice-print",
    label: "관별 독촉장출력",
    description: "관별로 독촉장을 출력합니다.",
  },
  {
    id: "notice-settings",
    label: "독촉장출력설정",
    description: "독촉장 출력 조건을 설정합니다.",
  },
] as const;

export type ActionButtonId = (typeof actionButtonDefinitions)[number]["id"];

export type ActionButtonLayout = {
  active: ActionButtonId[];
  inactive: ActionButtonId[];
};

export const actionButtonById = new Map(
  actionButtonDefinitions.map((action) => [action.id, action]),
);

export const defaultActionButtonLayout: ActionButtonLayout = {
  active: actionButtonDefinitions.map((action) => action.id),
  inactive: [],
};

export const actionButtonLayoutStorageKey = "alpas-action-button-layout-v1";

export function cloneActionButtonLayout(layout: ActionButtonLayout): ActionButtonLayout {
  return { active: [...layout.active], inactive: [...layout.inactive] };
}

export function isActionButtonId(id: unknown): id is ActionButtonId {
  return actionButtonDefinitions.some((action) => action.id === id);
}

export function parseActionButtonLayout(serialized: string | null): ActionButtonLayout {
  try {
    const saved: unknown = JSON.parse(serialized ?? "null");
    if (
      typeof saved !== "object" ||
      saved === null ||
      !("active" in saved) ||
      !("inactive" in saved)
    ) {
      return cloneActionButtonLayout(defaultActionButtonLayout);
    }
    const { active, inactive } = saved;
    if (!Array.isArray(active) || !Array.isArray(inactive)) {
      return cloneActionButtonLayout(defaultActionButtonLayout);
    }
    const activeIds = [...new Set(active.filter(isActionButtonId))];
    const inactiveIds = [...new Set(inactive.filter(isActionButtonId))].filter(
      (id) => !activeIds.includes(id),
    );
    const missingIds = defaultActionButtonLayout.active.filter(
      (id) => !activeIds.includes(id) && !inactiveIds.includes(id),
    );
    return { active: [...activeIds, ...missingIds], inactive: inactiveIds };
  } catch {
    return cloneActionButtonLayout(defaultActionButtonLayout);
  }
}

export function readActionButtonLayout(): ActionButtonLayout {
  try {
    return parseActionButtonLayout(window.localStorage.getItem(actionButtonLayoutStorageKey));
  } catch {
    return cloneActionButtonLayout(defaultActionButtonLayout);
  }
}
