import type { Meta, StoryObj } from "@storybook/react-vite";

import { ResultsGrid } from "@/components/ResultsGrid/ResultsGrid";
import { variants } from "@/theme/variants";
const meta = {
  title: "ALPAS/ResultsGrid",
  component: ResultsGrid,
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
} satisfies Meta<typeof ResultsGrid>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
