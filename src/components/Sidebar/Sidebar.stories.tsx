import { createClasses } from "@/styles/classes";
import css0 from "@/App.module.css";
import css1 from "@/components/Sidebar/Sidebar.module.css";

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { variants } from "@/theme/variants";

const cx = createClasses(css0, css1);

const meta = {
  title: "ALPAS/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  render: function Render(args) {
    const [mode, setMode] = React.useState(args.mode);
    return (
      <div className={cx(`app sidebar_${mode}`)}>
        <Sidebar {...args} mode={mode} onModeChange={setMode} />
      </div>
    );
  },
  args: { variant: variants[0], mode: "normal", onModeChange: fn() },
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
} satisfies Meta<typeof Sidebar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Collapsed: Story = { args: { mode: "collapsed" } };
export const Expanded: Story = { args: { mode: "expanded" } };
