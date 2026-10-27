import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Button } from "@/components/ui/Button/Button";
const meta = {
  title: "ALPAS/UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    open: true,
    onClose: fn(),
    children: (
      <>
        <DialogTitle>확인</DialogTitle>
        <DialogContent>변경 내용을 저장하시겠습니까?</DialogContent>
      </>
    ),
  },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = React.useState(args.open);
    return (
      <>
        <Button onClick={() => setOpen(true)}>팝업 열기</Button>
        <Dialog
          {...args}
          open={open}
          onClose={(event, reason) => {
            args.onClose?.(event, reason);
            setOpen(false);
          }}
        >
          <DialogTitle>확인</DialogTitle>
          <DialogContent>변경 내용을 저장하시겠습니까?</DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button variant="contained" onClick={() => setOpen(false)}>
              저장
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
};
