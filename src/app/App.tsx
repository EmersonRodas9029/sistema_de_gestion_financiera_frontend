import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { MainLayout } from '../shared/components/layout/MainLayout';
import { HomePage } from '../features/home/pages/HomePage';
import { AdminPage } from '../features/admin/pages/AdminPage';

// =====================================================
// CONFIGURACIÓN DE AUTENTICACIÓN
// =====================================================
// Cambia esta variable a true cuando quieras activar la autenticación
// - false: Puedes acceder a todas las páginas sin login
// - true:  Obliga a pasar por login primero
const REQUIRE_AUTH = false;
// =====================================================

// Páginas de ejemplo
const Dashboard = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <h1 className="text-white text-2xl font-bold">Dashboard Content</h1>
  </div>
);

const Clients = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <h1 className="text-white text-2xl font-bold">Clients Management</h1>
  </div>
);

const Expenses = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <h1 className="text-white text-2xl font-bold">Expenses Page</h1>
  </div>
);

const Incomes = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <h1 className="text-white text-2xl font-bold">Incomes Page</h1>
  </div>
);

const Categories = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <h1 className="text-white text-2xl font-bold">Categories Page</h1>
  </div>
);

const Goals = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <h1 className="text-white text-2xl font-bold">Goals Page</h1>
  </div>
);

const Reports = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <h1 className="text-white text-2xl font-bold">Reports Page</h1>
  </div>
);

const Settings = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <h1 className="text-white text-2xl font-bold">Settings Page</h1>
  </div>
);

// Componente para rutas protegidas
const ProtectedRoutes = () => {
  // Obtener datos de autenticación del localStorage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole') as 'admin' | 'client' || 'client';
  const userName = localStorage.getItem('userName') || 'Usuario';

  // Si REQUIRE_AUTH está activado y no está autenticado, redirigir al login
  if (REQUIRE_AUTH && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si REQUIRE_AUTH está desactivado, mostrar las rutas directamente
  return (
    <MainLayout userRole={userRole} userName={userName}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/clients" element={<Clients />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/incomes" element={<Incomes />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/analytics" element={<Reports />} />
        <Route path="/wallet" element={<Incomes />} />
        <Route path="/settings" element={<Settings />} />
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
