export type LayoutVariant = {
  label: string;
  option: "A" | "B";
  accent: string;
  sidebarBackground: string;
  surface: string;
  isAlternateLayout: boolean;
  dockviewStyle?: "default" | "rounded";
};

export type SidebarMode = "normal" | "collapsed" | "expanded";

export const variants: LayoutVariant[] = [
  {
    label: "OPTION A · ACTIVE",
    option: "A",
    accent: "#2468EB",
    sidebarBackground: "#193A7A",
    surface: "#EFF5FF",
    isAlternateLayout: false,
  },
  {
    label: "OPTION B · ACTIVE",
    option: "B",
    accent: "#F97316",
    sidebarBackground: "#833813",
    surface: "#FFF7ED",
    isAlternateLayout: false,
  },
  {
    label: "OPTION A · ACTIVE2",
    option: "A",
    accent: "#2468EB",
    sidebarBackground: "#193A7A",
    surface: "#EFF5FF",
    isAlternateLayout: true,
  },
  {
    label: "OPTION B · ACTIVE2",
    option: "B",
    accent: "#F97316",
    sidebarBackground: "#833813",
    surface: "#FFF7ED",
    isAlternateLayout: true,
  },
  {
    label: "OPTION A · ROUND",
    option: "A",
    accent: "#2468EB",
    sidebarBackground: "#193A7A",
    surface: "#EFF5FF",
    isAlternateLayout: false,
    dockviewStyle: "rounded",
  },
];
