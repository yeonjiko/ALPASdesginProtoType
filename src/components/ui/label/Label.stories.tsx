import { useId } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Label } from "@/components/ui/label/Label";
import type { LabelProps } from "@/components/ui/label/Label";
import { TextField } from "@/components/ui/TextField/TextField";
import fieldCss from "@/components/ui/label/Field.module.css";
import css from "@/components/ui/label/Label.stories.module.css";

function LabelExample(args: LabelProps): ReactElement {
  const id = useId();
  return (
    <div className={fieldCss.field}>
      <Label {...args} htmlFor={id} />
      <TextField
        id={id}
        placeholder="자료명을 입력하세요."
        required={args.required}
        disabled={args.disabled}
        error={args.error}
        helperText={args.error ? "자료명을 입력해 주세요." : null}
      />
    </div>
  );
}

const meta = {
  title: "ALPAS/UI/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "입력창 밖에 항상 표시하는 라벨입니다. small 12px/16px, medium 14px/20px(기본), large 16px/24px. htmlFor와 입력의 id를 연결하고 placeholder는 입력 안내에만 사용합니다. required는 필수 표시이므로 입력 컴포넌트에도 required를 설정합니다.",
      },
    },
  },
  args: { children: "자료명", size: "medium", htmlFor: "label-example" },
  argTypes: {
    size: { control: "inline-radio", options: ["small", "medium", "large"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    htmlFor: { control: false },
  },
  render: LabelExample,
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = { args: { size: "small" } };
export const Medium: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "자료명" });
    await userEvent.click(canvas.getByText("자료명", { selector: "label" }));
    await expect(input).toHaveFocus();
    await userEvent.type(input, "도서관의 하루");
    await expect(input).toHaveValue("도서관의 하루");
    await expect(canvas.getByText("자료명", { selector: "label" })).toBeVisible();
  },
};
export const Large: Story = { args: { size: "large" } };
export const AllSizes: Story = {
  render: function AllSizes(args): ReactElement {
    return (
      <div className={css.examples}>
        <LabelExample {...args} size="small">
          자료명 · Small (12/16px)
        </LabelExample>
        <LabelExample {...args} size="medium">
          자료명 · Medium (14/20px)
        </LabelExample>
        <LabelExample {...args} size="large">
          자료명 · Large (16/24px)
        </LabelExample>
      </div>
    );
  },
};
export const Required: Story = { args: { required: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Error: Story = { args: { error: true, required: true } };
