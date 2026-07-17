import api from '@/lib/axios';

export const ChatService = {
  getHistory: async (sessionId: string) => {
    const response = await api.get(`/chat/history/${sessionId}`);
    return response.data;
  },
  getSessions: async () => {
    const response = await api.get('/chat/sessions');
    return response.data;
  },
  updateSession: async (sessionId: string, title: string) => {
    const response = await api.patch(`/chat/sessions/${sessionId}`, { title });
    return response.data;
  },
  deleteSession: async (sessionId: string) => {
    const response = await api.delete(`/chat/sessions/${sessionId}`);
    return response.data;
  }
};
