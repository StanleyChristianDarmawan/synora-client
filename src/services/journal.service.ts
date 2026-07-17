import api from '@/lib/axios';

export const JournalService = {
  getJournals: async (limit: number = 20, skip: number = 0) => {
    const response = await api.get(`/journals/?limit=${limit}&skip=${skip}`);
    return response.data;
  },
  getJournal: async (journalId: string) => {
    const response = await api.get(`/journals/${journalId}`);
    return response.data;
  },
  submitJournal: async (data: any) => {
    const response = await api.post('/journals/', data);
    return response.data;
  }
};
