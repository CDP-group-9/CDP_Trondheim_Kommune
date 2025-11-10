/**
 * Checklist Service - Handles all checklist-related API communications
 */

import type { ChecklistPayload } from "../types/Checklist";

export interface ChecklistToStringResponse {
  response?: string;
  error?: string;
}

export class ChecklistServiceError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ChecklistServiceError";
  }
}

export class ChecklistService {
  private static instance: ChecklistService;

  private baseUrl: string;

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  static getInstance(
    baseUrl = "http://localhost:8000/api/checklist/",
  ): ChecklistService {
    if (!ChecklistService.instance) {
      ChecklistService.instance = new ChecklistService(baseUrl);
    }
    return ChecklistService.instance;
  }

  async convertToString(
    payload: ChecklistPayload,
    options?: {
      csrfToken?: string;
    },
  ): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(options?.csrfToken && {
            "X-CSRFTOKEN": options.csrfToken,
          }),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data: ChecklistToStringResponse = await response.json();

      if (!response.ok) {
        throw new ChecklistServiceError(
          data.error || "Failed to convert checklist",
          "API_ERROR",
        );
      }

      if (data.response === undefined) {
        throw new ChecklistServiceError(
          "Invalid response format",
          "INVALID_RESPONSE",
        );
      }

      return data.response;
    } catch (error) {
      if (error instanceof ChecklistServiceError) {
        throw error;
      }
      throw new ChecklistServiceError(
        "No connection to server",
        "NETWORK_ERROR",
      );
    }
  }
}
