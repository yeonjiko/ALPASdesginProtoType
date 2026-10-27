import type { ReactElement } from "react";
import { Select as MuiSelect, type SelectProps } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { selectMenuProps } from "@/components/Select/menuProps";
import styles from "@/components/ui/Select/Select.module.css";
import { joinClasses } from "@/styles/classes";
export type { SelectProps };
export function Select<Value = unknown>({
  className,
  ...props
}: SelectProps<Value>): ReactElement | null {
  return (
    <MuiSelect<Value>
      size="small"
      IconComponent={ExpandMore}
      MenuProps={selectMenuProps}
      {...props}
      className={joinClasses("alpas_select", styles["alpas_select"], styles.root, className)}
    />
  );
}
