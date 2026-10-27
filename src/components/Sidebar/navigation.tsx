export const menu = [
  ["업무", "대시보드", "대출·반납"],
  ["수서대상관리", "희망자료관리", "희망자료통계"],
  ["구입", "구입자료관리", "검수자료관리", "구입자료출력"],
  ["기증", "기증자료관리", "기증자관리", "기증자료출력"],
  ["등록", "등록자료관리", "원부대장관리"],
  ["정리", "목록생성", "장비처리", "RFID대장"],
  ["열람", "배가일자료기록", "배가자료관리", "장서점검", "작업중통계"],
];

export const sidebarItems = menu.flatMap(([, ...items]) => items);

export function sidebarItemHref(item: string): string {
  return `#sidebar-${encodeURIComponent(item)}`;
}

export function selectedSidebarItemFromHash(): string | undefined {
  return sidebarItems.find((item) => window.location.hash === sidebarItemHref(item));
}
