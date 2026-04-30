import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  Bell,
  Sparkles,
  FolderTree,
  BarChart3,
  ArrowRight,
  Users,
  UserCircle,
  FileText,
  Settings,
  Repeat,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Activity,
  DollarSign,
  CreditCard,
  Zap,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import AnimatedCounter from '../components/AnimatedCounter';

interface QuickOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  stats?: string;
}

// Datos de ejemplo para los gráficos
const mockChartData = [
  { date: 'Lun', ingresos: 450, gastos: 320 },
  { date: 'Mar', ingresos: 380, gastos: 420 },
  { date: 'Mié', ingresos: 520, gastos: 380 },
  { date: 'Jue', ingresos: 410, gastos: 450 },
  { date: 'Vie', ingresos: 480, gastos: 390 },
  { date: 'Sáb', ingresos: 530, gastos: 410 },
  { date: 'Dom', ingresos: 490, gastos: 370 },
];

const monthlyChartData = [
  { mes: 'Ene', ingresos: 3200, gastos: 2800 },
  { mes: 'Feb', ingresos: 3600, gastos: 3100 },
  { mes: 'Mar', ingresos: 3800, gastos: 3200 },
  { mes: 'Abr', ingresos: 3500, gastos: 2800 },
  { mes: 'May', ingresos: 4000, gastos: 3300 },
  { mes: 'Jun', ingresos: 4200, gastos: 3400 },
];

// Transacciones recientes de ejemplo
const recentTransactions = [
  { id: 1, description: 'Supermercado', amount: 156.75, type: 'expense', category: 'Alimentación', date: 'Hoy', status: 'completada' },
  { id: 2, description: 'Pago de nómina', amount: 2500.00, type: 'income', category: 'Salario', date: 'Ayer', status: 'completada' },
  { id: 3, description: 'Netflix', amount: 15.99, type: 'expense', category: 'Suscripciones', date: 'Ayer', status: 'completada' },
  { id: 4, description: 'Cliente Proyecto Web', amount: 3500.00, type: 'income', category: 'Servicios', date: '23 Feb', status: 'completada' },
  { id: 5, description: 'Electricidad', amount: 85.50, type: 'expense', category: 'Servicios', date: '22 Feb', status: 'completada' },
];

// Distribución por categoría
const categoryDistribution = [
  { name: 'Alimentación', value: 35, color: '#F05984', amount: 1240.50 },
  { name: 'Vivienda', value: 28, color: '#BC455F', amount: 1200.00 },
  { name: 'Transporte', value: 15, color: '#6E4068', amount: 650.00 },
  { name: 'Entretenimiento', value: 12, color: '#321D28', amount: 520.00 },
  { name: 'Salud', value: 10, color: '#2DD4BF', amount: 430.00 },
];

// Métricas de salud financiera
const healthMetrics = [
  { name: 'Control de Gastos', value: 85, color: '#F05984' },
  { name: 'Capacidad de Ahorro', value: 72, color: '#BC455F' },
  { name: 'Estabilidad', value: 68, color: '#6E4068' },
];

