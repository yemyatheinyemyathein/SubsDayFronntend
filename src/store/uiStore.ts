import { create } from 'zustand';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  initTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  sidebarOpen: false,
  setTheme: (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  initTheme: () => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = (saved || (prefersDark ? 'dark' : 'light')) as 'light' | 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
}));
