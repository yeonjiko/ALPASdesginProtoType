import type { ReactElement } from "react";
import {
  DesktopDatePicker,
  type DesktopDatePickerProps,
} from "@mui/x-date-pickers/DesktopDatePicker";
import { useTheme } from "@mui/material";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import { AlpasCalendarHeader } from "@/components/DatePicker/AlpasCalendarHeader";
import styles from "@/components/ui/DatePicker/DatePicker.module.css";
import { joinClasses } from "@/styles/classes";
export type DatePickerProps = DesktopDatePickerProps;
export function DatePicker({
  className,
  slots,
  slotProps,
  ...props
}: DatePickerProps): ReactElement | null {
  const theme = useTheme();
  const option = theme.palette.primary.main.toLowerCase() === "#f97316" ? "b" : "a";
  return (
    <DesktopDatePicker
      format="YYYY.MM.DD"
      {...props}
      slots={{
        openPickerIcon: CalendarMonthOutlined,
        calendarHeader: AlpasCalendarHeader,
        ...slots,
      }}
      slotProps={{
        textField: { size: "small" },
        popper: {
          className: joinClasses(
            "alpas_date_picker_popper",
            styles["alpas_date_picker_popper"],
            "option_" + option,
          ),
          placement: "bottom-start",
        },
        desktopPaper: {
          className: joinClasses("alpas_date_picker_paper", styles["alpas_date_picker_paper"]),
        },
        ...slotProps,
      }}
      className={joinClasses(styles.root, className)}
    />
  );
}
