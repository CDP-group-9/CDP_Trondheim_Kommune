import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { AppSidebar } from "../app-sidebar";

jest.mock("../../ui/sidebar", () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar">{children}</div>
  ),
  SidebarContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarGroupContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarGroupLabel: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  SidebarHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <ul>{children}</ul>
  ),
  SidebarMenuButton: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => (
    <li>{asChild ? children : <button type="button">{children}</button>}</li>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
  SidebarTrigger: ({ className }: { className?: string }) => (
    <button className={className} type="button">
      Toggle
    </button>
  ),
}));

jest.mock("lucide-react", () => ({
  Check: () => <div>Check</div>,
  History: () => <div>History</div>,
  DockIcon: () => <div>DockIcon</div>,
  Info: () => <div>Info</div>,
  Plus: () => <div>Plus</div>,
}));

describe("AppSidebar", () => {
  test("renders DASQ brand name", () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText("DASQ")).toBeInTheDocument();
  });

  test("renders all menu items", () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Ny samtale")).toBeInTheDocument();
    expect(screen.getByText("Om personvern")).toBeInTheDocument();
    expect(screen.getByText("Sjekkliste")).toBeInTheDocument();
    expect(screen.getByText("Eksempler")).toBeInTheDocument();
  });

  test("renders Tidligere samtaler section", () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Tidligere samtaler")).toBeInTheDocument();
  });

  test("menu items have correct links", () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /Ny samtale/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("link", { name: /Om personvern/i }),
    ).toHaveAttribute("href", "/personvern");
    expect(screen.getByRole("link", { name: /Sjekkliste/i })).toHaveAttribute(
      "href",
      "/sjekkliste",
    );
    expect(screen.getByRole("link", { name: /Eksempler/i })).toHaveAttribute(
      "href",
      "/eksempel",
    );
  });

  test("renders menu item icons", () => {
    render(
      <MemoryRouter>
        <AppSidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Plus")).toBeInTheDocument();
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("Check")).toBeInTheDocument();
    expect(screen.getByText("DockIcon")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
  });
});
