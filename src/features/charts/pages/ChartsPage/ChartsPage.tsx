import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw,
  ArrowUp,
  Activity,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Home as HomeIcon,
  Wallet,
  ShoppingBag,
  Utensils,
  Car,
  Heart,
  Film,
  Zap,
  Shield,
  Sparkles,
  Briefcase
} from 'lucide-react';

interface ChartData {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}

// Datos de ejemplo - Evolución mensual
const monthlyData: ChartData[] = [
  { month: 'Ene', income: 3250, expense: 2100, savings: 1150 },
  { month: 'Feb', income: 3400, expense: 1950, savings: 1450 },
  { month: 'Mar', income: 3100, expense: 2300, savings: 800 },
  { month: 'Abr', income: 3550, expense: 2050, savings: 1500 },
  { month: 'May', income: 3300, expense: 2250, savings: 1050 },
  { month: 'Jun', income: 3600, expense: 1900, savings: 1700 },
  { month: 'Jul', income: 3450, expense: 2150, savings: 1300 },
  { month: 'Ago', income: 3200, expense: 2350, savings: 850 },
  { month: 'Sep', income: 3350, expense: 2000, savings: 1350 },
  { month: 'Oct', income: 3500, expense: 2200, savings: 1300 },
  { month: 'Nov', income: 3650, expense: 2100, savings: 1550 },
  { month: 'Dic', income: 3800, expense: 2500, savings: 1300 }
];

// Datos de categorías de ingresos con iconos
const incomeCategories: CategoryData[] = [
  { name: 'Salario', value: 28500, color: '#10b981', icon: <Wallet size={14} /> },
  { name: 'Servicios', value: 12500, color: '#3b82f6', icon: <Briefcase size={14} /> },
  { name: 'Ventas', value: 8500, color: '#8b5cf6', icon: <ShoppingBag size={14} /> },
  { name: 'Inversiones', value: 4200, color: '#06b6d4', icon: <TrendingUp size={14} /> },
  { name: 'Otros', value: 3800, color: '#6b7280', icon: <Sparkles size={14} /> }
];

// Datos de categorías de gastos con iconos
const expenseCategories: CategoryData[] = [
  { name: 'Vivienda', value: 14400, color: '#3b82f6', icon: <HomeIcon size={14} /> },
  { name: 'Alimentación', value: 5120, color: '#f59e0b', icon: <Utensils size={14} /> },
  { name: 'Transporte', value: 3240, color: '#10b981', icon: <Car size={14} /> },
  { name: 'Servicios', value: 2840, color: '#06b6d4', icon: <Zap size={14} /> },
  { name: 'Ocio', value: 2150, color: '#8b5cf6', icon: <Film size={14} /> },
  { name: 'Salud', value: 1850, color: '#ef4444', icon: <Heart size={14} /> },
  { name: 'Compras', value: 1650, color: '#ec4899', icon: <ShoppingBag size={14} /> },
  { name: 'Seguros', value: 1350, color: '#6366f1', icon: <Shield size={14} /> }
];

// Datos trimestrales
const quarterlyData = [
  { quarter: 'Q1 2024', income: 9750, expense: 6350, savings: 3400 },
  { quarter: 'Q2 2024', income: 10450, expense: 6200, savings: 4250 },
  { quarter: 'Q3 2024', income: 10000, expense: 6500, savings: 3500 },
  { quarter: 'Q4 2024', income: 10950, expense: 6800, savings: 4150 }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

// Componente de tooltip personalizado
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-xl rounded-xl p-3 shadow-2xl border border-white/20">
        <p className="text-xs text-white/60 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-white/80">{entry.name}:</span>
            </div>
            <span className="font-mono text-white">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface CustomPieChartProps {
  data: CategoryData[];
  title: string;
  total: number;
}

// Componente de gráfico de pastel personalizado
const CustomPieChart = ({ data, title, total }: CustomPieChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#F05984]/30 transition-all"
    >
      <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
        <PieChartIcon size={18} className="text-[#F05984]" />
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            labelLine={{ stroke: '#ffffff60', strokeWidth: 1 }}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke={activeIndex === index ? '#fff' : 'none'}
                strokeWidth={activeIndex === index ? 2 : 0}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => <span className="text-white/70 text-xs">{value}</span>}
            wrapperStyle={{ paddingTop: '20px' }}
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-white/40 text-sm">Total: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(total)}</p>
      </div>
    </motion.div>
  );
};

