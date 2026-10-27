import { useId, useRef, useState } from "react";
import type { ReactElement } from "react";
import { MenuItem } from "@mui/material";
import type { Dayjs } from "dayjs";
import { Button, DatePicker, Select, TextField } from "@/components/ui";
import css from "@/pages/loanReturn/LoanReturnPage.module.css";

type LoanEntryProps = {
  onScan: (number: string) => boolean;
  onChange: () => void;
  onSettings: () => void;
  onRfid: () => void;
  loanDate: Dayjs | null;
  returnDate: Dayjs | null;
  onLoanDateChange: (value: Dayjs | null) => void;
  onReturnDateChange: (value: Dayjs | null) => void;
};

export function LoanEntry({
  onScan,
  onChange,
  onSettings,
  onRfid,
  loanDate,
  returnDate,
  onLoanDateChange,
  onReturnDateChange,
}: LoanEntryProps): ReactElement {
  const id = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [number, setNumber] = useState("");
  const [library, setLibrary] = useState("310001");
  const [loanType, setLoanType] = useState("normal");
  const [returnType, setReturnType] = useState("normal");
  const focusRfid = () => {
    inputRef.current?.focus();
    onRfid();
  };
  return (
    <section className={`${css.fixed_card} ${css.entry_card}`} aria-label="기본 번호 입력">
      <form
        className={css.entry_form}
        onSubmit={(event) => {
          event.preventDefault();
          if (onScan(number)) setNumber("");
        }}
        onKeyDown={(event) => {
          if (event.key === "F9") {
            event.preventDefault();
            focusRfid();
          }
        }}
      >
        <button type="submit" className={css.sr_only} tabIndex={-1}>
          번호 처리
        </button>
        <label htmlFor={`${id}-number`}>번호</label>
        <TextField
          id={`${id}-number`}
          inputRef={inputRef}
          size="small"
          value={number}
          onChange={(event) => {
            setNumber(event.target.value);
            onChange();
          }}
          slotProps={{ htmlInput: { "aria-label": "번호", autoComplete: "off" } }}
        />
        <Button className={css.rfid_button} variant="contained" onClick={focusRfid}>
          RFID(F9)
        </Button>
        <label id={`${id}-library-label`} htmlFor={`${id}-library`}>
          도서관
        </label>
        <Select
          id={`${id}-library`}
          labelId={`${id}-library-label`}
          size="small"
          value={library}
          inputProps={{ "aria-label": "도서관" }}
          onChange={(event) => {
            setLibrary(event.target.value);
            onChange();
          }}
        >
          <MenuItem value="310001">310001 | 행복도서관</MenuItem>
        </Select>
        <label id={`${id}-loan-label`} htmlFor={`${id}-loan`}>
          대출형태
        </label>
        <Select
          id={`${id}-loan`}
          labelId={`${id}-loan-label`}
          size="small"
          value={loanType}
          inputProps={{ "aria-label": "대출형태" }}
          onChange={(event) => {
            setLoanType(event.target.value);
            onChange();
          }}
        >
          <MenuItem value="normal">일반</MenuItem>
        </Select>
        <DatePicker
          className={css.entry_date}
          value={loanDate}
          onChange={onLoanDateChange}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              slotProps: { input: { "aria-label": "대출일" } },
            },
            openPickerButton: { "aria-label": "대출일 선택", title: "대출일 선택" },
          }}
        />
        <label id={`${id}-return-label`} htmlFor={`${id}-return`}>
          반납형태
        </label>
        <Select
          id={`${id}-return`}
          labelId={`${id}-return-label`}
          size="small"
          value={returnType}
          inputProps={{ "aria-label": "반납형태" }}
          onChange={(event) => {
            setReturnType(event.target.value);
            onChange();
          }}
        >
          <MenuItem value="normal">일반</MenuItem>
        </Select>
        <DatePicker
          className={css.entry_date}
          value={returnDate}
          onChange={onReturnDateChange}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              slotProps: { input: { "aria-label": "반납일" } },
            },
            openPickerButton: { "aria-label": "반납일 선택", title: "반납일 선택" },
          }}
        />
        <Button className={css.settings_button} variant="outlined" onClick={onSettings}>
          설정
        </Button>
      </form>
    </section>
  );
}
