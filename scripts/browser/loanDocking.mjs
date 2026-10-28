// Exercise the public UI and DOM drag events without inspecting Dockview internals.
const button = document.querySelector("#run-docking-test");
const result = document.querySelector("#docking-test-result");
const evidence = [];
const titles = [
  "예약목록 (0)",
  "상호대차 대출 및 대출대기 목록 (0)",
  "대출목록 (0)",
  "이용자 검색목록",
  "처리목록",
];
function workspace() {
  return document.querySelector('section[aria-label="업무 패널"]');
}
function groups() {
  return [...workspace().querySelectorAll(".dv-groupview")];
}
function tab(text) {
  const found = [...workspace().querySelectorAll(".dv-tab")].find(
    (node) => node.textContent === text,
  );
  if (!found) throw new Error("Missing tab: " + text);
  return found;
}
function group(text) {
  return tab(text).closest(".dv-groupview");
}
function rect(text) {
  return group(text).getBoundingClientRect();
}
function content(text) {
  return group(text).querySelector(".dv-content-container");
}
function snapshot() {
  return groups().map((node) => ({
    tabs: [...node.querySelectorAll(".dv-tab")].map((item) => item.textContent),
    rect: node.getBoundingClientRect().toJSON(),
  }));
}
function check(name, condition) {
  if (!condition) throw new Error(name);
  evidence.push({ name, layout: snapshot() });
  result.textContent = JSON.stringify(evidence, null, 2);
}
function frame() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}
async function drag(source, target, x = 0.5, y = 0.5) {
  const dataTransfer = new DataTransfer();
  function emit(node, type, box, rx, ry) {
    node.dispatchEvent(
      new DragEvent(type, {
        bubbles: true,
        cancelable: true,
        dataTransfer,
        clientX: box.left + box.width * rx,
        clientY: box.top + box.height * ry,
      }),
    );
  }
  emit(source, "dragstart", source.getBoundingClientRect(), 0.5, 0.5);
  const box = target.getBoundingClientRect();
  emit(target, "dragenter", box, x, y);
  emit(target, "dragover", box, x, y);
  emit(target, "drop", box, x, y);
  emit(source, "dragend", box, x, y);
  await frame();
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
async function reset() {
  await openSettings();
  await clickButton("기본 배치로 초기화");
  await clickButton("완료");
}
function near(a, b) {
  return Math.abs(a - b) <= 2;
}
button.addEventListener("click", async () => {
  button.disabled = true;
  evidence.length = 0;
  try {
    [...document.querySelectorAll("a")]
      .find((node) => node.textContent.trim() === "대출·반납")
      ?.click();
    await frame();
    check(
      "default layout has two top groups and two bottom groups",
      groups().length === 4 &&
        near(rect(titles[0]).top, rect(titles[2]).top) &&
        near(rect(titles[3]).top, rect(titles[4]).top) &&
        rect(titles[0]).bottom <= rect(titles[3]).top + 2,
    );
    check(
      "first area retains three fixed sections",
      document.querySelector('section[aria-label="1행 기본 패널"] > div').children.length === 3,
    );
    for (const title of titles.slice(1)) await drag(tab(title), content(titles[0]));
    check(
      "merge every panel into a single group and remove empty areas",
      groups().length === 1 && near(rect(titles[0]).height, workspace().clientHeight),
    );
    await drag(tab(titles[2]), content(titles[0]), 0.5, 0.1);
    check("top split", groups().length === 2 && rect(titles[2]).bottom <= rect(titles[0]).top + 2);
    await drag(tab(titles[4]), content(titles[0]), 0.5, 0.9);
    check(
      "bottom split",
      groups().length === 3 && rect(titles[4]).top >= rect(titles[0]).bottom - 2,
    );
    await drag(tab(titles[3]), content(titles[0]), 0.1, 0.5);
    check(
      "left split beyond three groups",
      groups().length === 4 && rect(titles[3]).right <= rect(titles[0]).left + 2,
    );
    await drag(tab(titles[1]), content(titles[0]), 0.9, 0.5);
    check(
      "right split beyond four groups",
      groups().length === 5 && rect(titles[1]).left >= rect(titles[0]).right - 2,
    );
    await drag(tab(titles[2]), workspace().querySelector(".dv-dockview"), 0.999, 0.5);
    check(
      "right outer edge spans the full work area height",
      near(rect(titles[2]).height, workspace().clientHeight) &&
        near(rect(titles[2]).right, workspace().getBoundingClientRect().right - 1),
    );
    await drag(tab(titles[3]), tab(titles[4]), 0.2);
    check(
      "join a tab from another vertical level",
      group(titles[3]) === group(titles[4]) && groups().length === 4,
    );
    await drag(tab(titles[4]), tab(titles[3]), 0.2);
    check(
      "reorder joined tabs",
      group(titles[4]).querySelector(".dv-tab").textContent === titles[4],
    );
    await drag(group(titles[4]).querySelector(".dv-void-container"), content(titles[0]), 0.1, 0.5);
    check(
      "move the whole tab group",
      group(titles[4]) === group(titles[3]) && rect(titles[4]).right <= rect(titles[0]).left + 2,
    );
    const saved = JSON.stringify(snapshot());
    await openSettings();
    await clickButton("내부 배치 저장");
    await clickButton("기본 배치로 초기화");
    check(
      "reset restores original stacked layout",
      groups().length === 4 && near(rect(titles[0]).bottom, rect(titles[3]).top),
    );
    await clickButton("내부 배치 복원");
    await clickButton("완료");
    check("save and restore nested splits with panel sizes", JSON.stringify(snapshot()) === saved);
    const foreign = [...document.querySelectorAll(".dv-tab")].find(
      (node) => !workspace().contains(node) && node.textContent.includes("희망자료관리"),
    );
    await drag(foreign, content(titles[0]));
    check(
      "outer business tabs cannot enter the internal workspace",
      JSON.stringify(snapshot()) === saved,
    );
    await openSettings();
    for (const title of titles) {
      await select("추가할 화면", title.replace(" (0)", ""));
      await clickButton("선택 화면 숨기기");
    }
    check(
      "hiding every tab removes the whole empty dock area",
      workspace().hidden &&
        workspace().getBoundingClientRect().height === 0 &&
        groups().length === 0,
    );
    await select("추가할 화면", "대출목록");
    await clickButton("화면 추가 / 이동");
    check("settings can reopen an empty workspace", !workspace().hidden && groups().length === 1);
    for (const title of ["예약목록", "이용자 검색목록", "처리목록", "가족정보"]) {
      await select("추가할 화면", title);
      await clickButton("화면 추가 / 이동");
    }
    check("settings can add more than three independent panels", groups().length === 5);
    await select("업무 영역 높이", "길게");
    await clickButton("완료");
    check(
      "long workspace keeps a scrollable usable height",
      workspace().getBoundingClientRect().height >= 384,
    );
    await reset();
    check(
      "reset leaves fixed first area and default panels intact",
      groups().length === 4 &&
        document.querySelector('section[aria-label="1행 기본 패널"] > div').children.length === 3,
    );
    result.textContent = "PASS " + evidence.length + "\n" + JSON.stringify(evidence, null, 2);
  } catch (error) {
    result.textContent = "FAIL " + error.message + "\n" + JSON.stringify(evidence, null, 2);
  } finally {
    button.disabled = false;
  }
});
