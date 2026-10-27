import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { DatePicker } from "@/components/ui/DatePicker/DatePicker";
const meta = {
  title: "ALPAS/UI/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    slotProps: {
      textField: { size: "small", slotProps: { htmlInput: { "aria-label": "조회일" } } },
    },
  },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState(args.value ?? null);
    return <DatePicker {...args} value={value} onChange={setValue} />;
  },
};
export const Disabled: Story = { args: { disabled: true } };

export const OptionA: Story = { globals: { variant: "0" } };
export const OptionB: Story = { globals: { variant: "1" } };
export const WithLabel: Story = { args: { label: "조회일" } };
