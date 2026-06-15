// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage       from './pages/LoginPage';
import DashboardPage   from './pages/DashboardPage';
import WorkflowsPage   from './pages/WorkflowsPage';
import WorkflowDetail  from './pages/WorkflowDetail';
import NewWorkflow     from './pages/NewWorkflow';
import SearchPage      from './pages/SearchPage';
import Layout          from './components/Layout';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } }
});

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"          element={<DashboardPage />} />
              <Route path="workflows"          element={<WorkflowsPage />} />
              <Route path="workflows/new"      element={<NewWorkflow />} />
              <Route path="workflows/:id"      element={<WorkflowDetail />} />
              <Route path="search"             element={<SearchPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1A1A2E', color: '#E8E8EF', border: '1px solid #3A3A55' },
            success: { iconTheme: { primary: '#2DC98A', secondary: '#0D0D14' } },
            error:   { iconTheme: { primary: '#F05252', secondary: '#0D0D14' } },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
