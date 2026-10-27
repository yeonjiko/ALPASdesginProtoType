import { PrototypeField } from "./PrototypeField";
import previewStyles from "./preview.module.css";
import "../src/styles.css";
import "./docs.css";
import { createClasses } from "../src/styles/classes";
import css0 from "../src/components/Workspace/Workspace.module.css";

import React from "react";
import type { Preview } from "@storybook/react-vite";
import { AlpasProvider } from "../src/theme/AlpasProvider";
import { variants } from "../src/theme/variants";

const cx = createClasses(css0);

const preview: Preview = {
  globalTypes: {
    variant: {
      description: "ALPAS 색상 및 상태",
      toolbar: {
        icon: "paintbrush",
        items: variants.map((v, i) => ({ value: String(i), title: v.label })),
      },
    },
  },
  initialGlobals: { variant: "0" },
  decorators: [
    (Story, context) => {
      const variant = variants[Number(context.globals.variant)] ?? variants[0];
      if (context.title.startsWith("ALPAS/UI/"))
        return (
          <AlpasProvider variant={variant}>
            <div
              className={`${previewStyles.ui_canvas} option_${variant.option.toLowerCase()} ${variant.isAlternateLayout ? "active2" : "active"}`}
            >
              <PrototypeField kind={context.title.split("/").pop() ?? ""}>
                <Story />
              </PrototypeField>
            </div>
          </AlpasProvider>
        );
      return (
        <AlpasProvider variant={variant}>
          <div
            className={cx(
              `dockview_shell option_${variant.option.toLowerCase()} ${variant.isAlternateLayout ? "active2" : "active"}`,
            )}
            style={
              {
                height: "100vh",
                "--alpas-accent": variant.accent,
                "--alpas-surface": variant.surface,
                "--alpas-row-selected": variant.option === "A" ? "#D3E1FB" : "#FFEDD5",
              } as React.CSSProperties
            }
          >
            <Story />
          </div>
        </AlpasProvider>
      );
    },
  ],
  parameters: { layout: "fullscreen", controls: { expanded: true } },
};
export default preview;
