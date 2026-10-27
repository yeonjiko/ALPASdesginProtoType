import type { CssVariables } from "@/styles/styleTypes";
import type { ReactElement } from "react";
import { IconButton, Tooltip } from "@/components/ui";
import { createClasses } from "@/styles/classes";
import css0 from "@/components/ActionButtonSettings/ActionButtonSettings.module.css";
import css1 from "@/components/Workspace/Workspace.module.css";

import React from "react";
import { Stack } from "@mui/material";
import type { IDockviewPanelProps } from "dockview";
import { DockviewReact } from "dockview";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import Close from "@mui/icons-material/Close";
import type { LayoutVariant } from "@/theme/variants";
import { WorkspacePanel } from "@/components/WorkspacePanel/WorkspacePanel";

const cx = createClasses(css0, css1);

export function DockPanel({
  api,
  params,
}: IDockviewPanelProps<{ variant: LayoutVariant }>): ReactElement | null {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    // Mount the virtualized grid only after Dockview has measured its visible panel.
    const update = () => {
      if (api.isVisible && api.width > 0 && api.height > 0) setReady(true);
    };
    const dimensions = api.onDidDimensionsChange(update);
    const visibility = api.onDidVisibilityChange(update);
    update();
    return () => {
      dimensions.dispose();
      visibility.dispose();
    };
  }, [api]);
  return ready ? <WorkspacePanel variant={params.variant} /> : null;
}

export function DockHeaderActions(): ReactElement | null {
  return (
    <Stack direction="row" className={cx("dock_header_actions")}>
      <Tooltip title="복사">
        <IconButton size="small" aria-label="복사">
          <ContentCopyOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="닫기">
        <IconButton size="small" aria-label="닫기">
          <Close />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export function Workspace({ variant }: { variant: LayoutVariant }): ReactElement | null {
  const panelTitles = variant.isAlternateLayout
    ? ["희망자료관리", "대출·반납", "대시보드"]
    : ["희망자료관리", "대출·반납"];
  const customStyle: CssVariables = {
    "--alpas-accent": variant.accent,
    "--alpas-surface": variant.surface,
    "--alpas-row-selected": variant.option === "A" ? "#D3E1FB" : "#FFEDD5",
  };

  return (
    <main className={cx("workspace")}>
      <div
        className={cx(
          `dockview_shell option_${variant.option.toLowerCase()} ${variant.isAlternateLayout ? "active2" : "active"}`,
        )}
        style={customStyle}
      >
        <DockviewReact
          key={variant.label}
          className={cx("dockview-theme-light alpas_dockview")}
          components={{
            workspace: (props) => <DockPanel {...props} params={{ variant }} />,
          }}
          rightHeaderActionsComponent={DockHeaderActions}
          onReady={({ api }) => {
            let firstPanel: ReturnType<typeof api.addPanel> | undefined;
            panelTitles.forEach((title, index) => {
              const panel = api.addPanel({
                id: `${variant.label}-${index}`,
                component: "workspace",
                title,
                params: { variant },
              });
              if (index === 0) firstPanel = panel;
            });
            firstPanel?.api.setActive();
          }}
        />
      </div>
    </main>
  );
}
