import { useState } from 'react';
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  CreditCard,
  Wallet,
  Home,
  Utensils,
  Car,
  Heart,
  ShoppingBag,
  Film,
  Zap,
  Wifi,
  Droplet,
  Home as HomeIcon,
  Briefcase,
  Gift,
  Award,
  Smartphone,
  Laptop,
  Plane,
  Hotel,
  Shirt,
  Dumbbell,
  BookOpen,
  Coffee,
  Dog,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Activity,
  LineChart,
  AreaChart,
  XCircle,
  Percent,
  Target,
  Zap as ZapIcon,
  Shield,
  Users,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Link,
  Copy,
  Share2,
  Printer,
  X,
  Table
} from 'lucide-react';

interface ChartData {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

interface CategoryData {
  category: string;
  amount: number;
  color: string;
  icon: React.ReactNode;
  trend?: number;
  budget?: number;
}

interface TimePeriod {
  value: string;
  label: string;
}

// Función para formatear moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Componente de gráfico de barras mejorado
const EnhancedBarChart = ({ data, type, maxHeight = 300 }: { data: ChartData[], type: 'income' | 'expense' | 'both', maxHeight?: number }) => {
  const maxValue = Math.max(...data.map(d => type === 'both' ? Math.max(d.income, d.expense) : type === 'income' ? d.income : d.expense));
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const incomePercent = (item.income / maxValue) * 100;
        const expensePercent = (item.expense / maxValue) * 100;
        const showIncome = type === 'income' || type === 'both';
        const showExpense = type === 'expense' || type === 'both';
        
        return (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/80">{item.month}</span>
                {showIncome && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 rounded-full">
                    <TrendingUp size={10} className="text-green-400" />
                    <span className="text-xs text-green-400">{formatCurrency(item.income)}</span>
                  </div>
                )}
                {showExpense && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 rounded-full">
                    <TrendingDown size={10} className="text-red-400" />
                    <span className="text-xs text-red-400">{formatCurrency(item.expense)}</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-white/40">
                {((item.income - item.expense) / item.income * 100).toFixed(0)}% ahorro
              </div>
            </div>
            <div className="flex gap-1 h-12 rounded-lg overflow-hidden bg-white/5">
              {showIncome && (
                <div 
                  className="relative bg-gradient-to-r from-green-500 to-green-600 transition-all duration-700 hover:opacity-90 cursor-pointer group/bar"
                  style={{ width: `${incomePercent}%` }}
                >
                  <div className="absolute inset-0 flex items-center justify-end px-3 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    <span className="text-xs text-white font-medium">{formatCurrency(item.income)}</span>
                  </div>
                </div>
              )}
              {showExpense && (
                <div 
                  className="relative bg-gradient-to-r from-red-500 to-red-600 transition-all duration-700 hover:opacity-90 cursor-pointer group/bar"
                  style={{ width: `${expensePercent}%` }}
                >
                  <div className="absolute inset-0 flex items-center justify-end px-3 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    <span className="text-xs text-white font-medium">{formatCurrency(item.expense)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Componente de gráfico circular mejorado
const EnhancedPieChart = ({ data, total }: { data: CategoryData[], total: number }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Calcular porcentajes
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
              // Calcular ángulos
              const startAngle = itemsWithPercentage.slice(0, item.index).reduce((sum, i) => sum + (i.percentage * 3.6), 0);
              const angle = item.percentage * 3.6;
              const endAngle = startAngle + angle;
              
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              const largeArc = angle > 180 ? 1 : 0;
              
              // Obtener colores del gradiente
              const colorClass = item.color.split(' ')[1].replace('from-', '');
              
              return (
                <path
                  key={item.index}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={`url(#gradient-${item.index})`}
                  className="transition-all duration-300 cursor-pointer hover:opacity-80"
                  onMouseEnter={() => setHoveredIndex(item.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  stroke="#1a0f14"
                  strokeWidth="1"
                />
              );
            })}
            <defs>
              {itemsWithPercentage.map((item, idx) => (
                <linearGradient key={idx} id={`gradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className={item.color.split(' ')[1]} />
                  <stop offset="100%" className={item.color.split(' ')[2]} />
                </linearGradient>
              ))}
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-[#1a0f14]/80 rounded-full w-24 h-24 flex flex-col items-center justify-center backdrop-blur-sm">
              <p className="text-xl font-bold text-white">{total > 0 ? formatCurrency(total) : '$0'}</p>
              <p className="text-xs text-white/40">Total</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-2">
        {itemsWithPercentage.map((item) => {
          const isHovered = hoveredIndex === item.index;
          
          return (
            <div 
              key={item.index} 
              className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 cursor-pointer ${isHovered ? 'bg-white/10 scale-[1.02]' : 'bg-white/5 hover:bg-white/10'}`}
              onMouseEnter={() => setHoveredIndex(item.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`} />
                <div className={`p-1 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20`}>
                  {item.icon}
                </div>
                <span className="text-white text-sm">{item.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white text-sm font-medium">{formatCurrency(item.amount)}</span>
                <span className="text-white/40 text-xs w-12 text-right">{item.percentage.toFixed(1)}%</span>
                {item.trend && (
                  <div className={`flex items-center gap-0.5 ${item.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span className="text-xs">{Math.abs(item.trend)}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Componente de gráfico de líneas mejorado con más separación
const EnhancedLineChart = ({ data }: { data: ChartData[] }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expense, d.savings)));
  const minValue = Math.min(...data.map(d => Math.min(d.income, d.expense, d.savings)));
  const range = maxValue - minValue;
  const chartHeight = 200;
  const chartWidth = 100;
  
  const getY = (value: number) => {
    return chartHeight - ((value - minValue) / range) * chartHeight;
  };
  
  const points = {
    income: data.map((d, i) => ({ x: (i / (data.length - 1)) * chartWidth, y: getY(d.income) })),
    expense: data.map((d, i) => ({ x: (i / (data.length - 1)) * chartWidth, y: getY(d.expense) })),
    savings: data.map((d, i) => ({ x: (i / (data.length - 1)) * chartWidth, y: getY(d.savings) }))
  };
  
  const linePath = (points: { x: number; y: number }[]) => {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };
  
  return (
    <div className="relative">
      <div className="relative h-64 mb-6">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-white/10 w-full h-0 relative">
              <span className="absolute -left-16 -top-2 text-xs text-white/40">
                {formatCurrency(maxValue - (range / 4) * i)}
              </span>
            </div>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-around">
          {data.map((item, idx) => (
            <span key={idx} className="text-xs text-white/40">{item.month}</span>
          ))}
        </div>
        
        {/* Lines and points */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Income line */}
          <path
            d={linePath(points.income)}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            className="transition-all duration-500"
          />
          {/* Expense line */}
          <path
            d={linePath(points.expense)}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            className="transition-all duration-500"
          />
          {/* Savings line */}
          <path
            d={linePath(points.savings)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            className="transition-all duration-500"
          />
        </svg>
        
        {/* Points */}
        <div className="absolute inset-0">
          {data.map((item, idx) => {
            const incomeY = getY(item.income);
            const expenseY = getY(item.expense);
            const savingsY = getY(item.savings);
            const x = (idx / (data.length - 1)) * 100;
            
            return (
              <div key={idx}>
                {/* Income point */}
                <div
                  className="absolute group"
                  style={{ left: `${x}%`, top: `${incomeY}px` }}
                >
                  <div 
                    className="w-3 h-3 bg-green-500 rounded-full cursor-pointer transition-all duration-300 hover:scale-150 shadow-lg"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </div>
                {/* Expense point */}
                <div
                  className="absolute group"
                  style={{ left: `${x}%`, top: `${expenseY}px` }}
                >
                  <div 
                    className="w-3 h-3 bg-red-500 rounded-full cursor-pointer transition-all duration-300 hover:scale-150 shadow-lg"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </div>
                {/* Savings point */}
                <div
                  className="absolute group"
                  style={{ left: `${x}%`, top: `${savingsY}px` }}
                >
                  <div 
                    className="w-3 h-3 bg-blue-500 rounded-full cursor-pointer transition-all duration-300 hover:scale-150 shadow-lg"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </div>
                
                {/* Tooltip */}
                {hoveredPoint === idx && (
                  <div className="absolute z-10 bg-black/90 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap" style={{ left: `${x}%`, top: `${Math.min(incomeY, expenseY, savingsY) - 60}px`, transform: 'translateX(-50%)' }}>
                    <div className="space-y-1">
                      <p className="font-semibold text-center mb-1">{item.month}</p>
                      <p className="text-green-400">Ingreso: {formatCurrency(item.income)}</p>
                      <p className="text-red-400">Gasto: {formatCurrency(item.expense)}</p>
                      <p className="text-blue-400">Ahorro: {formatCurrency(item.savings)}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-white/60 text-sm">Ingresos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-white/60 text-sm">Gastos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-white/60 text-sm">Ahorro</span>
        </div>
      </div>
    </div>
  );
};

export const ChartsPage = () => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense' | 'comparison'>('comparison');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6m');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const periods: TimePeriod[] = [
    { value: '1m', label: 'Último mes' },
    { value: '3m', label: 'Últimos 3 meses' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '1y', label: 'Último año' },
    { value: '2y', label: 'Últimos 2 años' }
  ];

  const years: string[] = ['2024', '2023', '2022', '2021', '2020'];

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

  const incomeCategories: CategoryData[] = [
    { category: 'Salario', amount: 28500, color: 'from-green-500 to-green-600', icon: <Briefcase size={16} />, trend: 8.5 },
    { category: 'Servicios profesionales', amount: 12500, color: 'from-blue-500 to-blue-600', icon: <Laptop size={16} />, trend: 12.3 },
    { category: 'Ventas', amount: 8500, color: 'from-purple-500 to-purple-600', icon: <ShoppingBag size={16} />, trend: -2.1 },
    { category: 'Inversiones', amount: 4200, color: 'from-cyan-500 to-cyan-600', icon: <TrendingUp size={16} />, trend: 15.7 },
    { category: 'Otros', amount: 3800, color: 'from-gray-500 to-gray-600', icon: <Sparkles size={16} />, trend: 5.2 }
  ];

  const expenseCategories: CategoryData[] = [
    { category: 'Vivienda', amount: 14400, color: 'from-blue-500 to-blue-600', icon: <HomeIcon size={16} />, trend: 3.2, budget: 15000 },
    { category: 'Alimentación', amount: 5120, color: 'from-yellow-500 to-yellow-600', icon: <Utensils size={16} />, trend: 5.8, budget: 6000 },
    { category: 'Transporte', amount: 3240, color: 'from-green-500 to-green-600', icon: <Car size={16} />, trend: -1.5, budget: 3500 },
    { category: 'Servicios', amount: 2840, color: 'from-cyan-500 to-cyan-600', icon: <Zap size={16} />, trend: 4.2, budget: 3000 },
    { category: 'Ocio', amount: 2150, color: 'from-purple-500 to-purple-600', icon: <Film size={16} />, trend: 8.3, budget: 2500 },
    { category: 'Salud', amount: 1850, color: 'from-red-500 to-red-600', icon: <Heart size={16} />, trend: -0.5, budget: 2000 },
    { category: 'Compras', amount: 1650, color: 'from-pink-500 to-pink-600', icon: <ShoppingBag size={16} />, trend: 6.7, budget: 2000 },
    { category: 'Seguros', amount: 1350, color: 'from-indigo-500 to-indigo-600', icon: <Award size={16} />, trend: 2.1, budget: 1500 }
  ];

  const quarterlyData = [
    { quarter: 'Q1 2024', income: 9750, expense: 6350, savings: 3400, incomeGrowth: 5.2, expenseGrowth: 2.1 },
    { quarter: 'Q2 2024', income: 10450, expense: 6200, savings: 4250, incomeGrowth: 7.2, expenseGrowth: -2.4 },
    { quarter: 'Q3 2024', income: 10000, expense: 6500, savings: 3500, incomeGrowth: -4.3, expenseGrowth: 4.8 },
    { quarter: 'Q4 2024', income: 10950, expense: 6800, savings: 4150, incomeGrowth: 9.5, expenseGrowth: 4.6 }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalExpense = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;

  const getFilteredData = () => {
    let filtered = [...monthlyData];
    if (selectedPeriod === '3m') filtered = filtered.slice(-3);
    if (selectedPeriod === '6m') filtered = filtered.slice(-6);
    if (selectedPeriod === '1y') filtered = filtered.slice(-12);
    return filtered;
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Análisis y Gráficos</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">
              {monthlyData.length} períodos
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Visualiza y analiza tus finanzas con gráficos interactivos
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleRefresh} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>
            <Filter size={20} />
          </button>
          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 group hover:border-[#F05984]/30 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Ingresos Totales</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalIncome)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp size={14} className="text-green-400" />
                <span className="text-green-400 text-sm font-medium">+8.5%</span>
                <span className="text-white/40 text-xs ml-1">vs año anterior</span>
              </div>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp size={24} className="text-green-400" />
            </div>
          </div>
          <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full w-2/3" />
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 group hover:border-[#F05984]/30 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Gastos Totales</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalExpense)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp size={14} className="text-red-400" />
                <span className="text-red-400 text-sm font-medium">+3.2%</span>
                <span className="text-white/40 text-xs ml-1">vs año anterior</span>
              </div>
            </div>
            <div className="p-3 bg-red-500/20 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingDown size={24} className="text-red-400" />
            </div>
          </div>
          <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full w-2/3" />
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 group hover:border-[#F05984]/30 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Ahorro Total</p>
              <p className="text-3xl font-bold text-green-400">{formatCurrency(totalIncome - totalExpense)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp size={14} className="text-green-400" />
                <span className="text-green-400 text-sm font-medium">+12.4%</span>
                <span className="text-white/40 text-xs ml-1">vs año anterior</span>
              </div>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform">
              <Target size={24} className="text-blue-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/60">Tasa de ahorro</span>
              <span className="text-white font-medium">{savingsRate.toFixed(1)}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${savingsRate}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="flex border-b border-white/10">
          <button onClick={() => setActiveTab('comparison')} className={`flex-1 px-6 py-3 text-sm font-medium transition-all ${activeTab === 'comparison' ? 'text-[#F05984] border-b-2 border-[#F05984] bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            <div className="flex items-center justify-center gap-2"><BarChart3 size={16} /> Comparación General</div>
          </button>
          <button onClick={() => setActiveTab('income')} className={`flex-1 px-6 py-3 text-sm font-medium transition-all ${activeTab === 'income' ? 'text-[#F05984] border-b-2 border-[#F05984] bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            <div className="flex items-center justify-center gap-2"><TrendingUp size={16} /> Análisis de Ingresos</div>
          </button>
          <button onClick={() => setActiveTab('expense')} className={`flex-1 px-6 py-3 text-sm font-medium transition-all ${activeTab === 'expense' ? 'text-[#F05984] border-b-2 border-[#F05984] bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            <div className="flex items-center justify-center gap-2"><TrendingDown size={16} /> Análisis de Gastos</div>
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 flex flex-wrap gap-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-white/40" />
            <span className="text-white/60 text-sm">Período:</span>
            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm cursor-pointer">
              {periods.map((period) => (<option key={period.value} value={period.value}>{period.label}</option>))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">Año:</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm cursor-pointer">
              {years.map((year) => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setChartType('bar')} className={`p-2 rounded-lg transition-all ${chartType === 'bar' ? 'bg-[#F05984] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`} title="Gráfico de barras"><BarChart3 size={18} /></button>
            <button onClick={() => setChartType('line')} className={`p-2 rounded-lg transition-all ${chartType === 'line' ? 'bg-[#F05984] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`} title="Gráfico de líneas"><LineChart size={18} /></button>
            <button onClick={() => setChartType('pie')} className={`p-2 rounded-lg transition-all ${chartType === 'pie' ? 'bg-[#F05984] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`} title="Gráfico de pastel"><PieChart size={18} /></button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'comparison' && (
            <div className="space-y-8">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#F05984]" />
                  Evolución Ingresos vs Gastos
                </h3>
                {chartType === 'bar' && <EnhancedBarChart data={filteredData} type="both" />}
                {chartType === 'line' && <EnhancedLineChart data={filteredData} />}
                {chartType === 'pie' && <EnhancedPieChart data={incomeCategories.concat(expenseCategories.map(c => ({ ...c, amount: c.amount / 10 })))} total={(totalIncome + totalExpense) / 10} />}
              </div>

              {/* Resumen trimestral */}
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-[#F05984]" />
                  Resumen Trimestral
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quarterlyData.map((quarter, index) => (
                    <div key={index} className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10 hover:border-[#F05984]/30 transition-all group">
                      <p className="text-white/40 text-xs mb-3">{quarter.quarter}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 text-sm">Ingresos:</span>
                          <span className="text-white font-medium">{formatCurrency(quarter.income)}</span>
                          <div className={`flex items-center gap-0.5 ${quarter.incomeGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {quarter.incomeGrowth > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                            <span className="text-xs">{Math.abs(quarter.incomeGrowth)}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-red-400 text-sm">Gastos:</span>
                          <span className="text-white font-medium">{formatCurrency(quarter.expense)}</span>
                          <div className={`flex items-center gap-0.5 ${quarter.expenseGrowth > 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {quarter.expenseGrowth > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                            <span className="text-xs">{Math.abs(quarter.expenseGrowth)}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                          <span className="text-blue-400 text-sm">Ahorro:</span>
                          <span className="text-white font-bold">{formatCurrency(quarter.savings)}</span>
                          <span className="text-white/40 text-xs">{((quarter.savings / quarter.income) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
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
                  <EnhancedBarChart data={filteredData} type="income" />
                </div>
                
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                    <PieChart size={18} className="text-purple-400" />
                    Distribución por Categoría
                  </h3>
                  <EnhancedPieChart data={incomeCategories} total={totalIncome} />
                </div>
              </div>

              {/* Tabla de ingresos */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Table size={18} className="text-blue-400" />
                  Detalle por Categoría
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Categoría</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Monto</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Porcentaje</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Promedio mensual</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Tendencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeCategories.map((cat, index) => {
                        const percentage = (cat.amount / totalIncome) * 100;
                        const monthlyAvg = cat.amount / 12;
                        return (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>{cat.icon}</div>
                                <span className="text-white">{cat.category}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right text-white font-medium">{formatCurrency(cat.amount)}</td>
                            <td className="py-3 px-4 text-right text-white/60">{percentage.toFixed(1)}%</td>
                            <td className="py-3 px-4 text-right text-white/60">{formatCurrency(monthlyAvg)}</td>
                            <td className="py-3 px-4 text-right">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${cat.trend && cat.trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {cat.trend && cat.trend > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                <span className="text-xs font-medium">{Math.abs(cat.trend || 0)}%</span>
                              </div>
                            </td>
                           </tr>
                        );
                      })}
                    </tbody>
                   </table>
                </div>
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
                  <EnhancedBarChart data={filteredData} type="expense" />
                </div>
                
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                    <PieChart size={18} className="text-purple-400" />
                    Distribución por Categoría
                  </h3>
                  <EnhancedPieChart data={expenseCategories} total={totalExpense} />
                </div>
              </div>

              {/* Tabla de gastos */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Table size={18} className="text-orange-400" />
                  Detalle por Categoría
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Categoría</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Monto</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Porcentaje</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Presupuesto</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Utilización</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Tendencia</th>
                       </tr>
                    </thead>
                    <tbody>
                      {expenseCategories.map((cat, index) => {
                        const percentage = (cat.amount / totalExpense) * 100;
                        const budgetUtilization = cat.budget ? (cat.amount / cat.budget) * 100 : 0;
                        return (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>{cat.icon}</div>
                                <span className="text-white">{cat.category}</span>
                              </div>
                             </td>
                            <td className="py-3 px-4 text-right text-white font-medium">{formatCurrency(cat.amount)}</td>
                            <td className="py-3 px-4 text-right text-white/60">{percentage.toFixed(1)}%</td>
                            <td className="py-3 px-4 text-right text-white/60">{cat.budget ? formatCurrency(cat.budget) : '-'}</td>
                            <td className="py-3 px-4 text-right">
                              {cat.budget && (
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${budgetUtilization > 90 ? 'bg-red-500' : budgetUtilization > 70 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(budgetUtilization, 100)}%` }} />
                                  </div>
                                  <span className={`text-xs ${budgetUtilization > 90 ? 'text-red-400' : budgetUtilization > 70 ? 'text-yellow-400' : 'text-green-400'}`}>{budgetUtilization.toFixed(0)}%</span>
                                </div>
                              )}
                             </td>
                            <td className="py-3 px-4 text-right">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${cat.trend && cat.trend > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                {cat.trend && cat.trend > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                <span className="text-xs font-medium">{Math.abs(cat.trend || 0)}%</span>
                              </div>
                             </td>
                           </tr>
                        );
                      })}
                    </tbody>
                   </table>
                </div>
              </div>

              {/* Análisis de gastos fijos vs variables */}
              <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                  <PieChart size={18} className="text-[#F05984]" />
                  Análisis de Gastos Fijos vs Variables
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-white font-medium flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Gastos Fijos</p>
                      <span className="text-white/60 text-sm">{formatCurrency(expenseCategories.filter(c => ['Vivienda', 'Servicios', 'Seguros'].includes(c.category)).reduce((sum, c) => sum + c.amount, 0))}</span>
                    </div>
                    <div className="space-y-4">
                      {expenseCategories.filter(c => ['Vivienda', 'Servicios', 'Seguros'].includes(c.category)).map((cat, idx) => {
                        const fixedTotal = expenseCategories.filter(c => ['Vivienda', 'Servicios', 'Seguros'].includes(c.category)).reduce((sum, c) => sum + c.amount, 0);
                        const fixedPercent = (cat.amount / fixedTotal) * 100;
                        return (
                          <div key={idx}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-white/80">{cat.category}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-white">{formatCurrency(cat.amount)}</span>
                                <span className="text-white/40 w-12 text-right">{fixedPercent.toFixed(0)}%</span>
                              </div>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${fixedPercent}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-white font-medium flex items-center gap-2"><div className="w-2 h-2 bg-orange-500 rounded-full" /> Gastos Variables</p>
                      <span className="text-white/60 text-sm">{formatCurrency(expenseCategories.filter(c => !['Vivienda', 'Servicios', 'Seguros'].includes(c.category)).reduce((sum, c) => sum + c.amount, 0))}</span>
                    </div>
                    <div className="space-y-4">
                      {expenseCategories.filter(c => !['Vivienda', 'Servicios', 'Seguros'].includes(c.category)).map((cat, idx) => {
                        const variableTotal = expenseCategories.filter(c => !['Vivienda', 'Servicios', 'Seguros'].includes(c.category)).reduce((sum, c) => sum + c.amount, 0);
                        const variablePercent = (cat.amount / variableTotal) * 100;
                        return (
                          <div key={idx}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-white/80">{cat.category}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-white">{formatCurrency(cat.amount)}</span>
                                <span className="text-white/40 w-12 text-right">{variablePercent.toFixed(0)}%</span>
                              </div>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${variablePercent}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
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
              <div className="p-2 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform"><TrendingUp size={18} className="text-green-400" /></div>
              <div><p className="text-white/90 text-sm font-medium mb-1">Crecimiento de ingresos</p><p className="text-white/60 text-sm">Tus ingresos han aumentado un <span className="text-green-400 font-medium">8.5%</span> respecto al año anterior</p></div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all group">
              <div className="p-2 bg-red-500/20 rounded-lg group-hover:scale-110 transition-transform"><TrendingDown size={18} className="text-red-400" /></div>
              <div><p className="text-white/90 text-sm font-medium mb-1">Área de oportunidad</p><p className="text-white/60 text-sm">Tus gastos en ocio representan el <span className="text-red-400 font-medium">15%</span> del total</p></div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all group">
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform"><Target size={18} className="text-blue-400" /></div>
              <div><p className="text-white/90 text-sm font-medium mb-1">Tasa de ahorro</p><p className="text-white/60 text-sm">Tu tasa de ahorro actual es del <span className="text-blue-400 font-medium">21%</span>, por encima del promedio</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
