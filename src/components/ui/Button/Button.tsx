import React from "react";
import { Button as MuiButton, type ButtonProps as MuiButtonProps, useTheme } from "@mui/material";
import styles from "@/components/ui/Button/Button.module.css";
import { joinClasses } from "@/styles/classes";
export type ButtonProps = MuiButtonProps & { appearance?: "alpas" | "mui" };
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, appearance = "alpas", style, ...props },
  ref,
) {
  const theme = useTheme();
  const orange = theme.palette.primary.main.toLowerCase() === "#f97316";
  const colors = orange
    ? {
        accent: "#F97316",
        hover: "#EA580C",
        pressed: "#C2410C",
        focus: "#F97316",
        ink: "#C2410C",
        subtle: "#FFF7ED",
        down: "#FFEDD5",
      }
    : {
        accent: "#2468EB",
        hover: "#1D56BC",
        pressed: "#16408D",
        focus: "#246BE8",
        ink: "#1D56BC",
        subtle: "#EFF5FF",
        down: "#D3E1FB",
      };
  const variables = Object.fromEntries(
    Object.entries(colors).map(([k, v]) => ["--button-" + k, v]),
  );
  return (
    <MuiButton
      type="button"
      {...props}
      ref={ref}
      className={joinClasses(appearance === "alpas" && styles.root, className)}
      style={{ ...variables, ...style }}
    />
  );
});
