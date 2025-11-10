import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { DssChecklistLink } from "../DssChecklistLink";

const mockNavigate = jest.fn();
const mockSwitchToChecklist = jest.fn();
const mockGetChatChecklistId = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("contexts/AppStateContext", () => ({
  useAppState: () => ({
    currentChatId: "chat-123",
    switchToChecklist: mockSwitchToChecklist,
    getChatChecklistId: mockGetChatChecklistId,
  }),
}));

jest.mock("lucide-react", () => ({
  FileText: ({ className }: { className?: string }) => (
    <div className={className}>FileText</div>
  ),
}));

describe("DssChecklistLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when there is no checklist linked", () => {
    mockGetChatChecklistId.mockReturnValue(null);

    const { container } = render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <DssChecklistLink />
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });

  test("renders when checklist is linked to chat", () => {
    mockGetChatChecklistId.mockReturnValue("checklist-456");

    render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <DssChecklistLink />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Denne samtalen er koblet til en sjekkliste"),
    ).toBeInTheDocument();
    expect(screen.getByText("Rediger sjekkliste")).toBeInTheDocument();
  });

  test("switches to checklist and navigates when button is clicked", () => {
    mockGetChatChecklistId.mockReturnValue("checklist-456");

    render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <DssChecklistLink />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", {
      name: "Rediger sjekkliste tilknyttet denne samtalen",
    });
    fireEvent.click(button);

    expect(mockSwitchToChecklist).toHaveBeenCalledWith("checklist-456");
    expect(mockNavigate).toHaveBeenCalledWith("/sjekkliste");
    expect(mockGetChatChecklistId).toHaveBeenCalledWith("chat-123");
  });
});
