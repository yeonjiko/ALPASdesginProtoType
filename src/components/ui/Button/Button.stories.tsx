import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, expect, userEvent, within } from "storybook/test";
import { Button } from "@/components/ui/Button/Button";
const meta = {
  title: "ALPAS/UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: "버튼", variant: "contained", onClick: fn() },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["contained", "outlined", "text"],
    },
    size: { control: "inline-radio", options: ["small", "medium", "large"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "버튼" }));
    await expect(args.onClick).toHaveBeenCalled();
  },
};
export const Outlined: Story = { args: { variant: "outlined" } };
export const Text: Story = { args: { variant: "text" } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };

export const OptionA: Story = { globals: { variant: "0" } };
export const OptionB: Story = { globals: { variant: "1" } };
