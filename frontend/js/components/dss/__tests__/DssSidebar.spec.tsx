import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { DssSidebar } from "../DssSidebar";
import React from "react";

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
    <div>{asChild ? children : <button type="button">{children}</button>}</div>
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

jest.mock("../../../assets/images/tk-logo-wide.svg", () => "tk-logo-wide.svg");

describe("DssSidebar", () => {
  test("renders Trondheim Kommune logo", () => {
    render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <DssSidebar />
      </MemoryRouter>,
    );
    const logo = screen.getByAltText("Trondheim Kommunes logo");
    expect(logo).toHaveAttribute("src", "tk-logo-wide.svg");
  });

  test("renders all menu items", () => {
    render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <DssSidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Ny samtale")).toBeInTheDocument();
    expect(screen.getByText("Om personvern")).toBeInTheDocument();
    expect(screen.getByText("Sjekkliste")).toBeInTheDocument();
    expect(screen.getByText("Eksempler")).toBeInTheDocument();
  });

  test("renders Tidligere samtaler section", () => {
    render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <DssSidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Tidligere samtaler")).toBeInTheDocument();
  });

  test("menu items have correct links", () => {
    render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <DssSidebar />
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
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <DssSidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Plus")).toBeInTheDocument();
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("Check")).toBeInTheDocument();
    expect(screen.getByText("DockIcon")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
  });
});
