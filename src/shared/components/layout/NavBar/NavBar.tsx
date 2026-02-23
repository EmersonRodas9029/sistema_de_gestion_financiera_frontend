import { useState, useEffect } from 'react';
import { 
  Search,
  Bell,
  Mail,
  Calendar,
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  Menu
} from 'lucide-react';

interface NavBarProps {
  userName?: string;
  userRole?: 'admin' | 'client';
  userAvatar?: string;
  onMenuClick?: () => void;
  pageTitle?: string;
}

export const NavBar = ({ 
  userName = 'Usuario', 
  userRole = 'client',
  userAvatar,
  onMenuClick,
  pageTitle = 'Dashboard'
}: NavBarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Detectar scroll para cambiar estilo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Actualizar hora actual
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatear hora
  const formattedTime = currentTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedDate = currentTime.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  // Notificaciones de ejemplo
  const notifications = [
    { id: 1, title: 'Nuevo ingreso registrado', time: 'Hace 5 min', read: false, type: 'income' },
    { id: 2, title: 'Gasto excedente detectado', time: 'Hace 15 min', read: false, type: 'expense' },
    { id: 3, title: 'Meta de ahorro alcanzada', time: 'Hace 1 hora', read: true, type: 'goal' },
    { id: 4, title: 'Reporte mensual disponible', time: 'Hace 2 horas', read: true, type: 'report' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header 
      className={`fixed top-0 right-0 transition-all duration-300 z-40 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md' 
          : 'bg-white/50 backdrop-blur-sm'
      }`}
      style={{ 
        left: '16rem', // w-64 = 16rem
        width: 'calc(100% - 16rem)'
      }}
    >
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left section - Page title and mobile menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button (visible en móvil) */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            <Menu size={20} />
          </button>
          
          {/* Page title */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
            <p className="text-sm text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>

        {/* Right section - Actions and profile */}
        <div className="flex items-center space-x-3">
          {/* Date and time */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <Calendar size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {formattedDate} - {formattedTime}
            </span>
          </div>

          {/* Search button */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
            <Search size={20} />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#F05984] rounded-full"></span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                  <span className="text-xs text-[#F05984] font-medium">{unreadCount} nuevas</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id}
                      className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-[#F05984]/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 mt-2 rounded-full ${
                          !notif.read ? 'bg-[#F05984]' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-[#F05984] hover:text-[#d14d75] py-1">
                    Ver todas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: '#F05984' }}
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-full h-full rounded-lg object-cover" />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
              <ChevronDown size={16} className="text-gray-500 hidden md:block" />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <User size={16} />
                    <span>Mi Perfil</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <Settings size={16} />
                    <span>Configuración</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <HelpCircle size={16} />
                    <span>Ayuda</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                    <LogOut size={16} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
