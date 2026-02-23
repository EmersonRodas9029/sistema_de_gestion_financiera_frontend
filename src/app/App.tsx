import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MainLayout } from '../shared/components/layout/MainLayout';

// Páginas de ejemplo
const Dashboard = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h1 className="text-gray-900">Dashboard Content</h1>
  </div>
);

const Clients = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h1 className="text-gray-900">Clients Management</h1>
  </div>
);

const Expenses = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h1 className="text-gray-900">Expenses Page</h1>
  </div>
);

const Incomes = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h1 className="text-gray-900">Incomes Page</h1>
  </div>
);

// Componente wrapper para obtener la ubicación actual
const AppContent = () => {
  const location = useLocation();
  const userRole = 'admin';
  const userName = 'Emerson';

  // Determinar el título de la página según la ruta
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/admin/clients':
        return 'Gestión de Clientes';
      case '/expenses':
        return 'Gastos';
      case '/incomes':
        return 'Ingresos';
      default:
        return 'Dashboard';
    }
  };

  return (
    <MainLayout userRole={userRole} userName={userName} pageTitle={getPageTitle()}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/clients" element={<Clients />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/incomes" element={<Incomes />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </MainLayout>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};
