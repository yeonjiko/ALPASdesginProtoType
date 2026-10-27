import type { ReactElement } from "react";
import { createClasses } from "@/styles/classes";
import css0 from "@/components/WorkspacePanel/WorkspacePanel.module.css";

import type { LayoutVariant } from "@/theme/variants";
import { SearchFilters } from "@/components/SearchFilters/SearchFilters";
import { ActionButtonSettings } from "@/components/ActionButtonSettings/ActionButtonSettings";
import { ResultsGrid } from "@/components/ResultsGrid/ResultsGrid";

const cx = createClasses(css0);

export function WorkspacePanel({ variant }: { variant: LayoutVariant }): ReactElement | null {
  return (
    <div className={cx("dock_panel_content")}>
      <SearchFilters variant={variant} />
      <ActionButtonSettings variant={variant} />
      <ResultsGrid variant={variant} />
    </div>
  );
}
