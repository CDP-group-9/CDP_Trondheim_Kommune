import { forwardRef } from "react";

import { useSidebarSectionLayout } from "js/hooks/useSidebarSectionLayout";
import { cn } from "js/lib/utils";

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
    const { computedStyle, isCollapsed } = useSidebarSectionLayout({
      collapsedOverride,
      style,
    });

    return (
      <footer
        ref={ref}
        className={cn(
          "bg-popover border-t border-border fixed z-10 bottom-0 flex justify-center p-2",
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
