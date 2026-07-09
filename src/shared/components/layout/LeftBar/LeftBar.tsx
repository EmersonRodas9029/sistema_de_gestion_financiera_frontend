import { NavLink, useNavigate } from 'react-router-dom';
import {
  Users, Wallet, TrendingUp, TrendingDown, Target, Settings,
  LogOut, FolderTree, FileText, Bell, Home, BarChart3, Repeat
} from 'lucide-react';

interface MenuItem {
  path: string;
  name: string;
  icon: React.ReactNode;
  roles: ('admin' | 'client')[];
  section?: 'main' | 'finances' | 'goals' | 'management' | 'reports' | 'settings';
}

interface LeftBarProps {
  userRole: 'admin' | 'client';
  userName?: string;
  userAvatar?: string;
  onNavigate?: () => void;
}

export const LeftBar = ({ userRole, userName = 'Usuario', userAvatar, onNavigate }: LeftBarProps) => {
  const navigate = useNavigate();
  const unreadNotifications = 3;

  const menuItems: MenuItem[] = [
    { path: '/', name: 'Inicio', icon: <Home size={20} />, roles: ['admin', 'client'], section: 'main' },
    { path: '/incomes', name: 'Ingresos', icon: <TrendingUp size={20} />, roles: ['admin', 'client'], section: 'finances' },
    { path: '/expenses', name: 'Gastos', icon: <TrendingDown size={20} />, roles: ['admin', 'client'], section: 'finances' },
    { path: '/recurring-expenses', name: 'Gastos Recurrentes', icon: <Repeat size={20} />, roles: ['admin', 'client'], section: 'finances' },
    { path: '/budgets', name: 'Presupuestos', icon: <Wallet size={20} />, roles: ['admin', 'client'], section: 'finances' },
    { path: '/goals', name: 'Metas de Ahorro', icon: <Target size={20} />, roles: ['admin', 'client'], section: 'goals' },
    { path: '/categories', name: 'Categorías', icon: <FolderTree size={20} />, roles: ['admin', 'client'], section: 'management' },
    { path: '/admin/clients', name: 'Clientes', icon: <Users size={20} />, roles: ['admin'], section: 'management' },
    { path: '/analytics', name: 'Gráficos', icon: <BarChart3 size={20} />, roles: ['admin', 'client'], section: 'reports' },
    { path: '/admin/reports', name: 'Reportes', icon: <FileText size={20} />, roles: ['admin'], section: 'reports' },
    { path: '/settings', name: 'Configuración', icon: <Settings size={20} />, roles: ['admin', 'client'], section: 'settings' }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const mainItems = filteredMenuItems.filter(item => item.section === 'main');
  const financesItems = filteredMenuItems.filter(item => item.section === 'finances');
  const goalsItems = filteredMenuItems.filter(item => item.section === 'goals');
  const managementItems = filteredMenuItems.filter(item => item.section === 'management');
  const reportsItems = filteredMenuItems.filter(item => item.section === 'reports');
  const settingsItems = filteredMenuItems.filter(item => item.section === 'settings');

  const renderMenuSection = (items: MenuItem[], title: string) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className="text-xs uppercase tracking-wider text-white/50 px-3 mb-2 font-semibold">{title}</h3>
        <div className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#F05984] text-white shadow-lg shadow-[#F05984]/20'
                    : 'text-white/70 hover:bg-[#F05984]/20 hover:text-white'
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="ml-3 text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    );
  };

  return (
    <aside className="h-full w-64 bg-gradient-to-b from-[#321D28] via-[#6E4068] to-[#BC455F] flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center p-5 border-b border-white/10">
        <h1 className="text-xl font-bold text-white tracking-tight">BudgEase</h1>
      </div>

      {/* Perfil de usuario */}
      <div className="flex items-center p-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-[#F05984] flex items-center justify-center text-white font-bold shadow-lg">
          {userAvatar ? <img src={userAvatar} alt={userName} className="w-full h-full rounded-xl object-cover" /> : userName.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold text-white">{userName}</p>
          <p className="text-xs text-white/60 capitalize">{userRole}</p>
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
        {renderMenuSection(settingsItems, 'Configuración')}
      </nav>

      {/* Botones adicionales */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <button
          onClick={() => {
            onNavigate?.();
            navigate('/notifications');
          }}
          className="flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-white/70 hover:bg-[#F05984]/20 hover:text-white"
        >
          <Bell size={20} />
          <span className="ml-3 text-sm font-medium">Notificaciones</span>
          {unreadNotifications > 0 && (
            <span className="ml-auto bg-[#F05984] text-white text-xs px-1.5 py-0.5 rounded-full">
              {unreadNotifications}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            onNavigate?.();
            navigate('/login');
          }}
          className="flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-white/70 hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut size={20} />
          <span className="ml-3 text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
