import React from "react";
import { Dialog as MuiDialog, type DialogProps as MuiDialogProps } from "@mui/material";
import styles from "@/components/ui/Dialog/Dialog.module.css";
import { joinClasses } from "@/styles/classes";

export type DialogProps = MuiDialogProps;
export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { className, ...props },
  ref,
) {
  return <MuiDialog {...props} ref={ref} className={joinClasses(styles.root, className)} />;
});
