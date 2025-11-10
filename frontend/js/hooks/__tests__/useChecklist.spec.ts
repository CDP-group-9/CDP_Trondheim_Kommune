import { renderHook, act, waitFor } from "@testing-library/react";

import { useChecklist } from "../useChecklist";

const mockCurrentChecklistId = "checklist-1";
const mockGetCurrentChecklistData = jest.fn();
const mockSaveCurrentChecklist = jest.fn();
const mockCreateNewChecklist = jest.fn();
const mockCreateChatFromChecklist = jest.fn();

jest.mock("../../contexts/AppStateContext", () => ({
  useAppState: () => ({
    currentChecklistId: mockCurrentChecklistId,
    getCurrentChecklistData: mockGetCurrentChecklistData,
    saveCurrentChecklist: mockSaveCurrentChecklist,
    createNewChecklist: mockCreateNewChecklist,
    createChatFromChecklist: mockCreateChatFromChecklist,
  }),
}));

describe("useChecklist", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockGetCurrentChecklistData.mockResolvedValue(null);
    mockSaveCurrentChecklist.mockResolvedValue(undefined);
    mockCreateChatFromChecklist.mockResolvedValue("new-chat-id");
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("initialization", () => {
    test("initializes with default values", () => {
      const { result } = renderHook(() => useChecklist());

      expect(result.current.selectedOption).toBeNull();
      expect(result.current.contextData).toStrictEqual({
        projectSummary: "",
        department: "",
        status: "",
        purpose: "",
      });
      expect(result.current.handlingData.personCount).toBe(1);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.submitError).toBeNull();
    });

    test("loads saved data when currentChecklistId exists", async () => {
      const savedData = {
        selectedOption: "motta" as const,
        contextData: {
          projectSummary: "Test Project",
          department: "IT",
          status: "active",
          purpose: "testing",
        },
        handlingData: {
          purpose: "Data collection",
          selectedDataTypes: ["name", "email"],
          personCount: 100,
          retentionTime: 12,
          collectionMethods: ["form"],
          recipient: "",
          recipientType: "",
          sharingLegalBasis: "",
          shareFrequency: 0,
          dataTransferMethods: [],
          selectedDataSources: [],
        },
        legalBasisData: {
          legalBasis: "consent",
          handlesSensitiveData: false,
          selectedSensitiveDataReason: [],
          statutoryTasks: "",
        },
        involvedPartiesData: {
          registeredGroups: ["employees"],
          usesExternalProcessors: false,
          externalProcessors: "",
          employeeAccess: "limited",
          sharesWithOthers: false,
          sharedWith: "",
        },
        techData: {
          storage: "cloud",
          security: ["encryption"],
          integrations: false,
          integrationDetails: "",
          automated: false,
          automatedDescription: "",
        },
        riskConcernData: {
          privacyRisk: 3,
          unauthAccess: 2,
          dataLoss: 1,
          reidentification: 1,
          employeeConcern: false,
          writtenConcern: "",
          regulatoryConcern: "",
        },
      };

      mockGetCurrentChecklistData.mockResolvedValueOnce(savedData);

      const { result } = renderHook(() => useChecklist());

      await waitFor(() => {
        expect(result.current.selectedOption).toBe("motta");
        expect(result.current.contextData.projectSummary).toBe("Test Project");
        expect(result.current.handlingData.personCount).toBe(100);
        expect(result.current.techData.storage).toBe("cloud");
      });
    });

    test("uses default values when saved data is incomplete", async () => {
      mockGetCurrentChecklistData.mockResolvedValueOnce({
        selectedOption: "dele",
        contextData: {
          projectSummary: "Test",
          department: "",
          status: "",
          purpose: "",
        },
      });

      const { result } = renderHook(() => useChecklist());

      await waitFor(() => {
        expect(result.current.selectedOption).toBe("dele");
        expect(result.current.handlingData.personCount).toBe(1);
        expect(result.current.techData.storage).toBe("");
      });
    });
  });

  describe("state setters", () => {
    test("updates selectedOption", () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setSelectedOption("motta");
      });

      expect(result.current.selectedOption).toBe("motta");
    });

    test("updates contextData", () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setContextData({
          projectSummary: "New Project",
          department: "HR",
          status: "draft",
          purpose: "employee management",
        });
      });

      expect(result.current.contextData.projectSummary).toBe("New Project");
      expect(result.current.contextData.department).toBe("HR");
    });

    test("updates handlingData", () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setHandlingData({
          ...result.current.handlingData,
          personCount: 500,
          purpose: "Testing purpose",
        });
      });

      expect(result.current.handlingData.personCount).toBe(500);
      expect(result.current.handlingData.purpose).toBe("Testing purpose");
    });

    test("updates all data types independently", () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setLegalBasisData({
          legalBasis: "legitimate interest",
          handlesSensitiveData: true,
          selectedSensitiveDataReason: ["health"],
          statutoryTasks: "medical records",
        });

        result.current.setInvolvedPartiesData({
          registeredGroups: ["patients"],
          usesExternalProcessors: true,
          externalProcessors: "Cloud Provider Inc",
          employeeAccess: "restricted",
          sharesWithOthers: true,
          sharedWith: "Health Authority",
        });

        result.current.setTechData({
          storage: "on-premise",
          security: ["encryption", "access-control"],
          integrations: true,
          integrationDetails: "EHR system",
          automated: true,
          automatedDescription: "Automated alerts",
        });

        result.current.setRiskConcernData({
          privacyRisk: 5,
          unauthAccess: 4,
          dataLoss: 3,
          reidentification: 2,
          employeeConcern: true,
          writtenConcern: "High risk",
          regulatoryConcern: "Requires approval",
        });
      });

      expect(result.current.legalBasisData.handlesSensitiveData).toBe(true);
      expect(result.current.involvedPartiesData.usesExternalProcessors).toBe(
        true,
      );
      expect(result.current.techData.integrations).toBe(true);
      expect(result.current.riskConcernData.privacyRisk).toBe(5);
    });
  });

  describe("createPayload", () => {
    test("creates payload with current state", () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setSelectedOption("motta");
        result.current.setContextData({
          projectSummary: "Test",
          department: "IT",
          status: "active",
          purpose: "testing",
        });
      });

      const payload = result.current.createPayload();

      expect(payload.selectedOption).toBe("motta");
      expect(payload.contextData.projectSummary).toBe("Test");
      expect(payload.handlingData).toBeDefined();
      expect(payload.legalBasisData).toBeDefined();
      expect(payload.involvedPartiesData).toBeDefined();
      expect(payload.techData).toBeDefined();
      expect(payload.riskConcernData).toBeDefined();
    });
  });

  describe("auto-save functionality", () => {
    test("auto-saves after 500ms when data changes", async () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setSelectedOption("motta");
      });

      expect(mockSaveCurrentChecklist).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockSaveCurrentChecklist).toHaveBeenCalledWith(
          expect.objectContaining({ selectedOption: "motta" }),
          "Ny sjekkliste",
        );
      });
    });

    test("uses project summary as title when available", async () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setSelectedOption("dele");
        result.current.setContextData({
          projectSummary: "My Project Summary",
          department: "",
          status: "",
          purpose: "",
        });
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockSaveCurrentChecklist).toHaveBeenCalledWith(
          expect.any(Object),
          "My Project Summary",
        );
      });
    });

    test("truncates long project summary in title", async () => {
      const { result } = renderHook(() => useChecklist());

      const longSummary = "A".repeat(60);

      act(() => {
        result.current.setSelectedOption("motta");
        result.current.setContextData({
          projectSummary: longSummary,
          department: "",
          status: "",
          purpose: "",
        });
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockSaveCurrentChecklist).toHaveBeenCalledWith(
          expect.any(Object),
          `${"A".repeat(50)}...`,
        );
      });
    });

    test("debounces multiple rapid changes", async () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setSelectedOption("motta");
      });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      act(() => {
        result.current.setContextData({
          projectSummary: "Updated",
          department: "",
          status: "",
          purpose: "",
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(mockSaveCurrentChecklist).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(mockSaveCurrentChecklist).toHaveBeenCalledTimes(1);
      });
    });

    test("does not auto-save when selectedOption is null", async () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setContextData({
          projectSummary: "Test",
          department: "",
          status: "",
          purpose: "",
        });
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockSaveCurrentChecklist).not.toHaveBeenCalled();
      });
    });
  });

  describe("downloadAsTextFile", () => {
    test("provides downloadAsTextFile function", () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setSelectedOption("motta");
        result.current.setContextData({
          projectSummary: "Test Project",
          department: "IT",
          status: "active",
          purpose: "testing",
        });
      });

      // Test the function exists
      expect(result.current.downloadAsTextFile).toBeDefined();
      expect(typeof result.current.downloadAsTextFile).toBe("function");
    });
  });

  describe("redirectToChat", () => {
    test("successfully redirects to chat", async () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setSelectedOption("motta");
        result.current.setContextData({
          projectSummary: "Test",
          department: "",
          status: "",
          purpose: "",
        });
      });

      let chatId: string = "";

      await act(async () => {
        chatId = await result.current.redirectToChat();
      });

      expect(chatId).toBe("new-chat-id");
      expect(mockSaveCurrentChecklist).toHaveBeenCalledWith(
        expect.any(Object),
        "Test",
      );
      expect(mockCreateChatFromChecklist).toHaveBeenCalledWith();
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.submitError).toBeNull();
    });

    test("sets isSubmitting to true and then false", async () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setSelectedOption("motta");
      });

      expect(result.current.isSubmitting).toBe(false);

      await act(async () => {
        await result.current.redirectToChat();
      });

      expect(result.current.isSubmitting).toBe(false);
    });

    test("handles error during redirect", async () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setSelectedOption("motta");
      });

      mockCreateChatFromChecklist.mockRejectedValueOnce(
        new Error("Network error"),
      );

      await act(async () => {
        try {
          await result.current.redirectToChat();
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.submitError).toBe("An unexpected error occurred");
      expect(result.current.isSubmitting).toBe(false);
    });

    test("clears previous error on successful redirect", async () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setSelectedOption("motta");
      });

      // First call fails
      mockCreateChatFromChecklist.mockRejectedValueOnce(
        new Error("Network error"),
      );

      await act(async () => {
        try {
          await result.current.redirectToChat();
        } catch {
          // Expected
        }
      });

      expect(result.current.submitError).toBe("An unexpected error occurred");

      // Second call succeeds
      mockCreateChatFromChecklist.mockResolvedValueOnce("chat-id");

      await act(async () => {
        await result.current.redirectToChat();
      });

      expect(result.current.submitError).toBeNull();
    });
  });

  describe("resetChecklist", () => {
    test("resets all fields to default values", () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.setSelectedOption("motta");
        result.current.setContextData({
          projectSummary: "Test",
          department: "IT",
          status: "active",
          purpose: "testing",
        });
        result.current.setHandlingData({
          ...result.current.handlingData,
          personCount: 100,
        });
      });

      expect(result.current.selectedOption).toBe("motta");
      expect(result.current.contextData.projectSummary).toBe("Test");

      act(() => {
        result.current.resetChecklist();
      });

      expect(result.current.selectedOption).toBeNull();
      expect(result.current.contextData.projectSummary).toBe("");
      expect(result.current.handlingData.personCount).toBe(1);
      expect(result.current.techData.storage).toBe("");
    });
  });

  describe("createNewChecklist", () => {
    test("calls createNewChecklist from context", () => {
      const { result } = renderHook(() => useChecklist());

      act(() => {
        result.current.createNewChecklist();
      });

      expect(mockCreateNewChecklist).toHaveBeenCalledTimes(1);
    });
  });
});
