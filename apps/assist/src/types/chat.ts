

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: number;
  sender: "user" | "bot";
  userId?: string;
  sentiment?: "positive" | "negative" | "neutral";
  language?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  startedAt: number;
  lastMessageAt: number;
  messages: ChatMessage[];
}

export interface UserPreferences {
  language: string;
  theme: "light" | "dark" | "system";
  notifications: boolean;
  autoTranslate: boolean;
}
