import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tooltip } from "@/components/ui/Tooltip/Tooltip";
import { Button } from "@/components/ui/Button/Button";
const meta = {
  title: "ALPAS/UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    title: "버튼에 대한 도움말입니다.",
    arrow: true,
    children: <Button variant="outlined">도움말</Button>,
  },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Visible: Story = { args: { open: true } };
