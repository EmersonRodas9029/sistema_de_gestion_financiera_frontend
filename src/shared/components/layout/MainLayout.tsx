import { type ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAutoNotifications } from '../../hooks/useAutoNotifications';
import { useManagedClient } from '../../hooks/useManagedClient';
import { logout } from '../../utils';
import { MobileLeftBar } from './LeftBar/MobileLeftBar';
import { LeftBar } from './LeftBar/LeftBar';
import {
  Home, TrendingUp, TrendingDown, Repeat, Wallet, Target,
  FolderTree, BarChart3, FileText, Users, Settings,
  Bell, LogOut, ChevronDown, Menu, UserCog, ShieldCheck
} from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'client' | 'sudo';
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
    '/goals': 'Metas de Ahorro',
    '/categories': 'Categorías',
    '/analytics': 'Gráficos',
    '/settings': 'Configuración',
    '/notifications': 'Notificaciones',
    '/admin': 'Admin',
    '/admin/clients': 'Clientes',
    '/admin/reports': 'Reportes',
    '/wallet': 'Billetera',
    '/sudo/metrics': 'Métricas',
    '/sudo/contadores': 'Contadores',
  };
  if (path.startsWith('/admin/clients')) return 'Clientes';
  if (path.startsWith('/admin/reports')) return 'Reportes';
  if (path.startsWith('/admin')) return 'Admin';
  return titles[path] || 'BudgEase';
};

const getPageIcon = (path: string) => {
  const icons: Record<string, React.ReactNode> = {
    '/': <Home size={18} className="text-[#8A5CF6]" />,
    '/incomes': <TrendingUp size={18} className="text-green-400" />,
    '/expenses': <TrendingDown size={18} className="text-red-400" />,
    '/recurring-expenses': <Repeat size={18} className="text-orange-400" />,
    '/budgets': <Wallet size={18} className="text-blue-400" />,
    '/goals': <Target size={18} className="text-purple-400" />,
    '/categories': <FolderTree size={18} className="text-cyan-400" />,
    '/analytics': <BarChart3 size={18} className="text-teal-400" />,
    '/settings': <Settings size={18} className="text-gray-400" />,
    '/notifications': <Bell size={18} className="text-yellow-400" />,
    '/admin': <Users size={18} className="text-blue-400" />,
    '/admin/clients': <Users size={18} className="text-amber-400" />,
    '/admin/reports': <FileText size={18} className="text-gray-400" />,
    '/sudo/metrics': <BarChart3 size={18} className="text-purple-400" />,
    '/sudo/contadores': <ShieldCheck size={18} className="text-purple-400" />,
  };
  if (path.startsWith('/admin/clients')) return <Users size={18} className="text-amber-400" />;
  if (path.startsWith('/admin')) return <Users size={18} className="text-blue-400" />;
  return icons[path] || <Home size={18} className="text-[#8A5CF6]" />;
};

export const MainLayout = ({ children, userRole, userName }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = location.pathname;
  const pageTitle = getPageTitle(currentPath);
  const pageIcon = getPageIcon(currentPath);
  
  const managedClient = useManagedClient();

  useAutoNotifications();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-main">
      {/* LeftBar fijo en desktop - siempre visible */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64 z-40">
        <LeftBar userRole={userRole} userName={userName} />
      </div>

      {/* Botón menú móvil - solo visible en móvil */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-[#101015]/90 backdrop-blur rounded-xl text-white shadow-lg border border-white/10"
      >
        <Menu size={22} />
      </button>

      {/* Menú móvil (solo se muestra cuando está abierto) */}
      <MobileLeftBar
        userRole={userRole}
        userName={userName}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Contenido principal - con margen izquierdo en desktop */}
      <main className="lg:ml-64">
        {/* Header simplificado para móvil */}
        <div className="sticky top-0 z-10 glass-effect">
          <div className="px-3 py-2 sm:px-4 sm:py-3">
            <div className="flex items-center justify-between gap-2">
              {/* Título e icono - centrado en móvil, con margen para el botón de menú */}
              <div className="flex items-center gap-2 ml-12 lg:ml-0">
                <div className="p-1.5 rounded-lg bg-white/10 hidden sm:block">
                  {pageIcon}
                </div>
                <div>
                  <h1 className="text-base sm:text-xl font-extrabold bg-gradient-to-r from-[#8A5CF6] to-[#F26D5B] bg-clip-text text-transparent">
                    {pageTitle}
                  </h1>
                </div>
              </div>

              {/* Iconos de acción rápida en móvil */}
              <div className="flex items-center gap-1">
                {/* Usuario dropdown - simplificado para móvil */}
                <div className="relative group">
                  <button className="flex items-center gap-1 sm:gap-2 bg-white/10 rounded-lg px-2 py-1.5 hover:bg-white/20 transition-all">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#8A5CF6] to-[#F26D5B] flex items-center justify-center text-white font-bold shadow-lg text-xs">
                      {userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown size={12} className="text-white/60 hidden xs:block" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-[#08080B] rounded-xl border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="text-white text-sm font-medium">{userName || 'Usuario'}</p>
                        <p className="text-white/40 text-xs capitalize">{userRole}</p>
                      </div>
                      <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/10 rounded-lg text-sm">
                        <Settings size={14} /><span>Config. de perfil</span>
                      </button>
                      <div className="border-t border-white/10 my-1"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg text-sm">
                        <LogOut size={14} /><span>Salir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aviso de modo "gestionar cliente": el contador está viendo datos acotados a un solo cliente */}
        {(userRole === 'admin' || userRole === 'sudo') && managedClient && (
          <button
            onClick={() => navigate('/admin/clients')}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-[#8A5CF6]/15 border-b border-[#8A5CF6]/30 text-[#8A5CF6] text-xs sm:text-sm font-medium hover:bg-[#8A5CF6]/25 transition-colors"
          >
            <UserCog size={14} />
            Gestionando a {managedClient.nombre} — datos acotados a este cliente. Click para cambiar.
          </button>
        )}

        {/* Contenido principal con padding responsive */}
        <div className="p-3 sm:p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
