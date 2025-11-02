import { forwardRef } from "react";
import type { CSSProperties } from "react";

import { cn } from "js/lib/utils";

import { useSidebar } from "../ui/sidebar";

type DssFooterProps = React.ComponentPropsWithoutRef<"footer"> & {
  /**
   * Overrides the collapsed state coming from the sidebar context.
   * Useful when the footer is rendered outside of the provider.
   */
  isCollapsed?: boolean;
};

export const DssFooter = forwardRef<HTMLElement, DssFooterProps>(
  (
    { className, style, isCollapsed: collapsedOverride, children, ...props },
    ref,
  ) => {
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
      <footer
        ref={ref}
        className={cn(
          "bg-card border-t border-border fixed z-10 bottom-0 flex justify-center p-2",
          className,
        )}
        data-collapsed={isCollapsed ? "true" : "false"}
        style={computedStyle}
        {...props}
      >
        {children ?? (
          <p className="text-center text-xs text-muted-foreground tk-readable">
            Dette verktøyet kan gi feil informasjon. Alle råd, oppfordringer
            eller opplysninger som systemet gir, må vurderes av en relevant
            fagperson før videre behandling.
          </p>
        )}
      </footer>
    );
  },
);

DssFooter.displayName = "DssFooter";
