import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { GroupsPage } from '@/pages/GroupsPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { AdminKYCPage } from '@/pages/AdminKYCPage';
import { AdminGroupsPage } from '@/pages/AdminGroupsPage';
import { AdminClaimsPage } from '@/pages/AdminClaimsPage';
import { AdminUsersPage } from '@/pages/AdminUsersPage';
import { AdminAuditPage } from '@/pages/AdminAuditPage';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/auth';
import { ROUTES } from '@/constants';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  if (!isAdmin(user)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const [showLoading, setShowLoading] = useState(true);

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.GROUPS} element={<GroupsPage />} />
            
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path={ROUTES.ADMIN}
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            
            <Route
              path="/admin/kyc"
              element={
                <AdminRoute>
                  <AdminKYCPage />
                </AdminRoute>
              }
            />
            
            <Route
              path={ROUTES.ADMIN_GROUPS}
              element={
                <AdminRoute>
                  <AdminGroupsPage />
                </AdminRoute>
              }
            />
            
            <Route
              path={ROUTES.ADMIN_CLAIMS}
              element={
                <AdminRoute>
                  <AdminClaimsPage />
                </AdminRoute>
              }
            />
            
            <Route
              path={ROUTES.ADMIN_USERS}
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
            
            <Route
              path={ROUTES.ADMIN_LOGS}
              element={
                <AdminRoute>
                  <AdminAuditPage />
                </AdminRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-trust">404</h1>
        <p className="text-2xl text-gray-600 mb-8">पेज नहीं मिला</p>
        <a href={ROUTES.HOME} className="btn-primary inline-block">
          होम पर जाएं
        </a>
      </div>
    </div>
  );
}

export default App;
