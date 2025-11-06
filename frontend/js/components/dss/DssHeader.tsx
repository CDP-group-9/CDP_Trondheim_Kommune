import { forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";

import { useInternalStatus } from "js/hooks/useInternalStatus"; // adjust path if needed
import { cn } from "js/lib/utils";

import tkLogo from "../../../assets/images/tk-logo-wide.svg";
import { SidebarHeader, useSidebar } from "../ui/sidebar";
import { Switch } from "../ui/switch";

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

    const { isInternal, updateInternalStatus } = useInternalStatus();

    const handleSwitchChange = (checked: boolean) => {
      updateInternalStatus(checked);
    };

    return (
      <header
        ref={ref}
        className={cn(
          "bg-popover border-t border-border fixed z-10 top-0 flex-col justify-start shadow-md",
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
        <div className="border-t border-border px-4 py-2 flex items-center justify-between">
          <div className="flex items-center h-full">
            <DssDynamicBreadcrumb className="relative top-[2px]" />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={!!isInternal}
              onCheckedChange={handleSwitchChange}
            />
            <span className="inline-block w-[260px] whitespace-nowrap">
              {isInternal
                ? "Jeg jobber i Trondheim kommune"
                : "Jeg jobber ikke i Trondheim kommune"}
            </span>
          </div>
        </div>
      </header>
    );
  },
);

DssHeader.displayName = "DssHeader";
