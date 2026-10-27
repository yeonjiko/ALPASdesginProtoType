import { createClasses } from "@/styles/classes";
import css0 from "@/App.module.css";
import css1 from "@/components/ui/Select/Select.module.css";

const cx = createClasses(css0, css1);

export // MUI Popover keeps the configured bottom origin and only shifts the menu
// inside the viewport. Flip the menu when the space below the select is not
// enough, so the menu never covers its trigger near the bottom edge.
function positionSelectMenuForViewport(element: HTMLElement): void {
  const activeElement = document.activeElement;
  const activeSelect =
    activeElement instanceof HTMLElement && activeElement.getAttribute("aria-expanded") === "true"
      ? activeElement
      : null;
  const anchor =
    activeSelect ?? document.querySelector<HTMLElement>('[role="combobox"][aria-expanded="true"]');

  if (!anchor) return;

  const anchorRect = anchor.getBoundingClientRect();
  const menuHeight = element.offsetHeight;
  const viewportMargin = 16;
  const menuGap = 4;
  const menuCssMargin = 4;
  const spaceBelow = window.innerHeight - anchorRect.bottom - viewportMargin;
  const spaceAbove = anchorRect.top - viewportMargin;
  const shouldOpenAbove = menuHeight > spaceBelow && spaceAbove > spaceBelow;

  if (!shouldOpenAbove) return;

  const availableHeight = Math.max(0, Math.min(menuHeight, spaceAbove));
  element.style.maxHeight = `${availableHeight}px`;
  element.style.top = `${Math.round(anchorRect.top - availableHeight - menuGap - menuCssMargin)}px`;
  element.style.transformOrigin = "left bottom";
}

export const viewportAwareMenuTransitionProps = {
  onEntering: (element: HTMLElement): void => {
    // MUI applies its default Popover position after onEntering. Queue the
    // flip so it runs immediately after that calculation and before the next
    // visible interaction frame.
    queueMicrotask(() => positionSelectMenuForViewport(element));
  },
};

export // 02Components Select examples: popup below the field, 4px gap when space allows.
const selectMenuProps = {
  anchorOrigin: { vertical: "bottom" as const, horizontal: "left" as const },
  transformOrigin: { vertical: "top" as const, horizontal: "left" as const },
  TransitionProps: viewportAwareMenuTransitionProps,
  slotProps: { paper: { className: cx("alpas-select-menu") } },
};

export const favoriteMenuProps = {
  ...selectMenuProps,
  slotProps: {
    paper: { className: cx("alpas-select-menu alpas_favorite_menu") },
  },
};

export const selectionIndicatorMenuProps = {
  ...selectMenuProps,
  slotProps: {
    paper: {
      className: cx("alpas-select-menu alpas_selection_indicator_menu"),
    },
  },
};
