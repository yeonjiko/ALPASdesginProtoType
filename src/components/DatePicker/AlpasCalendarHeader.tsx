import type { ReactElement } from "react";
import {
  PickersCalendarHeader,
  type PickersCalendarHeaderProps,
} from "@mui/x-date-pickers/PickersCalendarHeader";

export function AlpasCalendarHeader(props: PickersCalendarHeaderProps): ReactElement | null {
  const headerProps: PickersCalendarHeaderProps = {
    ...props,
    format: "YYYY년 M월",
  };

  return <PickersCalendarHeader {...headerProps} />;
}
