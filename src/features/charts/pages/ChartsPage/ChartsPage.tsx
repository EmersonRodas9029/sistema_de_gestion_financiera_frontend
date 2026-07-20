import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { containerVariants, itemVariants, notifyConnectionError } from '../../../../shared/utils';
import { PageSkeleton } from '../../../../shared/components/ui/PageSkeleton';
import { getCurrentClientSession } from '../../../../shared/hooks/useCurrentClient';
import { gastosService } from '../../../expenses/services';
import { ingresosService } from '../../../incomes/services';
import { categoriasService } from '../../../categories/services';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUp,
  ArrowDown,
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
  Briefcase,
  Menu,
  Tag,
  DollarSign,
  CreditCard,
  X as XIcon
} from 'lucide-react';

interface ChartData {
  key: string; // "YYYY-MM", usado para filtrar por rango de fechas personalizado
  month: string;
  income: number;
  expense: number;
  savings: number;
}

interface QuarterData {
  quarter: string;
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

const sumBy = (values: number[]) => values.reduce((total, n) => total + n, 0);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Colores para fuentes de ingreso (no tienen categoría/color propio en la API)
const INCOME_PALETTE = ['#F05984', '#BC455F', '#6E4068', '#8b5cf6', '#06b6d4', '#f59e0b', '#6366f1', '#6b7280'];

// Mapa reducido de iconos por nombre codificado en categoria.icono ("expense:utensils")
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  home: <HomeIcon size={14} />,
  utensils: <Utensils size={14} />,
  car: <Car size={14} />,
  heart: <Heart size={14} />,
  shopping: <ShoppingBag size={14} />,
  film: <Film size={14} />,
  zap: <Zap size={14} />,
  shield: <Shield size={14} />,
  briefcase: <Briefcase size={14} />,
  sparkles: <Sparkles size={14} />,
  wallet: <Wallet size={14} />,
  dollar: <DollarSign size={14} />,
  credit: <CreditCard size={14} />,
};
const iconFor = (icono?: string) => {
  const name = icono?.includes(':') ? icono.slice(icono.indexOf(':') + 1) : icono;
  return CATEGORY_ICONS[name ?? ''] ?? <Tag size={14} />;
};

