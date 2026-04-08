import { useState } from 'react';
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
  ArrowDown,
  Activity,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ChevronDown,
  ChevronUp,
  XCircle,
  Star
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
}

// Componente de tooltip personalizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-xl rounded-xl p-3 shadow-2xl border border-white/20">
        <p className="text-xs text-white/60 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
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

// Componente de gráfico de pastel personalizado
const CustomPieChart = ({ data, title, total }: { data: CategoryData[], title: string, total: number }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  return (
    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
      <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
        <PieChartIcon size={18} className="text-purple-400" />
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
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-white/40 text-sm">Total: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(total)}</p>
      </div>
    </div>
  );
};

export const ChartsPage = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'income' | 'expense'>('comparison');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6m');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  // Datos de categorías de ingresos
  const incomeCategories: CategoryData[] = [
    { name: 'Salario', value: 28500, color: '#10b981' },
    { name: 'Servicios', value: 12500, color: '#3b82f6' },
    { name: 'Ventas', value: 8500, color: '#8b5cf6' },
    { name: 'Inversiones', value: 4200, color: '#06b6d4' },
    { name: 'Otros', value: 3800, color: '#6b7280' }
  ];

  // Datos de categorías de gastos
  const expenseCategories: CategoryData[] = [
    { name: 'Vivienda', value: 14400, color: '#3b82f6' },
    { name: 'Alimentación', value: 5120, color: '#f59e0b' },
    { name: 'Transporte', value: 3240, color: '#10b981' },
    { name: 'Servicios', value: 2840, color: '#06b6d4' },
    { name: 'Ocio', value: 2150, color: '#8b5cf6' },
    { name: 'Salud', value: 1850, color: '#ef4444' },
    { name: 'Compras', value: 1650, color: '#ec4899' },
    { name: 'Seguros', value: 1350, color: '#6366f1' }
  ];

  // Datos trimestrales
  const quarterlyData = [
    { quarter: 'Q1 2024', income: 9750, expense: 6350, savings: 3400 },
    { quarter: 'Q2 2024', income: 10450, expense: 6200, savings: 4250 },
    { quarter: 'Q3 2024', income: 10000, expense: 6500, savings: 3500 },
    { quarter: 'Q4 2024', income: 10950, expense: 6800, savings: 4150 }
  ];

  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.value, 0);
  const totalExpense = expenseCategories.reduce((sum, cat) => sum + cat.value, 0);
  const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;

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
          <button onClick={handleRefresh} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10'}`}>
            <Filter size={20} />
          </button>
          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Ingresos Totales</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp size={14} className="text-green-400" />
                <span className="text-green-400 text-sm font-medium">+8.5%</span>
                <span className="text-white/40 text-xs ml-1">vs año anterior</span>
              </div>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <TrendingUp size={24} className="text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Gastos Totales</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalExpense)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp size={14} className="text-red-400" />
                <span className="text-red-400 text-sm font-medium">+3.2%</span>
                <span className="text-white/40 text-xs ml-1">vs año anterior</span>
              </div>
            </div>
            <div className="p-3 bg-red-500/20 rounded-xl">
              <TrendingDown size={24} className="text-red-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Ahorro Total</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome - totalExpense)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp size={14} className="text-green-400" />
                <span className="text-green-400 text-sm font-medium">+12.4%</span>
                <span className="text-white/40 text-xs ml-1">vs año anterior</span>
              </div>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
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
          <button
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
          </button>
          <button
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
          </button>
          <button
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
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 flex flex-wrap gap-4 border-b border-white/10 bg-white/5">
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
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-lg transition-all ${
                chartType === 'bar'
                  ? 'bg-[#F05984] text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
              }`}
              title="Gráfico de barras"
            >
              <BarChart3 size={18} />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-lg transition-all ${
                chartType === 'line'
                  ? 'bg-[#F05984] text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
              }`}
              title="Gráfico de líneas"
            >
              <LineChartIcon size={18} />
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`p-2 rounded-lg transition-all ${
                chartType === 'pie'
                  ? 'bg-[#F05984] text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
              }`}
              title="Gráfico de pastel"
            >
              <PieChartIcon size={18} />
            </button>
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
                {chartType === 'bar' && (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="month" stroke="#ffffff60" />
                      <YAxis stroke="#ffffff60" tickFormatter={(value) => `$${value}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="expense" name="Gastos" fill="#ef4444" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {chartType === 'line' && (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="month" stroke="#ffffff60" />
                      <YAxis stroke="#ffffff60" tickFormatter={(value) => `$${value}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="income" name="Ingresos" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                      <Line type="monotone" dataKey="expense" name="Gastos" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                {chartType === 'pie' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CustomPieChart 
                      data={incomeCategories} 
                      title="Distribución de Ingresos" 
                      total={totalIncome}
                    />
                    <CustomPieChart 
                      data={expenseCategories} 
                      title="Distribución de Gastos" 
                      total={totalExpense}
                    />
                  </div>
                )}
              </div>

              {/* Resumen trimestral */}
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-[#F05984]" />
                  Resumen Trimestral
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quarterlyData.map((quarter, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#F05984]/30 transition-all">
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
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                          <span className="text-blue-400 text-sm">Ahorro:</span>
                          <span className="text-white font-bold">{formatCurrency(quarter.savings)}</span>
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
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="month" stroke="#ffffff60" />
                      <YAxis stroke="#ffffff60" tickFormatter={(value) => `$${value}`} />
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
                      <XAxis dataKey="month" stroke="#ffffff60" />
                      <YAxis stroke="#ffffff60" tickFormatter={(value) => `$${value}`} />
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

        {/* Insights */}
        <div className="p-5 border-t border-white/10 bg-gradient-to-r from-[#321D28]/30 to-[#6E4068]/30">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity size={18} className="text-[#F05984]" />
            Insights y Recomendaciones
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="p-2 bg-green-500/20 rounded-lg"><TrendingUp size={18} className="text-green-400" /></div>
              <div><p className="text-white/90 text-sm font-medium mb-1">Crecimiento de ingresos</p><p className="text-white/60 text-sm">Tus ingresos han aumentado un <span className="text-green-400 font-medium">8.5%</span> respecto al año anterior</p></div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="p-2 bg-red-500/20 rounded-lg"><TrendingDown size={18} className="text-red-400" /></div>
              <div><p className="text-white/90 text-sm font-medium mb-1">Área de oportunidad</p><p className="text-white/60 text-sm">Tus gastos en ocio representan el <span className="text-red-400 font-medium">15%</span> del total</p></div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="p-2 bg-blue-500/20 rounded-lg"><Target size={18} className="text-blue-400" /></div>
              <div><p className="text-white/90 text-sm font-medium mb-1">Tasa de ahorro</p><p className="text-white/60 text-sm">Tu tasa de ahorro actual es del <span className="text-blue-400 font-medium">{savingsRate.toFixed(0)}%</span>, por encima del promedio</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
