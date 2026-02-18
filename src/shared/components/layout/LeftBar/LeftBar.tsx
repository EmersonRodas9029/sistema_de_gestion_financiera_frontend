import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Target,
  PieChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  FileText,
  Bell,
  HelpCircle
} from 'lucide-react';

interface MenuItem {
  path: string;
  name: string;
  icon: React.ReactNode;
  roles: ('admin' | 'client')[];
  section?: 'main' | 'management' | 'other';
}

interface LeftBarProps {
  userRole: 'admin' | 'client';
  userName?: string;
  userAvatar?: string;
}

export const LeftBar = ({ userRole, userName = 'Usuario', userAvatar }: LeftBarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    // Sección Principal
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      roles: ['admin', 'client'],
      section: 'main'
    },
    // Sección Gestión (solo admin)
    {
      path: '/admin/clients',
      name: 'Clientes',
      icon: <Users size={20} />,
      roles: ['admin'],
      section: 'management'
    },
    {
      path: '/admin/reports',
      name: 'Reportes',
      icon: <FileText size={20} />,
      roles: ['admin'],
      section: 'management'
    },
    // Sección Finanzas (solo client)
    {
      path: '/incomes',
      name: 'Ingresos',
      icon: <TrendingUp size={20} />,
      roles: ['client'],
      section: 'main'
    },
    {
      path: '/expenses',
      name: 'Gastos',
      icon: <TrendingDown size={20} />,
      roles: ['client'],
      section: 'main'
    },
    {
      path: '/goals',
      name: 'Metas',
      icon: <Target size={20} />,
      roles: ['client'],
      section: 'main'
    },
    {
      path: '/wallet',
      name: 'Billetera',
      icon: <Wallet size={20} />,
      roles: ['client'],
      section: 'main'
    },
    // Sección Categorías (compartida)
    {
      path: '/categories',
      name: 'Categorías',
      icon: <FolderTree size={20} />,
      roles: ['admin', 'client'],
      section: 'management'
    },
    // Sección Análisis
    {
      path: '/analytics',
      name: 'Análisis',
      icon: <PieChart size={20} />,
      roles: ['admin', 'client'],
      section: 'other'
    },
    // Sección Configuración
    {
      path: '/settings',
      name: 'Configuración',
      icon: <Settings size={20} />,
      roles: ['admin', 'client'],
      section: 'other'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  // Agrupar items por sección
  const mainItems = filteredMenuItems.filter(item => item.section === 'main');
  const managementItems = filteredMenuItems.filter(item => item.section === 'management');
  const otherItems = filteredMenuItems.filter(item => item.section === 'other');

  const renderMenuSection = (items: MenuItem[], title?: string) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-6">
        {!collapsed && title && (
          <h3 className="text-xs uppercase tracking-wider text-white/50 px-3 mb-2">
            {title}
          </h3>
        )}
        <ul className="space-y-2 px-2">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => {
                  return `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    collapsed ? 'justify-center' : 'space-x-3'
                  } ${
                    isActive 
                      ? 'bg-[#F05984] text-white shadow-lg shadow-[#F05984]/20' 
                      : 'text-white/70 hover:bg-[#F05984]/20 hover:text-white hover:translate-x-1'
                  }`;
                }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <aside 
      className={`h-screen transition-all duration-300 fixed left-0 top-0 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      style={{ 
        background: 'linear-gradient(180deg, #321D28 0%, #6E4068 50%, #BC455F 100%)'
      }}
    >
      {/* Logo y toggle */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 mb-4">
        {!collapsed && (
          <h1 className="text-xl font-bold text-white tracking-tight">
            Finanzas
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto text-white"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Perfil de usuario */}
      <div className="flex items-center p-3 border-b border-white/10 mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
          style={{ backgroundColor: '#F05984' }}
        >
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-full h-full rounded-xl object-cover" />
          ) : (
            userName.charAt(0).toUpperCase()
          )}
        </div>
        {!collapsed && (
          <div className="ml-3">
            <p className="text-sm font-semibold text-white">{userName}</p>
            <p className="text-xs text-white/60 capitalize">{userRole}</p>
          </div>
        )}
      </div>

      {/* Navegación con secciones separadas */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {renderMenuSection(mainItems, 'PRINCIPAL')}
        {renderMenuSection(managementItems, 'GESTIÓN')}
        {renderMenuSection(otherItems, 'OTROS')}
      </nav>

      {/* Botones adicionales */}
      <div className="p-3 border-t border-white/10">
        {/* Notificaciones */}
        <button
          className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-white/70 hover:bg-[#F05984]/20 hover:text-white hover:translate-x-1 mb-1 ${
            collapsed ? 'justify-center' : 'space-x-3'
          }`}
        >
          <Bell size={20} />
          {!collapsed && <span className="text-sm font-medium">Notificaciones</span>}
          {!collapsed && (
            <span className="ml-auto bg-[#F05984] text-white text-xs px-1.5 py-0.5 rounded-full">
              3
            </span>
          )}
        </button>

        {/* Ayuda */}
        <button
          className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-white/70 hover:bg-[#F05984]/20 hover:text-white hover:translate-x-1 mb-2 ${
            collapsed ? 'justify-center' : 'space-x-3'
          }`}
        >
          <HelpCircle size={20} />
          {!collapsed && <span className="text-sm font-medium">Ayuda</span>}
        </button>

        {/* Cerrar sesión */}
        <button
          className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-white/70 hover:bg-red-500/20 hover:text-red-300 hover:translate-x-1 ${
            collapsed ? 'justify-center' : 'space-x-3'
          }`}
          onClick={() => console.log('Logout')}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};
