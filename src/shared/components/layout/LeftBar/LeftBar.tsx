import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Users, Wallet, TrendingUp, TrendingDown, Target, Settings,
  LogOut, FolderTree, FileText, Bell, Home, BarChart3, Repeat, ShieldCheck
} from 'lucide-react';
import { useUnreadNotificationsCount } from '../../../hooks/useUnreadNotificationsCount';
import { Logo } from '../../ui/Logo';
import { logout } from '../../../utils';

type Role = 'admin' | 'client' | 'sudo';

interface MenuItem {
  path: string;
  name: string;
  icon: React.ReactNode;
  roles: Role[];
  section?: 'main' | 'finances' | 'goals' | 'management' | 'reports' | 'settings' | 'sudo';
}

interface LeftBarProps {
  userRole: Role;
  userName?: string;
  userAvatar?: string;
  onNavigate?: () => void;
}

export const LeftBar = ({ userRole, userName = 'Usuario', userAvatar, onNavigate }: LeftBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { count: unreadNotifications } = useUnreadNotificationsCount(location.pathname);

  const menuItems: MenuItem[] = [
    { path: '/', name: 'Inicio', icon: <Home size={20} />, roles: ['admin', 'client'], section: 'main' },
    { path: '/incomes', name: 'Ingresos', icon: <TrendingUp size={20} />, roles: ['admin', 'client'], section: 'finances' },
    { path: '/expenses', name: 'Gastos', icon: <TrendingDown size={20} />, roles: ['admin', 'client'], section: 'finances' },
    { path: '/recurring-expenses', name: 'Gastos Recurrentes', icon: <Repeat size={20} />, roles: ['admin', 'client'], section: 'finances' },
    { path: '/budgets', name: 'Presupuestos', icon: <Wallet size={20} />, roles: ['admin', 'client'], section: 'finances' },
    { path: '/goals', name: 'Metas de Ahorro', icon: <Target size={20} />, roles: ['admin', 'client'], section: 'goals' },
    { path: '/categories', name: 'Categorías', icon: <FolderTree size={20} />, roles: ['admin', 'client'], section: 'management' },
    { path: '/admin/clients', name: 'Clientes', icon: <Users size={20} />, roles: ['admin', 'sudo'], section: 'management' },
    { path: '/analytics', name: 'Gráficos', icon: <BarChart3 size={20} />, roles: ['admin', 'client'], section: 'reports' },
    { path: '/admin/reports', name: 'Reportes', icon: <FileText size={20} />, roles: ['admin'], section: 'reports' },
    { path: '/sudo/metrics', name: 'Métricas', icon: <BarChart3 size={20} />, roles: ['sudo'], section: 'sudo' },
    { path: '/sudo/contadores', name: 'Contadores', icon: <ShieldCheck size={20} />, roles: ['sudo'], section: 'sudo' },
    { path: '/settings', name: 'Configuración', icon: <Settings size={20} />, roles: ['admin', 'client', 'sudo'], section: 'settings' }
  ];

  // El sudo solo ve Clientes, Métricas, Contadores y Configuración (más Notificaciones/Cerrar sesión, fijos abajo).
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const mainItems = filteredMenuItems.filter(item => item.section === 'main');
  const financesItems = filteredMenuItems.filter(item => item.section === 'finances');
  const goalsItems = filteredMenuItems.filter(item => item.section === 'goals');
  const managementItems = filteredMenuItems.filter(item => item.section === 'management');
  const reportsItems = filteredMenuItems.filter(item => item.section === 'reports');
  const sudoItems = filteredMenuItems.filter(item => item.section === 'sudo');
  const settingsItems = filteredMenuItems.filter(item => item.section === 'settings');

  const renderMenuSection = (items: MenuItem[], title: string) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className="text-[10.5px] uppercase tracking-wider text-white/30 px-2 mb-1.5 font-bold">{title}</h3>
        <div className="space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all duration-200 text-[13.5px] font-semibold ${
                  isActive
                    ? 'bg-gradient-to-br from-[#8A5CF6] to-[#F26D5B] text-white shadow-lg shadow-[#8A5CF6]/20'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    );
  };

  return (
    <aside className="h-full w-64 bg-[#0C0C10] border-r border-white/[0.06] flex flex-col">
      {/* Logo */}
      <NavLink
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-5 py-[22px] border-b border-white/[0.06] hover:opacity-80 transition-opacity"
      >
        <Logo size={30} />
        <h1 className="font-display text-[17px] font-extrabold text-white tracking-tight">BudgEase</h1>
      </NavLink>

      {/* Perfil de usuario */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06]">
        <div className="w-[34px] h-[34px] rounded-2xl bg-gradient-to-br from-[#8A5CF6] to-[#F26D5B] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {userAvatar ? <img src={userAvatar} alt={userName} className="w-full h-full rounded-2xl object-cover" /> : userName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-white truncate">{userName}</p>
          <p className="text-[11.5px] text-white/40 capitalize">{userRole}</p>
        </div>
      </div>

      {/* Navegación por secciones */}
      <nav
        className="flex-1 overflow-y-auto py-4 px-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          nav::-webkit-scrollbar {
            width: 0;
            display: none;
          }
          nav::-webkit-scrollbar-track {
            background: transparent;
          }
          nav::-webkit-scrollbar-thumb {
            background: transparent;
          }
        `}</style>
        {renderMenuSection(mainItems, 'Principal')}
        {renderMenuSection(financesItems, 'Finanzas')}
        {renderMenuSection(goalsItems, 'Metas')}
        {renderMenuSection(managementItems, 'Gestión')}
        {renderMenuSection(reportsItems, 'Reportes')}
        {renderMenuSection(sudoItems, 'Sudo')}
        {renderMenuSection(settingsItems, 'Configuración')}
      </nav>

      {/* Botones adicionales */}
      <div className="p-3 border-t border-white/[0.06] space-y-0.5">
        <button
          onClick={() => {
            onNavigate?.();
            navigate('/notifications');
          }}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-2xl transition-all duration-200 text-[13.5px] font-semibold text-white/60 hover:bg-white/5 hover:text-white"
        >
          <Bell size={18} />
          <span>Notificaciones</span>
          {unreadNotifications > 0 && (
            <span className="ml-auto bg-gradient-to-br from-[#8A5CF6] to-[#F26D5B] text-white text-xs px-1.5 py-0.5 rounded-full">
              {unreadNotifications}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            logout();
            onNavigate?.();
            navigate('/login');
          }}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-2xl transition-all duration-200 text-[13.5px] font-semibold text-white/60 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
