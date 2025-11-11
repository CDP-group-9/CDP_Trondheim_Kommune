import type { ChecklistPayload } from "../../types/Checklist";
import { ChecklistService, ChecklistServiceError } from "../checklistService";

// Unmock the service for this test file
jest.unmock("../checklistService");

const mockFetch = jest.fn();
(global as typeof globalThis & { fetch: jest.Mock }).fetch = mockFetch;

describe("ChecklistService", () => {
  let service: ChecklistService;

  beforeEach(() => {
    // Reset singleton instance
    (ChecklistService as any).instance = undefined;
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getInstance", () => {
    test("creates a singleton instance", () => {
      const instance1 = ChecklistService.getInstance();
      const instance2 = ChecklistService.getInstance();
      expect(instance1).toBe(instance2);
    });

    test("uses default baseUrl if not provided", () => {
      const instance = ChecklistService.getInstance();
      expect(instance).toBeDefined();
    });

    test("uses provided baseUrl", () => {
      const customUrl = "http://example.com/api/";
      const instance = ChecklistService.getInstance(customUrl);
      expect(instance).toBeDefined();
    });
  });

  describe("convertToString", () => {
    beforeEach(() => {
      service = ChecklistService.getInstance();
    });

    test("successfully converts checklist payload", async () => {
      const mockPayload: ChecklistPayload = {
        selectedOption: "motta",
        contextData: {
          projectSummary: "Test project",
          department: "IT",
          status: "active",
          purpose: "testing",
        },
        handlingData: {
          purpose: "Test purpose",
          selectedDataTypes: ["name"],
          personCount: 10,
          retentionTime: 12,
          collectionMethods: ["form"],
          recipient: "Test recipient",
          recipientType: "internal",
          sharingLegalBasis: "consent",
          shareFrequency: 1,
          dataTransferMethods: ["api"],
          selectedDataSources: ["database"],
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
          privacyRisk: 1,
          unauthAccess: 1,
          dataLoss: 1,
          reidentification: 1,
          employeeConcern: false,
          writtenConcern: "",
          regulatoryConcern: "",
        },
      };

      const mockResponse = { response: "Converted checklist text" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.convertToString(mockPayload);

      expect(result).toBe("Converted checklist text");
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(mockPayload),
        }),
      );
    });

    test("includes CSRF token in headers when provided", async () => {
      const mockPayload: ChecklistPayload = {
        selectedOption: null,
        contextData: {
          projectSummary: "",
          department: "",
          status: "",
          purpose: "",
        },
        handlingData: {
          purpose: "",
          selectedDataTypes: [],
          personCount: 1,
          retentionTime: 0,
          collectionMethods: [],
          recipient: "",
          recipientType: "",
          sharingLegalBasis: "",
          shareFrequency: 0,
          dataTransferMethods: [],
          selectedDataSources: [],
        },
        legalBasisData: {
          legalBasis: "",
          handlesSensitiveData: false,
          selectedSensitiveDataReason: [],
          statutoryTasks: "",
        },
        involvedPartiesData: {
          registeredGroups: [],
          usesExternalProcessors: false,
          externalProcessors: "",
          employeeAccess: "",
          sharesWithOthers: false,
          sharedWith: "",
        },
        techData: {
          storage: "",
          security: [],
          integrations: false,
          integrationDetails: "",
          automated: false,
          automatedDescription: "",
        },
        riskConcernData: {
          privacyRisk: 1,
          unauthAccess: 1,
          dataLoss: 1,
          reidentification: 1,
          employeeConcern: false,
          writtenConcern: "",
          regulatoryConcern: "",
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: "test" }),
      });

      await service.convertToString(mockPayload, {
        csrfToken: "test-csrf-token",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            "X-CSRFTOKEN": "test-csrf-token",
          },
        }),
      );
    });

    test("throws ChecklistServiceError when response is not ok", async () => {
      const mockPayload: any = { selectedOption: null };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: "Invalid data" }),
      });

      const error = await service.convertToString(mockPayload).catch((e) => e);

      expect(error).toBeInstanceOf(ChecklistServiceError);
      expect(error.message).toBe("Invalid data");
    });

    test("throws ChecklistServiceError when response format is invalid", async () => {
      const mockPayload: any = { selectedOption: null };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      const error = await service.convertToString(mockPayload).catch((e) => e);

      expect(error).toBeInstanceOf(ChecklistServiceError);
      expect(error.message).toBe("Invalid response format");
    });

    test("throws ChecklistServiceError on network error", async () => {
      const mockPayload: any = { selectedOption: null };

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(service.convertToString(mockPayload)).rejects.toThrow(
        ChecklistServiceError,
      );
      await expect(service.convertToString(mockPayload)).rejects.toThrow(
        "No connection to server",
      );
    });

    test("uses default error message when API error has no message", async () => {
      const mockPayload: any = { selectedOption: null };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(service.convertToString(mockPayload)).rejects.toThrow(
        "Failed to convert checklist",
      );
    });
  });

  describe("ChecklistServiceError", () => {
    test("creates error with message and code", () => {
      const error = new ChecklistServiceError("Test error", "TEST_CODE");
      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_CODE");
      expect(error.name).toBe("ChecklistServiceError");
    });

    test("creates error without code", () => {
      const error = new ChecklistServiceError("Test error");
      expect(error.message).toBe("Test error");
      expect(error.code).toBeUndefined();
    });
  });
});
