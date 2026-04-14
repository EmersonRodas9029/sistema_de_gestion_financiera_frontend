import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Wallet, TrendingUp, TrendingDown, Target, Settings,
  LogOut, FolderTree, FileText, Bell, Home, BarChart3, PiggyBank, Repeat
} from 'lucide-react';

interface MenuItem {
  path: string;
  name: string;
  icon: React.ReactNode;
  roles: ('admin' | 'client')[];
}

interface LeftBarProps {
  userRole: 'admin' | 'client';
  userName?: string;
  userAvatar?: string;
  onNavigate?: () => void;
}

export const LeftBar = ({ userRole, userName = 'Usuario', userAvatar, onNavigate }: LeftBarProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const handleNotifications = () => {
    navigate('/notifications');
    onNavigate?.();
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
    onNavigate?.();
  };

  const unreadNotifications = 3;

  const menuItems: MenuItem[] = [
    { path: '/', name: 'Inicio', icon: <Home size={20} />, roles: ['admin', 'client'] },
    { path: '/incomes', name: 'Ingresos', icon: <TrendingUp size={20} />, roles: ['admin', 'client'] },
    { path: '/expenses', name: 'Gastos', icon: <TrendingDown size={20} />, roles: ['admin', 'client'] },
    { path: '/recurring-expenses', name: 'Gastos Recurrentes', icon: <Repeat size={20} />, roles: ['admin', 'client'] },
    { path: '/budgets', name: 'Presupuestos', icon: <Wallet size={20} />, roles: ['admin', 'client'] },
    { path: '/goals', name: 'Metas Financieras', icon: <Target size={20} />, roles: ['admin', 'client'] },
    { path: '/savings', name: 'Metas de Ahorro', icon: <PiggyBank size={20} />, roles: ['admin', 'client'] },
    { path: '/categories', name: 'Categorías', icon: <FolderTree size={20} />, roles: ['admin', 'client'] },
    { path: '/admin/clients', name: 'Clientes', icon: <Users size={20} />, roles: ['admin'] },
    { path: '/analytics', name: 'Gráficos', icon: <BarChart3 size={20} />, roles: ['admin', 'client'] },
    { path: '/admin/reports', name: 'Reportes', icon: <FileText size={20} />, roles: ['admin'] },
    { path: '/settings', name: 'Configuración', icon: <Settings size={20} />, roles: ['admin', 'client'] }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

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

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {filteredMenuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-white/70 hover:bg-[#F05984]/20 hover:text-white"
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="ml-3 text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Botones adicionales */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <button
          onClick={handleNotifications}
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
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-white/70 hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut size={20} />
          <span className="ml-3 text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
