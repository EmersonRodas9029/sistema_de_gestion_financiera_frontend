import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  HelpCircle,
  Home,
  BarChart3,
  PiggyBank,
  CreditCard,
  Repeat,
  UserCircle
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
}

export const LeftBar = ({ userRole, userName = 'Usuario', userAvatar }: LeftBarProps) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  // Notificaciones no leídas (simulado)
  const unreadNotifications = 3;

  const menuItems: MenuItem[] = [
    // Sección Principal
    {
      path: '/',
      name: 'Inicio',
      icon: <Home size={20} />,
      roles: ['admin', 'client'],
      section: 'main'
    },
    
    // Sección Finanzas
    {
      path: '/incomes',
      name: 'Ingresos',
      icon: <TrendingUp size={20} />,
      roles: ['admin', 'client'],
      section: 'finances'
    },
    {
      path: '/expenses',
      name: 'Gastos',
      icon: <TrendingDown size={20} />,
      roles: ['admin', 'client'],
      section: 'finances'
    },
    {
      path: '/recurring-expenses',
      name: 'Gastos Recurrentes',
      icon: <Repeat size={20} />,
      roles: ['admin', 'client'],
      section: 'finances'
    },
    {
      path: '/budgets',
      name: 'Presupuestos',
      icon: <Wallet size={20} />,
      roles: ['admin', 'client'],
      section: 'finances'
    },
    
    // Sección Metas
    {
      path: '/goals',
      name: 'Metas Financieras',
      icon: <Target size={20} />,
      roles: ['admin', 'client'],
      section: 'goals'
    },
    {
      path: '/savings',
      name: 'Metas de Ahorro',
      icon: <PiggyBank size={20} />,
      roles: ['admin', 'client'],
      section: 'goals'
    },
    
    // Sección Gestión
    {
      path: '/categories',
      name: 'Categorías',
      icon: <FolderTree size={20} />,
      roles: ['admin', 'client'],
      section: 'management'
    },
    {
      path: '/admin/clients',
      name: 'Clientes',
      icon: <Users size={20} />,
      roles: ['admin'],
      section: 'management'
    },
    
    // Sección Reportes y Análisis
    {
      path: '/analytics',
      name: 'Gráficos',
      icon: <BarChart3 size={20} />,
      roles: ['admin', 'client'],
      section: 'reports'
    },
    {
      path: '/admin/reports',
      name: 'Reportes',
      icon: <FileText size={20} />,
      roles: ['admin'],
      section: 'reports'
    },
    
    // Sección Configuración
    {
      path: '/settings',
      name: 'Configuración',
      icon: <Settings size={20} />,
      roles: ['admin', 'client'],
      section: 'settings'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const mainItems = filteredMenuItems.filter(item => item.section === 'main');
  const financesItems = filteredMenuItems.filter(item => item.section === 'finances');
  const goalsItems = filteredMenuItems.filter(item => item.section === 'goals');
  const managementItems = filteredMenuItems.filter(item => item.section === 'management');
  const reportsItems = filteredMenuItems.filter(item => item.section === 'reports');
  const settingsItems = filteredMenuItems.filter(item => item.section === 'settings');

  const renderMenuSection = (items: MenuItem[], title?: string) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-6">
        {!collapsed && title && (
          <h3 className="text-xs uppercase tracking-wider text-white/50 px-3 mb-2">
            {title}
          </h3>
        )}
        <ul className="space-y-1 px-2">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => {
                  return `flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
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
        background: 'linear-gradient(180deg, #321D28 0%, #6E4068 50%, #BC455F 100%)',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {/* Ocultar scrollbar para Chrome, Safari y Edge */}
      <style>
        {`
          aside::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      
      {/* Logo y toggle */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 mb-4">
        {!collapsed && (
          <h1 className="text-xl font-bold text-white tracking-tight">
            FinanSys
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

      {/* Navegación con todas las secciones - sin scrollbar visible */}
      <nav className="flex-1 py-2 px-2">
        {renderMenuSection(mainItems, 'PRINCIPAL')}
        {renderMenuSection(financesItems, 'FINANZAS')}
        {renderMenuSection(goalsItems, 'METAS')}
        {renderMenuSection(managementItems, 'GESTIÓN')}
        {renderMenuSection(reportsItems, 'REPORTES')}
        {renderMenuSection(settingsItems, 'CONFIGURACIÓN')}
      </nav>

      {/* Botones adicionales */}
      <div className="p-3 border-t border-white/10 mt-auto">
        {/* Notificaciones */}
        <button
          onClick={handleNotifications}
          className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 text-white/70 hover:bg-[#F05984]/20 hover:text-white hover:translate-x-1 mb-1 ${
            collapsed ? 'justify-center' : 'space-x-3'
          }`}
        >
          <Bell size={20} />
          {!collapsed && <span className="text-sm font-medium">Notificaciones</span>}
          {!collapsed && unreadNotifications > 0 && (
            <span className="ml-auto bg-[#F05984] text-white text-xs px-1.5 py-0.5 rounded-full">
              {unreadNotifications}
            </span>
          )}
          {collapsed && unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#F05984] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* Ayuda */}
        <button
          className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 text-white/70 hover:bg-[#F05984]/20 hover:text-white hover:translate-x-1 mb-2 ${
            collapsed ? 'justify-center' : 'space-x-3'
          }`}
        >
          <HelpCircle size={20} />
          {!collapsed && <span className="text-sm font-medium">Ayuda</span>}
        </button>

        {/* Cerrar sesión */}
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 text-white/70 hover:bg-red-500/20 hover:text-red-300 hover:translate-x-1 ${
            collapsed ? 'justify-center' : 'space-x-3'
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};
