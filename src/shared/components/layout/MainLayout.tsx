import { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { MobileLeftBar } from './LeftBar/MobileLeftBar';
import { Home, TrendingUp, TrendingDown, Repeat, Wallet, Target, PiggyBank, FolderTree, BarChart3, FileText, Users, Settings, Bell, HelpCircle } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'client';
  userName?: string;
}

// Mapa de rutas a nombres de página
const getPageTitle = (path: string, userRole: string): string => {
  const titles: Record<string, string> = {
    '/': 'Inicio',
    '/dashboard': 'Dashboard',
    '/incomes': 'Ingresos',
    '/expenses': 'Gastos',
    '/recurring-expenses': 'Gastos Recurrentes',
    '/budgets': 'Presupuestos',
    '/goals': 'Metas Financieras',
    '/savings': 'Metas de Ahorro',
    '/categories': 'Categorías',
    '/analytics': 'Gráficos y Análisis',
    '/settings': 'Configuración',
    '/notifications': 'Notificaciones',
    '/admin': 'Panel de Administración',
    '/admin/clients': 'Gestión de Clientes',
    '/admin/reports': 'Reportes',
    '/wallet': 'Billetera',
  };
  
  // Para rutas dinámicas como /admin/clients
  if (path.startsWith('/admin/clients')) return 'Gestión de Clientes';
  if (path.startsWith('/admin/reports')) return 'Reportes';
  if (path.startsWith('/admin')) return 'Panel de Administración';
  
  return titles[path] || 'FinanSys';
};

// Mapa de rutas a iconos
const getPageIcon = (path: string, userRole: string) => {
  const icons: Record<string, React.ReactNode> = {
    '/': <Home size={20} className="text-[#F05984]" />,
    '/dashboard': <Home size={20} className="text-[#F05984]" />,
    '/incomes': <TrendingUp size={20} className="text-green-400" />,
    '/expenses': <TrendingDown size={20} className="text-red-400" />,
    '/recurring-expenses': <Repeat size={20} className="text-orange-400" />,
    '/budgets': <Wallet size={20} className="text-blue-400" />,
    '/goals': <Target size={20} className="text-purple-400" />,
    '/savings': <PiggyBank size={20} className="text-pink-400" />,
    '/categories': <FolderTree size={20} className="text-cyan-400" />,
    '/analytics': <BarChart3 size={20} className="text-teal-400" />,
    '/settings': <Settings size={20} className="text-gray-400" />,
    '/notifications': <Bell size={20} className="text-yellow-400" />,
    '/admin': <Users size={20} className="text-blue-400" />,
    '/admin/clients': <Users size={20} className="text-amber-400" />,
    '/admin/reports': <FileText size={20} className="text-gray-400" />,
    '/wallet': <Wallet size={20} className="text-indigo-400" />,
  };
  
  if (path.startsWith('/admin/clients')) return <Users size={20} className="text-amber-400" />;
  if (path.startsWith('/admin/reports')) return <FileText size={20} className="text-gray-400" />;
  if (path.startsWith('/admin')) return <Users size={20} className="text-blue-400" />;
  
  return icons[path] || <Home size={20} className="text-[#F05984]" />;
};

export const MainLayout = ({ children, userRole, userName }: MainLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const pageTitle = getPageTitle(currentPath, userRole);
  const pageIcon = getPageIcon(currentPath, userRole);

  return (
    <div className="min-h-screen bg-gray-100">
      <MobileLeftBar userRole={userRole} userName={userName} />
      <main className="lg:ml-64 transition-all duration-300">
        {/* Header con título de página */}
        <div className="bg-gradient-to-r from-[#321D28] to-[#6E4068] border-b border-white/10 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                {pageIcon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
                <p className="text-white/50 text-sm mt-0.5">
                  {userRole === 'admin' ? 'Panel de Administración' : 'Panel de Usuario'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
