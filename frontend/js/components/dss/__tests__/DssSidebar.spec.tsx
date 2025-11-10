import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { DssSidebar } from "../DssSidebar";

const mockNavigate = jest.fn();
const mockCreateNewChat = jest.fn();
const mockSwitchToChat = jest.fn();
const mockDeleteChat = jest.fn();
const mockRestoreCurrentChecklist = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: "/" }),
}));

jest.mock("../../ui/sidebar", () => ({
  Sidebar: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="sidebar" {...props}>
      {children}
    </div>
  ),
  SidebarContent: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  SidebarGroup: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  SidebarGroupContent: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
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
    onClick,
    isActive,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    isActive?: boolean;
    className?: string;
  }) => (
    <button
      className={className}
      data-active={isActive}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
  SidebarFooter: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
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

jest.mock("contexts/AppStateContext", () => ({
  useAppState: () => ({
    chatSessions: [
      {
        id: "chat-1",
        title: "Test Chat 1",
        updatedAt: Date.now(),
      },
      {
        id: "chat-2",
        title: "Test Chat 2",
        updatedAt: Date.now(),
      },
    ],
    currentChatId: "chat-1",
    createNewChat: mockCreateNewChat,
    switchToChat: mockSwitchToChat,
    deleteChat: mockDeleteChat,
    restoreCurrentChecklist: mockRestoreCurrentChecklist,
  }),
}));

const renderWithRouter = (component: React.ReactElement) =>
  render(
    <MemoryRouter
      future={{
        // eslint-disable-next-line camelcase
        v7_startTransition: true,
        // eslint-disable-next-line camelcase
        v7_relativeSplatPath: true,
      }}
    >
      {component}
    </MemoryRouter>,
  );

describe("DssSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders ASQ brand link", () => {
    renderWithRouter(<DssSidebar />);

    const brandLink = screen.getByLabelText("Gå til ASQ forsiden");
    expect(brandLink).toHaveAttribute("href", "/");
  });

  test("renders all menu items", () => {
    renderWithRouter(<DssSidebar />);

    expect(screen.getByText("Ny samtale")).toBeInTheDocument();
    expect(screen.getByText("Om personvern")).toBeInTheDocument();
    expect(screen.getByText("Sjekkliste")).toBeInTheDocument();
    expect(screen.getByText("Eksempler")).toBeInTheDocument();
  });

  test("creates new chat and navigates when clicking Ny samtale", () => {
    renderWithRouter(<DssSidebar />);

    const newChatButton = screen.getByRole("button", { name: /Ny samtale/i });
    fireEvent.click(newChatButton);

    expect(mockCreateNewChat).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("restores checklist and navigates when clicking Sjekkliste", () => {
    renderWithRouter(<DssSidebar />);

    const checklistButton = screen.getByRole("button", { name: /Sjekkliste/i });
    fireEvent.click(checklistButton);

    expect(mockRestoreCurrentChecklist).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/sjekkliste");
  });

  test("renders tidligere samtaler section with chat sessions", () => {
    renderWithRouter(<DssSidebar />);

    expect(screen.getByText("Tidligere samtaler")).toBeInTheDocument();
    expect(screen.getByText("Test Chat 1")).toBeInTheDocument();
    expect(screen.getByText("Test Chat 2")).toBeInTheDocument();
  });

  test("switches to chat when clicking on a chat session", () => {
    renderWithRouter(<DssSidebar />);

    const chatButtons = screen.getAllByRole("button", { name: /Test Chat 2/i });
    const chatButton = chatButtons.find(
      (btn) => !btn.getAttribute("aria-label")?.includes("Slett"),
    );
    fireEvent.click(chatButton!);

    expect(mockSwitchToChat).toHaveBeenCalledWith("chat-2");
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("deletes chat when clicking delete button", () => {
    renderWithRouter(<DssSidebar />);

    const deleteButton = screen.getByLabelText("Slett samtale: Test Chat 1");
    fireEvent.click(deleteButton);

    expect(mockDeleteChat).toHaveBeenCalledWith("chat-1");
    expect(mockSwitchToChat).not.toHaveBeenCalled();
  });

  test("renders footer with contact information", () => {
    renderWithRouter(<DssSidebar />);

    expect(screen.getByText("asq@trondheim.kommune.no")).toBeInTheDocument();
    expect(screen.getByText("72 54 00 00")).toBeInTheDocument();
    expect(screen.getByText("Munkegata 1, 7013 Trondheim")).toBeInTheDocument();
  });

  test("renders external link to personvern page", () => {
    renderWithRouter(<DssSidebar />);

    const link = screen.getByLabelText(/Les mer om personvern/i);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
