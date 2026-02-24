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
  AreaChart
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
}

interface TimePeriod {
  value: string;
  label: string;
}

export const ChartsPage = () => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense' | 'comparison'>('comparison');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6m');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Períodos disponibles
  const periods: TimePeriod[] = [
    { value: '1m', label: 'Último mes' },
    { value: '3m', label: 'Últimos 3 meses' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '1y', label: 'Último año' },
    { value: '2y', label: 'Últimos 2 años' }
  ];

  // Años disponibles
  const years: string[] = ['2024', '2023', '2022', '2021', '2020'];

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

  // Datos de ejemplo - Categorías de ingresos
  const incomeCategories: CategoryData[] = [
    { category: 'Salario', amount: 28500, color: 'from-green-500 to-green-600', icon: <Briefcase size={16} /> },
    { category: 'Servicios', amount: 12500, color: 'from-blue-500 to-blue-600', icon: <Laptop size={16} /> },
    { category: 'Ventas', amount: 8500, color: 'from-purple-500 to-purple-600', icon: <ShoppingBag size={16} /> },
    { category: 'Inversiones', amount: 4200, color: 'from-cyan-500 to-cyan-600', icon: <TrendingUp size={16} /> },
    { category: 'Otros', amount: 3800, color: 'from-gray-500 to-gray-600', icon: <Sparkles size={16} /> }
  ];

  // Datos de ejemplo - Categorías de gastos
  const expenseCategories: CategoryData[] = [
    { category: 'Vivienda', amount: 14400, color: 'from-blue-500 to-blue-600', icon: <HomeIcon size={16} /> },
    { category: 'Alimentación', amount: 5120, color: 'from-yellow-500 to-yellow-600', icon: <Utensils size={16} /> },
    { category: 'Transporte', amount: 3240, color: 'from-green-500 to-green-600', icon: <Car size={16} /> },
    { category: 'Servicios', amount: 2840, color: 'from-cyan-500 to-cyan-600', icon: <Zap size={16} /> },
    { category: 'Ocio', amount: 2150, color: 'from-purple-500 to-purple-600', icon: <Film size={16} /> },
    { category: 'Salud', amount: 1850, color: 'from-red-500 to-red-600', icon: <Heart size={16} /> },
    { category: 'Compras', amount: 1650, color: 'from-pink-500 to-pink-600', icon: <ShoppingBag size={16} /> },
    { category: 'Seguros', amount: 1350, color: 'from-indigo-500 to-indigo-600', icon: <Award size={16} /> }
  ];

  // Datos de ejemplo - Trimestres
  const quarterlyData = [
    { quarter: 'Q1 2024', income: 9750, expense: 6350, savings: 3400 },
    { quarter: 'Q2 2024', income: 10450, expense: 6200, savings: 4250 },
    { quarter: 'Q3 2024', income: 10000, expense: 6500, savings: 3500 },
    { quarter: 'Q4 2024', income: 10950, expense: 6800, savings: 4150 }
  ];

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

  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalExpense = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);

  // Componente de gráfico de barras
  const BarChartComponent = ({ data, type }: { data: ChartData[], type: 'income' | 'expense' | 'both' }) => {
    const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expense)));
    
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60 font-medium">{item.month}</span>
              <div className="flex items-center gap-4">
                {(type === 'income' || type === 'both') && (
                  <span className="text-green-400 font-medium">{formatCurrency(item.income)}</span>
                )}
                {(type === 'expense' || type === 'both') && (
                  <span className="text-red-400 font-medium">{formatCurrency(item.expense)}</span>
                )}
              </div>
            </div>
            <div className="flex gap-1 h-8">
              {(type === 'income' || type === 'both') && (
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 rounded-l-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                  style={{ width: `${(item.income / maxValue) * 100}%` }}
                >
                  <div className="h-full w-full flex items-center justify-end px-2 text-xs text-white font-medium opacity-0 hover:opacity-100 transition-opacity">
                    {formatCurrency(item.income)}
                  </div>
                </div>
              )}
              {(type === 'expense' || type === 'both') && (
                <div 
                  className="bg-gradient-to-r from-red-500 to-red-600 rounded-r-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                  style={{ width: `${(item.expense / maxValue) * 100}%` }}
                >
                  <div className="h-full w-full flex items-center justify-end px-2 text-xs text-white font-medium opacity-0 hover:opacity-100 transition-opacity">
                    {formatCurrency(item.expense)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Componente de gráfico circular
  const PieChartComponent = ({ data, total }: { data: CategoryData[], total: number }) => {
    return (
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.amount / total) * 100;
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20`}>
                    {item.icon}
                  </div>
                  <span className="text-white text-sm">{item.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm font-medium">{formatCurrency(item.amount)}</span>
                  <span className="text-white/40 text-xs w-12 text-right">{percentage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Componente de gráfico de líneas simplificado
  const LineChartComponent = ({ data }: { data: ChartData[] }) => {
    const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expense, d.savings)));
    
    return (
      <div className="relative h-64">
        {/* Líneas de fondo */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-white/10 w-full h-0" />
          ))}
        </div>
        
        {/* Puntos y líneas */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full flex justify-around px-2">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center w-12">
                {/* Línea de ingresos */}
                <div className="relative group cursor-pointer">
                  <div 
                    className="w-2 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(item.income / maxValue) * 180}px` }}
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Ingreso: {formatCurrency(item.income)}
                  </div>
                </div>
                {/* Línea de gastos */}
                <div className="relative group cursor-pointer mt-1">
                  <div 
                    className="w-2 bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(item.expense / maxValue) * 180}px` }}
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Gasto: {formatCurrency(item.expense)}
                  </div>
                </div>
                {/* Línea de ahorro */}
                <div className="relative group cursor-pointer mt-1">
                  <div 
                    className="w-2 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(item.savings / maxValue) * 180}px` }}
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    Ahorro: {formatCurrency(item.savings)}
                  </div>
                </div>
                <span className="text-white/40 text-xs mt-2">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

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
            Visualiza y analiza tus ingresos y gastos
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Ingresos Totales</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUp size={14} className="text-green-400" />
            <span className="text-green-400 text-xs">+8.5%</span>
            <span className="text-white/40 text-xs ml-1">vs año anterior</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Gastos Totales</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalExpense)}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUp size={14} className="text-red-400" />
            <span className="text-red-400 text-xs">+3.2%</span>
            <span className="text-white/40 text-xs ml-1">vs año anterior</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Ahorro Total</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome - totalExpense)}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUp size={14} className="text-green-400" />
            <span className="text-green-400 text-xs">+12.4%</span>
            <span className="text-white/40 text-xs ml-1">vs año anterior</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'comparison'
                ? 'text-[#F05984] border-b-2 border-[#F05984] bg-white/5'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Comparación General
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'income'
                ? 'text-[#F05984] border-b-2 border-[#F05984] bg-white/5'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Análisis de Ingresos
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'expense'
                ? 'text-[#F05984] border-b-2 border-[#F05984] bg-white/5'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Análisis de Gastos
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 flex flex-wrap gap-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">Período:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">Año:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-lg transition-colors ${
                chartType === 'bar' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
              title="Gráfico de barras"
            >
              <BarChart3 size={18} />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-lg transition-colors ${
                chartType === 'line' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
              title="Gráfico de líneas"
            >
              <LineChart size={18} />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-2 rounded-lg transition-colors ${
                chartType === 'area' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
              title="Gráfico de áreas"
            >
              <AreaChart size={18} />
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="p-6">
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              {/* Gráfico de comparación */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Evolución Ingresos vs Gastos</h3>
                {chartType === 'bar' && <BarChartComponent data={monthlyData} type="both" />}
                {chartType === 'line' && <LineChartComponent data={monthlyData} />}
                {chartType === 'area' && <BarChartComponent data={monthlyData} type="both" />}
              </div>

              {/* Leyenda */}
              <div className="flex items-center justify-center gap-6">
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

              {/* Resumen trimestral */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {quarterlyData.map((quarter, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-white/40 text-xs mb-2">{quarter.quarter}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-400">Ingresos:</span>
                        <span className="text-white">{formatCurrency(quarter.income)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-red-400">Gastos:</span>
                        <span className="text-white">{formatCurrency(quarter.expense)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-medium pt-1 border-t border-white/10 mt-1">
                        <span className="text-blue-400">Ahorro:</span>
                        <span className="text-white">{formatCurrency(quarter.savings)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'income' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Evolución de Ingresos</h3>
                  <BarChartComponent data={monthlyData} type="income" />
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Distribución por Categoría</h3>
                  <PieChartComponent data={incomeCategories} total={totalIncome} />
                </div>
              </div>

              {/* Tabla de ingresos */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Detalle por Categoría</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Categoría</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Monto</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Porcentaje</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Promedio mensual</th>
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
                                <div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>
                                  {cat.icon}
                                </div>
                                <span className="text-white">{cat.category}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right text-white font-medium">{formatCurrency(cat.amount)}</td>
                            <td className="py-3 px-4 text-right text-white/60">{percentage.toFixed(1)}%</td>
                            <td className="py-3 px-4 text-right text-white/60">{formatCurrency(monthlyAvg)}</td>
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Evolución de Gastos</h3>
                  <BarChartComponent data={monthlyData} type="expense" />
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Distribución por Categoría</h3>
                  <PieChartComponent data={expenseCategories} total={totalExpense} />
                </div>
              </div>

              {/* Tabla de gastos */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Detalle por Categoría</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Categoría</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Monto</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Porcentaje</th>
                        <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Promedio mensual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseCategories.map((cat, index) => {
                        const percentage = (cat.amount / totalExpense) * 100;
                        const monthlyAvg = cat.amount / 12;
                        return (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>
                                  {cat.icon}
                                </div>
                                <span className="text-white">{cat.category}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right text-white font-medium">{formatCurrency(cat.amount)}</td>
                            <td className="py-3 px-4 text-right text-white/60">{percentage.toFixed(1)}%</td>
                            <td className="py-3 px-4 text-right text-white/60">{formatCurrency(monthlyAvg)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Análisis de gastos fijos vs variables */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Gastos Fijos vs Variables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-white/60 text-sm mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Gastos Fijos
                    </p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-white">Vivienda</span>
                          <span className="text-white">40%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-white">Servicios</span>
                          <span className="text-white">25%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-white">Seguros</span>
                          <span className="text-white">15%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '15%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      Gastos Variables
                    </p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-white">Alimentación</span>
                          <span className="text-white">35%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: '35%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-white">Transporte</span>
                          <span className="text-white">25%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: '25%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-white">Ocio</span>
                          <span className="text-white">20%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: '20%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="p-4 border-t border-white/10 bg-gradient-to-r from-[#321D28]/50 to-[#6E4068]/50">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Activity size={18} className="text-[#F05984]" />
            Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
              <TrendingUp size={16} className="text-green-400 mt-1 flex-shrink-0" />
              <p className="text-white/70 text-sm">
                Tus ingresos han aumentado un <span className="text-green-400 font-medium">8.5%</span> respecto al año anterior
              </p>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
              <TrendingDown size={16} className="text-red-400 mt-1 flex-shrink-0" />
              <p className="text-white/70 text-sm">
                Tus gastos en ocio representan el <span className="text-red-400 font-medium">15%</span> del total
              </p>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
              <Activity size={16} className="text-blue-400 mt-1 flex-shrink-0" />
              <p className="text-white/70 text-sm">
                Tu tasa de ahorro actual es del <span className="text-blue-400 font-medium">21%</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
