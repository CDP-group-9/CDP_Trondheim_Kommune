import { forwardRef } from "react";

import { cn } from "js/lib/utils";

import { SidebarInset } from "../ui/sidebar";

import { useSidebarSectionLayout } from "js/hooks/useSidebarSectionLayout";

type DssMainProps = React.ComponentPropsWithoutRef<typeof SidebarInset> & {
  /**
   * Overrides the collapsed state sourced from the sidebar context.
   */
  isCollapsed?: boolean;
};

export const DssMain = forwardRef<HTMLDivElement, DssMainProps>(
  ({ className, style, isCollapsed: collapsedOverride, ...props }, ref) => {
    const { computedStyle, isCollapsed } = useSidebarSectionLayout({
      collapsedOverride,
      style,
    });

    return (
      <section
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
