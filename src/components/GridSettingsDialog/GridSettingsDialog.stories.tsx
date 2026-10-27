import { Button } from "@/components/ui";
import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { GridSettingsDialog } from "@/components/GridSettingsDialog/GridSettingsDialog";
import { defaultGridColumnVisibilityModel } from "@/components/ResultsGrid/gridData";
const meta = {
  title: "ALPAS/GridSettingsDialog",
  component: GridSettingsDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    value: {
      fontSize: 14,
      rowHeight: 42,
      batchSize: 25,
      selectionScope: "현재 화면",
      columnVisibilityModel: defaultGridColumnVisibilityModel,
    },
    onClose: fn(),
    onSave: fn(),
  },
} satisfies Meta<typeof GridSettingsDialog>;
export default meta;
export const Default: StoryObj<typeof meta> = {
  render: function Render(args) {
    const [open, setOpen] = React.useState(args.open);
    return (
      <>
        <Button onClick={() => setOpen(true)}>설정 열기</Button>
        <GridSettingsDialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onSave={(value) => {
            args.onSave(value);
            setOpen(false);
          }}
        />
      </>
    );
  },
};
