import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { DssSidebar } from "../DssSidebar";

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
  SidebarFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarTrigger: ({ className }: { className?: string }) => (
    <button className={className} type="button">
      Toggle
    </button>
  ),
  useSidebar: () => ({ state: "expanded", isMobile: false }),
}));

jest.mock("lucide-react", () => ({
  Check: () => <div>Check</div>,
  History: () => <div>History</div>,
  DockIcon: () => <div>DockIcon</div>,
  Info: () => <div>Info</div>,
  Plus: () => <div>Plus</div>,
  Mail: () => <div>Mail</div>,
  Phone: () => <div>Phone</div>,
  MapPin: () => <div>MapPin</div>,
  SquareArrowOutUpRight: () => <div>SquareArrowOutUpRight</div>,
  Trash2: () => <div>Trash2</div>,
}));

jest.mock("../../../contexts/AppStateContext", () => ({
  useAppState: () => ({
    chatSessions: [
      {
        id: "chat-1",
        title: "Tidligere chat",
      },
    ],
    currentChatId: null,
    createNewChat: jest.fn(),
    switchToChat: jest.fn(),
    deleteChat: jest.fn(),
    restoreCurrentChecklist: jest.fn(),
  }),
}));

describe("DssSidebar", () => {
  test("renders ASQ brand link", () => {
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
    expect(
      screen.getByLabelText("Gå til ASQ forsiden"),
    ).toBeInTheDocument();
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

  test("menu items render as buttons with correct labels", () => {
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

    expect(screen.getByRole("button", { name: /Ny samtale/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /Om personvern/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /Sjekkliste/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /Eksempler/i })).toBeVisible();
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
