import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  DollarSign,
  CreditCard,
  Wallet,
  Home as HomeIcon,
  Briefcase,
  Gift,
  Award,
  Laptop,
  ShoppingBag,
  Utensils,
  Car,
  Heart,
  Film,
  Zap,
  Shield,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Activity,
  LineChart,
  Target,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Printer,
  Share2,
  Image,
  FileText,
  Database,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';

// Componente GlassCard premium
const GlassCard = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={`
      relative overflow-hidden
      backdrop-blur-xl bg-white/[0.02] 
      border border-white/[0.08] rounded-2xl
      shadow-[0_8px_32px_rgba(0,0,0,0.12)]
      hover:border-white/[0.15] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]
      transition-all duration-500
      ${className}
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent 
      translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
    {children}
  </motion.div>
);

// Componente de tooltip personalizado
const CustomTooltip = ({ active, payload, label, type = 'default' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-white/20 animate-in fade-in zoom-in min-w-[200px]">
        <p className="text-xs font-mono text-white/60 mb-2 border-b border-white/10 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm py-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
              <span className="text-white/80">{entry.name}:</span>
            </div>
            <span className="font-mono text-white font-medium">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Componente KPI Card con sparkline
const KPICard = ({ title, value, trend, trendValue, icon: Icon, color, delay = 0 }) => (
  <GlassCard delay={delay} className="p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/40 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        <div className="flex items-center gap-1 mt-2">
          {trend > 0 ? <ArrowUp size={14} className="text-emerald-400" /> : <ArrowDown size={14} className="text-rose-400" />}
          <span className={`text-sm font-medium ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-white/40 text-xs ml-1">{trendValue}</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-r ${color} bg-opacity-20`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </GlassCard>
);

