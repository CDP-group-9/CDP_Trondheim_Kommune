import type { CSSProperties } from "react";

import { useSidebar } from "js/components/ui/sidebar";

type UseSidebarSectionLayoutOptions = {
  collapsedOverride?: boolean;
  style?: CSSProperties;
};

export function useSidebarSectionLayout({
  collapsedOverride,
  style,
}: UseSidebarSectionLayoutOptions = {}) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = collapsedOverride ?? state === "collapsed";

  const sidebarWidthVar = isCollapsed
    ? "var(--sidebar-width-icon, 4rem)"
    : "var(--sidebar-width, 16rem)";

  const computedStyle: CSSProperties = {
    ...(style ?? {}),
  };

  if (!isMobile) {
    computedStyle.marginLeft = sidebarWidthVar;
    computedStyle.width = `calc(100% - ${sidebarWidthVar})`;
  } else {
    computedStyle.width = "100%";
  }

  return { computedStyle, isCollapsed };
}
