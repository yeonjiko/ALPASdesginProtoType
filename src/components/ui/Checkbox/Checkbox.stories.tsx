import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
const meta = {
  title: "ALPAS/UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { inputProps: { "aria-label": "자료 선택" } },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("checkbox", {
      name: "자료 선택",
    });
    if ((input as HTMLInputElement).checked) await userEvent.click(input);
    await userEvent.click(input);
    await expect(input).toBeChecked();
  },
};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Indeterminate: Story = { args: { indeterminate: true } };