export const HomePage = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [userName] = useState(localStorage.getItem('userName') || 'Emerson');
  const [userRole] = useState<'admin' | 'client'>(localStorage.getItem('userRole') as 'admin' | 'client' || 'client');
  const [currentTime, setCurrentTime] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const chartData = period === 'week' ? mockChartData : monthlyChartData;
  const xAxisKey = period === 'week' ? 'date' : 'mes';

  // Estadísticas
  const stats = {
    balance: 12580.75,
    monthlyIncome: 3250.00,
    monthlyExpenses: 1245.50,
    savingsRate: 62,
    totalTransactions: 145
  };

  // Opciones rápidas
  const quickOptions: QuickOption[] = [
    { id: 'incomes', title: 'Ingresos', description: 'Registra tus ingresos', icon: <TrendingUp size={24} />, color: 'from-emerald-500/20 to-emerald-600/20', route: '/incomes', stats: '+12%' },
    { id: 'expenses', title: 'Gastos', description: 'Controla tus gastos', icon: <TrendingDown size={24} />, color: 'from-rose-500/20 to-rose-600/20', route: '/expenses', stats: '-5%' },
    { id: 'recurring-expenses', title: 'Gastos Recurrentes', description: 'Suscripciones', icon: <Repeat size={24} />, color: 'from-orange-500/20 to-orange-600/20', route: '/recurring-expenses', stats: '12 activos' },
    { id: 'budgets', title: 'Presupuestos', description: 'Controla límites', icon: <Wallet size={24} />, color: 'from-blue-500/20 to-blue-600/20', route: '/budgets', stats: '80% usado' },
    { id: 'goals', title: 'Metas', description: 'Objetivos financieros', icon: <Target size={24} />, color: 'from-purple-500/20 to-purple-600/20', route: '/goals', stats: '3 activas' },
    { id: 'savings', title: 'Ahorro', description: 'Metas de ahorro', icon: <PiggyBank size={24} />, color: 'from-pink-500/20 to-pink-600/20', route: '/savings', stats: '$7,850' },
  ];

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

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    const commonElements = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
        <XAxis dataKey={xAxisKey} stroke="#94a3b8" style={{ fontSize: '12px' }} />
        <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a0f14',
            border: '1px solid #BC455F',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
          labelStyle={{ color: 'white' }}
          itemStyle={{ color: 'white' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
      </>
    );

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F05984" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F05984" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#BC455F" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#BC455F" stopOpacity={0} />
              </linearGradient>
            </defs>
            {commonElements}
            <Area type="monotone" dataKey="ingresos" stroke="#F05984" strokeWidth={3} fill="url(#colorIngresos)" />
            <Area type="monotone" dataKey="gastos" stroke="#BC455F" strokeWidth={3} fill="url(#colorGastos)" />
          </AreaChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            {commonElements}
            <Line type="monotone" dataKey="ingresos" stroke="#F05984" strokeWidth={3} dot={{ fill: "#F05984", r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="gastos" stroke="#BC455F" strokeWidth={3} dot={{ fill: "#BC455F", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {commonElements}
            <Bar dataKey="ingresos" fill="#F05984" radius={[8, 8, 0, 0]} />
            <Bar dataKey="gastos" fill="#BC455F" radius={[8, 8, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="min-h-screen space-y-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Welcome Banner */}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#321D28] via-[#6E4068] to-[#BC455F] p-6 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium mb-1">Balance Total</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">$</span>
                    <span className="text-5xl font-bold text-white">{formatCurrency(stats.balance)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30">
                  <TrendingUp className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold">+12.5%</span>
                  <span className="text-white/80 text-sm">vs mes anterior</span>
                </div>
              </div>
              <p className="text-white/70 text-sm mt-4">{currentTime}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/30 min-w-[140px]">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-300" />
                  <span className="text-white/90 text-sm font-medium">Ingresos</span>
                </div>
                <div className="text-2xl font-bold text-white">{formatCurrency(stats.monthlyIncome)}</div>
                <p className="text-emerald-300 text-xs mt-1 font-medium">+12% este mes</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/30 min-w-[140px]">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownRight className="w-4 h-4 text-rose-300" />
                  <span className="text-white/90 text-sm font-medium">Gastos</span>
                </div>
                <div className="text-2xl font-bold text-white">{formatCurrency(stats.monthlyExpenses)}</div>
                <p className="text-rose-300 text-xs mt-1 font-medium">-5% vs mes anterior</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Tasa de Ahorro</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white">{stats.savingsRate}</span>
                <span className="text-white">%</span>
              </div>
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${stats.savingsRate}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Transacciones</p>
              <p className="text-xl font-bold text-white">{stats.totalTransactions}</p>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-3">Total registradas</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Gasto Promedio</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white">{formatCurrency(stats.monthlyExpenses / 30)}</span>
              </div>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-3">Por día</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Diferencia</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white">{formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}</span>
              </div>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-3">Este mes</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(option.route)}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-xl p-3 border border-white/10 transition-all duration-300 hover:scale-105 text-left"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`} />
              <div className="relative z-10">
                <div className="p-1.5 rounded-lg bg-white/10 inline-block mb-2">
                  <div className="text-white">{option.icon}</div>
                </div>
                <h3 className="text-white text-sm font-medium">{option.title}</h3>
                {option.stats && <p className="text-white/40 text-xs mt-0.5">{option.stats}</p>}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Chart Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 shadow-sm">
            <div className="flex flex-col gap-4 mb-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white">Flujo de Caja</h3>
                  <p className="text-white/40 text-sm">Análisis de ingresos y gastos</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                  <button onClick={() => setChartType('area')} className={`p-2 rounded-lg transition-all ${chartType === 'area' ? 'bg-[#F05984] text-white shadow-sm' : 'text-white/60 hover:bg-white/10'}`}>
                    <AreaChartIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => setChartType('line')} className={`p-2 rounded-lg transition-all ${chartType === 'line' ? 'bg-[#F05984] text-white shadow-sm' : 'text-white/60 hover:bg-white/10'}`}>
                    <LineChartIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => setChartType('bar')} className={`p-2 rounded-lg transition-all ${chartType === 'bar' ? 'bg-[#F05984] text-white shadow-sm' : 'text-white/60 hover:bg-white/10'}`}>
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPeriod('week')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${period === 'week' ? 'bg-[#F05984] text-white shadow-md' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>7 Días</button>
                <button onClick={() => setPeriod('month')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${period === 'month' ? 'bg-[#F05984] text-white shadow-md' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>6 Meses</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              {renderChart()}
            </ResponsiveContainer>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-white/40 text-xs">Total Ingresos</p>
                <p className="text-white font-bold text-sm">{formatCurrency(chartData.reduce((s, d) => s + d.ingresos, 0))}</p>
              </div>
              <div className="text-center">
                <p className="text-white/40 text-xs">Total Gastos</p>
                <p className="text-white font-bold text-sm">{formatCurrency(chartData.reduce((s, d) => s + d.gastos, 0))}</p>
              </div>
              <div className="text-center">
                <p className="text-white/40 text-xs">Diferencia</p>
                <p className="text-[#F05984] font-bold text-sm">{formatCurrency(chartData.reduce((s, d) => s + (d.ingresos - d.gastos), 0))}</p>
              </div>
              <div className="text-center">
                <p className="text-white/40 text-xs">Promedio/Día</p>
                <p className="text-white font-bold text-sm">{formatCurrency(chartData.reduce((s, d) => s + (d.ingresos - d.gastos), 0) / chartData.length)}</p>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Actividad Reciente</h3>
              <button onClick={() => navigate('/incomes')} className="text-[#F05984] hover:text-[#d14d75] text-sm font-medium flex items-center gap-1 transition-colors">
                Ver todas <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                      {tx.type === 'income' ? <TrendingUp size={16} className="text-emerald-400" /> : <TrendingDown size={16} className="text-rose-400" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{tx.description}</p>
                      <p className="text-white/40 text-xs flex items-center gap-2 mt-0.5">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tx.status === 'completada' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {tx.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className={`font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Distribution */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 shadow-sm">
            <h3 className="text-lg font-bold text-white mb-4">Distribución por Categoría</h3>
            <div className="space-y-4">
              {categoryDistribution.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-white text-sm">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/60 text-sm">{cat.value}%</span>
                      <span className="text-white text-sm font-medium">{formatCurrency(cat.amount)}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${cat.value}%` }}
                      className="h-full rounded-full" style={{ backgroundColor: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Financial Health */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#321D28]/50 to-[#6E4068]/50 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F05984]/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#F05984]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Salud Financiera</h3>
                  <p className="text-white/40 text-xs">Tu puntuación</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#F05984]">78</div>
                <p className="text-white/40 text-xs">Bueno</p>
              </div>
            </div>
            <div className="space-y-4">
              {healthMetrics.map((metric, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/60 text-xs font-medium">{metric.name}</span>
                    <span className="text-white text-xs font-bold">{metric.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${metric.value}%` }}
                      className="h-full rounded-full" style={{ backgroundColor: metric.color }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Projection Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#BC455F]/20 to-[#F05984]/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F05984] text-white flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Proyección</h3>
                <p className="text-white/40 text-xs">Fin de mes</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60 text-xs">Ingresos Estimados</span>
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                </div>
                <p className="text-emerald-400 font-bold text-lg">{formatCurrency(4200)}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60 text-xs">Gastos Estimados</span>
                  <TrendingDown className="w-3 h-3 text-rose-400" />
                </div>
                <p className="text-rose-400 font-bold text-lg">{formatCurrency(2800)}</p>
              </div>
              <div className="bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/80 text-xs">Balance Proyectado</span>
                  <Wallet className="w-3 h-3 text-white/80" />
                </div>
                <p className="text-white font-bold text-lg">{formatCurrency(1400)}</p>
              </div>
            </div>
          </motion.div>

          {/* Información adicional según rol */}
          {userRole === 'admin' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-[#321D28]/50 to-[#6E4068]/50 rounded-2xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Users size={16} className="text-[#F05984]" />
                Panel de Administración
              </h3>
              <p className="text-white/60 text-sm">Gestiona clientes y reportes avanzados</p>
            </motion.div>
          )}

          {userRole === 'client' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-[#321D28]/50 to-[#6E4068]/50 rounded-2xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <UserCircle size={16} className="text-[#F05984]" />
                Tu Panel Personal
              </h3>
              <p className="text-white/60 text-sm">Gestiona tus finanzas personales y establece metas</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
