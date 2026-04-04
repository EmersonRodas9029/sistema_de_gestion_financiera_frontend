import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  ChevronRight,
  Sparkles,
  FolderTree,
  BarChart3,
  Goal,
  ArrowRight,
  Users,
  UserCircle,
  Building2,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Settings,
  HelpCircle,
  Home,
  LayoutDashboard,
  Repeat,
  PiggyBank,
  CreditCard,
  DollarSign,
  Receipt
} from 'lucide-react';

interface QuickOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  stats?: string;
}

export const HomePage = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [userName] = useState(localStorage.getItem('userName') || 'Emerson');
  const [userRole] = useState<'admin' | 'client'>(localStorage.getItem('userRole') as 'admin' | 'client' || 'client');
  const [currentTime, setCurrentTime] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  // Todas las opciones disponibles en el sistema
  const quickOptions: QuickOption[] = [
    // Finanzas
    {
      id: 'incomes',
      title: 'Ingresos',
      description: 'Registra y controla tus ingresos',
      icon: <TrendingUp size={28} />,
      color: 'from-green-500/20 to-green-600/20',
      route: '/incomes',
      stats: 'Total: $3,250'
    },
    {
      id: 'expenses',
      title: 'Gastos',
      description: 'Controla tus gastos diarios',
      icon: <TrendingDown size={28} />,
      color: 'from-red-500/20 to-red-600/20',
      route: '/expenses',
      stats: 'Total: $1,245'
    },
    {
      id: 'recurring-expenses',
      title: 'Gastos Recurrentes',
      description: 'Suscripciones y pagos periódicos',
      icon: <Repeat size={28} />,
      color: 'from-orange-500/20 to-orange-600/20',
      route: '/recurring-expenses',
      stats: '12 activos'
    },
    {
      id: 'budgets',
      title: 'Presupuestos',
      description: 'Controla tus límites de gasto',
      icon: <Wallet size={28} />,
      color: 'from-blue-500/20 to-blue-600/20',
      route: '/budgets',
      stats: '80% utilizado'
    },
    
    // Metas
    {
      id: 'goals',
      title: 'Metas Financieras',
      description: 'Define tus objetivos financieros',
      icon: <Target size={28} />,
      color: 'from-purple-500/20 to-purple-600/20',
      route: '/goals',
      stats: '3 activas'
    },
    {
      id: 'savings',
      title: 'Metas de Ahorro',
      description: 'Ahorra para el futuro',
      icon: <PiggyBank size={28} />,
      color: 'from-pink-500/20 to-pink-600/20',
      route: '/savings',
      stats: '$7,850 ahorrados'
    },
    
    // Gestión
    {
      id: 'categories',
      title: 'Categorías',
      description: 'Organiza tus transacciones',
      icon: <FolderTree size={28} />,
      color: 'from-cyan-500/20 to-cyan-600/20',
      route: '/categories',
      stats: '12 categorías'
    },
    {
      id: 'wallet',
      title: 'Billetera',
      description: 'Tus cuentas y tarjetas',
      icon: <CreditCard size={28} />,
      color: 'from-indigo-500/20 to-indigo-600/20',
      route: '/wallet',
      stats: '3 cuentas'
    },
    
    // Análisis
    {
      id: 'analytics',
      title: 'Gráficos',
      description: 'Visualiza tus finanzas',
      icon: <BarChart3 size={28} />,
      color: 'from-teal-500/20 to-teal-600/20',
      route: '/analytics',
      stats: '12 meses'
    },
    
    // Reportes (solo admin)
    ...(userRole === 'admin' ? [{
      id: 'reports',
      title: 'Reportes',
      description: 'Genera reportes personalizados',
      icon: <FileText size={28} />,
      color: 'from-gray-500/20 to-gray-600/20',
      route: '/admin/reports',
      stats: '8 disponibles'
    }] : []),
    
    // Clientes (solo admin)
    ...(userRole === 'admin' ? [{
      id: 'clients',
      title: 'Clientes',
      description: 'Gestiona tus clientes',
      icon: <Users size={28} />,
      color: 'from-amber-500/20 to-amber-600/20',
      route: '/admin/clients',
      stats: '28 activos'
    }] : []),
    
    // Dashboard
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Panel de control principal',
      icon: <LayoutDashboard size={28} />,
      color: 'from-emerald-500/20 to-emerald-600/20',
      route: '/dashboard',
      stats: 'Resumen'
    },
    
    // Configuración
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Personaliza tu experiencia',
      icon: <Settings size={28} />,
      color: 'from-slate-500/20 to-slate-600/20',
      route: '/settings',
      stats: 'Preferencias'
    }
  ];

  const quickStats = {
    balance: 12580.75,
    monthlyIncome: 3250.00,
    monthlyExpenses: 1245.50,
    totalCategories: 12,
    activeGoals: 3,
    monthlySavings: 2004.25
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('¡Buenos días');
    else if (hour < 18) setGreeting('¡Buenas tardes');
    else setGreeting('¡Buenas noches');

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    const timer = setTimeout(() => setShowWelcome(false), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Welcome Banner Personalizado */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-[#F05984]/20 via-[#BC455F]/20 to-[#6E4068]/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-xl">
              <Sparkles className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                {greeting}, {userName}! 👋
              </h1>
              <p className="text-white/60 text-sm mt-1">
                {currentTime.charAt(0).toUpperCase() + currentTime.slice(1)}
              </p>
              <p className="text-white/40 text-sm mt-2">
                Tu balance total es {formatCurrency(quickStats.balance)} | Ahorro mensual: {formatCurrency(quickStats.monthlySavings)}
              </p>
            </div>
            <button className="p-3 hover:bg-white/10 rounded-xl transition-colors">
              <Bell size={24} className="text-white/60" />
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Balance Total</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(quickStats.balance)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Ingresos</p>
              <p className="text-white font-bold">{formatCurrency(quickStats.monthlyIncome)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <TrendingDown size={16} className="text-red-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Gastos</p>
              <p className="text-white font-bold">{formatCurrency(quickStats.monthlyExpenses)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Target size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Ahorro</p>
              <p className="text-white font-bold">{formatCurrency(quickStats.monthlySavings)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Todas las opciones disponibles */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Módulos del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => navigate(option.route)}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-xl p-5 border border-white/10 transition-all duration-300 hover:scale-105 hover:border-[#F05984]/50 text-left"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${option.color} group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {option.icon}
                    </div>
                  </div>
                  {option.stats && (
                    <span className="text-sm font-medium text-white/40 group-hover:text-white/60">
                      {option.stats}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-1">
                  {option.title}
                </h3>
                
                <p className="text-sm text-white/40 group-hover:text-white/60 mb-4">
                  {option.description}
                </p>
                
                <div className="flex items-center gap-1 text-[#F05984] group-hover:gap-2 transition-all duration-300">
                  <span className="text-sm font-medium">Acceder</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Información adicional según el rol */}
      {userRole === 'admin' && (
        <div className="bg-gradient-to-r from-[#321D28]/50 to-[#6E4068]/50 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Users size={18} className="text-[#F05984]" />
            Panel de Administración
          </h3>
          <p className="text-white/60 text-sm">
            Tienes acceso completo a la gestión de clientes y reportes avanzados.
            Puedes ver y administrar todos los clientes desde el módulo de Clientes.
          </p>
        </div>
      )}

      {userRole === 'client' && (
        <div className="bg-gradient-to-r from-[#321D28]/50 to-[#6E4068]/50 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <UserCircle size={18} className="text-[#F05984]" />
            Tu Panel Personal
          </h3>
          <p className="text-white/60 text-sm">
            Gestiona tus finanzas personales, establece metas de ahorro y controla tus gastos.
            Todos tus datos están seguros y disponibles en tiempo real.
          </p>
        </div>
      )}
    </div>
  );
};
