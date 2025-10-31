import { forwardRef } from "react";
import type { CSSProperties } from "react";

import { cn } from "js/lib/utils";

import { SidebarInset, useSidebar } from "../ui/sidebar";

type DssMainProps = React.ComponentPropsWithoutRef<typeof SidebarInset> & {
  /**
   * Overrides the collapsed state sourced from the sidebar context.
   */
  isCollapsed?: boolean;
};

export const DssMain = forwardRef<HTMLDivElement, DssMainProps>(
  ({ className, style, isCollapsed: collapsedOverride, ...props }, ref) => {
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

    return (
      <main
        ref={ref}
        className={cn("flex-1 scroll-smooth", className)}
        data-collapsed={isCollapsed ? "true" : "false"}
        style={computedStyle}
        {...props}
      />
    );
  },
);

DssMain.displayName = "DssMain";
