import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { MainLayout } from '../shared/components/layout/MainLayout';
import { HomePage } from '../features/home/pages/HomePage';
import { AdminPage } from '../features/admin/pages/AdminPage';
import { IncomesPage } from '../features/incomes/pages/IncomesPage';
import { ExpensesPage } from '../features/expenses/pages/ExpensesPage';
import { CategoriesPage } from '../features/categories/pages/CategoriesPage';
import { GoalsPage } from '../features/goals/pages/GoalsPage';
import { ChartsPage } from '../features/charts/pages/ChartsPage';
import { ClientsPage } from '../features/clients/pages/ClientsPage';
import { SavingsPage } from '../features/savings/pages/SavingsPage';
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage';
import { SettingsPage } from '../features/settings/pages/SettingsPage';

// =====================================================
// CONFIGURACIÓN DE AUTENTICACIÓN
// =====================================================
const REQUIRE_AUTH = false;
// =====================================================

// Páginas de ejemplo
const Dashboard = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <h1 className="text-white text-2xl font-bold">Dashboard Content</h1>
  </div>
);

const Reports = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <h1 className="text-white text-2xl font-bold">Reports Page</h1>
  </div>
);

const Wallet = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <h1 className="text-white text-2xl font-bold">Wallet Page</h1>
  </div>
);

// Componente para rutas protegidas
const ProtectedRoutes = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole') as 'admin' | 'client' || 'client';
  const userName = localStorage.getItem('userName') || 'Usuario';

  if (REQUIRE_AUTH && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout userRole={userRole} userName={userName}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/clients" element={<ClientsPage />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/incomes" element={<IncomesPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/savings" element={<SavingsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/analytics" element={<ChartsPage />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </MainLayout>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};
