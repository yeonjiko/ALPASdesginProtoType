import type { Meta, StoryObj } from "@storybook/react-vite";

import { Workspace } from "@/components/Workspace/Workspace";
import { variants } from "@/theme/variants";
const meta = {
  title: "ALPAS/Workspace",
  component: Workspace,
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
} satisfies Meta<typeof Workspace>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
