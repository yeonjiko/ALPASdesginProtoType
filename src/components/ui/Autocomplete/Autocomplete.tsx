import type { ReactElement } from "react";
import { Autocomplete as MuiAutocomplete, type AutocompleteProps } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import styles from "@/components/ui/Autocomplete/Autocomplete.module.css";
import { joinClasses } from "@/styles/classes";
export type { AutocompleteProps };
export function Autocomplete<
  Value,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>({
  className,
  ...props
}: AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>): ReactElement | null {
  return (
    <MuiAutocomplete
      popupIcon={<ExpandMore />}
      noOptionsText="검색 결과가 없습니다."
      {...props}
      className={joinClasses(styles.root, className)}
    />
  );
}
