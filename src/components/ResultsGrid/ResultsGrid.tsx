import type { CssVariables } from "@/styles/styleTypes";
import type { ReactElement } from "react";
import { createClasses } from "@/styles/classes";
import css0 from "@/components/ResultsGrid/ResultsGrid.module.css";
import css1 from "@/components/ui/Checkbox/Checkbox.module.css";

import React from "react";
import { DataGrid, type GridColumnVisibilityModel } from "@mui/x-data-grid";
import { koKR } from "@mui/x-data-grid/locales";
import type { LayoutVariant } from "@/theme/variants";
import {
  gridColumns,
  defaultGridColumnVisibilityModel,
  sampleLoanRows,
  emptyGridRows,
} from "@/components/ResultsGrid/gridData";
import { InfiniteGridFooterContext, ResultsFooter } from "@/components/ResultsGrid/ResultsFooter";
import type { GridSettingsDialogValue } from "@/components/GridSettingsDialog/GridSettingsDialog";
import { GridSettingsDialog } from "@/components/GridSettingsDialog/GridSettingsDialog";

const cx = createClasses(css0, css1);

export function ResultsGrid({ variant }: { variant: LayoutVariant }): ReactElement {
  return <ResultsGridContent key={variant.label} variant={variant} />;
}

function ResultsGridContent({ variant }: { variant: LayoutVariant }): ReactElement {
  const allRows = variant.isAlternateLayout ? emptyGridRows : sampleLoanRows;
  const totalCount = allRows.length;
  const [batchSize, setBatchSizeState] = React.useState(25);
  const [gridFontSize, setGridFontSize] = React.useState(14);
  const [rowHeight, setRowHeight] = React.useState(42);
  const [selectionScope, setSelectionScope] =
    React.useState<GridSettingsDialogValue["selectionScope"]>("현재 화면");
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>({
      ...defaultGridColumnVisibilityModel,
    });
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [loadedCount, setLoadedCount] = React.useState(() => Math.min(25, totalCount));
  const gridHostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const scroller = gridHostRef.current?.querySelector<HTMLElement>(
      ".MuiDataGrid-virtualScroller",
    );
    if (!scroller || loadedCount >= totalCount) return;

    const loadNextBatch = () => {
      const remaining = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
      if (remaining <= 84) {
        setLoadedCount((count) => Math.min(count + batchSize, totalCount));
      }
    };

    scroller.addEventListener("scroll", loadNextBatch, { passive: true });
    const frame = window.requestAnimationFrame(loadNextBatch);
    return () => {
      window.cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", loadNextBatch);
    };
  }, [batchSize, loadedCount, totalCount]);

  const setBatchSize = React.useCallback(
    (value: number) => {
      setBatchSizeState(value);
      setLoadedCount(Math.min(value, totalCount));
    },
    [totalCount],
  );

  const footerContext = React.useMemo(
    () => ({
      batchSize,
      loadedCount,
      totalCount,
      hasMore: loadedCount < totalCount,
      setBatchSize,
      openSettings: () => setIsSettingsOpen(true),
    }),
    [batchSize, loadedCount, setBatchSize, totalCount],
  );

  const dialogValue = React.useMemo(
    () => ({
      fontSize: gridFontSize,
      rowHeight,
      batchSize,
      selectionScope,
      columnVisibilityModel,
    }),
    [batchSize, columnVisibilityModel, gridFontSize, rowHeight, selectionScope],
  );

  const saveGridSettings = (nextValue: GridSettingsDialogValue) => {
    setGridFontSize(nextValue.fontSize);
    setRowHeight(nextValue.rowHeight);
    setBatchSize(nextValue.batchSize);
    setSelectionScope(nextValue.selectionScope);
    setColumnVisibilityModel({ ...nextValue.columnVisibilityModel });
    setIsSettingsOpen(false);
  };

  const customStyle: CssVariables = {
    "--alpas-grid-font-size": `${gridFontSize}px`,
  };

  return (
    <InfiniteGridFooterContext.Provider value={footerContext}>
      <div
        ref={gridHostRef}
        className={cx("grid_infinite_host")}
        data-infinite-scroll="true"
        data-batch-size={batchSize}
      >
        <DataGrid
          className={cx("alpas_grid")}
          aria-label="대출 자료 검색 결과"
          rows={allRows.slice(0, loadedCount)}
          columns={gridColumns}
          columnVisibilityModel={columnVisibilityModel}
          columnHeaderHeight={42}
          rowHeight={rowHeight}
          style={customStyle}
          checkboxSelection
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: -1 } },
          }}
          pageSizeOptions={[{ value: -1, label: "전체" }]}
          localeText={{
            ...koKR.components.MuiDataGrid.defaultProps.localeText,
            noRowsLabel: "결과가 없습니다",
          }}
          slots={{ footer: ResultsFooter }}
          slotProps={{
            baseCheckbox: {
              material: {
                icon: <span className={cx("grid_checkbox_icon")} />,
              },
            },
            rowCheckbox: {
              material: {
                icon: <span className={cx("grid_checkbox_icon")} />,
              },
            },
            noRowsOverlay: { className: cx("alpas_empty") },
          }}
        />
      </div>
      <GridSettingsDialog
        open={isSettingsOpen}
        value={dialogValue}
        onClose={() => setIsSettingsOpen(false)}
        onSave={saveGridSettings}
      />
    </InfiniteGridFooterContext.Provider>
  );
}
