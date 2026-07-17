import api from '@/lib/axios';

export const ChatService = {
  getHistory: async (sessionId: string) => {
    const response = await api.get(`/chat/history/${sessionId}`);
    return response.data;
  }
};
