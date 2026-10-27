import React from "react";
import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from "@mui/material";
import styles from "@/components/ui/TextField/TextField.module.css";
import { joinClasses } from "@/styles/classes";

export type TextFieldProps = MuiTextFieldProps;
export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(function TextField(
  { className, ...props },
  ref,
) {
  return (
    <MuiTextField
      size="small"
      variant="outlined"
      {...props}
      ref={ref}
      className={joinClasses(styles.root, className)}
    />
  );
});
