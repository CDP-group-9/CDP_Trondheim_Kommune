import { forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "js/lib/utils";

import tkLogo from "../../../assets/images/tk-logo-wide.svg";
import { SidebarHeader, useSidebar } from "../ui/sidebar";

import { DssDynamicBreadcrumb } from "./DssDynamicBreadcrumb";

type DssHeaderProps = React.ComponentPropsWithoutRef<typeof SidebarHeader> & {
  /**
   * Optional element rendered on the right-hand side of the header.
   * Falls back to the DASQ brand link when not provided.
   */
  brand?: ReactNode;
  isCollapsed?: boolean;
};

export const DssHeader = forwardRef<HTMLDivElement, DssHeaderProps>(
  (
    { className, brand, style, isCollapsed: collapsedOverride, ...props },
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
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-50 bg-card border-b border-border shadow-sm flex flex-col gap-0",
          className,
        )}
        data-collapsed={isCollapsed ? "true" : "false"}
        style={computedStyle}
        {...props}
      >
        <div className="py-3 flex items-start justify-between">
          <div className="flex h-full gap-4">
            {brand ?? (
              <a
                aria-label="Gå til Trondheim Kommune sin hjemmeside (åpner i ny fane)"
                className="flex justify-start rounded-md cursor-pointer"
                href="https://www.trondheim.kommune.no/"
                rel="noreferrer"
                target="_blank"
              >
                <img
                  alt="Trondheim Kommunes logo"
                  className="h-18 object-contain hover:opacity-80 transition-opacity tk-logo-left"
                  src={tkLogo}
                />
              </a>
            )}
          </div>
        </div>
        <div className="border-t border-border px-4 py-2">
          <DssDynamicBreadcrumb />
        </div>
      </header>
    );
  },
);

DssHeader.displayName = "DssHeader";
