import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  Sparkles,
  Repeat,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign,
  Zap,
  Users,
  UserCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, containerVariants, itemVariants } from '../../../../shared/utils';

interface QuickOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  stats?: string;
}

// Tipo unificado para los datos del gráfico
interface ChartDataPoint {
  name: string;
  ingresos: number;
  gastos: number;
}

// Datos para el gráfico de 7 días
const weeklyChartData: ChartDataPoint[] = [
  { name: 'Lun', ingresos: 450, gastos: 320 },
  { name: 'Mar', ingresos: 380, gastos: 420 },
  { name: 'Mié', ingresos: 520, gastos: 380 },
  { name: 'Jue', ingresos: 410, gastos: 450 },
  { name: 'Vie', ingresos: 480, gastos: 390 },
  { name: 'Sáb', ingresos: 530, gastos: 410 },
  { name: 'Dom', ingresos: 490, gastos: 370 },
];

// Datos para el gráfico de 6 meses
const monthlyChartData: ChartDataPoint[] = [
  { name: 'Ene', ingresos: 3200, gastos: 2800 },
  { name: 'Feb', ingresos: 3600, gastos: 3100 },
  { name: 'Mar', ingresos: 3800, gastos: 3200 },
  { name: 'Abr', ingresos: 3500, gastos: 2800 },
  { name: 'May', ingresos: 4000, gastos: 3300 },
  { name: 'Jun', ingresos: 4200, gastos: 3400 },
];

// Datos para el gráfico de pastel
const pieChartExpensesData = [
  { name: 'Alimentación', value: 35, color: '#F05984', amount: 1240.50 },
  { name: 'Vivienda', value: 28, color: '#BC455F', amount: 1200.00 },
  { name: 'Transporte', value: 15, color: '#6E4068', amount: 650.00 },
  { name: 'Entretenimiento', value: 12, color: '#321D28', amount: 520.00 },
  { name: 'Salud', value: 10, color: '#2DD4BF', amount: 430.00 },
];

const pieChartIncomeData = [
  { name: 'Salario', value: 45, color: '#F05984', amount: 3250.00 },
  { name: 'Freelance', value: 30, color: '#BC455F', amount: 2150.00 },
  { name: 'Inversiones', value: 15, color: '#6E4068', amount: 1080.00 },
  { name: 'Otros', value: 10, color: '#321D28', amount: 720.00 },
];

const recentTransactions = [
  { id: 1, description: 'Supermercado', amount: 156.75, type: 'expense', category: 'Alimentación', date: 'Hoy' },
  { id: 2, description: 'Pago de nómina', amount: 2500.00, type: 'income', category: 'Salario', date: 'Ayer' },
  { id: 3, description: 'Netflix', amount: 15.99, type: 'expense', category: 'Suscripciones', date: 'Ayer' },
  { id: 4, description: 'Cliente Proyecto Web', amount: 3500.00, type: 'income', category: 'Servicios', date: '23 Feb' },
];

const healthMetrics = [
  { name: 'Control de Gastos', value: 85, color: '#F05984' },
  { name: 'Capacidad de Ahorro', value: 72, color: '#BC455F' },
  { name: 'Estabilidad', value: 68, color: '#6E4068' },
];

type ChartPeriod = 'week' | 'month';

