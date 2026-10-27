import React, { useId } from "react";
import type { ReactElement } from "react";
import { Label } from "@/components/ui/label/Label";
import fieldCss from "@/components/ui/label/Field.module.css";
import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from "@mui/material";
import styles from "@/components/ui/TextField/TextField.module.css";
import { joinClasses } from "@/styles/classes";

export type TextFieldProps = MuiTextFieldProps;
export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(function TextField(
  { className, id, label, ...props },
  ref,
): ReactElement {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const control = (
    <MuiTextField
      size="small"
      variant="outlined"
      {...props}
      ref={ref}
      id={fieldId}
      className={joinClasses(styles.root, className)}
    />
  );
  if (label == null || label === "" || label === false) return control;
  return (
    <div className={joinClasses(fieldCss.field, props.fullWidth && fieldCss.full_width)}>
      <Label
        htmlFor={fieldId}
        required={props.required}
        disabled={props.disabled}
        error={props.error}
      >
        {label}
      </Label>
      {control}
    </div>
  );
});
