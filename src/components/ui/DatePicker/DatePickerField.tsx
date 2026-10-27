import { forwardRef, useId } from "react";
import type { ReactElement } from "react";
import { PickersTextField } from "@mui/x-date-pickers/PickersTextField";
import type { PickersTextFieldProps } from "@mui/x-date-pickers/PickersTextField";
import { Label } from "@/components/ui/label/Label";
import { joinClasses } from "@/styles/classes";
import css from "@/components/ui/label/Field.module.css";

export const DatePickerField = forwardRef<HTMLDivElement, PickersTextFieldProps>(
  function DatePickerField({ id, label, slotProps, ...props }, ref): ReactElement {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const hasLabel = label != null && label !== "" && label !== false;
    const labelId = `${fieldId}-label`;
    const control = (
      <PickersTextField
        {...props}
        ref={ref}
        id={fieldId}
        slotProps={{
          ...slotProps,
          input: {
            ...slotProps?.input,
            ...(hasLabel ? { "aria-labelledby": labelId } : {}),
          },
        }}
      />
    );
    if (!hasLabel) return control;
    return (
      <div className={joinClasses(css.field, props.fullWidth && css.full_width)}>
        <Label
          id={labelId}
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
  },
);
