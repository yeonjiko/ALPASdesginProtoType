import type { Meta, StoryObj } from "@storybook/react-vite";

import { Workspace } from "@/components/Workspace/Workspace";
import { variants } from "@/theme/variants";
import css from "@/components/Workspace/Workspace.stories.module.css";
const meta = {
  title: "ALPAS/Workspace",
  component: Workspace,
  tags: ["autodocs"],
  args: { variant: variants[0] },
  decorators: [
    (Story, context) => (
      <div className={css.canvas}>
        <Story
          args={{
            ...context.args,
            variant: variants[Number(context.globals.variant)] ?? variants[0],
          }}
        />
      </div>
    ),
  ],
} satisfies Meta<typeof Workspace>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const RoundedTabs: Story = {
  name: "둥근 테두리 탭",
  args: { variant: variants[4] },
  globals: { variant: "4" },
  parameters: {
    docs: {
      description: {
        story:
          "흰색 비선택 탭과 옅은 파란색 선택 탭을 둥근 테두리로 구분하는 추가 시안입니다. 대출·반납 내부 도킹 탭에도 같은 디자인을 적용합니다.",
      },
    },
  },
};
