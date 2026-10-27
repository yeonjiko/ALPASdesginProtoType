import type { ReactElement } from "react";
import { Select, IconButton, Tooltip } from "@/components/ui";
import { createClasses } from "@/styles/classes";
import css0 from "@/components/ResultsGrid/ResultsGrid.module.css";
import css1 from "@/components/GridSettingsDialog/GridSettingsDialog.module.css";

import React from "react";
import { MenuItem, Typography } from "@mui/material";
import {
  GridFooterContainer,
  gridRowSelectionCountSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Settings from "@mui/icons-material/Settings";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { selectMenuProps } from "@/components/Select/menuProps";

const cx = createClasses(css0, css1);

export type InfiniteGridFooterContextValue = {
  batchSize: number;
  loadedCount: number;
  totalCount: number;
  hasMore: boolean;
  setBatchSize: (value: number) => void;
  openSettings: () => void;
};

export const InfiniteGridFooterContext = React.createContext<
  InfiniteGridFooterContextValue | undefined
>(undefined);

export function ResultsFooter(): ReactElement | null {
  const apiRef = useGridApiContext();
  const selected = useGridSelector(apiRef, gridRowSelectionCountSelector);
  const infiniteGrid = React.useContext(InfiniteGridFooterContext);
  if (!infiniteGrid) return null;
  const { batchSize, loadedCount, totalCount, hasMore, setBatchSize, openSettings } = infiniteGrid;
  return (
    <GridFooterContainer className={cx("grid_foot")}>
      <Typography component="span" variant="inherit">
        총 {totalCount}건 / 선택 항목 {selected}건
      </Typography>
      <div
        className={cx("per_page_control")}
        data-loaded-count={loadedCount}
        data-has-more={hasMore}
      >
        <Typography component="span" variant="inherit">
          한 번에
        </Typography>
        <Select
          className={cx("per_page_select")}
          size="small"
          value={batchSize}
          onChange={(event) => setBatchSize(Number(event.target.value))}
          IconComponent={ExpandMore}
          inputProps={{ "aria-label": "한 번에 불러올 건수" }}
          MenuProps={selectMenuProps}
        >
          <MenuItem value={25}>25건</MenuItem>
          <MenuItem value={50}>50건</MenuItem>
          <MenuItem value={100}>100건</MenuItem>
        </Select>
      </div>
      <Tooltip title="그리드 설정">
        <IconButton
          className={cx("grid_settings")}
          size="small"
          aria-label="그리드 설정"
          onClick={openSettings}
        >
          <Settings />
        </IconButton>
      </Tooltip>
    </GridFooterContainer>
  );
}
