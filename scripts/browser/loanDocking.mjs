// Browser regression fixture: use Dockview's DOM drag events, without accessing its internals.
const button = document.querySelector("#run-docking-test");
const result = document.querySelector("#docking-test-result");
const evidence = [];
function row(number) {
  return document.querySelector(
    `section[aria-label="${number === 2 ? "2행 업무목록" : "3행 처리목록"}"]`,
  );
}
function groups(number) {
  return [...row(number).querySelectorAll(".dv-groupview")];
}
function tab(number, text) {
  const found = [...row(number).querySelectorAll(".dv-tab")].find(
    (node) => node.textContent === text,
  );
  if (!found) throw new Error(`Missing tab ${number}: ${text}`);
  return found;
}
function snapshot() {
  return [2, 3].map((number) =>
    groups(number).map((group) =>
      [...group.querySelectorAll(".dv-tab")].map((node) => node.textContent),
    ),
  );
}
function check(name, condition) {
  if (!condition) throw new Error(name);
  evidence.push({ name, rows: snapshot() });
  result.textContent = JSON.stringify(evidence, null, 2);
}
function frame() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}
async function drag(source, target, x = 0.5, y = 0.5) {
  const dataTransfer = new DataTransfer();
  function emit(node, type, rect, rx, ry) {
    node.dispatchEvent(
      new DragEvent(type, {
        bubbles: true,
        cancelable: true,
        dataTransfer,
        clientX: rect.left + rect.width * rx,
        clientY: rect.top + rect.height * ry,
      }),
    );
  }
  emit(source, "dragstart", source.getBoundingClientRect(), 0.5, 0.5);
  const rect = target.getBoundingClientRect();
  emit(target, "dragenter", rect, x, y);
  emit(target, "dragover", rect, x, y);
  emit(target, "drop", rect, x, y);
  emit(source, "dragend", rect, x, y);
  await frame();
}
function isCollapsed(number) {
  return row(number).hidden && row(number).getBoundingClientRect().height === 0;
}
async function clickButton(text) {
  const target = [...document.querySelectorAll("button")].find(
    (node) => node.textContent.trim() === text,
  );
  if (!target) throw new Error("Missing button: " + text);
  target.click();
  await frame();
}
async function openSettings() {
  document.querySelector('button[aria-label="대출·반납 화면 설정"]').click();
  await frame();
}
async function select(label, value) {
  const target = [...document.querySelectorAll('[role="combobox"]')].find((node) =>
    node
      .getAttribute("aria-labelledby")
      ?.split(" ")
      .some((id) => document.getElementById(id)?.textContent === label),
  );
  if (!target) throw new Error("Missing select: " + label);
  target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }));
  await frame();
  const option = [...document.querySelectorAll('[role="option"]')].find(
    (node) => node.textContent === value,
  );
  if (!option) throw new Error("Missing option: " + value);
  option.click();
  await frame();
}
function content(number, text) {
  return tab(number, text).closest(".dv-groupview").querySelector(".dv-content-container");
}
button.addEventListener("click", async () => {
  button.disabled = true;
  evidence.length = 0;
  try {
    document.querySelector('nav a[href*="sidebar-%EB%8C%80%EC%B6%9C"]')?.click();
    if (!row(2)) {
      const link = [...document.querySelectorAll("a")].find(
        (node) => node.textContent.trim() === "대출·반납",
      );
      link?.click();
    }
    await frame();
    check(
      "default independent rows",
      JSON.stringify(snapshot()) ===
        JSON.stringify([
          [["예약목록 (0)", "상호대차 대출 및 대출대기 목록 (0)"], ["대출목록 (0)"]],
          [["이용자 검색목록"], ["처리목록"]],
        ]),
    );
    await drag(tab(3, "이용자 검색목록"), tab(2, "대출목록 (0)"), 0.2);
    check(
      "cross-row tab header",
      tab(2, "이용자 검색목록").closest(".dv-groupview") ===
        tab(2, "대출목록 (0)").closest(".dv-groupview"),
    );
    await drag(tab(2, "이용자 검색목록"), content(3, "처리목록"), 0.1);
    check("cross-row left section", groups(3).length === 2);
    await drag(tab(3, "처리목록"), content(2, "대출목록 (0)"), 0.9);
    check("third section accepted", groups(2).length === 3);
    await drag(tab(3, "이용자 검색목록"), content(2, "처리목록"), 0.9);
    check("fourth section rejected", groups(2).length === 3 && !!tab(3, "이용자 검색목록"));
    const previousHeight = row(2).getBoundingClientRect().height;
    await drag(tab(3, "이용자 검색목록"), tab(2, "처리목록"), 0.2);
    check(
      "tab header accepted at cap and empty row collapsed",
      groups(2).length === 3 &&
        row(3).querySelectorAll(".dv-tab").length === 0 &&
        groups(3).length === 0 &&
        isCollapsed(3),
    );
    check(
      "remaining row fills freed space",
      row(2).getBoundingClientRect().height > previousHeight,
    );
    await drag(tab(2, "처리목록"), tab(2, "이용자 검색목록"), 0.2);
    check(
      "tab reorder at cap",
      [...tab(2, "처리목록").closest(".dv-groupview").querySelectorAll(".dv-tab")][0]
        .textContent === "처리목록",
    );
    await openSettings();
    await select("추가할 화면", "이용자 검색목록");
    await select("배치할 행", "3행 처리목록");
    await clickButton("화면 추가 / 이동");
    await clickButton("완료");
    check(
      "settings reopen collapsed row",
      !isCollapsed(3) && groups(3).length === 1 && !!tab(3, "이용자 검색목록"),
    );
    await drag(tab(2, "처리목록"), content(2, "예약목록 (0)"), 0.1);
    check(
      "whole section reorder at cap",
      groups(2).length === 3 && snapshot()[0][0][0] === "처리목록",
    );
    const before = JSON.stringify(snapshot());
    await drag(tab(2, "대출목록 (0)"), content(3, "이용자 검색목록"), 0.5, 0.05);
    check("vertical split rejected", JSON.stringify(snapshot()) === before);
    check(
      "first row remains three fixed sections",
      document.querySelector('section[aria-label="1행 기본 패널"] > div').children.length === 3,
    );
    for (const title of snapshot()[0].flat())
      await drag(tab(2, title), content(3, "이용자 검색목록"));
    check("second row also collapses", isCollapsed(2) && groups(2).length === 0 && !isCollapsed(3));
    const collapsedLayout = JSON.stringify(snapshot());
    await openSettings();
    await clickButton("내부 배치 저장");
    await clickButton("기본 배치로 초기화");
    check("reset restores both rows", !isCollapsed(2) && !isCollapsed(3));
    await clickButton("내부 배치 복원");
    check(
      "restore keeps empty row collapsed",
      isCollapsed(2) && JSON.stringify(snapshot()) === collapsedLayout,
    );
    for (const title of [
      "예약목록",
      "상호대차 대출 및 대출대기 목록",
      "대출목록",
      "이용자 검색목록",
      "처리목록",
    ]) {
      await select("추가할 화면", title);
      await clickButton("선택 화면 숨기기");
    }
    check(
      "hiding every tab collapses both rows",
      isCollapsed(2) && isCollapsed(3) && groups(2).length === 0 && groups(3).length === 0,
    );
    await select("추가할 화면", "대출목록");
    await select("배치할 행", "2행 업무목록");
    await clickButton("화면 추가 / 이동");
    await clickButton("완료");
    check(
      "add after both rows empty",
      !isCollapsed(2) && isCollapsed(3) && !!tab(2, "대출목록 (0)"),
    );
    result.textContent = "PASS " + evidence.length + "\n" + JSON.stringify(evidence, null, 2);
  } catch (error) {
    result.textContent = `FAIL ${error.message}\n` + JSON.stringify(evidence, null, 2);
  } finally {
    button.disabled = false;
  }
});
