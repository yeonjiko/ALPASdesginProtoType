import type { ReactElement } from "react";
import {
  Button,
  TextField,
  Select,
  Checkbox,
  Dialog,
  IconButton,
  DatePicker,
} from "@/components/ui";
import { createClasses } from "@/styles/classes";
import css0 from "@/App.module.css";
import css1 from "@/components/ActionButtonSettings/ActionButtonSettings.module.css";
import css2 from "@/components/DetailedSearchDialog/DetailedSearchDialog.module.css";
import css3 from "@/components/ui/Checkbox/Checkbox.module.css";
import css4 from "@/components/ui/DatePicker/DatePicker.module.css";
import css5 from "@/components/SearchFilters/SearchFilters.module.css";

import React from "react";
import { MenuItem, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

import type { Dayjs } from "dayjs";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Close from "@mui/icons-material/Close";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import type { LayoutVariant } from "@/theme/variants";
import { selectMenuProps } from "@/components/Select/menuProps";
import { AlpasCalendarHeader } from "@/components/DatePicker/AlpasCalendarHeader";

const cx = createClasses(css0, css1, css2, css3, css4, css5);

export type DetailedSearchForm = {
  management: string;
  status: string;
  applicant: string;
  memberNo: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  title: string;
  author: string;
  publisher: string;
  pubYear: string;
  isbn: string;
  recommendation: string;
  shouldKeepManagement: boolean;
  shouldKeepStatus: boolean;
  shouldKeepDate: boolean;
};

export const emptyDetailedSearchForm = (): DetailedSearchForm => ({
  management: "행복도서관",
  status: "신청중",
  applicant: "",
  memberNo: "",
  startDate: null,
  endDate: null,
  title: "",
  author: "",
  publisher: "",
  pubYear: "",
  isbn: "",
  recommendation: "",
  shouldKeepManagement: false,
  shouldKeepStatus: false,
  shouldKeepDate: false,
});

export function DetailedSearchDialog({
  open,
  onClose,
  variant,
}: {
  open: boolean;
  onClose: () => void;
  variant: LayoutVariant;
}): ReactElement | null {
  const [draft, setDraft] = React.useState<DetailedSearchForm>(emptyDetailedSearchForm);

  const [wasOpen, setWasOpen] = React.useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) setDraft(emptyDetailedSearchForm());
  }

  const updateDraft = <Key extends keyof DetailedSearchForm>(
    key: Key,
    value: DetailedSearchForm[Key],
  ) => setDraft((current) => ({ ...current, [key]: value }));

  const resetDraft = () => setDraft(emptyDetailedSearchForm());

  const renderTextField = (
    key: Exclude<
      keyof DetailedSearchForm,
      | "management"
      | "status"
      | "startDate"
      | "endDate"
      | "shouldKeepManagement"
      | "shouldKeepStatus"
      | "shouldKeepDate"
    >,
    label: string,
  ) => (
    <TextField
      className={cx("detailed_search_input")}
      size="small"
      value={draft[key]}
      onChange={(event) => updateDraft(key, event.target.value)}
      inputProps={{ "aria-label": label }}
    />
  );

  const renderKeepCheckbox = (
    key: "shouldKeepManagement" | "shouldKeepStatus" | "shouldKeepDate",
    label: string,
  ) => (
    <label className={cx("detailed_search_keep")}>
      <Checkbox
        size="small"
        checked={draft[key]}
        onChange={(event) => updateDraft(key, event.target.checked)}
        icon={<span className={cx("grid_checkbox_icon")} />}
        inputProps={{
          "aria-label": `${label} ${key === "shouldKeepDate" ? "신청일자" : "조건"} 유지`,
        }}
      />
      <span>{label}</span>
    </label>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={cx(`detailed_search_dialog option_${variant.option.toLowerCase()}`)}
      aria-labelledby="detailed_search_title"
      slotProps={{ paper: { className: cx("detailed_search_dialog_paper") } }}
    >
      <DialogTitle className={cx("detailed_search_title")}>
        <Typography id="detailed_search_title" component="h2">
          비치희망자료 상세검색
        </Typography>
        <IconButton
          className={cx("detailed_search_close")}
          size="small"
          aria-label="상세검색 닫기"
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className={cx("detailed_search_content")}>
        <div className={cx("detailed_search_form")}>
          <div className={cx("detailed_search_row")}>
            <span className={cx("detailed_search_label")}>관리구분</span>
            <div className={cx("detailed_search_control_group")}>
              <Select
                className={cx("detailed_search_select")}
                size="small"
                value={draft.management}
                onChange={(event) => updateDraft("management", event.target.value)}
                IconComponent={ExpandMore}
                inputProps={{ "aria-label": "관리구분" }}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="행복도서관">행복도서관</MenuItem>
                <MenuItem value="중앙도서관">중앙도서관</MenuItem>
              </Select>
              <Button className={cx("alpas-button")} type="button" variant="outlined">
                전관 선택
              </Button>
            </div>
            {renderKeepCheckbox("shouldKeepManagement", "유지")}
          </div>
          <div className={cx("detailed_search_row")}>
            <span className={cx("detailed_search_label")}>비치상태</span>
            <div className={cx("detailed_search_control_group")}>
              <Select
                className={cx("detailed_search_select detailed-search-select-wide")}
                size="small"
                value={draft.status}
                onChange={(event) => updateDraft("status", event.target.value)}
                IconComponent={ExpandMore}
                inputProps={{ "aria-label": "비치상태" }}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="신청중">신청중</MenuItem>
                <MenuItem value="처리중">처리중</MenuItem>
                <MenuItem value="처리완료">처리완료</MenuItem>
              </Select>
            </div>
            {renderKeepCheckbox("shouldKeepStatus", "유지")}
          </div>
          <div className={cx("detailed_search_row")}>
            <span className={cx("detailed_search_label")}>신청자명</span>
            {renderTextField("applicant", "신청자명")}
          </div>
          <div className={cx("detailed_search_row")}>
            <span className={cx("detailed_search_label")}>대출자번호</span>
            {renderTextField("memberNo", "대출자번호")}
          </div>
          <div className={cx("detailed_search_row")}>
            <span className={cx("detailed_search_label")}>신청일자</span>
            <div className={cx("detailed_search_date_range")}>
              <DatePicker
                value={draft.startDate}
                onChange={(value) => updateDraft("startDate", value)}
                format="YYYY.MM.DD"
                slots={{
                  openPickerIcon: CalendarMonthOutlined,
                  calendarHeader: AlpasCalendarHeader,
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    className: cx("detailed_search_date_input"),
                    slotProps: {
                      htmlInput: { "aria-label": "신청일자 시작일" },
                    },
                  },
                  popper: {
                    className: cx(
                      `alpas_date_picker_popper option_${variant.option.toLowerCase()}`,
                    ),
                    placement: "bottom-start",
                  },
                  desktopPaper: { className: cx("alpas_date_picker_paper") },
                }}
              />
              <span className={cx("detailed_search_date_separator")}>~</span>
              <DatePicker
                value={draft.endDate}
                onChange={(value) => updateDraft("endDate", value)}
                format="YYYY.MM.DD"
                slots={{
                  openPickerIcon: CalendarMonthOutlined,
                  calendarHeader: AlpasCalendarHeader,
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    className: cx("detailed_search_date_input"),
                    slotProps: {
                      htmlInput: { "aria-label": "신청일자 종료일" },
                    },
                  },
                  popper: {
                    className: cx(
                      `alpas_date_picker_popper option_${variant.option.toLowerCase()}`,
                    ),
                    placement: "bottom-start",
                  },
                  desktopPaper: { className: cx("alpas_date_picker_paper") },
                }}
              />
            </div>
            {renderKeepCheckbox("shouldKeepDate", "유지")}
          </div>
          <div className={cx("detailed_search_row")}>
            <span className={cx("detailed_search_label")}>서명</span>
            {renderTextField("title", "서명")}
          </div>
          <div className={cx("detailed_search_row")}>
            <span className={cx("detailed_search_label")}>저자</span>
            {renderTextField("author", "저자")}
          </div>
          <div className={cx("detailed_search_row")}>
            <span className={cx("detailed_search_label")}>발행자</span>
            {renderTextField("publisher", "발행자")}
          </div>
          <div className={cx("detailed_search_row")}>
            <span className={cx("detailed_search_label")}>발행년</span>
            {renderTextField("pubYear", "발행년")}
          </div>
          <div className={cx("detailed_search_row")}>
            <span className={cx("detailed_search_label")}>ISBN</span>
            {renderTextField("isbn", "ISBN")}
          </div>
          <div className={cx("detailed_search_row")}>
            <span className={cx("detailed_search_label")}>추천의견</span>
            {renderTextField("recommendation", "추천의견")}
          </div>
        </div>
      </DialogContent>
      <DialogActions className={cx("detailed_search_actions")}>
        <Button
          className={cx("alpas-button")}
          type="button"
          variant="outlined"
          onClick={resetDraft}
        >
          화면지우기
        </Button>
        <span className={cx("detailed_search_actions_spacer")} />
        <Button className={cx("alpas-button")} type="button" variant="contained" onClick={onClose}>
          검색
        </Button>
        <Button className={cx("alpas-button")} type="button" variant="outlined" onClick={onClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
