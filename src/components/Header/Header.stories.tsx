import type { Meta, StoryObj } from "@storybook/react-vite";

import { Header } from "@/components/Header/Header";
import { variants } from "@/theme/variants";
const meta = {
  title: "ALPAS/Header",
  component: Header,
  tags: ["autodocs"],
  args: { variant: variants[0] },
  decorators: [
    (Story, context) => (
      <Story
        args={{
          ...context.args,
          variant: variants[Number(context.globals.variant)] ?? variants[0],
        }}
      />
    ),
  ],
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