// Insignia de tendencia (positiva/negativa) reutilizada en las tarjetas de resumen
const TrendBadge = ({ value }: { value: number }) => {
  const positive = value >= 0;
  return (
    <div className={`flex items-center gap-1 px-2 py-1 ${positive ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-full group-hover:scale-105 transition-transform`}>
      {positive ? <ArrowUp size={12} className="text-green-400" /> : <ArrowDown size={12} className="text-red-400" />}
      <span className={`${positive ? 'text-green-400' : 'text-red-400'} text-xs font-medium`}>
        {positive ? '+' : ''}{value.toFixed(1)}%
      </span>
    </div>
  );
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

// Componente de tooltip personalizado con diseño mejorado
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="bg-gradient-to-br from-[#1a0f14] to-[#2d1a25] backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20"
        role="tooltip"
        aria-label={`Información del gráfico para ${label}`}
      >
        <p className="text-xs text-white/50 mb-2 font-medium">{label}</p>
        <div className="space-y-2">
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shadow-lg" 
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                <span className="text-white/80 font-medium">{entry.name}:</span>
              </div>
              <span className="font-mono text-white font-bold">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(entry.value)}
              </span>
            </div>
          ))}
        </div>
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
      className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-6 border border-white/10 hover:border-[#F05984]/40 transition-all shadow-lg hover:shadow-xl"
    >
      <h3 className="text-white font-semibold mb-6 flex items-center gap-2 text-lg">
        <div className="p-1.5 rounded-lg bg-[#F05984]/20">
          <PieChartIcon size={18} className="text-[#F05984]" aria-hidden="true" />
        </div>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <defs>
            {data.map((entry, idx) => (
              <linearGradient id={`gradient-${idx}`} key={`grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                <stop offset="100%" stopColor={entry.color} stopOpacity={0.7}/>
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, idx) => (
              <Cell 
                key={`cell-${idx}`} 
                fill={`url(#gradient-${idx})`}
                stroke={activeIndex === idx ? '#fff' : 'none'}
                strokeWidth={activeIndex === idx ? 3 : 0}
                style={{ filter: activeIndex === idx ? 'drop-shadow(0px 0px 10px rgba(255,255,255,0.3))' : 'none' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Legend 
            formatter={(value) => {
              const item = data.find(d => d.name === value);
              const percentage = item ? (item.value / total) * 100 : 0;
              return <span className="text-white/80 text-xs font-medium">{value} ({percentage.toFixed(0)}%)</span>;
            }}
            wrapperStyle={{ paddingTop: '24px' }}
            verticalAlign="bottom"
            height={50}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 text-center">
        <p className="text-white/40 text-sm">Total: <span className="text-white font-semibold">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(total)}</span></p>
      </div>
    </motion.div>
  );
};

// Componente de lazy loading
const LazyChart = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="h-[450px] bg-white/5 rounded-2xl animate-pulse" />}
    </div>
  );
};

export const ChartsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comparison' | 'income' | 'expense'>('comparison');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6m');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '2026-01-01', end: '2026-12-31' });

  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [quarterlyData, setQuarterlyData] = useState<QuarterData[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<CategoryData[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<CategoryData[]>([]);

  const [clienteId] = useState(() => Number(getCurrentClientSession().ownClienteId || 0));

  const fetchChartData = useCallback(async () => {
    if (!clienteId) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const [gastosLista, ingresosLista, categorias] = await Promise.all([
        gastosService.getAll(), ingresosService.getAll(), categoriasService.getByCliente(clienteId),
      ]);
      const gastos = gastosLista.filter(g => g.clienteId === clienteId && g.activo !== false);
      const ingresos = ingresosLista.filter(i => i.clienteId === clienteId && i.activo !== false);
      const catById = new Map(categorias.map(c => [c.id, c]));

      const now = new Date();
      const months = Array.from({ length: 12 }, (_, idx) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (11 - idx), 1);
        return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: capitalize(d.toLocaleDateString('es-ES', { month: 'short' })) };
      });
      const monthly: ChartData[] = months.map(({ key, label }) => {
        const income = sumBy(ingresos.filter(i => i.fecha?.slice(0, 7) === key).map(i => i.monto ?? 0));
        const expense = sumBy(gastos.filter(g => g.fecha?.slice(0, 7) === key).map(g => g.monto ?? 0));
        return { key, month: label, income, expense, savings: income - expense };
      });
      setMonthlyData(monthly);

      const quarters: QuarterData[] = Array.from({ length: 4 }, (_, q) => {
        const chunk = monthly.slice(q * 3, q * 3 + 3);
        const income = sumBy(chunk.map(m => m.income));
        const expense = sumBy(chunk.map(m => m.expense));
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - (11 - (q * 3 + 2)), 1);
        return { quarter: `Q${Math.floor(lastMonthDate.getMonth() / 3) + 1} ${lastMonthDate.getFullYear()}`, income, expense, savings: income - expense };
      });
      setQuarterlyData(quarters);

      const expenseTotals = new Map<number, number>();
      gastos.forEach(g => { if (g.categoriaId != null) expenseTotals.set(g.categoriaId, (expenseTotals.get(g.categoriaId) ?? 0) + (g.monto ?? 0)); });
      setExpenseCategories([...expenseTotals.entries()]
        .map(([catId, value]) => {
          const cat = catById.get(catId);
          return { name: cat?.nombre ?? 'Sin categoría', value, color: cat?.color ?? '#6b7280', icon: iconFor(cat?.icono) };
        })
        .sort((a, b) => b.value - a.value));

      const incomeTotals = new Map<string, number>();
      ingresos.forEach(i => { const key = i.fuente || i.tipo || 'Otros'; incomeTotals.set(key, (incomeTotals.get(key) ?? 0) + (i.monto ?? 0)); });
      setIncomeCategories([...incomeTotals.entries()]
        .map(([name, value], idx) => ({ name, value, color: INCOME_PALETTE[idx % INCOME_PALETTE.length], icon: <Wallet size={14} /> }))
        .sort((a, b) => b.value - a.value));
    } catch (e) {
      console.error('Error cargando datos de gráficos:', e);
      notifyConnectionError();
    } finally {
      setIsLoading(false);
    }
  }, [clienteId]);

  useEffect(() => { fetchChartData(); }, [fetchChartData]);

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
    if (selectedPeriod === 'custom') {
      const start = dateRange.start.slice(0, 7);
      const end = dateRange.end.slice(0, 7);
      filtered = filtered.filter(d => d.key >= start && d.key <= end);
    }
    return filtered;
  };

  const filteredData = getFilteredData();
  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.value, 0);
  const totalExpense = expenseCategories.reduce((sum, cat) => sum + cat.value, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  const topExpenseCategories = [...expenseCategories].sort((a, b) => b.value - a.value).slice(0, 5);
  const topExpenseCategory = topExpenseCategories[0];
  const topExpensePercentage = topExpenseCategory && totalExpense > 0 ? (topExpenseCategory.value / totalExpense) * 100 : 0;

  const trendPct = (key: 'income' | 'expense' | 'savings') => {
    if (monthlyData.length < 2) return 0;
    const prev = monthlyData[monthlyData.length - 2][key];
    const last = monthlyData[monthlyData.length - 1][key];
    if (!prev) return last > 0 ? 100 : 0;
    return ((last - prev) / Math.abs(prev)) * 100;
  };
  const incomeTrend = trendPct('income');
  const expenseTrend = trendPct('expense');
  const savingsTrend = trendPct('savings');

  if (isLoading) return <PageSkeleton />;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: '#1a0f14' }}
    >
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-3 right-3 z-50 p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10"
        aria-label="Abrir filtros"
      >
        {isSidebarOpen ? <XIcon size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
      </button>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed top-0 left-0 z-40 w-80 h-full bg-gradient-to-b from-[#1a0f14] to-[#0d0710] border-r border-white/10 p-6 overflow-y-auto shadow-2xl"
          >
            <div className="mt-12">
              <h3 className="text-white font-semibold mb-6 text-lg">Filtros Rápidos</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-white/60 text-sm block mb-2 font-medium">Fecha inicio</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F05984] focus:ring-1 focus:ring-[#F05984] transition-all"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm block mb-2 font-medium">Fecha fin</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F05984] transition-all"
                  />
                </div>
                <button
                  onClick={() => setSelectedPeriod('custom')}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:opacity-90 transition-all font-medium shadow-lg"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-r from-[#321D28] via-[#4a2d40] to-[#321D28] rounded-2xl p-6 border border-white/10 shadow-xl mb-6"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F05984]/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#BC455F]/15 rounded-full blur-3xl animate-pulse" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#F05984] to-[#BC455F] rounded-xl shadow-lg">
              <BarChart3 size={28} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Análisis y Gráficos</h1>
              <p className="text-white/50 text-sm mt-1">Visualiza y analiza tus ingresos y gastos</p>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards con colores del tema */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
            className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="min-w-0">
                <p className="text-white/50 text-sm font-medium mb-2">Ingresos Totales</p>
                <p className="text-3xl font-bold text-white tracking-tight group-hover:text-[#F05984] transition-colors">{formatCurrency(totalIncome)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <TrendBadge value={incomeTrend} />
                  <span className="text-white/30 text-xs">vs mes anterior</span>
                </div>
              </div>
              <div className="shrink-0 p-3 rounded-xl bg-[#F05984]/20 group-hover:bg-[#F05984]/30 transition-all duration-300 group-hover:scale-110">
                <TrendingUp size={24} className="text-[#F05984]" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
            className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="min-w-0">
                <p className="text-white/50 text-sm font-medium mb-2">Gastos Totales</p>
                <p className="text-3xl font-bold text-white tracking-tight group-hover:text-[#BC455F] transition-colors">{formatCurrency(totalExpense)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <TrendBadge value={expenseTrend} />
                  <span className="text-white/30 text-xs">vs mes anterior</span>
                </div>
              </div>
              <div className="shrink-0 p-3 rounded-xl bg-[#BC455F]/20 group-hover:bg-[#BC455F]/30 transition-all duration-300 group-hover:scale-110">
                <TrendingDown size={24} className="text-[#BC455F]" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
            className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="min-w-0">
                <p className="text-white/50 text-sm font-medium mb-2">Ahorro Total</p>
                <p className="text-3xl font-bold text-green-400 tracking-tight group-hover:text-[#F05984] transition-colors">{formatCurrency(totalIncome - totalExpense)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <TrendBadge value={savingsTrend} />
                  <span className="text-white/30 text-xs">vs mes anterior</span>
                </div>
              </div>
              <div className="shrink-0 p-3 rounded-xl bg-[#F05984]/20 group-hover:bg-[#F05984]/30 transition-all duration-300 group-hover:scale-110">
                <Target size={24} className="text-[#F05984]" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/50">Tasa de ahorro</span>
                <span className="text-white font-semibold">{savingsRate.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${savingsRate}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full group-hover:opacity-80 transition-opacity"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <LazyChart>
            <CustomPieChart 
              data={incomeCategories} 
              title="Distribución de Ingresos" 
              total={totalIncome}
            />
          </LazyChart>
          
          <LazyChart>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-6 border border-white/10 hover:border-[#F05984]/40 transition-all shadow-lg hover:shadow-xl"
            >
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-[#F05984]/20">
                  <TrendingDown size={18} className="text-[#F05984]" />
                </div>
                Top 5 Categorías de Gastos
              </h3>
              <div className="space-y-5">
                {topExpenseCategories.map((cat, idx) => {
                  const percentage = (cat.value / totalExpense) * 100;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-x-2 gap-y-1 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${cat.color}20` }}>
                            {cat.icon}
                          </div>
                          <span className="text-white font-medium group-hover:text-[#F05984] transition-colors">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-white/50 text-sm">{percentage.toFixed(1)}%</span>
                          <span className="text-white font-semibold">{formatCurrency(cat.value)}</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className="h-full rounded-full transition-all group-hover:opacity-80"
                          style={{ backgroundColor: cat.color }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </LazyChart>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          <div className="flex border-b border-white/10 bg-white/5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('comparison')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
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
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
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
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
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

          <div className="p-5 border-b border-white/10 bg-white/5">
                <div className="flex flex-wrap gap-5 items-center">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-white/40" />
                    <span className="text-white/70 text-sm font-medium">Período:</span>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F05984] text-sm cursor-pointer font-medium"
                    >
                      <option value="1m">Último mes</option>
                      <option value="3m">Últimos 3 meses</option>
                      <option value="6m">Últimos 6 meses</option>
                      <option value="1y">Último año</option>
                      <option value="2y">Últimos 2 años</option>
                    </select>
                  </div>

                  {activeTab === 'comparison' && (
                    <div className="flex items-center gap-3 ml-auto">
                      <span className="text-white/70 text-sm font-medium">Tipo de gráfico:</span>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChartType('bar')}
                          className={`p-2 rounded-xl transition-all ${
                            chartType === 'bar'
                              ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg'
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
                          className={`p-2 rounded-xl transition-all ${
                            chartType === 'line'
                              ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg'
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
                          className={`p-2 rounded-xl transition-all ${
                            chartType === 'area'
                              ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg'
                              : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                          }`}
                          title="Gráfico de área"
                        >
                          <Activity size={18} />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
          </div>

          <div className="p-6">
            <LazyChart>
              {activeTab === 'comparison' && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold mb-6 flex items-center gap-2 text-lg">
                      <div className="p-1.5 rounded-lg bg-[#F05984]/20">
                        <BarChart3 size={18} className="text-[#F05984]" />
                      </div>
                      Evolución Ingresos vs Gastos
                    </h3>
                    {chartType === 'bar' && (
                      <ResponsiveContainer width="100%" height={420}>
                        <BarChart data={filteredData}>
                          <defs>
                            <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#F05984" stopOpacity={0.9}/>
                              <stop offset="100%" stopColor="#BC455F" stopOpacity={0.6}/>
                            </linearGradient>
                            <linearGradient id="expenseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9}/>
                              <stop offset="100%" stopColor="#f87171" stopOpacity={0.6}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                          <XAxis dataKey="month" stroke="#ffffff60" tick={{ fill: '#ffffff80', fontSize: 12, fontWeight: 500 }} />
                          <YAxis stroke="#ffffff60" tick={{ fill: '#ffffff80', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                          <Legend wrapperStyle={{ color: '#ffffff80', paddingTop: '20px' }} iconType="circle" />
                          <Bar dataKey="income" name="Ingresos" fill="url(#incomeGradient)" radius={[8, 8, 0, 0]} barSize={40} />
                          <Bar dataKey="expense" name="Gastos" fill="url(#expenseGradient)" radius={[8, 8, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                    {chartType === 'line' && (
                      <ResponsiveContainer width="100%" height={420}>
                        <LineChart data={filteredData}>
                          <defs>
                            <linearGradient id="incomeLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#F05984" stopOpacity={1}/>
                              <stop offset="100%" stopColor="#BC455F" stopOpacity={1}/>
                            </linearGradient>
                            <linearGradient id="expenseLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                              <stop offset="100%" stopColor="#f87171" stopOpacity={1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                          <XAxis dataKey="month" stroke="#ffffff60" tick={{ fill: '#ffffff80', fontSize: 12, fontWeight: 500 }} />
                          <YAxis stroke="#ffffff60" tick={{ fill: '#ffffff80', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ color: '#ffffff80', paddingTop: '20px' }} iconType="circle" />
                          <Line type="monotone" dataKey="income" name="Ingresos" stroke="url(#incomeLineGradient)" strokeWidth={3} dot={{ fill: '#F05984', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, fill: '#BC455F' }} />
                          <Line type="monotone" dataKey="expense" name="Gastos" stroke="url(#expenseLineGradient)" strokeWidth={3} dot={{ fill: '#ef4444', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, fill: '#f87171' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                    {chartType === 'area' && (
                      <ResponsiveContainer width="100%" height={420}>
                        <AreaChart data={filteredData}>
                          <defs>
                            <linearGradient id="incomeAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#F05984" stopOpacity={0.4}/>
                              <stop offset="100%" stopColor="#BC455F" stopOpacity={0.05}/>
                            </linearGradient>
                            <linearGradient id="expenseAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4}/>
                              <stop offset="100%" stopColor="#f87171" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                          <XAxis dataKey="month" stroke="#ffffff60" tick={{ fill: '#ffffff80', fontSize: 12, fontWeight: 500 }} />
                          <YAxis stroke="#ffffff60" tick={{ fill: '#ffffff80', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ color: '#ffffff80', paddingTop: '20px' }} iconType="circle" />
                          <Area type="monotone" dataKey="income" name="Ingresos" stackId="1" stroke="#F05984" strokeWidth={2} fill="url(#incomeAreaGradient)" />
                          <Area type="monotone" dataKey="expense" name="Gastos" stackId="2" stroke="#ef4444" strokeWidth={2} fill="url(#expenseAreaGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-5 flex items-center gap-2 text-lg">
                      <div className="p-1.5 rounded-lg bg-[#F05984]/20">
                        <Calendar size={18} className="text-[#F05984]" />
                      </div>
                      Resumen Trimestral
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      {quarterlyData.map((quarter, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ y: -6, scale: 1.02 }}
                          className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-5 border border-white/10 hover:border-[#F05984]/40 transition-all cursor-pointer group"
                        >
                          <p className="text-white/40 text-xs font-medium mb-3">{quarter.quarter}</p>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-green-400 text-sm group-hover:text-[#F05984] transition-colors">Ingresos:</span>
                              <span className="text-white font-semibold">{formatCurrency(quarter.income)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-red-400 text-sm">Gastos:</span>
                              <span className="text-white font-semibold">{formatCurrency(quarter.expense)}</span>
                            </div>
                            <div className="w-full h-px bg-white/10 my-2" />
                            <div className="flex items-center justify-between">
                              <span className="text-blue-400 text-sm">Ahorro:</span>
                              <span className="text-white font-bold text-lg">{formatCurrency(quarter.savings)}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'income' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold mb-6 flex items-center gap-2 text-lg">
                      <div className="p-1.5 rounded-lg bg-[#F05984]/20">
                        <TrendingUp size={18} className="text-[#F05984]" />
                      </div>
                      Evolución de Ingresos
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={filteredData}>
                        <defs>
                          <linearGradient id="incomeOnlyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F05984" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="#BC455F" stopOpacity={0.6}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                        <XAxis dataKey="month" stroke="#ffffff60" tick={{ fill: '#ffffff80', fontSize: 12 }} />
                        <YAxis stroke="#ffffff60" tick={{ fill: '#ffffff80', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="income" name="Ingresos" fill="url(#incomeOnlyGradient)" radius={[8, 8, 0, 0]} barSize={50} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <CustomPieChart 
                    data={incomeCategories} 
                    title="Distribución por Categoría" 
                    total={totalIncome}
                  />
                </div>
              )}

              {activeTab === 'expense' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold mb-6 flex items-center gap-2 text-lg">
                      <div className="p-1.5 rounded-lg bg-[#F05984]/20">
                        <TrendingDown size={18} className="text-[#F05984]" />
                      </div>
                      Evolución de Gastos
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={filteredData}>
                        <defs>
                          <linearGradient id="expenseOnlyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="#f87171" stopOpacity={0.6}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                        <XAxis dataKey="month" stroke="#ffffff60" tick={{ fill: '#ffffff80', fontSize: 12 }} />
                        <YAxis stroke="#ffffff60" tick={{ fill: '#ffffff80', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="expense" name="Gastos" fill="url(#expenseOnlyGradient)" radius={[8, 8, 0, 0]} barSize={50} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <CustomPieChart 
                    data={expenseCategories} 
                    title="Distribución por Categoría" 
                    total={totalExpense}
                  />
                </div>
              )}
            </LazyChart>
          </div>

          {/* Insights rediseñados como tarjetas más elaboradas */}
          <div className="p-6 border-t border-white/10 bg-gradient-to-r from-[#321D28]/40 to-[#6E4068]/40">
            <h4 className="text-white font-semibold mb-5 flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-[#F05984]/20">
                <Activity size={18} className="text-[#F05984]" />
              </div>
              Insights y Recomendaciones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 border border-white/10 hover:border-[#F05984]/50 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#F05984]/5 rounded-full blur-2xl group-hover:bg-[#F05984]/10 transition-all" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-gradient-to-br from-[#F05984]/20 to-[#BC455F]/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp size={22} className="text-[#F05984]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-2 text-base">{incomeTrend >= 0 ? 'Crecimiento de ingresos' : 'Caída de ingresos'}</p>
                    <p className="text-white/60 text-sm leading-relaxed">
                      Tus ingresos {incomeTrend >= 0 ? 'aumentaron' : 'disminuyeron'} un <span className="text-[#F05984] font-bold text-base">{Math.abs(incomeTrend).toFixed(1)}%</span> respecto al mes anterior
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 border border-white/10 hover:border-[#F05984]/50 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#BC455F]/5 rounded-full blur-2xl group-hover:bg-[#BC455F]/10 transition-all" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-gradient-to-br from-[#BC455F]/20 to-[#6E4068]/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <TrendingDown size={22} className="text-[#BC455F]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-2 text-base">Área de oportunidad</p>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {topExpenseCategory
                        ? <>Tus gastos en {topExpenseCategory.name} representan el <span className="text-[#BC455F] font-bold text-base">{topExpensePercentage.toFixed(0)}%</span> del total</>
                        : 'Aún no hay gastos registrados para analizar'}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 border border-white/10 hover:border-[#F05984]/50 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#F05984]/5 rounded-full blur-2xl group-hover:bg-[#F05984]/10 transition-all" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-gradient-to-br from-[#F05984]/20 to-[#BC455F]/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Target size={22} className="text-[#F05984]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-2 text-base">Tasa de ahorro</p>
                    <p className="text-white/60 text-sm leading-relaxed">
                      Tu tasa de ahorro actual es del <span className="text-[#F05984] font-bold text-base">{savingsRate.toFixed(0)}%</span> de tus ingresos totales
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
};