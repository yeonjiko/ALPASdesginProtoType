import type { ReactElement } from "react";
import { Tooltip as MuiTooltip, type TooltipProps } from "@mui/material";
import styles from "@/components/ui/Tooltip/Tooltip.module.css";
import { joinClasses } from "@/styles/classes";
export type { TooltipProps };
export function Tooltip({ classes, ...props }: TooltipProps): ReactElement | null {
  return (
    <MuiTooltip
      {...props}
      classes={{
        ...classes,
        tooltip: joinClasses(styles.content, classes?.tooltip),
      }}
    />
  );
}
