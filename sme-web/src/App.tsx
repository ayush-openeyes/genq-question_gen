import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HistoryProvider } from './context/HistoryContext';
import { ToastProvider } from './components/shared/Toast';
import ErrorBoundary from './components/shared/ErrorBoundary';
import ScrollToTop from './components/shared/ScrollToTop';
import CustomCursor from './components/shared/CustomCursor';
import Layout from './components/layout/Layout';
import { queryClient } from './lib/query';
import QuestionGenerator from './pages/QuestionGenerator';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/generate" replace />} />
        <Route path="/generate" element={<QuestionGenerator />} />
        <Route path="*" element={<Navigate to="/generate" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <AuthProvider>
            <HistoryProvider>
              <ToastProvider>
                <ErrorBoundary>
                  <div className="noise-overlay" aria-hidden="true" />
                  <CustomCursor />
                  <ScrollToTop />
                  <AppRoutes />
                </ErrorBoundary>
              </ToastProvider>
            </HistoryProvider>
          </AuthProvider>
        </BrowserRouter>
      </MotionConfig>
    </QueryClientProvider>
  );
}
