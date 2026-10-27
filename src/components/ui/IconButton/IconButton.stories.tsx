import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import Search from "@mui/icons-material/Search";
const meta = {
  title: "ALPAS/UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { "aria-label": "검색", children: <Search />, onClick: fn() },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };

export const FilterAction: Story = { args: { "aria-label": "초기화" } };
