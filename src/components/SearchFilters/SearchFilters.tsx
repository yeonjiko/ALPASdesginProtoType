import type { ReactElement } from "react";
import {
  Autocomplete,
  Button,
  TextField,
  Select,
  Checkbox,
  IconButton,
  Tooltip,
  DatePicker,
} from "@/components/ui";
import { createClasses } from "@/styles/classes";
import css0 from "@/components/ui/Checkbox/Checkbox.module.css";
import css1 from "@/components/ui/Select/Select.module.css";
import css2 from "@/components/SearchFilters/SearchFilters.module.css";
import css3 from "@/components/ui/DatePicker/DatePicker.module.css";
import css4 from "@/components/ui/Autocomplete/Autocomplete.module.css";

import React from "react";
import { MenuItem } from "@mui/material";

import type { Dayjs } from "dayjs";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Search from "@mui/icons-material/Search";
import Refresh from "@mui/icons-material/Refresh";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import type { LayoutVariant } from "@/theme/variants";
import { selectMenuProps, selectionIndicatorMenuProps } from "@/components/Select/menuProps";
import { AlpasCalendarHeader } from "@/components/DatePicker/AlpasCalendarHeader";

import { DetailedSearchDialog } from "@/components/DetailedSearchDialog/DetailedSearchDialog";

const cx = createClasses(css0, css1, css2, css3, css4);

export const libraryRoomOptions = ["종합자료실", "어린이자료실", "디지털자료실"];

export const searchIndicatorOptions = ["서명", "저자", "자료실"];

export function SearchFilters({ variant }: { variant: LayoutVariant }): ReactElement | null {
  const [dateBasis, setDateBasis] = React.useState("대출일");
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [libraryRoom, setLibraryRoom] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchIndicators, setSearchIndicators] = React.useState<string[]>([]);
  const [isDetailSearchOpen, setIsDetailSearchOpen] = React.useState(false);
  return (
    <>
      <div className={cx("filters loan_filters")}>
        <Select
          className={cx("alpas_select")}
          size="small"
          value={dateBasis}
          onChange={(event) => setDateBasis(event.target.value)}
          IconComponent={ExpandMore}
          inputProps={{ "aria-label": "날짜 기준" }}
          MenuProps={selectMenuProps}
        >
          <MenuItem value="대출일">대출일</MenuItem>
          <MenuItem value="반납일">반납일</MenuItem>
        </Select>
        <div className={cx("panel_date_picker_shell start-date-picker")}>
          <DatePicker
            value={startDate}
            onChange={setStartDate}
            format="YYYY.MM.DD"
            slots={{
              openPickerIcon: CalendarMonthOutlined,
              calendarHeader: AlpasCalendarHeader,
            }}
            slotProps={{
              textField: {
                size: "small",
                slotProps: {
                  htmlInput: { "aria-label": "시작일" },
                },
              },
              popper: {
                className: cx(`alpas_date_picker_popper option_${variant.option.toLowerCase()}`),
                placement: "bottom-start",
              },
              desktopPaper: {
                className: cx("alpas_date_picker_paper"),
              },
            }}
          />
        </div>
        <span className={cx("date_separator")}>–</span>
        <div className={cx("panel_date_picker_shell end-date-picker")}>
          <DatePicker
            value={endDate}
            onChange={setEndDate}
            format="YYYY.MM.DD"
            slots={{
              openPickerIcon: CalendarMonthOutlined,
              calendarHeader: AlpasCalendarHeader,
            }}
            slotProps={{
              textField: {
                size: "small",
                slotProps: {
                  htmlInput: { "aria-label": "종료일" },
                },
              },
              popper: {
                className: cx(`alpas_date_picker_popper option_${variant.option.toLowerCase()}`),
                placement: "bottom-start",
              },
              desktopPaper: {
                className: cx("alpas_date_picker_paper"),
              },
            }}
          />
        </div>
        <Autocomplete
          className={cx("panel_autocomplete")}
          options={libraryRoomOptions}
          value={libraryRoom}
          onChange={(_, value) => setLibraryRoom(value)}
          popupIcon={<ExpandMore />}
          forcePopupIcon
          noOptionsText="검색 결과가 없습니다."
          slotProps={{
            paper: {
              className: cx(`panel_autocomplete_paper option_${variant.option.toLowerCase()}`),
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="자료실 검색 또는 선택"
              inputProps={{
                ...params.inputProps,
                "aria-label": "자료실 검색 또는 선택",
              }}
            />
          )}
        />
        <TextField
          className={cx("loan_search_textfield")}
          size="small"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="검색어 입력"
          inputProps={{ "aria-label": "검색어" }}
        />
        <Select
          className={cx("alpas_select search-selection-indicator-select")}
          size="small"
          multiple
          displayEmpty
          value={searchIndicators}
          onChange={(event) => {
            const value = event.target.value;
            setSearchIndicators(typeof value === "string" ? value.split(",") : value);
          }}
          renderValue={(selected) => {
            const values = selected;
            return values.length ? values.join(", ") : "태그 선택";
          }}
          IconComponent={ExpandMore}
          inputProps={{ "aria-label": "선택 지표" }}
          MenuProps={selectionIndicatorMenuProps}
        >
          {searchIndicatorOptions.map((option) => (
            <MenuItem className={cx("selection_indicator_option")} key={option} value={option}>
              <Checkbox
                size="small"
                checked={searchIndicators.includes(option)}
                icon={<span className={cx("grid_checkbox_icon")} />}
                disableRipple
                tabIndex={-1}
                sx={{
                  color: "#9ca3af",
                  "&.Mui-checked": {
                    color: variant.option === "A" ? "#2468eb" : "#f97316",
                  },
                }}
                inputProps={{ "aria-label": `${option} 선택` }}
              />
              <span>{option}</span>
            </MenuItem>
          ))}
        </Select>
        <Button className={cx("alpas-button")} type="button" variant="contained">
          <Search />
          검색
        </Button>
        <Button
          className={cx("alpas-button detail-search-button")}
          type="button"
          variant="outlined"
          onClick={() => setIsDetailSearchOpen(true)}
        >
          상세검색
        </Button>
        <Tooltip title="초기화">
          <IconButton
            size="small"
            aria-label="초기화"
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              setLibraryRoom(null);
              setSearchQuery("");
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </div>
      <DetailedSearchDialog
        open={isDetailSearchOpen}
        onClose={() => setIsDetailSearchOpen(false)}
        variant={variant}
      />
    </>
  );
}
