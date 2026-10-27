import React from "react";
import { Checkbox as MuiCheckbox, type CheckboxProps } from "@mui/material";
import styles from "@/components/ui/Checkbox/Checkbox.module.css";
import { joinClasses } from "@/styles/classes";
export type { CheckboxProps };
export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { className, icon, ...props },
  ref,
) {
  return (
    <MuiCheckbox
      size="small"
      disableRipple
      {...props}
      ref={ref}
      icon={
        icon ?? <span className={joinClasses("grid_checkbox_icon", styles["grid_checkbox_icon"])} />
      }
      className={joinClasses(styles.root, className)}
    />
  );
});
