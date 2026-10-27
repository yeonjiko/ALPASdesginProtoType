import React from "react";
import {
  IconButton as MuiIconButton,
  type IconButtonProps as MuiIconButtonProps,
} from "@mui/material";
import styles from "@/components/ui/IconButton/IconButton.module.css";
import { joinClasses } from "@/styles/classes";

export type IconButtonProps = MuiIconButtonProps;
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, ...props },
  ref,
) {
  return (
    <MuiIconButton
      size="small"
      {...props}
      ref={ref}
      className={joinClasses(styles.root, className)}
    />
  );
});
