export interface ChatMessage {
  id: string;
  type: "user" | "bot";
  message: string;
}