export const HomePage = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [userRole] = useState<'admin' | 'client'>(localStorage.getItem('userRole') as 'admin' | 'client' || 'client');
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [period, setPeriod] = useState<ChartPeriod>('week');
  const [activePieChart, setActivePieChart] = useState<'expenses' | 'income'>('expenses');

  const stats = {
    balance: 12580.75,
    monthlyIncome: 3250.00,
    monthlyExpenses: 1245.50,
    savingsRate: 62
  };

  const quickOptions: QuickOption[] = [
    { id: 'incomes', title: 'Ingresos', description: 'Registra tus ingresos', icon: <TrendingUp size={22} />, color: 'from-emerald-500/20 to-emerald-600/20', route: '/incomes', stats: '+12%' },
    { id: 'expenses', title: 'Gastos', description: 'Controla tus gastos', icon: <TrendingDown size={22} />, color: 'from-rose-500/20 to-rose-600/20', route: '/expenses', stats: '-5%' },
    { id: 'recurring-expenses', title: 'Gastos Rec.', description: 'Suscripciones', icon: <Repeat size={22} />, color: 'from-orange-500/20 to-orange-600/20', route: '/recurring-expenses', stats: '12' },
    { id: 'budgets', title: 'Presupuestos', description: 'Controla límites', icon: <Wallet size={22} />, color: 'from-blue-500/20 to-blue-600/20', route: '/budgets', stats: '80%' },
    { id: 'goals', title: 'Metas', description: 'Objetivos financieros', icon: <Target size={22} />, color: 'from-purple-500/20 to-purple-600/20', route: '/goals', stats: '3' },
    { id: 'savings', title: 'Ahorro', description: 'Metas de ahorro', icon: <PiggyBank size={22} />, color: 'from-pink-500/20 to-pink-600/20', route: '/savings', stats: '$7.8k' },
  ];

  useEffect(() => {
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

    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    setTimeout(() => setIsLoading(false), 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Obtener datos del gráfico según el período
  const getChartData = (): ChartDataPoint[] => {
    return period === 'week' ? weeklyChartData : monthlyChartData;
  };

  const chartData = getChartData();
  
  const currentPieData = activePieChart === 'expenses' ? pieChartExpensesData : pieChartIncomeData;
  const totalAmount = currentPieData.reduce((sum, item) => sum + item.amount, 0);

  // Calcular totales según el período
  const totalIngresos = chartData.reduce((sum, d) => sum + d.ingresos, 0);
  const totalGastos = chartData.reduce((sum, d) => sum + d.gastos, 0);
  const diferencia = totalIngresos - totalGastos;
  const promedioDiario = period === 'week' ? diferencia / 7 : diferencia / 180;

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 space-y-6" style={{ backgroundColor: '#1a0f14' }}>
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-white/10 rounded-3xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white/10 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-white/10 rounded-2xl" />
            <div className="h-96 bg-white/10 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4 md:p-6 space-y-8"
      style={{ backgroundColor: '#1a0f14' }}
    >
      {/* Welcome Banner */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5, ease: "easeInOut" } }}
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
      </AnimatePresence>

      {/* Quick Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Tasa de Ahorro</p>
              <p className="text-2xl font-bold text-white">{stats.savingsRate}%</p>
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.savingsRate}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" 
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Transacciones</p>
              <p className="text-2xl font-bold text-white">145</p>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-3">Total registradas</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Gasto Promedio</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(42)}</p>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-3">Por día</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Diferencia</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.monthlyIncome - stats.monthlyExpenses)}</p>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-3">Este mes</p>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-white mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(option.route)}
              className="group bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 transition-all text-left"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-3`}>
                {option.icon}
              </div>
              <h3 className="text-white font-medium text-sm">{option.title}</h3>
              <p className="text-white/40 text-xs mt-1">{option.description}</p>
              {option.stats && (
                <span className="inline-block mt-2 text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                  {option.stats}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Chart Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">Flujo de Caja</h3>
                <p className="text-white/40 text-sm">Ingresos vs Gastos</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPeriod('week')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all min-h-[36px] ${
                    period === 'week' ? 'bg-[#F05984] text-white shadow-md' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  7 días
                </button>
                <button
                  onClick={() => setPeriod('month')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all min-h-[36px] ${
                    period === 'month' ? 'bg-[#F05984] text-white shadow-md' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  6 meses
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a0f14',
                    border: '1px solid #BC455F',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number) => [`$${value}`, '']}
                  labelStyle={{ color: 'white' }}
                />
                <Legend />
                <Area type="monotone" dataKey="ingresos" stroke="#F05984" strokeWidth={2} fill="url(#colorIngresos)" />
                <Area type="monotone" dataKey="gastos" stroke="#BC455F" strokeWidth={2} fill="url(#colorGastos)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-white/40 text-xs">Total Ingresos</p>
                <p className="text-white font-bold text-sm">{formatCurrency(totalIngresos)}</p>
              </div>
              <div className="text-center">
                <p className="text-white/40 text-xs">Total Gastos</p>
                <p className="text-white font-bold text-sm">{formatCurrency(totalGastos)}</p>
              </div>
              <div className="text-center">
                <p className="text-white/40 text-xs">Diferencia</p>
                <p className={`font-bold text-sm ${diferencia >= 0 ? 'text-[#F05984]' : 'text-rose-400'}`}>
                  {formatCurrency(diferencia)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/40 text-xs">Promedio/Día</p>
                <p className="text-white font-bold text-sm">{formatCurrency(promedioDiario)}</p>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white mb-4">Actividad Reciente</h3>
            <div className="space-y-2">
              {recentTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'income' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                  }`}>
                    {tx.type === 'income' ? (
                      <TrendingUp size={16} className="text-emerald-400" />
                    ) : (
                      <TrendingDown size={16} className="text-rose-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{tx.description}</p>
                    <p className="text-white/40 text-xs">{tx.category} • {tx.date}</p>
                  </div>
                  <p className={`font-semibold text-sm flex-shrink-0 ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pie Chart Section */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">
                {activePieChart === 'expenses' ? 'Distribución de Gastos' : 'Distribución de Ingresos'}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setActivePieChart('expenses')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
                    activePieChart === 'expenses' ? 'bg-[#F05984] text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Gastos
                </button>
                <button
                  onClick={() => setActivePieChart('income')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
                    activePieChart === 'income' ? 'bg-[#F05984] text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Ingresos
                </button>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={200}>
              <RePieChart>
                <Pie
                  data={currentPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {currentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a0f14',
                    border: '1px solid #BC455F',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`]}
                  itemStyle={{ color: 'white' }}
                />
              </RePieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {currentPieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-white/70">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/50 text-xs">{item.value}%</span>
                    <span className="text-white font-medium text-xs">{formatCurrency(item.amount)}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-white/50 text-xs">Total</span>
                <span className="text-white font-bold text-sm">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </motion.div>

          {/* Financial Health */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
            className="bg-gradient-to-br from-[#321D28]/50 to-[#6E4068]/50 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
          >
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
                    <span className="text-white/50 text-xs font-medium">{metric.name}</span>
                    <span className="text-white text-xs font-bold">{metric.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: metric.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Projection Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
            className="bg-gradient-to-br from-[#BC455F]/20 to-[#F05984]/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
          >
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
                  <span className="text-white/50 text-xs">Ingresos Estimados</span>
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                </div>
                <p className="text-emerald-400 font-bold text-lg">{formatCurrency(4200)}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/50 text-xs">Gastos Estimados</span>
                  <TrendingDown className="w-3 h-3 text-rose-400" />
                </div>
                <p className="text-rose-400 font-bold text-lg">{formatCurrency(2800)}</p>
              </div>
              <div className="bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/70 text-xs">Balance Proyectado</span>
                  <Wallet className="w-3 h-3 text-white/70" />
                </div>
                <p className="text-white font-bold text-lg">{formatCurrency(1400)}</p>
              </div>
            </div>
          </motion.div>

          {/* Rol info */}
          {userRole === 'admin' && (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
              className="bg-gradient-to-r from-[#321D28]/50 to-[#6E4068]/50 rounded-2xl p-4 border border-white/10"
            >
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Users size={16} className="text-[#F05984]" />
                Panel de Administración
              </h3>
              <p className="text-white/50 text-sm">Gestiona clientes y reportes avanzados</p>
            </motion.div>
          )}

          {userRole === 'client' && (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
              className="bg-gradient-to-r from-[#321D28]/50 to-[#6E4068]/50 rounded-2xl p-4 border border-white/10"
            >
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <UserCircle size={16} className="text-[#F05984]" />
                Tu Panel Personal
              </h3>
              <p className="text-white/50 text-sm">Gestiona tus finanzas personales</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
