import type { ReactElement } from "react";
import { Button, Dialog, IconButton, Tooltip } from "@/components/ui";
import { createClasses } from "@/styles/classes";
import css0 from "@/components/ActionButtonSettings/ActionButtonSettings.module.css";

import React from "react";
import { DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import RestartAlt from "@mui/icons-material/RestartAlt";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import Close from "@mui/icons-material/Close";
import type { LayoutVariant } from "@/theme/variants";

import {
  defaultActionButtonLayout,
  isActionButtonId,
  actionButtonById,
  actionButtonLayoutStorageKey,
  cloneActionButtonLayout,
  readActionButtonLayout,
  type ActionButtonId,
  type ActionButtonLayout,
} from "@/components/ActionButtonSettings/actionButtonLayout";
export * from "@/components/ActionButtonSettings/actionButtonLayout";

const cx = createClasses(css0);

export function ActionButtonSettings({ variant }: { variant: LayoutVariant }): ReactElement | null {
  const [savedLayout, setSavedLayout] = React.useState(readActionButtonLayout);
  const [draftLayout, setDraftLayout] = React.useState(() => cloneActionButtonLayout(savedLayout));
  const [isEditing, setIsEditing] = React.useState(false);
  const [draggedId, setDraggedId] = React.useState<ActionButtonId | null>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = React.useState(false);
  const layout = isEditing ? draftLayout : savedLayout;

  const moveAction = React.useCallback(
    (id: ActionButtonId, target: keyof ActionButtonLayout, beforeId?: ActionButtonId) => {
      setDraftLayout((current) => {
        const next = cloneActionButtonLayout(current);
        next.active = next.active.filter((actionId) => actionId !== id);
        next.inactive = next.inactive.filter((actionId) => actionId !== id);
        const targetList = next[target];
        const targetIndex = beforeId ? targetList.indexOf(beforeId) : -1;
        targetList.splice(targetIndex >= 0 ? targetIndex : targetList.length, 0, id);
        return next;
      });
    },
    [],
  );

  const openSettings = () => {
    setDraftLayout(cloneActionButtonLayout(savedLayout));
    setIsEditing(true);
  };

  const closeSettings = () => {
    setDraftLayout(cloneActionButtonLayout(savedLayout));
    setIsEditing(false);
    setDraggedId(null);
  };

  const saveSettings = () => {
    const nextLayout = cloneActionButtonLayout(draftLayout);
    setSavedLayout(nextLayout);
    window.localStorage.setItem(actionButtonLayoutStorageKey, JSON.stringify(nextLayout));
    setIsEditing(false);
    setDraggedId(null);
    setIsSaveDialogOpen(true);
  };

  const renderAction = (id: ActionButtonId, zone: keyof ActionButtonLayout) => {
    const action = actionButtonById.get(id)!;
    const isInactive = zone === "inactive";
    return (
      <Tooltip
        key={id}
        title={isEditing ? `${action.label}: 드래그하여 위치를 변경합니다.` : action.description}
        placement="bottom"
        arrow
        describeChild
        slotProps={{
          tooltip: { className: cx("alpas_action_tooltip") },
          arrow: { className: cx("alpas_action_tooltip_arrow") },
        }}
      >
        <span
          className={cx("action_button_shell")}
          onDragOver={(event) => {
            if (!isEditing) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }}
          onDrop={(event) => {
            if (!isEditing) return;
            event.preventDefault();
            event.stopPropagation();
            const droppedId = event.dataTransfer.getData("text/plain") || draggedId;
            if (isActionButtonId(droppedId)) moveAction(droppedId, zone, id);
          }}
        >
          <Button
            className={cx(
              `alpas_button action_with_tooltip${isInactive ? " is_inactive" : ""}${draggedId === id ? " is_dragging" : ""}`,
            )}
            size="small"
            variant="outlined"
            disabled={!isEditing && isInactive}
            draggable={isEditing}
            aria-label={
              isEditing
                ? `${action.label}, ${isInactive ? "미사용" : "사용"} 버튼, 드래그하여 이동`
                : undefined
            }
            onDoubleClick={() => {
              if (isEditing) moveAction(id, isInactive ? "active" : "inactive");
            }}
            onDragStart={(event) => {
              if (!isEditing) return;
              setDraggedId(id);
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", id);
            }}
            onDragEnd={() => setDraggedId(null)}
          >
            {action.label}
          </Button>
        </span>
      </Tooltip>
    );
  };

  const renderDropZone = (zone: keyof ActionButtonLayout, ids: ActionButtonId[]) => (
    <div
      className={cx(`action_drop_zone action_${zone}_zone`)}
      data-action-zone={zone}
      onDragOver={(event) => {
        if (!isEditing) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        if (!isEditing) return;
        event.preventDefault();
        const droppedId = event.dataTransfer.getData("text/plain") || draggedId;
        if (isActionButtonId(droppedId)) moveAction(droppedId, zone);
      }}
    >
      {ids.map((id) => renderAction(id, zone))}
      {zone === "inactive" && ids.length === 0 && (
        <span className={cx("action_storage_placeholder")}>
          사용하지 않는 버튼을 이곳에 놓아 주세요.
        </span>
      )}
    </div>
  );

  return (
    <>
      <section
        className={cx(
          `actions${isEditing ? " is_editing" : ""}${layout.inactive.length ? " has-inactive" : ""}`,
        )}
        aria-label="그리드 기능 버튼"
      >
        {renderDropZone("active", layout.active)}
        {isEditing && renderDropZone("inactive", layout.inactive)}
        <Tooltip title={isEditing ? "버튼 설정 닫기" : "버튼 설정"}>
          <IconButton
            className={cx("panel_settings")}
            size="small"
            aria-label={isEditing ? "버튼 설정 닫기" : "버튼 설정"}
            aria-pressed={isEditing}
            onClick={isEditing ? closeSettings : openSettings}
          >
            <Settings />
          </IconButton>
        </Tooltip>
        {isEditing && (
          <div className={cx("action_edit_controls")}>
            <Tooltip title="버튼 설정을 초기화합니다.">
              <IconButton
                className={cx("action_layout_control")}
                size="small"
                aria-label="버튼 설정 초기화"
                onClick={() => setDraftLayout(cloneActionButtonLayout(defaultActionButtonLayout))}
              >
                <RestartAlt />
              </IconButton>
            </Tooltip>
            <Tooltip title="현재 버튼 설정을 저장합니다.">
              <IconButton
                className={cx("action_layout_control action_layout_save")}
                size="small"
                aria-label="현재 버튼 설정 저장"
                onClick={saveSettings}
              >
                <SaveOutlined />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </section>
      <Dialog
        className={cx(`action_save_dialog option_${variant.option.toLowerCase()}`)}
        open={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        aria-labelledby="action_save_dialog_title"
        slotProps={{ paper: { className: cx("action_save_dialog_paper") } }}
      >
        <DialogTitle className={cx("action_save_dialog_title")} id="action_save_dialog_title">
          <Typography component="span">알림</Typography>
          <IconButton
            size="small"
            aria-label="알림 닫기"
            onClick={() => setIsSaveDialogOpen(false)}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className={cx("action_save_dialog_content")}>
          <Typography>버튼 배치를 저장했습니다.</Typography>
        </DialogContent>
        <DialogActions className={cx("action_save_dialog_actions")}>
          <Button
            className={cx("alpas-button")}
            type="button"
            variant="contained"
            onClick={() => setIsSaveDialogOpen(false)}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
