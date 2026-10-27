import styles from "./Autocomplete.module.css";
import { useTheme } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Autocomplete } from "@/components/ui/Autocomplete/Autocomplete";
import { TextField } from "@/components/ui/TextField/TextField";
const meta = {
  title: "ALPAS/UI/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story, context) => {
      const theme = useTheme();
      const option = theme.palette.primary.main.toLowerCase() === "#f97316" ? "b" : "a";
      return (
        <Story
          args={{
            ...context.args,
            className: "panel_autocomplete " + styles["panel_autocomplete"],
            slotProps: {
              paper: {
                className:
                  "panel_autocomplete_paper " +
                  styles["panel_autocomplete_paper"] +
                  " option-" +
                  option,
              },
            },
          }}
        />
      );
    },
  ],
  args: {
    options: ["종합자료실", "어린이자료실", "디지털자료실"],
    renderInput: (params) => (
      <TextField
        {...params}
        placeholder="자료실 검색 또는 선택"
        inputProps={{ ...params.inputProps, "aria-label": "자료실 검색 또는 선택" }}
      />
    ),
  },
} satisfies Meta<typeof Autocomplete>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const NoOptions: Story = { args: { options: [] } };

export const OptionA: Story = { globals: { variant: "0" } };
export const OptionB: Story = { globals: { variant: "1" } };