// Componente de selector de período
const PeriodSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const periods = [
    { value: '1m', label: 'Último mes' },
    { value: '3m', label: 'Últimos 3 meses' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '1y', label: 'Último año' },
    { value: '2y', label: 'Últimos 2 años' }
  ];
  
  const getPeriodLabel = (val: string) => periods.find(p => p.value === val)?.label || 'Seleccionar';
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
      >
        <Calendar size={16} className="text-white/60" />
        <span className="text-white text-sm">{getPeriodLabel(value)}</span>
        <ChevronDown size={14} className={`text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-48 bg-[#1a0f14] rounded-xl border border-white/10 shadow-xl z-10 overflow-hidden"
          >
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => { onChange(period.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${value === period.value ? 'bg-[#F05984]/20 text-[#F05984]' : 'text-white/70 hover:bg-white/10'}`}
              >
                {period.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente de exportación
const ExportMenu = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const exportOptions = [
    { icon: <Image size={14} />, label: 'PNG Image', format: 'png' },
    { icon: <FileText size={14} />, label: 'PDF Document', format: 'pdf' },
    { icon: <Database size={14} />, label: 'CSV Data', format: 'csv' },
    { icon: <FileText size={14} />, label: 'JSON Raw', format: 'json' }
  ];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
      >
        <Download size={16} className="text-white/60" />
        <span className="text-white text-sm">Exportar</span>
        <ChevronDown size={14} className={`text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-48 bg-[#1a0f14] rounded-xl border border-white/10 shadow-xl z-10 overflow-hidden"
          >
            {exportOptions.map((option) => (
              <button
                key={option.format}
                onClick={() => { onExport(option.format); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:bg-white/10 transition-colors"
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Gráfico de barras mejorado
const EnhancedBarChart = ({ data, type }) => {
  const maxValue = Math.max(...data.map(d => type === 'both' ? Math.max(d.income, d.expense) : type === 'income' ? d.income : d.expense));
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const incomePercent = (item.income / maxValue) * 100;
        const expensePercent = (item.expense / maxValue) * 100;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/80">{item.month}</span>
                {(type === 'income' || type === 'both') && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 rounded-full">
                    <TrendingUp size={10} className="text-emerald-400" />
                    <span className="text-xs text-emerald-400">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(item.income)}
                    </span>
                  </div>
                )}
                {(type === 'expense' || type === 'both') && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 rounded-full">
                    <TrendingDown size={10} className="text-rose-400" />
                    <span className="text-xs text-rose-400">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(item.expense)}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-xs text-white/40">
                {((item.income - item.expense) / item.income * 100).toFixed(0)}% ahorro
              </div>
            </div>
            <div className="flex gap-1 h-12 rounded-lg overflow-hidden bg-white/5">
              {(type === 'income' || type === 'both') && (
                <motion.div 
                  className="relative bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700 hover:opacity-90 cursor-pointer group/bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${incomePercent}%` }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                >
                  <div className="absolute inset-0 flex items-center justify-end px-3 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    <span className="text-xs text-white font-medium">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(item.income)}
                    </span>
                  </div>
                </motion.div>
              )}
              {(type === 'expense' || type === 'both') && (
                <motion.div 
                  className="relative bg-gradient-to-r from-rose-400 to-red-500 transition-all duration-700 hover:opacity-90 cursor-pointer group/bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${expensePercent}%` }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                >
                  <div className="absolute inset-0 flex items-center justify-end px-3 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    <span className="text-xs text-white font-medium">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(item.expense)}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Gráfico de pastel tipo dona
const DonutChart = ({ data, total, centerText }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const itemsWithPercentage = data.map((item, index) => ({
    ...item,
    percentage: (item.amount / total) * 100,
    index
  }));

  return (
    <div className="space-y-6">
      <div className="relative flex justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {itemsWithPercentage.map((item) => {
              const startAngle = itemsWithPercentage.slice(0, item.index).reduce((sum, i) => sum + (i.percentage * 3.6), 0);
              const angle = item.percentage * 3.6;
              const endAngle = startAngle + angle;
              
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = 50 + 35 * Math.cos(startRad);
              const y1 = 50 + 35 * Math.sin(startRad);
              const x2 = 50 + 35 * Math.cos(endRad);
              const y2 = 50 + 35 * Math.sin(endRad);
              const largeArc = angle > 180 ? 1 : 0;
              
              const colors = item.color === 'income' ? 'from-emerald-400 to-teal-500' : 'from-rose-400 to-red-500';
              
              return (
                <path
                  key={item.index}
                  d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  className="transition-all duration-300 cursor-pointer hover:opacity-80"
                  style={{ 
                    fill: `url(#gradient-${item.index})`,
                    transform: hoveredIndex === item.index ? 'scale(1.02)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={() => setHoveredIndex(item.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
            <defs>
              {itemsWithPercentage.map((item, idx) => (
                <radialGradient key={idx} id={`gradient-${idx}`}>
                  <stop offset="0%" stopColor={item.color === 'income' ? '#10b981' : '#f43f5e'} />
                  <stop offset="100%" stopColor={item.color === 'income' ? '#14b8a6' : '#ef4444'} />
                </radialGradient>
              ))}
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-[#1a0f14]/80 rounded-full w-24 h-24 flex flex-col items-center justify-center backdrop-blur-sm">
              <p className="text-xl font-bold text-white">{centerText.value}</p>
              <p className="text-xs text-white/40">{centerText.label}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2">
        {itemsWithPercentage.map((item) => (
          <div
            key={item.index}
            className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 cursor-pointer ${hoveredIndex === item.index ? 'bg-white/10 scale-[1.02]' : 'bg-white/5 hover:bg-white/10'}`}
            onMouseEnter={() => setHoveredIndex(item.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: item.color === 'income' ? '#10b981' : '#f43f5e' }} />
              <div className="p-1 rounded-lg bg-white/5">
                {item.icon}
              </div>
              <span className="text-white text-sm">{item.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-medium">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(item.amount)}
              </span>
              <span className="text-white/40 text-xs w-12 text-right">{item.percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartsPage = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'income' | 'expense'>('comparison');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6m');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'donut'>('bar');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const monthlyData = [
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

  const incomeCategories = [
    { category: 'Salario', amount: 28500, color: 'income', icon: <Briefcase size={14} /> },
    { category: 'Servicios', amount: 12500, color: 'income', icon: <Laptop size={14} /> },
    { category: 'Ventas', amount: 8500, color: 'income', icon: <ShoppingBag size={14} /> },
    { category: 'Inversiones', amount: 4200, color: 'income', icon: <TrendingUpIcon size={14} /> },
    { category: 'Otros', amount: 3800, color: 'income', icon: <Sparkles size={14} /> }
  ];

  const expenseCategories = [
    { category: 'Vivienda', amount: 14400, color: 'expense', icon: <HomeIcon size={14} /> },
    { category: 'Alimentación', amount: 5120, color: 'expense', icon: <Utensils size={14} /> },
    { category: 'Transporte', amount: 3240, color: 'expense', icon: <Car size={14} /> },
    { category: 'Servicios', amount: 2840, color: 'expense', icon: <Zap size={14} /> },
    { category: 'Ocio', amount: 2150, color: 'expense', icon: <Film size={14} /> },
    { category: 'Salud', amount: 1850, color: 'expense', icon: <Heart size={14} /> },
    { category: 'Compras', amount: 1650, color: 'expense', icon: <ShoppingBag size={14} /> },
    { category: 'Seguros', amount: 1350, color: 'expense', icon: <Shield size={14} /> }
  ];

  const quarterlyData = [
    { quarter: 'Q1 2024', income: 9750, expense: 6350, savings: 3400, incomeGrowth: 5.2, expenseGrowth: 2.1 },
    { quarter: 'Q2 2024', income: 10450, expense: 6200, savings: 4250, incomeGrowth: 7.2, expenseGrowth: -2.4 },
    { quarter: 'Q3 2024', income: 10000, expense: 6500, savings: 3500, incomeGrowth: -4.3, expenseGrowth: 4.8 },
    { quarter: 'Q4 2024', income: 10950, expense: 6800, savings: 4150, incomeGrowth: 9.5, expenseGrowth: 4.6 }
  ];

  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalExpense = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = (format: string) => {
    console.log('Exportando en formato:', format);
  };

  const getFilteredData = () => {
    let filtered = [...monthlyData];
    if (selectedPeriod === '3m') filtered = filtered.slice(-3);
    if (selectedPeriod === '6m') filtered = filtered.slice(-6);
    if (selectedPeriod === '1y') filtered = filtered.slice(-12);
    return filtered;
  };

  const filteredData = getFilteredData();

  return (
    <div className={`min-h-screen p-6 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#1a0f14]' : 'bg-gray-50'}`}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header con diseño refinado */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Financial Analytics
            </h1>
            <p className="text-white/60 text-sm mt-1 font-light">
              Visualiza y analiza tus finanzas con gráficos interactivos
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all backdrop-blur-xl border border-white/10"
            >
              {theme === 'dark' ? <Sun size={18} className="text-white/70" /> : <Moon size={18} />}
            </button>
            <button onClick={handleRefresh} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all backdrop-blur-xl border border-white/10">
              <RefreshCw size={18} className={`text-white/70 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-xl transition-all backdrop-blur-xl border border-white/10 ${showFilters ? 'bg-[#F05984]/20 text-[#F05984]' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
              <Filter size={18} />
            </button>
            <ExportMenu onExport={handleExport} />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard
            title="Ingresos Totales"
            value={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(totalIncome)}
            trend={8.5}
            trendValue="vs año anterior"
            icon={TrendingUpIcon}
            color="from-emerald-400 to-teal-500"
            delay={0}
          />
          <KPICard
            title="Gastos Totales"
            value={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(totalExpense)}
            trend={3.2}
            trendValue="vs año anterior"
            icon={TrendingDownIcon}
            color="from-rose-400 to-red-500"
            delay={0.1}
          />
          <KPICard
            title="Ahorro Total"
            value={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(totalIncome - totalExpense)}
            trend={12.4}
            trendValue="vs año anterior"
            icon={Target}
            color="from-indigo-400 to-purple-500"
            delay={0.2}
          />
        </div>

        {/* Tabs y controles */}
        <GlassCard className="overflow-hidden">
          <div className="flex border-b border-white/10">
            {[
              { id: 'comparison', label: 'Comparación General', icon: <BarChart3 size={16} /> },
              { id: 'income', label: 'Análisis de Ingresos', icon: <TrendingUp size={16} /> },
              { id: 'expense', label: 'Análisis de Gastos', icon: <TrendingDown size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-[#F05984] border-b-2 border-[#F05984] bg-white/5'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 flex flex-wrap gap-4 border-b border-white/10 bg-white/5">
            <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Año:</span>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F05984] text-sm cursor-pointer">
                {['2024', '2023', '2022', '2021', '2020'].map((year) => (<option key={year} value={year}>{year}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setChartType('bar')} className={`p-2 rounded-xl transition-all ${chartType === 'bar' ? 'bg-[#F05984] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`}><BarChart3 size={18} /></button>
              <button onClick={() => setChartType('line')} className={`p-2 rounded-xl transition-all ${chartType === 'line' ? 'bg-[#F05984] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`}><LineChart size={18} /></button>
              <button onClick={() => setChartType('donut')} className={`p-2 rounded-xl transition-all ${chartType === 'donut' ? 'bg-[#F05984] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`}><PieChart size={18} /></button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'comparison' && (
              <div className="space-y-8">
                <GlassCard className="p-5">
                  <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                    <BarChart3 size={18} className="text-[#F05984]" />
                    Evolución Ingresos vs Gastos
                  </h3>
                  <EnhancedBarChart data={filteredData} type="both" />
                </GlassCard>

                <div>
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-[#F05984]" />
                    Resumen Trimestral
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quarterlyData.map((quarter, index) => (
                      <GlassCard key={index} delay={index * 0.1} className="p-4">
                        <p className="text-white/40 text-xs mb-3">{quarter.quarter}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-400 text-sm">Ingresos:</span>
                            <span className="text-white font-medium">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(quarter.income)}
                            </span>
                            <div className={`flex items-center gap-0.5 ${quarter.incomeGrowth > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {quarter.incomeGrowth > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                              <span className="text-xs">{Math.abs(quarter.incomeGrowth)}%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-rose-400 text-sm">Gastos:</span>
                            <span className="text-white font-medium">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(quarter.expense)}
                            </span>
                            <div className={`flex items-center gap-0.5 ${quarter.expenseGrowth > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {quarter.expenseGrowth > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                              <span className="text-xs">{Math.abs(quarter.expenseGrowth)}%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                            <span className="text-indigo-400 text-sm">Ahorro:</span>
                            <span className="text-white font-bold">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(quarter.savings)}
                            </span>
                            <span className="text-white/40 text-xs">{((quarter.savings / quarter.income) * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'income' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GlassCard className="p-5">
                    <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                      <TrendingUp size={18} className="text-emerald-400" />
                      Evolución de Ingresos
                    </h3>
                    <EnhancedBarChart data={filteredData} type="income" />
                  </GlassCard>
                  
                  <GlassCard className="p-5">
                    <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                      <PieChart size={18} className="text-purple-400" />
                      Distribución por Categoría
                    </h3>
                    <DonutChart 
                      data={incomeCategories.map(c => ({ ...c, amount: c.amount }))} 
                      total={totalIncome}
                      centerText={{ value: incomeCategories.length.toString(), label: 'categorías' }}
                    />
                  </GlassCard>
                </div>
              </div>
            )}

            {activeTab === 'expense' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GlassCard className="p-5">
                    <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                      <TrendingDown size={18} className="text-rose-400" />
                      Evolución de Gastos
                    </h3>
                    <EnhancedBarChart data={filteredData} type="expense" />
                  </GlassCard>
                  
                  <GlassCard className="p-5">
                    <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                      <PieChart size={18} className="text-purple-400" />
                      Distribución por Categoría
                    </h3>
                    <DonutChart 
                      data={expenseCategories.map(c => ({ ...c, amount: c.amount }))} 
                      total={totalExpense}
                      centerText={{ value: expenseCategories.length.toString(), label: 'categorías' }}
                    />
                  </GlassCard>
                </div>
              </div>
            )}
          </div>

          {/* Insights */}
          <div className="p-5 border-t border-white/10 bg-gradient-to-r from-[#321D28]/30 to-[#6E4068]/30">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity size={18} className="text-[#F05984]" />
              Insights y Recomendaciones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all group">
                <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:scale-110 transition-transform"><TrendingUp size={18} className="text-emerald-400" /></div>
                <div><p className="text-white/90 text-sm font-medium mb-1">Crecimiento de ingresos</p><p className="text-white/60 text-sm">Tus ingresos han aumentado un <span className="text-emerald-400 font-medium">8.5%</span> respecto al año anterior</p></div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all group">
                <div className="p-2 bg-rose-500/20 rounded-lg group-hover:scale-110 transition-transform"><TrendingDown size={18} className="text-rose-400" /></div>
                <div><p className="text-white/90 text-sm font-medium mb-1">Área de oportunidad</p><p className="text-white/60 text-sm">Tus gastos en ocio representan el <span className="text-rose-400 font-medium">15%</span> del total</p></div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all group">
                <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:scale-110 transition-transform"><Target size={18} className="text-indigo-400" /></div>
                <div><p className="text-white/90 text-sm font-medium mb-1">Tasa de ahorro</p><p className="text-white/60 text-sm">Tu tasa de ahorro actual es del <span className="text-indigo-400 font-medium">{savingsRate.toFixed(0)}%</span>, por encima del promedio</p></div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
