import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchFilters } from "@/components/SearchFilters/SearchFilters";
import { variants } from "@/theme/variants";
const meta = {
  title: "ALPAS/SearchFilters",
  component: SearchFilters,
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
} satisfies Meta<typeof SearchFilters>;
export default meta;
export const Default: StoryObj<typeof meta> = {};

export const OptionAActive: StoryObj<typeof meta> = { globals: { variant: "0" } };
export const OptionBActive: StoryObj<typeof meta> = { globals: { variant: "1" } };
export const OptionAActive2: StoryObj<typeof meta> = { globals: { variant: "2" } };
export const OptionBActive2: StoryObj<typeof meta> = { globals: { variant: "3" } };
