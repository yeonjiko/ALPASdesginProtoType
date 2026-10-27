import type { Theme } from "@mui/material/styles";
import { createSelectMenuTheme } from "@/components/ui/Select/menuTheme";
import { createTheme } from "@mui/material";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type { LayoutVariant } from "@/theme/variants";
export function createAlpasTheme(variant: LayoutVariant): Theme {
  // Keep 03Layout default colors/geometry; use 02Components interaction tokens.
  const states =
    variant.option === "A"
      ? {
          hover: "#1D56BC",
          pressed: "#16408D",
          focus: "#246BE8",
          ink: "#1D56BC",
          subtle: "#EFF5FF",
          down: "#D3E1FB",
          selected: "#BFDBFE",
          menuHover: "#EFF6FF",
        }
      : {
          hover: "#EA580C",
          pressed: "#C2410C",
          focus: "#F97316",
          ink: "#C2410C",
          subtle: "#FFF7ED",
          down: "#FFEDD5",
          selected: "#FED7AA",
          menuHover: "#FFF7ED",
        };
  return createTheme({
    palette: {
      mode: "light",
      primary: { main: variant.accent },
      error: { main: "#D92D20" },
      text: { primary: "#333", secondary: "#555" },
      divider: "#D1D5DB",
      background: { default: "#F4F6FA", paper: "#fff" },
      DataGrid: { bg: "#fff", headerBg: variant.surface },
    },
    typography: { fontFamily: "Noto Sans KR, sans-serif" },
    shape: { borderRadius: 4 },
    components: {
      MuiMenu: createSelectMenuTheme(states),
    },
  });
}
