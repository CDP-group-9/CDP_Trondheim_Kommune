import { forwardRef, useId } from "react";
import type { ReactNode } from "react";

import { useInternalStatus } from "js/hooks/useInternalStatus"; // adjust path if needed
import { useSidebarSectionLayout } from "js/hooks/useSidebarSectionLayout";
import { cn } from "js/lib/utils";

import tkLogo from "../../../assets/images/tk-logo-wide.svg";
import { SidebarHeader } from "../ui/sidebar";
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
    const internalStatusSwitchId = useId();
    const { computedStyle, isCollapsed } = useSidebarSectionLayout({
      collapsedOverride,
      style,
    });

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
        <div className="border-t border-border px-4 py-2 flex flex-row items-center justify-between">
          <div className="">
            <DssDynamicBreadcrumb className="relative top-[2px]" />
          </div>
          <div className="flex w-fit items-center gap-2 justify-between">
            <Switch
              checked={isInternal ?? false}
              id={internalStatusSwitchId}
              onCheckedChange={handleSwitchChange}
            />
            <label
              className="text-sm text-right inline-block whitespace-nowrap"
              htmlFor={internalStatusSwitchId}
            >
              {isInternal
                ? "Ansatt i Trondheim kommune"
                : "Ikke ansatt i Trondheim kommune"}
            </label>
          </div>
        </div>
      </header>
    );
  },
);

DssHeader.displayName = "DssHeader";
