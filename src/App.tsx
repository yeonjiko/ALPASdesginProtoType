import type { ReactElement } from "react";
import { Button } from "@/components/ui";
import { createClasses } from "@/styles/classes";
import css0 from "@/App.module.css";
import css1 from "@/components/Sidebar/Sidebar.module.css";

import React from "react";
import { Typography, Stack } from "@mui/material";
import type { SidebarMode } from "@/theme/variants";
import { variants } from "@/theme/variants";
import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Workspace } from "@/components/Workspace/Workspace";
import { AlpasProvider } from "@/theme/AlpasProvider";

const cx = createClasses(css0, css1);

export function App(): ReactElement | null {
  const [selected, setSelected] = React.useState(0);
  const [sidebarMode, setSidebarMode] = React.useState<SidebarMode>("normal");
  const variant = variants[selected];

  return (
    <AlpasProvider variant={variant}>
      <div className={cx(`app sidebar_${sidebarMode}`)}>
        <Header variant={variant} />
        <Sidebar variant={variant} mode={sidebarMode} onModeChange={setSidebarMode} />
        <Workspace variant={variant} />
        <div className={cx("switcher")}>
          <Typography variant="caption">03Layout 시안 전환</Typography>
          <Stack direction="row" spacing={1}>
            {variants.map((item, index) => (
              <Button
                appearance="mui"
                key={item.label}
                size="small"
                variant={selected === index ? "contained" : "outlined"}
                onClick={() => setSelected(index)}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </div>
      </div>
    </AlpasProvider>
  );
}
