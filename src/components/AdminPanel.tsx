import { useAdmin } from '../hooks/useAdmin';
import AdminAuth from './admin/AdminAuth';
import AdminDashboard from './admin/AdminDashboard';

export default function AdminPanel() {
  const { isAuthenticated, isLoading, login, logout } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuth onLogin={login} />;
  }

  return <AdminDashboard onLogout={logout} />;
}