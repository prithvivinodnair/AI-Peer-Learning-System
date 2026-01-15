// In-memory store for active SSE connections
type MessageListener = (message: any) => void;

class MessageStore {
  private listeners: Map<string, Set<MessageListener>> = new Map();

  subscribe(userId: string, callback: MessageListener) {
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, new Set());
    }
    this.listeners.get(userId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const userListeners = this.listeners.get(userId);
      if (userListeners) {
        userListeners.delete(callback);
        if (userListeners.size === 0) {
          this.listeners.delete(userId);
        }
      }
    };
  }

  broadcast(userId: string, message: any) {
    const userListeners = this.listeners.get(userId);
    if (userListeners) {
      userListeners.forEach(callback => callback(message));
    }
  }

  getActiveConnections() {
    return this.listeners.size;
  }
}

export const messageStore = new MessageStore();
