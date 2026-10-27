import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select } from "@/components/ui/Select/Select";
import { MenuItem } from "@mui/material";
const meta = {
  title: "ALPAS/UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    value: "대출일",
    inputProps: { "aria-label": "날짜 기준" },
    children: [
      <MenuItem key="loan" value="대출일">
        대출일
      </MenuItem>,
      <MenuItem key="return" value="반납일">
        반납일
      </MenuItem>,
    ],
  },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState(args.value);
    return <Select {...args} value={value} onChange={(event) => setValue(event.target.value)} />;
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Error: Story = { args: { error: true } };

export const OptionA: Story = { globals: { variant: "0" } };
export const OptionB: Story = { globals: { variant: "1" } };
