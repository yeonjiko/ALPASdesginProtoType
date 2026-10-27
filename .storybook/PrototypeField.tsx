import css from "./PrototypeField.module.css";
import type { PropsWithChildren } from "react";
import { createClasses } from "../src/styles/classes";
import filterStyles from "../src/components/SearchFilters/SearchFilters.module.css";
import dateStyles from "../src/components/ui/DatePicker/DatePicker.module.css";
import selectStyles from "../src/components/ui/Select/Select.module.css";
const cx = createClasses(filterStyles, dateStyles, selectStyles);
export function PrototypeField({ kind, children }: PropsWithChildren<{ kind: string }>) {
  if (kind === "Label") return <>{children}</>;
  const check = kind === "Checkbox";
  return (
    <div
      className={[
        cx(check ? "alpas_selection_indicator_menu" : "loan_filters"),
        css.field_canvas,
      ].join(" ")}
    >
      {kind === "DatePicker" ? (
        <div className={[cx("panel_date_picker_shell"), css.date_picker_shell].join(" ")}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
