import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import PageTransition from '../shared/PageTransition';
import ErrorBoundary from '../shared/ErrorBoundary';
import Spinner from '../ui/Spinner';

const PAGE_TITLES = {
  '/':                      'Question Generator',
  '/dashboard':             'Question Generator',
  '/runs/new':              'New Run',
  '/runs':                  'My Runs',
  '/lists':                 'My Lists',
  '/generate':              'Question Generator',
  '/question-bank':         'Question Bank',
  '/review-queue':          'Review & Approval Queue',
  '/assessments/new':       'Assessment Builder',
  '/projects':              'Projects',
  '/analytics':             'Analytics & Feedback',
  '/notifications':         'Notifications',
  '/settings/users':        'User Management',
  '/settings/roles':        'Roles & Permissions',
  '/settings/organization': 'Organization Settings',
  '/settings/audit-log':    'Audit Log',
  '/settings/integrations': 'Integrations & API',
  '/admin':                 'Super Admin Panel',
};

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Spinner size="lg" />
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();

  const title = Object.entries(PAGE_TITLES).find(([path]) => pathname === path || (path !== '/' && pathname.startsWith(path + '/') && !pathname.startsWith('/runs/') && !pathname.startsWith('/lists/')))?.[1]
    ?? (pathname.startsWith('/runs/')      ? 'Run Results'
      : pathname.startsWith('/lists/')     ? 'List Detail'
      : pathname.includes('/questions/')   ? 'Question Editor'
      : pathname.includes('/assessments/') ? 'Assessment Builder'
      : pathname.includes('/projects/')    ? 'Project Detail'
      : 'GenQue');

  return (
    <div className="flex min-h-screen bg-lgray">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header pageTitle={title} />
        <main id="main-content" className="flex-1 p-6 overflow-auto" tabIndex={-1}>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Outlet />
              </PageTransition>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
