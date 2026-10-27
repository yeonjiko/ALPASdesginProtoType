import type { Meta, StoryObj } from "@storybook/react-vite";

import { WorkspacePanel } from "@/components/WorkspacePanel/WorkspacePanel";
import { variants } from "@/theme/variants";
const meta = {
  title: "ALPAS/WorkspacePanel",
  component: WorkspacePanel,
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
} satisfies Meta<typeof WorkspacePanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
