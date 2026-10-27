import type { ReactElement } from "react";
import { Button, Select, Checkbox, Dialog, IconButton } from "@/components/ui";
import { createClasses } from "@/styles/classes";
import css0 from "@/components/ActionButtonSettings/ActionButtonSettings.module.css";
import css1 from "@/components/GridSettingsDialog/GridSettingsDialog.module.css";
import css2 from "@/components/ui/Checkbox/Checkbox.module.css";

import React from "react";
import { MenuItem, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { type GridColumnVisibilityModel } from "@mui/x-data-grid";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Close from "@mui/icons-material/Close";
import { selectMenuProps } from "@/components/Select/menuProps";
import {
  configurableGridColumns,
  defaultGridColumnVisibilityModel,
} from "@/components/ResultsGrid/gridData";

const cx = createClasses(css0, css1, css2);

export type GridSettingsDialogValue = {
  fontSize: number;
  rowHeight: number;
  batchSize: number;
  selectionScope: "현재 화면" | "전체 데이터";
  columnVisibilityModel: GridColumnVisibilityModel;
};

export function GridSettingsDialog({
  open,
  value,
  onClose,
  onSave,
}: {
  open: boolean;
  value: GridSettingsDialogValue;
  onClose: () => void;
  onSave: (value: GridSettingsDialogValue) => void;
}): ReactElement | null {
  const [draft, setDraft] = React.useState(value);

  const [wasOpen, setWasOpen] = React.useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) setDraft({ ...value, columnVisibilityModel: { ...value.columnVisibilityModel } });
  }

  const updateDraft = <Key extends keyof GridSettingsDialogValue>(
    key: Key,
    nextValue: GridSettingsDialogValue[Key],
  ) => setDraft((current) => ({ ...current, [key]: nextValue }));

  const resetDraft = () =>
    setDraft({
      fontSize: 14,
      rowHeight: 42,
      batchSize: 25,
      selectionScope: "현재 화면",
      columnVisibilityModel: { ...defaultGridColumnVisibilityModel },
    });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={cx("grid_settings_dialog")}
      aria-labelledby="grid_settings_title"
      slotProps={{ paper: { className: cx("grid_settings_dialog_paper") } }}
    >
      <DialogTitle className={cx("grid_settings_title")}>
        <Typography id="grid_settings_title" component="h2">
          그리드 설정
        </Typography>
        <IconButton
          className={cx("grid_settings_close")}
          size="small"
          aria-label="그리드 설정 닫기"
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className={cx("grid_settings_content")}>
        <div className={cx("grid_settings_sections")}>
          <section
            className={cx("grid-settings-section")}
            aria-labelledby="grid-display-settings-title"
          >
            <Typography
              id="grid-display-settings-title"
              className={cx("grid_settings_section_title")}
              component="h3"
            >
              설정
            </Typography>
            <div className={cx("grid_settings_card grid_settings_values")}>
              <label>
                <span>글자크기</span>
                <Select
                  className={cx("grid_settings_select")}
                  size="small"
                  value={draft.fontSize}
                  onChange={(event) => updateDraft("fontSize", Number(event.target.value))}
                  IconComponent={ExpandMore}
                  inputProps={{ "aria-label": "그리드 글자크기" }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={14}>14</MenuItem>
                  <MenuItem value={16}>16</MenuItem>
                </Select>
              </label>
              <label>
                <span>행 높이</span>
                <Select
                  className={cx("grid_settings_select")}
                  size="small"
                  value={draft.rowHeight}
                  onChange={(event) => updateDraft("rowHeight", Number(event.target.value))}
                  IconComponent={ExpandMore}
                  inputProps={{ "aria-label": "그리드 행 높이" }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value={36}>좁게</MenuItem>
                  <MenuItem value={42}>보통</MenuItem>
                  <MenuItem value={48}>넓게</MenuItem>
                </Select>
              </label>
              <label>
                <span>한 번에</span>
                <Select
                  className={cx("grid_settings_select")}
                  size="small"
                  value={draft.batchSize}
                  onChange={(event) => updateDraft("batchSize", Number(event.target.value))}
                  IconComponent={ExpandMore}
                  inputProps={{ "aria-label": "한 번에 불러올 건수 설정" }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value={25}>25건</MenuItem>
                  <MenuItem value={50}>50건</MenuItem>
                  <MenuItem value={100}>100건</MenuItem>
                </Select>
              </label>
              <label>
                <span>선택 범위</span>
                <Select
                  className={cx("grid_settings_select")}
                  size="small"
                  value={draft.selectionScope}
                  onChange={(event) => updateDraft("selectionScope", event.target.value)}
                  IconComponent={ExpandMore}
                  inputProps={{ "aria-label": "그리드 선택 범위" }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="현재 화면">현재 화면</MenuItem>
                  <MenuItem value="전체 데이터">전체 데이터</MenuItem>
                </Select>
              </label>
            </div>
          </section>
          <section
            className={cx("grid-settings-section")}
            aria-labelledby="grid-column-settings-title"
          >
            <Typography
              id="grid-column-settings-title"
              className={cx("grid_settings_section_title")}
              component="h3"
            >
              컬럼설정
            </Typography>
            <div
              className={cx("grid_settings_card grid_settings_columns")}
              role="group"
              aria-label="표시할 컬럼"
            >
              {configurableGridColumns.map((column) => (
                <label key={column.field}>
                  <Checkbox
                    size="small"
                    checked={draft.columnVisibilityModel[column.field] !== false}
                    icon={<span className={cx("grid_checkbox_icon")} />}
                    onChange={(event) =>
                      updateDraft("columnVisibilityModel", {
                        ...draft.columnVisibilityModel,
                        [column.field]: event.target.checked,
                      })
                    }
                    inputProps={{
                      "aria-label": `${column.headerName} 컬럼 표시`,
                    }}
                  />
                  <span>{column.headerName}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
      <DialogActions className={cx("grid_settings_actions")}>
        <Button type="button" variant="outlined" onClick={resetDraft}>
          초기화
        </Button>
        <Button type="button" variant="contained" onClick={() => onSave(draft)}>
          현재 설정 저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
