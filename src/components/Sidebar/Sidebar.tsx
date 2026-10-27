import type { CssVariables } from "@/styles/styleTypes";
import type { ReactElement } from "react";
import { Select, IconButton } from "@/components/ui";
import { createClasses } from "@/styles/classes";
import css0 from "@/components/Sidebar/Sidebar.module.css";
import css1 from "@/components/ui/Select/Select.module.css";

import React from "react";
import { MenuItem } from "@mui/material";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ExpandMore from "@mui/icons-material/ExpandMore";
import type { LayoutVariant, SidebarMode } from "@/theme/variants";
import {
  menu,
  sidebarItemHref,
  selectedSidebarItemFromHash,
} from "@/components/Sidebar/navigation";
import { favoriteMenuProps } from "@/components/Select/menuProps";

const cx = createClasses(css0, css1);

export function Sidebar({
  variant,
  mode,
  onModeChange,
}: {
  variant: LayoutVariant;
  mode: SidebarMode;
  onModeChange: (mode: SidebarMode) => void;
}): ReactElement | null {
  const [activeItem, setActiveItem] = React.useState(
    () => selectedSidebarItemFromHash() ?? "희망자료관리",
  );

  React.useEffect(() => {
    const syncSelection = () => {
      setActiveItem(selectedSidebarItemFromHash() ?? "희망자료관리");
    };
    window.addEventListener("hashchange", syncSelection);
    return () => window.removeEventListener("hashchange", syncSelection);
  }, []);

  const customStyle: CssVariables = {
    background: variant.dark,
    "--sidebar-accent": variant.accent,
    "--sidebar-active-hover": variant.option === "A" ? "#1D56BC" : "#EA580C",
  };

  return (
    <aside className={cx("sidebar")} data-option={variant.option} style={customStyle}>
      <div className={cx("sidebar_top")}>
        <Select
          className={cx("alpas_select")}
          size="small"
          value="즐겨찾기"
          IconComponent={ExpandMore}
          inputProps={{ "aria-label": "즐겨찾기" }}
          MenuProps={favoriteMenuProps}
        >
          <MenuItem value="즐겨찾기">즐겨찾기</MenuItem>
        </Select>
        <div className={cx("sidebar_arrows")}>
          {mode !== "collapsed" && (
            <IconButton
              type="button"
              aria-label={mode === "expanded" ? "사이드바 기본 너비로 복원" : "사이드바 접기"}
              aria-pressed={mode === "expanded"}
              onClick={() => onModeChange(mode === "expanded" ? "normal" : "collapsed")}
            >
              <ChevronLeft aria-hidden="true" />
            </IconButton>
          )}
          {mode !== "expanded" && (
            <IconButton
              type="button"
              aria-label={
                mode === "collapsed" ? "사이드바 기본 너비로 복원" : "사이드바 전체 화면으로 펼치기"
              }
              aria-pressed={mode === "collapsed"}
              onClick={() => onModeChange(mode === "collapsed" ? "normal" : "expanded")}
            >
              <ChevronRight aria-hidden="true" />
            </IconButton>
          )}
        </div>
      </div>
      <nav className={cx("quick_nav")} aria-label="자료 유형 메뉴">
        <ul>
          <li>
            <a href="#home" aria-label="홈">
              <HomeOutlined aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href="#monographs">단행자료</a>
          </li>
          <li>
            <a href="#serials">연속자료</a>
          </li>
          <li>
            <a href="#shared-resources">공통자료</a>
          </li>
        </ul>
      </nav>
      <div className={cx("sidebar_menu")}>
        {menu.map(([heading, ...items]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <nav aria-label={`${heading} 메뉴`}>
              <ul>
                {items.map((item) => (
                  <li key={item} className={cx(activeItem === item ? "active_menu" : "")}>
                    <a
                      href={sidebarItemHref(item)}
                      aria-current={activeItem === item ? "location" : undefined}
                      onClick={() => setActiveItem(item)}
                    >
                      {item}
                      {activeItem === item && <ChevronRight aria-hidden="true" />}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        ))}
      </div>
    </aside>
  );
}
