import { useSupabaseAdmin } from '../hooks/useSupabaseAdmin';
import SupabaseAuth from './admin/SupabaseAuth';
import SupabaseDashboard from './admin/SupabaseDashboard';

export default function SupabaseAdminPanel() {
  const { isAuthenticated, isLoading, login, logout } = useSupabaseAdmin();

  if (!isAuthenticated) {
    return <SupabaseAuth onLogin={login} isLoading={isLoading} />;
  }

  return <SupabaseDashboard onLogout={logout} />;
}