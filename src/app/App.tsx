import type { ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { MainLayout } from '../shared/components/layout/MainLayout';
import { NotFound } from '../shared/components/ui/NotFound';
import { ErrorBoundary } from '../shared/components/ui/ErrorBoundary';
import { HomePage } from '../features/home/pages/HomePage';
import { IncomesPage } from '../features/incomes/pages/IncomesPage';
import { ExpensesPage } from '../features/expenses/pages/ExpensesPage';
import { CategoriesPage } from '../features/categories/pages/CategoriesPage';
import { GoalsPage } from '../features/goals/pages/GoalsPage';
import { ChartsPage } from '../features/charts/pages/ChartsPage';
import { ClientsPage } from '../features/clients/pages/ClientsPage';
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage';
import { SettingsPage } from '../features/settings/pages/SettingsPage';
import { RecurringExpensesPage } from '../features/recurring-expenses/pages/RecurringExpensesPage';
import { BudgetsPage } from '../features/budgets/pages/BudgetsPage';
import { ReportsPage } from '../features/reports/pages/ReportsPage';
import { MetricsPage } from '../features/sudo/pages/MetricsPage';
import { ContadoresPage } from '../features/sudo/pages/ContadoresPage';

// =====================================================
// CONFIGURACIÓN DE AUTENTICACIÓN
// =====================================================
const REQUIRE_AUTH = true;
// =====================================================

type UserRole = 'admin' | 'client' | 'sudo';

// El sudo tiene permisos absolutos: hereda todo lo que ve un admin (contador).
const AdminOnly = ({ userRole, children }: { userRole: UserRole; children: ReactNode }) =>
  userRole === 'admin' || userRole === 'sudo' ? <>{children}</> : <Navigate to="/" replace />;

const SudoOnly = ({ userRole, children }: { userRole: UserRole; children: ReactNode }) =>
  userRole === 'sudo' ? <>{children}</> : <Navigate to="/" replace />;

// Componente para rutas protegidas
const ProtectedRoutes = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole') as UserRole || 'client';
  const userName = localStorage.getItem('userName') || 'Usuario';

  if (REQUIRE_AUTH && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout userRole={userRole} userName={userName}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/admin" element={<Navigate to="/admin/clients" replace />} />
        <Route path="/admin/clients" element={<AdminOnly userRole={userRole}><ClientsPage /></AdminOnly>} />
        <Route path="/admin/reports" element={<AdminOnly userRole={userRole}><ReportsPage /></AdminOnly>} />
        <Route path="/sudo/metrics" element={<SudoOnly userRole={userRole}><MetricsPage /></SudoOnly>} />
        <Route path="/sudo/contadores" element={<SudoOnly userRole={userRole}><ContadoresPage /></SudoOnly>} />
        <Route path="/incomes" element={<IncomesPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/recurring-expenses" element={<RecurringExpensesPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/analytics" element={<ChartsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;
