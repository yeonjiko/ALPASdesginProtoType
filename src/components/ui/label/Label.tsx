import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { joinClasses } from "@/styles/classes";
import css from "@/components/ui/label/Label.module.css";

export type LabelProps = ComponentPropsWithRef<"label"> & {
  htmlFor: string;
  children: ReactNode;
  size?: "small" | "medium" | "large";
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
};

export function Label({
  htmlFor,
  children,
  size = "medium",
  required = false,
  disabled = false,
  error = false,
  className,
  ...props
}: LabelProps): ReactElement {
  return (
    <label
      {...props}
      htmlFor={htmlFor}
      className={joinClasses(
        css.root,
        css[size],
        error && css.error,
        disabled && css.disabled,
        className,
      )}
    >
      {children}
      {required && (
        <>
          <span className={css.required_mark} aria-hidden="true">
            *
          </span>
          <span className={css.sr_only}>(필수)</span>
        </>
      )}
    </label>
  );
}