export const ChartsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comparison' | 'income' | 'expense'>('comparison');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6m');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getFilteredData = () => {
    let filtered = [...monthlyData];
    if (selectedPeriod === '3m') filtered = filtered.slice(-3);
    if (selectedPeriod === '6m') filtered = filtered.slice(-6);
    if (selectedPeriod === '1y') filtered = filtered.slice(-12);
    return filtered;
  };

  const filteredData = getFilteredData();
  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.value, 0);
  const totalExpense = expenseCategories.reduce((sum, cat) => sum + cat.value, 0);
  const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;

  // Top 5 categorías de gastos
  const topExpenseCategories = [...expenseCategories].sort((a, b) => b.value - a.value).slice(0, 5);

  // Skeleton Loader
  if (isLoading) {
    return (
      <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between">
            <div className="h-8 w-48 bg-white/10 rounded-lg" />
            <div className="h-10 w-32 bg-white/10 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-white/10 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 min-h-screen p-6"
      style={{ backgroundColor: '#1a0f14' }}
    >
      {/* Header Mejorado */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-[#321D28] via-[#4a2d40] to-[#321D28] rounded-2xl p-6 border border-white/10 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05984]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#BC455F]/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#F05984] to-[#BC455F] rounded-xl shadow-lg">
              <BarChart3 size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Análisis y Gráficos</h1>
              <p className="text-white/50 text-sm mt-1">Visualiza y analiza tus ingresos y gastos</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 text-white/80 hover:text-white backdrop-blur-sm"
            >
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                showFilters ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white backdrop-blur-sm'
              }`}
            >
              <Filter size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 text-white/80 hover:text-white backdrop-blur-sm"
            >
              <Download size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards Mejoradas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium mb-1">Ingresos Totales</p>
              <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(totalIncome)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp size={14} className="text-green-400" />
                <span className="text-green-400 text-sm font-medium">+8.5%</span>
                <span className="text-white/30 text-xs ml-1">vs año anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <TrendingUp size={24} className="text-green-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium mb-1">Gastos Totales</p>
              <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(totalExpense)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp size={14} className="text-red-400" />
                <span className="text-red-400 text-sm font-medium">+3.2%</span>
                <span className="text-white/30 text-xs ml-1">vs año anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-red-500/20">
              <TrendingDown size={24} className="text-red-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium mb-1">Ahorro Total</p>
              <p className="text-2xl font-bold text-green-400 tracking-tight">{formatCurrency(totalIncome - totalExpense)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp size={14} className="text-green-400" />
                <span className="text-green-400 text-sm font-medium">+12.4%</span>
                <span className="text-white/30 text-xs ml-1">vs año anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Target size={24} className="text-blue-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/50">Tasa de ahorro</span>
              <span className="text-white font-medium">{savingsRate.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${savingsRate}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Gráfico de Pastel y Top 5 Categorías */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomPieChart 
          data={incomeCategories} 
          title="Distribución de Ingresos" 
          total={totalIncome}
        />
        
        {/* Top 5 Categorías de Gastos */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#F05984]/30 transition-all"
        >
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <TrendingDown size={18} className="text-[#F05984]" />
            Top 5 Categorías de Gastos
          </h3>
          <div className="space-y-4">
            {topExpenseCategories.map((cat, index) => {
              const percentage = (cat.value / totalExpense) * 100;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${cat.color}20` }}>
                        {cat.icon}
                      </div>
                      <span className="text-white text-sm font-medium">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/50 text-xs">{percentage.toFixed(1)}%</span>
                      <span className="text-white text-sm font-semibold">{formatCurrency(cat.value)}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Tabs y Gráficos Principales */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('comparison')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-all ${
              activeTab === 'comparison'
                ? 'text-[#F05984] border-b-2 border-[#F05984] bg-white/5'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BarChart3 size={16} />
              Comparación General
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('income')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-all ${
              activeTab === 'income'
                ? 'text-[#F05984] border-b-2 border-[#F05984] bg-white/5'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp size={16} />
              Análisis de Ingresos
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('expense')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-all ${
              activeTab === 'expense'
                ? 'text-[#F05984] border-b-2 border-[#F05984] bg-white/5'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingDown size={16} />
              Análisis de Gastos
            </div>
          </motion.button>
        </div>

        {/* Panel de filtros colapsable */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border-b border-white/10 bg-white/5 overflow-hidden"
            >
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-white/40" />
                  <span className="text-white/60 text-sm">Período:</span>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm cursor-pointer"
                  >
                    <option value="1m">Último mes</option>
                    <option value="3m">Últimos 3 meses</option>
                    <option value="6m">Últimos 6 meses</option>
                    <option value="1y">Último año</option>
                    <option value="2y">Últimos 2 años</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-white/60 text-sm">Tipo de gráfico:</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChartType('bar')}
                    className={`p-2 rounded-lg transition-all ${
                      chartType === 'bar'
                        ? 'bg-[#F05984] text-white shadow-lg'
                        : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                    }`}
                    title="Gráfico de barras"
                  >
                    <BarChart3 size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChartType('line')}
                    className={`p-2 rounded-lg transition-all ${
                      chartType === 'line'
                        ? 'bg-[#F05984] text-white shadow-lg'
                        : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                    }`}
                    title="Gráfico de líneas"
                  >
                    <LineChartIcon size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChartType('area')}
                    className={`p-2 rounded-lg transition-all ${
                      chartType === 'area'
                        ? 'bg-[#F05984] text-white shadow-lg'
                        : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                    }`}
                    title="Gráfico de área"
                  >
                    <Activity size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'comparison' && (
            <div className="space-y-8">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#F05984]" />
                  Evolución Ingresos vs Gastos
                </h3>
                {chartType === 'bar' && (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="month" stroke="#ffffff60" tick={{ fill: '#ffffff60' }} />
                      <YAxis stroke="#ffffff60" tick={{ fill: '#ffffff60' }} tickFormatter={(value) => `$${value}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: '#ffffff60' }} />
                      <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="expense" name="Gastos" fill="#ef4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {chartType === 'line' && (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="month" stroke="#ffffff60" tick={{ fill: '#ffffff60' }} />
                      <YAxis stroke="#ffffff60" tick={{ fill: '#ffffff60' }} tickFormatter={(value) => `$${value}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: '#ffffff60' }} />
                      <Line type="monotone" dataKey="income" name="Ingresos" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                      <Line type="monotone" dataKey="expense" name="Gastos" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                {chartType === 'area' && (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="month" stroke="#ffffff60" tick={{ fill: '#ffffff60' }} />
                      <YAxis stroke="#ffffff60" tick={{ fill: '#ffffff60' }} tickFormatter={(value) => `$${value}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: '#ffffff60' }} />
                      <Area type="monotone" dataKey="income" name="Ingresos" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="expense" name="Gastos" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Resumen trimestral mejorado */}
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-[#F05984]" />
                  Resumen Trimestral
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quarterlyData.map((quarter, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10 hover:border-[#F05984]/30 transition-all cursor-pointer"
                    >
                      <p className="text-white/40 text-xs mb-3">{quarter.quarter}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 text-sm">Ingresos:</span>
                          <span className="text-white font-medium">{formatCurrency(quarter.income)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-red-400 text-sm">Gastos:</span>
                          <span className="text-white font-medium">{formatCurrency(quarter.expense)}</span>
                        </div>
                        <div className="w-full h-px bg-white/10 my-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-blue-400 text-sm">Ahorro:</span>
                          <span className="text-white font-bold">{formatCurrency(quarter.savings)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'income' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                    <TrendingUp size={18} className="text-green-400" />
                    Evolución de Ingresos
                  </h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="month" stroke="#ffffff60" tick={{ fill: '#ffffff60' }} />
                      <YAxis stroke="#ffffff60" tick={{ fill: '#ffffff60' }} tickFormatter={(value) => `$${value}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <CustomPieChart 
                  data={incomeCategories} 
                  title="Distribución por Categoría" 
                  total={totalIncome}
                />
              </div>
            </div>
          )}

          {activeTab === 'expense' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                    <TrendingDown size={18} className="text-red-400" />
                    Evolución de Gastos
                  </h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="month" stroke="#ffffff60" tick={{ fill: '#ffffff60' }} />
                      <YAxis stroke="#ffffff60" tick={{ fill: '#ffffff60' }} tickFormatter={(value) => `$${value}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="expense" name="Gastos" fill="#ef4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <CustomPieChart 
                  data={expenseCategories} 
                  title="Distribución por Categoría" 
                  total={totalExpense}
                />
              </div>
            </div>
          )}
        </div>

        {/* Insights mejorado */}
        <div className="p-5 border-t border-white/10 bg-gradient-to-r from-[#321D28]/30 to-[#6E4068]/30">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity size={18} className="text-[#F05984]" />
            Insights y Recomendaciones
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-3 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="p-2 bg-green-500/20 rounded-lg"><TrendingUp size={18} className="text-green-400" /></div>
              <div>
                <p className="text-white/90 text-sm font-medium mb-1">Crecimiento de ingresos</p>
                <p className="text-white/60 text-xs">Tus ingresos han aumentado un <span className="text-green-400 font-medium">8.5%</span> respecto al año anterior</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-3 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="p-2 bg-red-500/20 rounded-lg"><TrendingDown size={18} className="text-red-400" /></div>
              <div>
                <p className="text-white/90 text-sm font-medium mb-1">Área de oportunidad</p>
                <p className="text-white/60 text-xs">Tus gastos en ocio representan el <span className="text-red-400 font-medium">15%</span> del total</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-3 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="p-2 bg-blue-500/20 rounded-lg"><Target size={18} className="text-blue-400" /></div>
              <div>
                <p className="text-white/90 text-sm font-medium mb-1">Tasa de ahorro</p>
                <p className="text-white/60 text-xs">Tu tasa de ahorro actual es del <span className="text-blue-400 font-medium">{savingsRate.toFixed(0)}%</span>, por encima del promedio</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Estilos CSS para el scrollbar personalizado */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #F05984 #1a0f14;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a0f14;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #F05984, #BC455F);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #BC455F, #6E4068);
        }
      `}</style>
    </motion.div>
  );
};