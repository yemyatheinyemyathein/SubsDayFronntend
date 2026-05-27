import { create } from 'zustand';
import { authApi, setAuthStoreRef } from '@/services/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, baseCurrency?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  setUser: (user) => set({ user }),
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const data = await authApi.login({ email, password });
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ isLoading: false });
      throw new Error('Invalid credentials');
    }
  },
  register: async (name: string, email: string, password: string, baseCurrency?: string) => {
    set({ isLoading: true });
    try {
      const data = await authApi.register({ name, email, password, baseCurrency });
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ isLoading: false });
      throw new Error('Registration failed');
    }
  },
  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue logout even if server call fails
    }
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    try {
      const data = await authApi.getMe();
      set({ user: data.user, isAuthenticated: true, isInitializing: false });
    } catch {
      set({ user: null, isAuthenticated: false, isInitializing: false });
    }
  },
}));

setAuthStoreRef({ logout: () => useAuthStore.getState().logout() });
