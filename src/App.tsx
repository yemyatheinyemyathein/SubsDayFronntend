import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Subscriptions from '@/pages/Subscriptions';
import Calendar from '@/pages/Calendar';
import Stats from '@/pages/Stats';
import Settings from '@/pages/Settings';
import SharedSubscriptions from '@/pages/SharedSubscriptions';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

const App: React.FC = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const initTheme = useUIStore((state) => state.initTheme);

  useEffect(() => {
    checkAuth();
    initTheme();
  }, [checkAuth, initTheme]);

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [isAuthenticated, queryClient]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            padding: '12px 16px',
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#065f46',
              color: '#d1fae5',
              border: '1px solid #10b981',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            style: {
              background: '#7f1d1d',
              color: '#fee2e2',
              border: '1px solid #ef4444',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="shared" element={<SharedSubscriptions />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
