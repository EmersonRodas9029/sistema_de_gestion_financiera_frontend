import { type ReactNode, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileLeftBar } from './LeftBar/MobileLeftBar';
import { 
  Home, TrendingUp, TrendingDown, Repeat, Wallet, Target, 
  PiggyBank, FolderTree, BarChart3, FileText, Users, Settings, 
  Bell, LogOut, User, Calendar, Clock, ChevronDown, Menu
} from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'client';
  userName?: string;
}

const getPageTitle = (path: string): string => {
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
  return titles[path] || 'BudgEase';
};

const getPageIcon = (path: string) => {
  const icons: Record<string, React.ReactNode> = {
    '/': <Home size={20} className="text-[#F05984]" />,
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
  };
  if (path.startsWith('/admin/clients')) return <Users size={20} className="text-amber-400" />;
  if (path.startsWith('/admin')) return <Users size={20} className="text-blue-400" />;
  return icons[path] || <Home size={20} className="text-[#F05984]" />;
};

export const MainLayout = ({ children, userRole, userName }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = location.pathname;
  const pageTitle = getPageTitle(currentPath);
  const pageIcon = getPageIcon(currentPath);
  
  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime({
        date: now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      });
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-main">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#321D28] rounded-lg text-white shadow-lg"
      >
        <Menu size={24} />
      </button>

      <MobileLeftBar userRole={userRole} userName={userName} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <main className="lg:ml-64 transition-all duration-300">
        {/* Header responsive */}
        <div className="sticky top-0 z-10 glass-effect">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Título e icono - centrado en móvil */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 transition-all duration-300 hover:scale-105 hidden sm:block">
                  {pageIcon}
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {pageTitle}
                  </h1>
                  <p className="text-white/50 text-xs sm:text-sm mt-0.5 hidden sm:block">
                    {userRole === 'admin' ? 'Panel de Administración' : 'Panel de Usuario'}
                  </p>
                </div>
              </div>

              {/* Fecha/Hora y Usuario - responsive */}
              <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-6">
                {/* Fecha y Hora - oculta en móvil muy pequeño */}
                <div className="hidden md:block">
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Calendar size={14} className="text-white/60" />
                      <span className="text-white/80 text-xs sm:text-sm capitalize hidden sm:inline">
                        {currentDateTime.date}
                      </span>
                    </div>
                    <div className="w-px h-3 sm:h-4 bg-white/20" />
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Clock size={14} className="text-white/60" />
                      <span className="text-white/80 text-xs sm:text-sm font-mono">
                        {currentDateTime.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Usuario dropdown - responsive */}
                <div className="relative group">
                  <button className="flex items-center gap-2 sm:gap-3 bg-white/10 rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-[#F05984] to-[#BC455F] flex items-center justify-center text-white font-bold shadow-lg text-sm sm:text-base">
                      {userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden xs:block text-left">
                      <p className="text-white text-xs sm:text-sm font-medium">{userName || 'Usuario'}</p>
                      <p className="text-white/50 text-xs capitalize">{userRole}</p>
                    </div>
                    <ChevronDown size={14} className="text-white/60 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-[#1a0f14] rounded-xl border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 backdrop-blur-sm">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="text-white text-sm font-medium">{userName || 'Usuario'}</p>
                        <p className="text-white/40 text-xs">{userRole === 'admin' ? 'Administrador' : 'Cliente'}</p>
                      </div>
                      <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/10 rounded-lg transition-all duration-200 text-sm hover:translate-x-1">
                        <User size={16} /><span>Mi Perfil</span>
                      </button>
                      <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/10 rounded-lg transition-all duration-200 text-sm hover:translate-x-1">
                        <Settings size={16} /><span>Configuración</span>
                      </button>
                      <button onClick={() => navigate('/notifications')} className="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/10 rounded-lg transition-all duration-200 text-sm hover:translate-x-1">
                        <Bell size={16} /><span>Notificaciones</span>
                      </button>
                      <div className="border-t border-white/10 my-1"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-sm hover:translate-x-1">
                        <LogOut size={16} /><span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenido principal con padding responsive */}
        <div className="p-3 sm:p-4 md:p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
