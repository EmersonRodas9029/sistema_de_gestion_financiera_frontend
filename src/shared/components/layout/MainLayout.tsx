import { type ReactNode, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileLeftBar } from './LeftBar/MobileLeftBar';
import { 
  Home, TrendingUp, TrendingDown, Repeat, Wallet, Target, 
  PiggyBank, FolderTree, BarChart3, FileText, Users, Settings, 
  Bell, HelpCircle, LogOut, User, Calendar, Clock, ChevronDown 
} from 'lucide-react';

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
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const pageTitle = getPageTitle(currentPath, userRole);
  const pageIcon = getPageIcon(currentPath, userRole);
  
  const [currentDateTime, setCurrentDateTime] = useState({
    date: '',
    time: '',
    fullDateTime: ''
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const timeOptions: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      };
      
      setCurrentDateTime({
        date: now.toLocaleDateString('es-ES', dateOptions),
        time: now.toLocaleTimeString('es-ES', timeOptions),
        fullDateTime: now.toLocaleString('es-ES')
      });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MobileLeftBar userRole={userRole} userName={userName} />
      <main className="lg:ml-64 transition-all duration-300">
        {/* Header con título de página, fecha/hora y usuario */}
        <div className="bg-gradient-to-r from-[#321D28] to-[#6E4068] border-b border-white/10 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Lado izquierdo - Título e icono */}
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

              {/* Lado derecho - Fecha/Hora y Usuario */}
              <div className="flex items-center gap-6">
                {/* Fecha y Hora */}
                <div className="hidden md:block">
                  <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-white/60" />
                      <span className="text-white/80 text-sm capitalize">
                        {currentDateTime.date}
                      </span>
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-white/60" />
                      <span className="text-white/80 text-sm font-mono">
                        {currentDateTime.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Usuario con dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2 hover:bg-white/20 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F05984] to-[#BC455F] flex items-center justify-center text-white font-bold">
                      {userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-white text-sm font-medium">{userName || 'Usuario'}</p>
                      <p className="text-white/50 text-xs capitalize">{userRole}</p>
                    </div>
                    <ChevronDown size={16} className="text-white/60 group-hover:rotate-180 transition-transform" />
                  </button>
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-[#1a0f14] rounded-lg border border-white/10 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="text-white text-sm font-medium">{userName || 'Usuario'}</p>
                        <p className="text-white/40 text-xs">{userRole === 'admin' ? 'Administrador' : 'Cliente'}</p>
                      </div>
                      <button
                        onClick={() => navigate('/settings')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors text-sm"
                      >
                        <User size={16} />
                        <span>Mi Perfil</span>
                      </button>
                      <button
                        onClick={() => navigate('/settings')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors text-sm"
                      >
                        <Settings size={16} />
                        <span>Configuración</span>
                      </button>
                      <button
                        onClick={() => navigate('/notifications')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors text-sm"
                      >
                        <Bell size={16} />
                        <span>Notificaciones</span>
                      </button>
                      <div className="border-t border-white/10 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                      >
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </div>
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
