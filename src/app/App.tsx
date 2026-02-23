import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../shared/components/layout/MainLayout';
import { AdminPage } from '../features/admin/pages/AdminPage';

// Páginas de ejemplo (las crearemos después)
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

export const App = () => {
  const userRole = 'admin';
  const userName = 'Emerson';

  return (
    <BrowserRouter>
      <MainLayout userRole={userRole} userName={userName}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/incomes" element={<Incomes />} />
          <Route path="/" element={<AdminPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};
