import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActionButtonSettings } from "@/components/ActionButtonSettings/ActionButtonSettings";
import { variants } from "@/theme/variants";
const meta = {
  title: "ALPAS/ActionButtonSettings",
  component: ActionButtonSettings,
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
} satisfies Meta<typeof ActionButtonSettings>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
