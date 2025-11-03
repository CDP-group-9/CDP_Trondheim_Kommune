const DB_NAME = "TrondheimKommuneDB";
const DB_VERSION = 1;

export interface ChatSession {
  id: string;
  title: string;
  messages: Array<{ id: string; type: "user" | "bot"; message: string }>;
  checklistId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChecklistSession {
  id: string;
  title: string;
  data: any;
  chatId?: string;
  createdAt: number;
  updatedAt: number;
}

class StorageManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.addEventListener("error", () => reject(request.error));
      request.addEventListener("success", () => {
        this.db = request.result;
        resolve();
      });

      request.addEventListener("upgradeneeded", (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains("chatSessions")) {
          const chatStore = db.createObjectStore("chatSessions", {
            keyPath: "id",
          });
          chatStore.createIndex("updatedAt", "updatedAt", { unique: false });
        }

        if (!db.objectStoreNames.contains("checklistSessions")) {
          const checklistStore = db.createObjectStore("checklistSessions", {
            keyPath: "id",
          });
          checklistStore.createIndex("updatedAt", "updatedAt", {
            unique: false,
          });
        }
      });
    });
  }

  async getAllChatSessions(): Promise<ChatSession[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["chatSessions"], "readonly");
      const store = transaction.objectStore("chatSessions");
      const index = store.index("updatedAt");
      const request = index.openCursor(null, "prev");

      const sessions: ChatSession[] = [];

      request.addEventListener("success", () => {
        const cursor = request.result;
        if (cursor) {
          sessions.push(cursor.value);
          cursor.continue();
        } else {
          resolve(sessions);
        }
      });

      request.addEventListener("error", () => reject(request.error));
    });
  }

  async getChatSession(id: string): Promise<ChatSession | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["chatSessions"], "readonly");
      const store = transaction.objectStore("chatSessions");
      const request = store.get(id);

      request.addEventListener("success", () =>
        resolve(request.result || null),
      );
      request.addEventListener("error", () => reject(request.error));
    });
  }

  async saveChatSession(session: ChatSession): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["chatSessions"], "readwrite");
      const store = transaction.objectStore("chatSessions");
      const request = store.put(session);

      request.addEventListener("success", () => resolve());
      request.addEventListener("error", () => reject(request.error));
    });
  }

  async deleteChatSession(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["chatSessions"], "readwrite");
      const store = transaction.objectStore("chatSessions");
      const request = store.delete(id);

      request.addEventListener("success", () => resolve());
      request.addEventListener("error", () => reject(request.error));
    });
  }

  async getChecklistSession(id: string): Promise<ChecklistSession | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ["checklistSessions"],
        "readonly",
      );
      const store = transaction.objectStore("checklistSessions");
      const request = store.get(id);

      request.addEventListener("success", () =>
        resolve(request.result || null),
      );
      request.addEventListener("error", () => reject(request.error));
    });
  }

  async saveChecklistSession(session: ChecklistSession): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ["checklistSessions"],
        "readwrite",
      );
      const store = transaction.objectStore("checklistSessions");
      const request = store.put(session);

      request.addEventListener("success", () => resolve());
      request.addEventListener("error", () => reject(request.error));
    });
  }

  async deleteChecklistSession(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ["checklistSessions"],
        "readwrite",
      );
      const store = transaction.objectStore("checklistSessions");
      const request = store.delete(id);

      request.addEventListener("success", () => resolve());
      request.addEventListener("error", () => reject(request.error));
    });
  }
}

export const storage = new StorageManager();
