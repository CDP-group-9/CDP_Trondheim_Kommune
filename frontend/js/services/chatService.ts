/**
 * Chat Service - Handles all chat-related API communications
 */

import type { ChatRequest, ChatResponse } from "../api/types.gen";

export class ChatServiceError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ChatServiceError";
  }
}

export class ChatService {
  private static instance: ChatService;

  private baseUrl: string;

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  static getInstance(baseUrl = "/api/chat/chat/"): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService(baseUrl);
    }
    return ChatService.instance;
  }

  async sendMessage(
    request: ChatRequest,
    options?: {
      signal?: AbortSignal;
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
        signal: options?.signal,
        body: JSON.stringify(request),
      });

      const data: ChatResponse = await response.json();

      if (!response.ok) {
        throw new ChatServiceError("Failed to send message", "API_ERROR");
      }

      if (data.response === undefined) {
        throw new ChatServiceError(
          "Invalid response format",
          "INVALID_RESPONSE",
        );
      }

      return data.response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ChatServiceError("Request was cancelled", "ABORTED");
        }
        if (error instanceof ChatServiceError) {
          throw error;
        }
      }
      throw new ChatServiceError("No connection to server", "NETWORK_ERROR");
    }
  }
}
