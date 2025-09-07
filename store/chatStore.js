// store/chatStore.js
import { create } from 'zustand';

const useChatStore = create((set) => ({
  messages: [],
  user: null,
  token: null,
  userId: null,
  shouldScrollToBottom: true,
  hasMoreMessages: true,

  // Actions
  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessageStatus: (tempId, status) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.tempId === tempId ? { ...msg, status } : msg
      ),
    })),

  setUser: (user) => set({ user }),
  setUserId: (userId) => set({ userId }),
  setToken: (token) => set({ token }),
  clearMessages: () => set({ messages: [] }),
  setShouldScrollToBottom: (newValue) =>
    set({ shouldScrollToBottom: newValue }),
  setHasMoreMessages: (newValue) => set({ hasMoreMessages: newValue }),
}));

export default useChatStore;
