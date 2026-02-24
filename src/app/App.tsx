import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/components/LoginPage';
import { MainLayout } from '../shared/components/layout/MainLayout';

// =====================================================
// CONFIGURACIÓN DE AUTENTICACIÓN
// =====================================================
// Cambia esta variable a true cuando quieras activar la autenticación
// - false: Puedes acceder a todas las páginas sin login
// - true:  Obliga a pasar por login primeroa
const REQUIRE_AUTH = false;
// =====================================================

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

const Categories = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h1 className="text-gray-900">Categories Page</h1>
  </div>
);

const Goals = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h1 className="text-gray-900">Goals Page</h1>
  </div>
);

const Reports = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h1 className="text-gray-900">Reports Page</h1>
  </div>
);

const Settings = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h1 className="text-gray-900">Settings Page</h1>
  </div>
);

// Componente para rutas protegidas
const ProtectedRoutes = () => {
  const userRole = 'admin';
  const userName = 'Emerson';
  const isAuthenticated = true; // Simulación de autenticación

  // Si REQUIRE_AUTH está activado y no está autenticado, redirigir al login
  if (REQUIRE_AUTH && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si REQUIRE_AUTH está desactivado, mostrar las rutas directamente
  return (
    <MainLayout userRole={userRole} userName={userName}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/clients" element={<Clients />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/incomes" element={<Incomes />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/analytics" element={<Reports />} />
        <Route path="/wallet" element={<Incomes />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
