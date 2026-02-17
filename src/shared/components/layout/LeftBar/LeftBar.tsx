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
  FileText
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
}

export const LeftBar = ({ userRole, userName = 'Usuario', userAvatar }: LeftBarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      roles: ['admin', 'client']
    },
    {
      path: '/admin/clients',
      name: 'Clientes',
      icon: <Users size={20} />,
      roles: ['admin']
    },
    {
      path: '/admin/reports',
      name: 'Reportes',
      icon: <FileText size={20} />,
      roles: ['admin']
    },
    {
      path: '/incomes',
      name: 'Ingresos',
      icon: <TrendingUp size={20} />,
      roles: ['client']
    },
    {
      path: '/expenses',
      name: 'Gastos',
      icon: <TrendingDown size={20} />,
      roles: ['client']
    },
    {
      path: '/goals',
      name: 'Metas',
      icon: <Target size={20} />,
      roles: ['client']
    },
    {
      path: '/categories',
      name: 'Categorías',
      icon: <FolderTree size={20} />,
      roles: ['admin', 'client']
    },
    {
      path: '/wallet',
      name: 'Billetera',
      icon: <Wallet size={20} />,
      roles: ['client']
    },
    {
      path: '/analytics',
      name: 'Análisis',
      icon: <PieChart size={20} />,
      roles: ['admin', 'client']
    },
    {
      path: '/settings',
      name: 'Configuración',
      icon: <Settings size={20} />,
      roles: ['admin', 'client']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <aside 
      className={`h-screen transition-all duration-300 fixed left-0 top-0 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      style={{ 
        background: 'linear-gradient(180deg, #321D28 0%, #6E4068 50%, #BC455F 100%)'
      }}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {!collapsed && (
          <h1 className="text-xl font-bold text-white">
            Finanzas
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors ml-auto text-white"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex items-center p-4 border-b border-white/20">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: '#F05984' }}
        >
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
          ) : (
            userName.charAt(0).toUpperCase()
          )}
        </div>
        {!collapsed && (
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{userName}</p>
            <p className="text-xs text-white/70 capitalize">{userRole}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredMenuItems.map((item) => {
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => {
                    return `flex items-center px-3 py-2 rounded-lg transition-colors ${
                      collapsed ? 'justify-center' : 'space-x-3'
                    } ${isActive ? 'bg-[#F05984] text-white' : 'text-white/80 hover:bg-[#F05984]/30 hover:text-white'}`;
                  }}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="text-sm">{item.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/20">
        <button
          className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors text-white/80 hover:bg-[#F05984]/30 hover:text-white ${
            collapsed ? 'justify-center' : 'space-x-3'
          }`}
          onClick={() => console.log('Logout')}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};
