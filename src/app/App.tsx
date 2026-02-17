import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export const App = () => {
  const userRole = 'admin';
  const userName = 'Emerson';

  return (
    <BrowserRouter>
      <MainLayout userRole={userRole} userName={userName}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/incomes" element={<Incomes />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};
