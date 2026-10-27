import { Button } from "@/components/ui";
import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { DetailedSearchDialog } from "@/components/DetailedSearchDialog/DetailedSearchDialog";
import { variants } from "@/theme/variants";
const meta = {
  title: "ALPAS/DetailedSearchDialog",
  component: DetailedSearchDialog,
  tags: ["autodocs"],
  args: { variant: variants[0], open: true, onClose: fn() },
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
} satisfies Meta<typeof DetailedSearchDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = React.useState(args.open);
    return (
      <>
        <Button onClick={() => setOpen(true)}>상세검색 열기</Button>
        <DetailedSearchDialog
          {...args}
          open={open}
          onClose={() => {
            args.onClose();
            setOpen(false);
          }}
        />
      </>
    );
  },
};
