import axios from 'axios';
import type { AuthResponse, Subscription, Stats } from '@/types';

const api = axios.create({
  baseURL: 'https://subs-day-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let storeRef: { logout?: () => void } = {};

export function setAuthStoreRef(ref: { logout: () => void }) {
  storeRef = ref;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthRoute = currentPath === '/login' || currentPath === '/register';
      const requestUrl = error.config?.url || 'https://subs-day-backend.vercel.app';
      const isMeEndpoint = requestUrl.includes('/auth/me');

      if (!isAuthRoute && !isMeEndpoint) {
        storeRef.logout?.();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: { name: string; email: string; password: string; baseCurrency?: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  getMe: async (): Promise<{ user: AuthResponse['user'] }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export const subscriptionApi = {
  getAll: async (params?: { status?: string; category?: string }): Promise<{ subscriptions: Subscription[] }> => {
    const response = await api.get('/subscriptions', { params });
    return response.data;
  },
  getById: async (id: string): Promise<{ subscription: Subscription }> => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },
  create: async (data: Partial<Subscription>): Promise<{ subscription: Subscription }> => {
    const response = await api.post('/subscriptions', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Subscription>): Promise<{ subscription: Subscription }> => {
    const response = await api.put(`/subscriptions/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },
  import: async (subscriptions: Partial<Subscription>[]): Promise<{ count: number; subscriptions: Subscription[] }> => {
    const response = await api.post('/subscriptions/import', { subscriptions });
    return response.data;
  },
  inviteMember: async (id: string, data: { email: string; shareAmount: number }): Promise<{ subscription: Subscription }> => {
    const response = await api.post(`/subscriptions/${id}/invite`, data);
    return response.data;
  },
  getShared: async (): Promise<{ subscriptions: Subscription[] }> => {
    const response = await api.get('/subscriptions/shared/mine');
    return response.data;
  },
  getInvitations: async (): Promise<{ invitations: Subscription[] }> => {
    const response = await api.get('/subscriptions/shared/invitations');
    return response.data;
  },
  acceptInvitation: async (id: string): Promise<{ subscription: Subscription }> => {
    const response = await api.post(`/subscriptions/${id}/accept`);
    return response.data;
  },
  resendInvitation: async (id: string, email: string): Promise<{ message: string }> => {
    const response = await api.post(`/subscriptions/${id}/resend-invite`, { email });
    return response.data;
  },
  removeMember: async (id: string, memberEmail: string): Promise<{ subscription: Subscription }> => {
    const response = await api.delete(`/subscriptions/${id}/members/${memberEmail}`);
    return response.data;
  },
};

export const statsApi = {
  getStats: async (): Promise<{ stats: Stats }> => {
    const response = await api.get('/stats');
    return response.data;
  },
};

export default api;
