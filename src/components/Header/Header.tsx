import type { ReactElement } from "react";
import { Button, TextField, IconButton, Tooltip } from "@/components/ui";
import { createClasses } from "@/styles/classes";
import css0 from "@/App.module.css";
import css1 from "@/components/Header/Header.module.css";

import Settings from "@mui/icons-material/Settings";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import type { LayoutVariant } from "@/theme/variants";

const cx = createClasses(css0, css1);

export function Header({ variant }: { variant: LayoutVariant }): ReactElement | null {
  return (
    <header
      className={cx(
        `app_header option_${variant.option.toLowerCase()} ${variant.isAlternateLayout ? "isAlternateLayout" : "active"}`,
      )}
    >
      <div className={cx("logo")} style={{ color: variant.accent }}>
        ALPAS
      </div>
      <div className={cx("header_tools")}>
        <div className={cx("header_search")}>
          <TextField
            type="text"
            size="small"
            variant="outlined"
            placeholder="검색어 입력"
            inputProps={{ "aria-label": "검색어 입력" }}
          />
          <Button className={cx("alpas-button")} type="button" variant="contained">
            검색
          </Button>
        </div>
        <span className={cx("help")}>문의 : 1599-5478</span>
        <span className={cx("avatar")} style={{ background: variant.surface }} aria-hidden="true" />
        <span className={cx("user")}>
          MA관리자님
          <br />
          <small>행복도서관</small>
        </span>
        <span className={cx("header_settings")}>
          <Tooltip title="환경설정">
            <IconButton size="small" aria-label="환경설정">
              <Settings />
            </IconButton>
          </Tooltip>
        </span>
        <span className={cx("header_logout")}>
          <Tooltip title="로그아웃">
            <IconButton size="small" color="error" aria-label="로그아웃">
              <PowerSettingsNew />
            </IconButton>
          </Tooltip>
        </span>
      </div>
    </header>
  );
}
