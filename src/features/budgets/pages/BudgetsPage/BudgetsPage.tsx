import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
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
  AlertTriangle,
  Info,
  Settings,
  X,
  Save,
  Copy,
  Calendar as CalendarIcon,
  Percent,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';

interface Budget {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'exceeded' | 'pending';
  alertThreshold: number;
  notifications: boolean;
  rollover: boolean;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  transactions?: BudgetTransaction[];
}

interface BudgetTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  vendor?: string;
}

interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  utilization: number;
  activeBudgets: number;
  exceededBudgets: number;
  completedBudgets: number;
  averageUtilization: number;
  projectedSavings: number;
  topCategory: string;
}

interface CategoryBudget {
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  status: 'good' | 'warning' | 'danger';
}

export const BudgetsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'details'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'spent' | 'utilization'>('utilization');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const itemsPerPage = 12;

  // Resumen de presupuestos
  const summary: BudgetSummary = {
    totalBudget: 4250.00,
    totalSpent: 2840.75,
    remainingBudget: 1409.25,
    utilization: 67,
    activeBudgets: 8,
    exceededBudgets: 2,
    completedBudgets: 3,
    averageUtilization: 65,
    projectedSavings: 1680.00,
    topCategory: 'Alimentación'
  };

  // Datos de ejemplo - Presupuestos por categoría
  const budgets: Budget[] = [
    {
      id: 'BUD-001',
      name: 'Presupuesto Alimentación',
      category: 'Alimentación',
      amount: 600.00,
      spent: 450.75,
      period: 'monthly',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'active',
      alertThreshold: 80,
      notifications: true,
      rollover: false,
      tags: ['alimentación', 'supermercado'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15',
      transactions: [
        { id: 'TXN-001', date: '2024-03-05', amount: 156.75, description: 'Supermercado', vendor: 'Mercadona' },
        { id: 'TXN-002', date: '2024-03-10', amount: 89.50, description: 'Restaurante', vendor: 'La Tagliatella' },
        { id: 'TXN-003', date: '2024-03-12', amount: 45.80, description: 'Panadería', vendor: 'La Mallorquina' }
      ]
    },
    {
      id: 'BUD-002',
      name: 'Presupuesto Vivienda',
      category: 'Vivienda',
      amount: 1200.00,
      spent: 1200.00,
      period: 'monthly',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'completed',
      alertThreshold: 90,
      notifications: true,
      rollover: false,
      tags: ['vivienda', 'alquiler'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15'
    },
    {
      id: 'BUD-003',
      name: 'Presupuesto Transporte',
      category: 'Transporte',
      amount: 200.00,
      spent: 65.00,
      period: 'monthly',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'active',
      alertThreshold: 80,
      notifications: true,
      rollover: true,
      tags: ['transporte', 'combustible'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15'
    },
    {
      id: 'BUD-004',
      name: 'Presupuesto Entretenimiento',
      category: 'Entretenimiento',
      amount: 150.00,
      spent: 180.00,
      period: 'monthly',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'exceeded',
      alertThreshold: 100,
      notifications: true,
      rollover: false,
      tags: ['ocio', 'diversión'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15'
    },
    {
      id: 'BUD-005',
      name: 'Presupuesto Salud',
      category: 'Salud',
      amount: 200.00,
      spent: 45.00,
      period: 'monthly',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'active',
      alertThreshold: 80,
      notifications: true,
      rollover: true,
      tags: ['salud', 'farmacia'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15'
    },
    {
      id: 'BUD-006',
      name: 'Presupuesto Compras',
      category: 'Compras',
      amount: 300.00,
      spent: 120.50,
      period: 'monthly',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'active',
      alertThreshold: 80,
      notifications: true,
      rollover: false,
      tags: ['compras', 'ropa'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15'
    },
    {
      id: 'BUD-007',
      name: 'Presupuesto Servicios',
      category: 'Servicios',
      amount: 300.00,
      spent: 210.50,
      period: 'monthly',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'active',
      alertThreshold: 80,
      notifications: true,
      rollover: false,
      tags: ['servicios', 'luz', 'agua', 'internet'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15'
    },
    {
      id: 'BUD-008',
      name: 'Presupuesto Educación',
      category: 'Educación',
      amount: 200.00,
      spent: 0,
      period: 'monthly',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'active',
      alertThreshold: 80,
      notifications: true,
      rollover: true,
      tags: ['educación', 'cursos'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15'
    },
    {
      id: 'BUD-009',
      name: 'Presupuesto Ahorro',
      category: 'Ahorro',
      amount: 500.00,
      spent: 500.00,
      period: 'monthly',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'completed',
      alertThreshold: 100,
      notifications: true,
      rollover: true,
      tags: ['ahorro', 'inversión'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15'
    },
    {
      id: 'BUD-010',
      name: 'Presupuesto Inversiones',
      category: 'Inversiones',
      amount: 300.00,
      spent: 200.00,
      period: 'monthly',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'active',
      alertThreshold: 80,
      notifications: true,
      rollover: true,
      tags: ['inversiones', 'bolsa'],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15'
    }
  ];

  // Resumen por categoría
  const categoryBudgets: CategoryBudget[] = [
    {
      name: 'Alimentación',
      budgeted: 600,
      spent: 450.75,
      remaining: 149.25,
      percentage: 75,
      color: 'from-yellow-500 to-yellow-600',
      icon: <Utensils size={16} />,
      status: 'good'
    },
    {
      name: 'Vivienda',
      budgeted: 1200,
      spent: 1200,
      remaining: 0,
      percentage: 100,
      color: 'from-blue-500 to-blue-600',
      icon: <HomeIcon size={16} />,
      status: 'danger'
    },
    {
      name: 'Transporte',
      budgeted: 200,
      spent: 65,
      remaining: 135,
      percentage: 33,
      color: 'from-green-500 to-green-600',
      icon: <Car size={16} />,
      status: 'good'
    },
    {
      name: 'Entretenimiento',
      budgeted: 150,
      spent: 180,
      remaining: -30,
      percentage: 120,
      color: 'from-purple-500 to-purple-600',
      icon: <Film size={16} />,
      status: 'danger'
    },
    {
      name: 'Salud',
      budgeted: 200,
      spent: 45,
      remaining: 155,
      percentage: 23,
      color: 'from-red-500 to-red-600',
      icon: <Heart size={16} />,
      status: 'good'
    },
    {
      name: 'Compras',
      budgeted: 300,
      spent: 120.50,
      remaining: 179.50,
      percentage: 40,
      color: 'from-pink-500 to-pink-600',
      icon: <ShoppingBag size={16} />,
      status: 'good'
    },
    {
      name: 'Servicios',
      budgeted: 300,
      spent: 210.50,
      remaining: 89.50,
      percentage: 70,
      color: 'from-cyan-500 to-cyan-600',
      icon: <Zap size={16} />,
      status: 'warning'
    },
    {
      name: 'Educación',
      budgeted: 200,
      spent: 0,
      remaining: 200,
      percentage: 0,
      color: 'from-indigo-500 to-indigo-600',
      icon: <BookOpen size={16} />,
      status: 'good'
    },
    {
      name: 'Ahorro',
      budgeted: 500,
      spent: 500,
      remaining: 0,
      percentage: 100,
      color: 'from-teal-500 to-teal-600',
      icon: <Target size={16} />,
      status: 'danger'
    },
    {
      name: 'Inversiones',
      budgeted: 300,
      spent: 200,
      remaining: 100,
      percentage: 67,
      color: 'from-orange-500 to-orange-600',
      icon: <TrendingUpIcon size={16} />,
      status: 'warning'
    }
  ];

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = selectedPeriod === 'todos' || budget.period === selectedPeriod;
    const matchesStatus = selectedStatus === 'todos' || budget.status === selectedStatus;
    
    return matchesSearch && matchesPeriod && matchesStatus;
  });

  // Ordenar presupuestos
  const sortedBudgets = [...filteredBudgets].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortBy === 'spent') {
      return sortOrder === 'asc' ? a.spent - b.spent : b.spent - a.spent;
    } else {
      const utilizationA = (a.spent / a.amount) * 100;
      const utilizationB = (b.spent / b.amount) * 100;
      return sortOrder === 'asc' ? utilizationA - utilizationB : utilizationB - utilizationA;
    }
  });

  // Paginación
  const totalPages = Math.ceil(sortedBudgets.length / itemsPerPage);
  const paginatedBudgets = sortedBudgets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Activity size={12} /> Activo</span>;
      case 'completed':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle size={12} /> Completado</span>;
      case 'exceeded':
        return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><AlertCircle size={12} /> Excedido</span>;
      case 'pending':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Clock size={12} /> Pendiente</span>;
      default:
        return null;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-gradient-to-r from-[#F05984] to-[#BC455F]';
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Presupuestos</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">
              {budgets.length} presupuestos
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Controla tus límites de gasto por categoría
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <BarChart3 size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Wallet size={20} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Nuevo Presupuesto</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Presupuesto Total</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalBudget)}</p>
          <p className="text-white/40 text-xs mt-1">Gastado: {formatCurrency(summary.totalSpent)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Restante</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(summary.remainingBudget)}</p>
          <p className="text-white/40 text-xs mt-1">Utilización: {summary.utilization}%</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Presupuestos Activos</p>
          <p className="text-xl font-bold text-white">{summary.activeBudgets}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-red-400 text-xs">{summary.exceededBudgets} excedidos</span>
            <span className="text-blue-400 text-xs">{summary.completedBudgets} completados</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Ahorro Proyectado</p>
          <p className="text-xl font-bold text-blue-400">{formatCurrency(summary.projectedSavings)}</p>
          <p className="text-white/40 text-xs mt-1">Categoría principal: {summary.topCategory}</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Progreso General</h3>
          <span className="text-white/60 text-sm">{summary.utilization}% utilizado</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full transition-all duration-500"
            style={{ width: `${summary.utilization}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-white/40">0%</span>
          <span className="text-white/40">25%</span>
          <span className="text-white/40">50%</span>
          <span className="text-white/40">75%</span>
          <span className="text-white/40">100%</span>
        </div>
      </div>

      {/* Category Budget Summary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-3">Presupuesto por Categoría</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryBudgets.map((cat, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>
                    {cat.icon}
                  </div>
                  <span className="text-white text-sm">{cat.name}</span>
                </div>
                <div className={`text-xs px-1.5 py-0.5 rounded-full ${
                  cat.status === 'good' ? 'bg-green-500/20 text-green-400' :
                  cat.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {cat.status === 'good' ? 'Bien' : cat.status === 'warning' ? 'Cuidado' : 'Excedido'}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-white/60">Gastado:</span>
                <span className="text-white">{formatCurrency(cat.spent)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-white/60">Presupuesto:</span>
                <span className="text-white">{formatCurrency(cat.budgeted)}</span>
              </div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/60">Restante:</span>
                <span className={cat.remaining >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {formatCurrency(cat.remaining)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    cat.percentage >= 100 ? 'bg-red-500' :
                    cat.percentage >= 80 ? 'bg-yellow-500' :
                    'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                  }`}
                  style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Buscar presupuesto por nombre o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
              >
                <option value="monthly">Mensual</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
              >
                <option value="todos">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="completed">Completados</option>
                <option value="exceeded">Excedidos</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Filter size={20} />
              </button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">Ordenar por:</span>
            <button
              onClick={() => {
                setSortBy('name');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'name' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <span>Nombre</span>
              {sortBy === 'name' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('amount');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'amount' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <DollarSign size={14} />
              <span>Presupuesto</span>
              {sortBy === 'amount' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('spent');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'spent' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Activity size={14} />
              <span>Gastado</span>
              {sortBy === 'spent' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('utilization');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'utilization' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Percent size={14} />
              <span>Utilización</span>
              {sortBy === 'utilization' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
          </div>
          <span className="text-white/40 text-sm">
            {filteredBudgets.length} resultados
          </span>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedBudgets.map((budget) => {
              const utilization = (budget.spent / budget.amount) * 100;
              const isExceeded = utilization >= 100;
              const isWarning = utilization >= 80 && utilization < 100;
              
              return (
                <div
                  key={budget.id}
                  className={`bg-white/5 rounded-xl p-4 border transition-all cursor-pointer hover:border-[#F05984]/50 ${
                    isExceeded ? 'border-red-500/30' : isWarning ? 'border-yellow-500/30' : 'border-white/10'
                  }`}
                  onClick={() => setSelectedBudget(budget)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${
                        budget.category === 'Alimentación' ? 'from-yellow-500 to-yellow-600' :
                        budget.category === 'Vivienda' ? 'from-blue-500 to-blue-600' :
                        budget.category === 'Transporte' ? 'from-green-500 to-green-600' :
                        budget.category === 'Entretenimiento' ? 'from-purple-500 to-purple-600' :
                        budget.category === 'Salud' ? 'from-red-500 to-red-600' :
                        budget.category === 'Compras' ? 'from-pink-500 to-pink-600' :
                        'from-cyan-500 to-cyan-600'
                      } bg-opacity-20`}>
                        {budget.category === 'Alimentación' ? <Utensils size={16} /> :
                         budget.category === 'Vivienda' ? <HomeIcon size={16} /> :
                         budget.category === 'Transporte' ? <Car size={16} /> :
                         budget.category === 'Entretenimiento' ? <Film size={16} /> :
                         budget.category === 'Salud' ? <Heart size={16} /> :
                         budget.category === 'Compras' ? <ShoppingBag size={16} /> :
                         <Zap size={16} />}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{budget.name}</h3>
                        <p className="text-white/40 text-xs">{budget.category}</p>
                      </div>
                    </div>
                    {getStatusBadge(budget.status)}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Presupuesto:</span>
                      <span className="text-white font-bold">{formatCurrency(budget.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Gastado:</span>
                      <span className={isExceeded ? 'text-red-400 font-bold' : 'text-white'}>
                        {formatCurrency(budget.spent)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Restante:</span>
                      <span className={isExceeded ? 'text-red-400' : 'text-green-400'}>
                        {formatCurrency(budget.amount - budget.spent)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Utilización:</span>
                      <span className={isExceeded ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-white'}>
                        {utilization.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        isExceeded ? 'bg-red-500' :
                        isWarning ? 'bg-yellow-500' :
                        'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                      }`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-white/10">
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Eye size={14} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Edit size={14} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Copy size={14} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <MoreVertical size={14} className="text-white/60" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="p-4 space-y-2">
            {paginatedBudgets.map((budget) => {
              const utilization = (budget.spent / budget.amount) * 100;
              const isExceeded = utilization >= 100;
              const isWarning = utilization >= 80 && utilization < 100;
              
              return (
                <div
                  key={budget.id}
                  className={`bg-white/5 rounded-lg p-3 border transition-all cursor-pointer hover:border-[#F05984]/50 ${
                    isExceeded ? 'border-red-500/30' : isWarning ? 'border-yellow-500/30' : 'border-white/10'
                  }`}
                  onClick={() => setSelectedBudget(budget)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${
                      budget.category === 'Alimentación' ? 'from-yellow-500 to-yellow-600' :
                      budget.category === 'Vivienda' ? 'from-blue-500 to-blue-600' :
                      budget.category === 'Transporte' ? 'from-green-500 to-green-600' :
                      budget.category === 'Entretenimiento' ? 'from-purple-500 to-purple-600' :
                      budget.category === 'Salud' ? 'from-red-500 to-red-600' :
                      budget.category === 'Compras' ? 'from-pink-500 to-pink-600' :
                      'from-cyan-500 to-cyan-600'
                    } bg-opacity-20`}>
                      {budget.category === 'Alimentación' ? <Utensils size={16} /> :
                       budget.category === 'Vivienda' ? <HomeIcon size={16} /> :
                       budget.category === 'Transporte' ? <Car size={16} /> :
                       budget.category === 'Entretenimiento' ? <Film size={16} /> :
                       budget.category === 'Salud' ? <Heart size={16} /> :
                       budget.category === 'Compras' ? <ShoppingBag size={16} /> :
                       <Zap size={16} />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{budget.name}</h3>
                        {getStatusBadge(budget.status)}
                      </div>
                      <p className="text-white/40 text-xs">{budget.category}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Presupuesto</p>
                        <p className="text-white text-sm font-bold">{formatCurrency(budget.amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Gastado</p>
                        <p className={isExceeded ? 'text-red-400 text-sm font-bold' : 'text-white text-sm'}>
                          {formatCurrency(budget.spent)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Restante</p>
                        <p className={isExceeded ? 'text-red-400 text-sm' : 'text-green-400 text-sm'}>
                          {formatCurrency(budget.amount - budget.spent)}
                        </p>
                      </div>
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-white/60">{utilization.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              isExceeded ? 'bg-red-500' :
                              isWarning ? 'bg-yellow-500' :
                              'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                            }`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <Eye size={16} className="text-white/60" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <Edit size={16} className="text-white/60" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <MoreVertical size={16} className="text-white/60" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredBudgets.length)} de {filteredBudgets.length} presupuestos
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#F05984] text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
