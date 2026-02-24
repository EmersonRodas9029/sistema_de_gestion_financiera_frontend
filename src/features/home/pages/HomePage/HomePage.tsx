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
  Plus,
  MoreHorizontal,
  CreditCard,
  DollarSign,
  Landmark,
  Receipt,
  Bell,
  ChevronRight,
  Sparkles,
  FolderTree,
  BarChart3,
  Goal,
  ArrowRight,
  Users
} from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  status: 'completada' | 'pendiente' | 'fallida';
}

interface FinancialGoal {
  id: number;
  name: string;
  current: number;
  target: number;
  deadline: string;
  category: string;
}

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
  const [userName] = useState('Emerson'); // Esto vendrá del contexto de autenticación
  const [currentTime, setCurrentTime] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  // Opciones rápidas - 7 apartados principales
  const quickOptions: QuickOption[] = [
    {
      id: 'expenses',
      title: 'Gastos',
      description: 'Controla tus gastos diarios',
      icon: <TrendingDown size={32} />,
      color: 'from-red-500/20 to-red-600/20',
      route: '/expenses',
      stats: '$1,245'
    },
    {
      id: 'categories',
      title: 'Categorías',
      description: 'Organiza por categorías',
      icon: <FolderTree size={32} />,
      color: 'from-purple-500/20 to-purple-600/20',
      route: '/categories',
      stats: '8 activas'
    },
    {
      id: 'charts',
      title: 'Gráficos',
      description: 'Visualiza tus finanzas',
      icon: <BarChart3 size={32} />,
      color: 'from-blue-500/20 to-blue-600/20',
      route: '/analytics',
      stats: '12 meses'
    },
    {
      id: 'incomes',
      title: 'Ingresos',
      description: 'Registra tus ingresos',
      icon: <TrendingUp size={32} />,
      color: 'from-green-500/20 to-green-600/20',
      route: '/incomes',
      stats: '$3,250'
    },
    {
      id: 'clients',
      title: 'Clientes',
      description: 'Gestiona tus clientes',
      icon: <Users size={32} />,
      color: 'from-cyan-500/20 to-cyan-600/20',
      route: '/admin/clients',
      stats: '28 activos'
    },
    {
      id: 'financial-goal',
      title: 'Meta Financiera',
      description: 'Define tus metas',
      icon: <Target size={32} />,
      color: 'from-orange-500/20 to-orange-600/20',
      route: '/goals',
      stats: '3 activas'
    },
    {
      id: 'savings-goal',
      title: 'Meta de Ahorro',
      description: 'Ahorra para el futuro',
      icon: <Goal size={32} />,
      color: 'from-pink-500/20 to-pink-600/20',
      route: '/savings',
      stats: '2 en progreso'
    }
  ];

  // Datos de ejemplo
  const recentTransactions: Transaction[] = [
    {
      id: 1,
      description: 'Pago de nómina',
      amount: 2500.00,
      type: 'income',
      category: 'Salario',
      date: 'Hoy, 10:30',
      status: 'completada'
    },
    {
      id: 2,
      description: 'Supermercado',
      amount: 156.75,
      type: 'expense',
      category: 'Alimentación',
      date: 'Hoy, 09:15',
      status: 'completada'
    },
    {
      id: 3,
      description: 'Netflix',
      amount: 15.99,
      type: 'expense',
      category: 'Suscripciones',
      date: 'Ayer',
      status: 'completada'
    }
  ];

  const goals: FinancialGoal[] = [
    {
      id: 1,
      name: 'Vacaciones',
      current: 850,
      target: 2000,
      deadline: 'Jun 2024',
      category: 'Viajes'
    },
    {
      id: 2,
      name: 'Fondo de emergencia',
      current: 3200,
      target: 5000,
      deadline: 'Dic 2024',
      category: 'Ahorro'
    }
  ];

  const quickStats = {
    balance: 12580.75,
    monthlyIncome: 3250.00,
    monthlyExpenses: 1245.50,
    totalClients: 28
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

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
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
                Tu balance total es {formatCurrency(quickStats.balance)} | {quickStats.totalClients} clientes activos
              </p>
            </div>
            <button className="p-3 hover:bg-white/10 rounded-xl transition-colors">
              <Bell size={24} className="text-white/60" />
            </button>
          </div>
        </div>
      )}

      {/* Balance Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Users size={16} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Clientes</p>
              <p className="text-white font-bold">{quickStats.totalClients}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Apartados Principales */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => navigate(option.route)}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-xl p-6 border border-white/10 transition-all duration-300 hover:scale-105 hover:border-[#F05984]/50 text-left"
            >
              {/* Fondo degradado en hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Contenido */}
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

      {/* Resumen de Metas y Transacciones Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Metas rápidas */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Tus Metas</h3>
            <button 
              onClick={() => navigate('/goals')}
              className="text-white/40 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal.current, goal.target);
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white/10 rounded-lg">
                        <Target size={14} className="text-white" />
                      </div>
                      <span className="text-white text-sm">{goal.name}</span>
                    </div>
                    <span className="text-white/40 text-xs">{goal.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/60">{formatCurrency(goal.current)}</span>
                    <span className="text-white/40">de {formatCurrency(goal.target)}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transacciones recientes */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Movimientos Recientes</h3>
            <button 
              onClick={() => navigate('/expenses')}
              className="text-white/40 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp size={14} className="text-green-400" />
                    ) : (
                      <TrendingDown size={14} className="text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm">{transaction.description}</p>
                    <p className="text-white/40 text-xs">{transaction.category} • {transaction.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
