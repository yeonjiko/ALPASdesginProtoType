import type { Components, Theme } from "@mui/material/styles";
export type MenuInteractionColors = { menuHover: string; selected: string };
export function createSelectMenuTheme(
  states: MenuInteractionColors,
): NonNullable<Components<Theme>["MuiMenu"]> {
  return {
    styleOverrides: {
      paper: {
        "&.alpas-select-menu": {
          marginTop: 4,
          borderRadius: 4,
          boxShadow: "none",
          "& .MuiMenu-list": { padding: "8px 0 7px" },
          "& .MuiMenuItem-root": {
            minHeight: 36,
            height: 36,
            padding: "8px 20px",
            fontSize: 14,
            lineHeight: "20px",
            color: "#000",
            "&:hover, &.Mui-focusVisible": {
              backgroundColor: states.menuHover,
            },
            "&.Mui-selected, &.Mui-selected:hover, &.Mui-selected.Mui-focusVisible": {
              backgroundColor: states.selected,
            },
          },
        },
      },
    },
  };
}
