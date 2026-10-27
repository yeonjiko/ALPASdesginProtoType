import type { ReactElement } from "react";
import React from "react";
import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ko";
import { createAlpasTheme } from "@/theme/createAlpasTheme";
import { variants, type LayoutVariant } from "@/theme/variants";
export function AlpasProvider({
  variant = variants[0],
  children,
}: React.PropsWithChildren<{ variant?: LayoutVariant }>): ReactElement | null {
  const theme = React.useMemo(() => createAlpasTheme(variant), [variant]);
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
