import filterStyles from "../../SearchFilters/SearchFilters.module.css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { TextField } from "@/components/ui/TextField/TextField";
const meta = {
  title: "ALPAS/UI/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    className: "loan_search_textfield " + filterStyles["loan_search_textfield"],
    placeholder: "검색어 입력",
    inputProps: { "aria-label": "검색어" },
  },
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "검색어",
    });
    await userEvent.clear(input);
    await userEvent.type(input, "도서관");
    await expect(input).toHaveValue("도서관");
  },
};
export const Disabled: Story = {
  args: { disabled: true, value: "비활성 입력창" },
};
export const Error: Story = {
  args: { error: true, helperText: "입력 내용을 확인해 주세요." },
};
export const WithLabel: Story = { args: { label: "자료명" } };

export const OptionA: Story = { globals: { variant: "0" } };
export const OptionB: Story = { globals: { variant: "1" } };
