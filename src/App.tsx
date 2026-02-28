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
import { GroupDetailPage } from '@/pages/GroupDetailPage';
import { KYCSubmissionPage } from '@/pages/KYCSubmissionPage';
import { NomineeManagementPage } from '@/pages/NomineeManagementPage';
import { MyGroupsPage } from '@/pages/MyGroupsPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { WalletPage } from '@/pages/WalletPage';
import { ProfilePage } from '@/pages/ProfilePage';
import NotFound from '@/pages/NotFound';
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
            <Route path="/groups/:groupId" element={<GroupDetailPage />} />
            
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path={ROUTES.MY_GROUPS}
              element={
                <ProtectedRoute>
                  <MyGroupsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path={ROUTES.TRANSACTIONS}
              element={
                <ProtectedRoute>
                  <TransactionsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path={ROUTES.WALLET}
              element={
                <ProtectedRoute>
                  <WalletPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/kyc"
              element={
                <ProtectedRoute>
                  <KYCSubmissionPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/nominees"
              element={
                <ProtectedRoute>
                  <NomineeManagementPage />
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

export default App;
