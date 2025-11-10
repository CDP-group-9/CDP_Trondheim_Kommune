import "@testing-library/jest-dom";
import "jest-axe/extend-expect";

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }) => children,
}));

jest.mock("./frontend/js/services/checklistService", () => ({
  ChecklistService: {
    getInstance: jest.fn(() => ({
      convertToString: jest.fn().mockResolvedValue("Mocked checklist string"),
    })),
  },
  ChecklistServiceError: class ChecklistServiceError extends Error {
    constructor(message, code) {
      super(message);
      this.code = code;
      this.name = "ChecklistServiceError";
    }
  },
}));

jest.mock("./frontend/js/utils/storage", () => ({
  storage: {
    init: jest.fn().mockResolvedValue(undefined),
    getAllChatSessions: jest.fn().mockResolvedValue([]),
    getChatSession: jest.fn().mockResolvedValue(null),
    saveChatSession: jest.fn().mockResolvedValue(undefined),
    deleteChatSession: jest.fn().mockResolvedValue(undefined),
    getChecklistSession: jest.fn().mockResolvedValue(null),
    saveChecklistSession: jest.fn().mockResolvedValue(undefined),
    deleteChecklistSession: jest.fn().mockResolvedValue(undefined),
  },
}));

if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}
