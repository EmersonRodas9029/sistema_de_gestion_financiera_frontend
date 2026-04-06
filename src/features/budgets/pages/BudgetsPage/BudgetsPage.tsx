import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
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
  Activity,
  Target,
  Home as HomeIcon,
  Utensils,
  Car,
  Heart,
  ShoppingBag,
  Film,
  Zap,
  BookOpen,
  X,
  Save,
  Copy,
  Calendar as CalendarIcon,
  Percent,
  TrendingUp as TrendingUpIcon,
  XCircle,
  User,
  Hash,
  Tag
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

// Función para generar ID único
const generateUniqueId = () => {
  return `BUD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Datos iniciales por defecto
const getDefaultBudgets = (): Budget[] => [
  {
    id: generateUniqueId(),
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
    updatedAt: '2024-03-15'
  },
  {
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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

export const BudgetsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    amount: '',
    category: '',
    alertThreshold: '80',
    notifications: true,
    rollover: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'spent' | 'utilization'>('utilization');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    period: 'monthly',
    alertThreshold: '80',
    notifications: true,
    rollover: false,
    notes: ''
  });

  const itemsPerPage = 6;

  // Cargar datos desde localStorage o usar datos por defecto
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    try {
      const saved = localStorage.getItem('budgets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return getDefaultBudgets();
    } catch (error) {
      console.error('Error loading budgets:', error);
      return getDefaultBudgets();
    }
  });

  // Guardar en localStorage cuando cambien los presupuestos
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Calcular estadísticas en tiempo real
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const activeBudgets = budgets.filter(b => b.status === 'active').length;
  const exceededBudgets = budgets.filter(b => b.status === 'exceeded').length;
  const completedBudgets = budgets.filter(b => b.status === 'completed').length;
  const projectedSavings = remainingBudget * 0.7;

  // Calcular categorías
  const categoryMap = new Map<string, { budgeted: number; spent: number }>();
  budgets.forEach(b => {
    const existing = categoryMap.get(b.category);
    if (existing) {
      existing.budgeted += b.amount;
      existing.spent += b.spent;
    } else {
      categoryMap.set(b.category, { budgeted: b.amount, spent: b.spent });
    }
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Alimentación': 'from-yellow-500 to-yellow-600',
      'Vivienda': 'from-blue-500 to-blue-600',
      'Transporte': 'from-green-500 to-green-600',
      'Entretenimiento': 'from-purple-500 to-purple-600',
      'Salud': 'from-red-500 to-red-600',
      'Compras': 'from-pink-500 to-pink-600',
      'Servicios': 'from-cyan-500 to-cyan-600',
      'Educación': 'from-indigo-500 to-indigo-600',
      'Ahorro': 'from-teal-500 to-teal-600',
      'Inversiones': 'from-orange-500 to-orange-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Alimentación': <Utensils size={16} />,
      'Vivienda': <HomeIcon size={16} />,
      'Transporte': <Car size={16} />,
      'Entretenimiento': <Film size={16} />,
      'Salud': <Heart size={16} />,
      'Compras': <ShoppingBag size={16} />,
      'Servicios': <Zap size={16} />,
      'Educación': <BookOpen size={16} />,
      'Ahorro': <Target size={16} />,
      'Inversiones': <TrendingUpIcon size={16} />
    };
    return icons[category] || <Tag size={16} />;
  };

  const categoryBudgets: CategoryBudget[] = Array.from(categoryMap.entries()).map(([name, data]) => {
    const percentage = data.budgeted > 0 ? (data.spent / data.budgeted) * 100 : 0;
    let status: 'good' | 'warning' | 'danger' = 'good';
    if (percentage >= 100) status = 'danger';
    else if (percentage >= 80) status = 'warning';
    
    return {
      name,
      budgeted: data.budgeted,
      spent: data.spent,
      remaining: data.budgeted - data.spent,
      percentage,
      color: getCategoryColor(name),
      icon: getCategoryIcon(name),
      status
    };
  }).sort((a, b) => b.budgeted - a.budgeted);

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = selectedPeriod === 'todos' || budget.period === selectedPeriod;
    const matchesStatus = selectedStatus === 'todos' || budget.status === selectedStatus;
    
    return matchesSearch && matchesPeriod && matchesStatus;
  });

  const sortedBudgets = [...filteredBudgets].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortBy === 'spent') {
      return sortOrder === 'asc' ? a.spent - b.spent : b.spent - a.spent;
    } else {
      const utilA = (a.spent / a.amount) * 100;
      const utilB = (b.spent / b.amount) * 100;
      return sortOrder === 'asc' ? utilA - utilB : utilB - utilA;
    }
  });

  const totalPages = Math.ceil(sortedBudgets.length / itemsPerPage);
  const paginatedBudgets = sortedBudgets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleCreateBudget = () => {
    const newBudget: Budget = {
      id: generateUniqueId(),
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      spent: 0,
      period: formData.period as any,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      status: 'active',
      alertThreshold: parseInt(formData.alertThreshold),
      notifications: formData.notifications,
      rollover: formData.rollover,
      notes: formData.notes || undefined,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBudgets(prev => [newBudget, ...prev]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      amount: '',
      category: '',
      period: 'monthly',
      alertThreshold: '80',
      notifications: true,
      rollover: false,
      notes: ''
    });
  };

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setEditFormData({
      name: budget.name,
      amount: budget.amount.toString(),
      category: budget.category,
      alertThreshold: budget.alertThreshold.toString(),
      notifications: budget.notifications,
      rollover: budget.rollover
    });
    setShowEditModal(true);
  };

  const handleUpdateBudget = () => {
    if (selectedBudget) {
      const updatedBudgets = budgets.map(b => 
        b.id === selectedBudget.id ? {
          ...b,
          name: editFormData.name,
          amount: parseFloat(editFormData.amount),
          category: editFormData.category,
          alertThreshold: parseInt(editFormData.alertThreshold),
          notifications: editFormData.notifications,
          rollover: editFormData.rollover,
          updatedAt: new Date().toISOString()
        } : b
      );
      setBudgets(updatedBudgets);
      setShowEditModal(false);
      setSelectedBudget(null);
    }
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este presupuesto?')) {
      setBudgets(prev => prev.filter(b => b.id !== id));
    }
  };

  const resetData = () => {
    if (window.confirm('¿Esto restaurará los datos a los valores por defecto. ¿Continuar?')) {
      localStorage.removeItem('budgets');
      setBudgets(getDefaultBudgets());
    }
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
      case 'active': return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Activity size={12} /> Activo</span>;
      case 'completed': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle size={12} /> Completado</span>;
      case 'exceeded': return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><AlertCircle size={12} /> Excedido</span>;
      case 'pending': return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Clock size={12} /> Pendiente</span>;
      default: return null;
    }
  };

  const hasActiveFilters = searchTerm !== '' || selectedPeriod !== 'monthly' || selectedStatus !== 'todos';

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
          <button onClick={handleRefresh} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>
            <BarChart3 size={20} />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>
            <Wallet size={20} />
          </button>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={20} />
            <span className="hidden sm:inline">Nuevo Presupuesto</span>
          </button>
          <button onClick={resetData} className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors text-yellow-400 hover:text-yellow-300" title="Restaurar datos por defecto">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Presupuesto Total</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalBudget)}</p>
          <p className="text-white/40 text-xs mt-1">Gastado: {formatCurrency(totalSpent)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Restante</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(remainingBudget)}</p>
          <p className="text-white/40 text-xs mt-1">Utilización: {utilization.toFixed(0)}%</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Presupuestos Activos</p>
          <p className="text-xl font-bold text-white">{activeBudgets}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-red-400 text-xs">{exceededBudgets} excedidos</span>
            <span className="text-blue-400 text-xs">{completedBudgets} completados</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Ahorro Proyectado</p>
          <p className="text-xl font-bold text-blue-400">{formatCurrency(projectedSavings)}</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Progreso General</h3>
          <span className="text-white/60 text-sm">{utilization.toFixed(0)}% utilizado</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full transition-all duration-500" style={{ width: `${utilization}%` }} />
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
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>{cat.icon}</div>
                  <span className="text-white text-sm">{cat.name}</span>
                </div>
                <div className={`text-xs px-1.5 py-0.5 rounded-full ${cat.status === 'good' ? 'bg-green-500/20 text-green-400' : cat.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                  {cat.status === 'good' ? 'Bien' : cat.status === 'warning' ? 'Cuidado' : 'Excedido'}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-1"><span className="text-white/60">Gastado:</span><span className="text-white">{formatCurrency(cat.spent)}</span></div>
              <div className="flex items-center justify-between text-sm mb-1"><span className="text-white/60">Presupuesto:</span><span className="text-white">{formatCurrency(cat.budgeted)}</span></div>
              <div className="flex items-center justify-between text-xs mb-1"><span className="text-white/60">Restante:</span><span className={cat.remaining >= 0 ? 'text-green-400' : 'text-red-400'}>{formatCurrency(cat.remaining)}</span></div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className={`h-full rounded-full ${cat.percentage >= 100 ? 'bg-red-500' : cat.percentage >= 80 ? 'bg-yellow-500' : 'bg-gradient-to-r from-[#F05984] to-[#BC455F]'}`} style={{ width: `${Math.min(cat.percentage, 100)}%` }} />
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
              <input type="text" placeholder="Buscar presupuesto por nombre o categoría..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors" />
            </div>
            <div className="flex flex-wrap gap-2">
              <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                <option value="monthly" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Mensual</option>
                <option value="quarterly" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Trimestral</option>
                <option value="yearly" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Anual</option>
              </select>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos los estados</option>
                <option value="active" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Activos</option>
                <option value="completed" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Completados</option>
                <option value="exceeded" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Excedidos</option>
              </select>
              <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}><Filter size={20} /></button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"><Download size={20} /></button>
              {hasActiveFilters && (
                <button onClick={() => { setSearchTerm(''); setSelectedPeriod('monthly'); setSelectedStatus('todos'); setCurrentPage(1); }} className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 text-sm">
                  <XCircle size={16} /><span>Limpiar filtros</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">Ordenar por:</span>
            <button onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'name' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}><span>Nombre</span>{sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</button>
            <button onClick={() => { setSortBy('amount'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'amount' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}><DollarSign size={14} /><span>Presupuesto</span>{sortBy === 'amount' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</button>
            <button onClick={() => { setSortBy('spent'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'spent' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}><Activity size={14} /><span>Gastado</span>{sortBy === 'spent' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</button>
            <button onClick={() => { setSortBy('utilization'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'utilization' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}><Percent size={14} /><span>Utilización</span>{sortBy === 'utilization' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</button>
          </div>
          <span className="text-white/40 text-sm">{filteredBudgets.length} resultados</span>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedBudgets.map((budget) => {
              const utilization = (budget.spent / budget.amount) * 100;
              const isExceeded = utilization >= 100;
              const isWarning = utilization >= 80 && utilization < 100;
              return (
                <div key={budget.id} className={`bg-white/5 rounded-xl p-4 border transition-all cursor-pointer hover:border-[#F05984]/50 ${isExceeded ? 'border-red-500/30' : isWarning ? 'border-yellow-500/30' : 'border-white/10'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(budget.category)} bg-opacity-20`}>{getCategoryIcon(budget.category)}</div>
                      <div><h3 className="text-white font-medium">{budget.name}</h3><p className="text-white/40 text-xs">{budget.category}</p></div>
                    </div>
                    {getStatusBadge(budget.status)}
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm"><span className="text-white/60">Presupuesto:</span><span className="text-white font-bold">{formatCurrency(budget.amount)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-white/60">Gastado:</span><span className={isExceeded ? 'text-red-400 font-bold' : 'text-white'}>{formatCurrency(budget.spent)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-white/60">Restante:</span><span className={isExceeded ? 'text-red-400' : 'text-green-400'}>{formatCurrency(budget.amount - budget.spent)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-white/60">Utilización:</span><span className={isExceeded ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-white'}>{utilization.toFixed(1)}%</span></div>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${isExceeded ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-gradient-to-r from-[#F05984] to-[#BC455F]'}`} style={{ width: `${Math.min(utilization, 100)}%` }} />
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-white/10">
                    <button onClick={() => handleEditBudget(budget)} className="p-1 hover:bg-blue-500/20 rounded transition-colors text-blue-400"><Edit size={14} /></button>
                    <button onClick={() => handleDeleteBudget(budget.id)} className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400"><Trash2 size={14} /></button>
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
                <div key={budget.id} className={`bg-white/5 rounded-lg p-3 border transition-all cursor-pointer hover:border-[#F05984]/50 ${isExceeded ? 'border-red-500/30' : isWarning ? 'border-yellow-500/30' : 'border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(budget.category)} bg-opacity-20`}>{getCategoryIcon(budget.category)}</div>
                    <div className="flex-1"><div className="flex items-center gap-2"><h3 className="text-white font-medium">{budget.name}</h3>{getStatusBadge(budget.status)}</div><p className="text-white/40 text-xs">{budget.category}</p></div>
                    <div className="flex items-center gap-6">
                      <div className="text-right"><p className="text-white/60 text-xs">Presupuesto</p><p className="text-white text-sm font-bold">{formatCurrency(budget.amount)}</p></div>
                      <div className="text-right"><p className="text-white/60 text-xs">Gastado</p><p className={isExceeded ? 'text-red-400 text-sm font-bold' : 'text-white text-sm'}>{formatCurrency(budget.spent)}</p></div>
                      <div className="text-right"><p className="text-white/60 text-xs">Restante</p><p className={isExceeded ? 'text-red-400 text-sm' : 'text-green-400 text-sm'}>{formatCurrency(budget.amount - budget.spent)}</p></div>
                      <div className="w-32"><div className="flex items-center justify-between text-xs mb-1"><span className="text-white/60">{utilization.toFixed(0)}%</span></div><div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className={`h-full rounded-full ${isExceeded ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-gradient-to-r from-[#F05984] to-[#BC455F]'}`} style={{ width: `${Math.min(utilization, 100)}%` }} /></div></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEditBudget(budget)} className="p-1 hover:bg-blue-500/20 rounded transition-colors text-blue-400"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteBudget(budget.id)} className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredBudgets.length)} de {filteredBudgets.length} presupuestos</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50"><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = totalPages <= 5 ? i + 1 : (currentPage <= 3 ? i + 1 : (currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i));
              return <button key={i} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${currentPage === pageNum ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>{pageNum}</button>;
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Modal para crear nuevo presupuesto */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="p-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-lg"><Wallet size={20} className="text-white" /></div><div><h2 className="text-xl font-bold text-white">Nuevo Presupuesto</h2><p className="text-white/40 text-sm">Define un nuevo límite de gasto por categoría</p></div></div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={20} className="text-white/60" /></button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateBudget(); }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-white/60 text-sm mb-1.5 block">Nombre del presupuesto *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" placeholder="Ej: Presupuesto Alimentación" required /></div>
                  <div><label className="text-white/60 text-sm mb-1.5 block">Categoría *</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }} required>
                    <option value="" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Seleccionar categoría</option>
                    <option value="Alimentación" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Alimentación</option><option value="Vivienda" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Vivienda</option><option value="Transporte" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Transporte</option><option value="Entretenimiento" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Entretenimiento</option><option value="Salud" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Salud</option><option value="Compras" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Compras</option><option value="Servicios" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Servicios</option><option value="Educación" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Educación</option><option value="Ahorro" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Ahorro</option><option value="Inversiones" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Inversiones</option>
                  </select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-white/60 text-sm mb-1.5 block">Monto del presupuesto *</label><div className="relative"><DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" placeholder="0.00" required /></div></div>
                  <div><label className="text-white/60 text-sm mb-1.5 block">Período</label><select value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                    <option value="monthly">Mensual</option><option value="quarterly">Trimestral</option><option value="yearly">Anual</option>
                  </select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-white/60 text-sm mb-1.5 block">Umbral de alerta (%)</label><div className="relative"><Percent size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="number" value={formData.alertThreshold} onChange={(e) => setFormData({...formData, alertThreshold: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" /></div></div>
                </div>
                <div className="flex items-center gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={formData.notifications} onChange={(e) => setFormData({...formData, notifications: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" /><span className="text-white text-sm">Recibir notificaciones</span></label><label className="flex items-center gap-2"><input type="checkbox" checked={formData.rollover} onChange={(e) => setFormData({...formData, rollover: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" /><span className="text-white text-sm">Permitir rollover</span></label></div>
                <div><label className="text-white/60 text-sm mb-1.5 block">Notas adicionales</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" placeholder="Notas adicionales..." /></div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors font-medium">Cancelar</button>
                  <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"><Save size={18} /><span>Guardar Presupuesto</span></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar presupuesto */}
      {showEditModal && selectedBudget && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="p-2 bg-blue-500/20 rounded-lg"><Edit size={20} className="text-blue-400" /></div><div><h2 className="text-xl font-bold text-white">Editar Presupuesto</h2><p className="text-white/40 text-sm">Modifica los datos del presupuesto</p></div></div>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={20} className="text-white/60" /></button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateBudget(); }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-white/60 text-sm mb-1.5 block">Nombre del presupuesto *</label><input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" required /></div>
                  <div><label className="text-white/60 text-sm mb-1.5 block">Categoría *</label><select value={editFormData.category} onChange={(e) => setEditFormData({...editFormData, category: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                    <option value="Alimentación">Alimentación</option><option value="Vivienda">Vivienda</option><option value="Transporte">Transporte</option><option value="Entretenimiento">Entretenimiento</option><option value="Salud">Salud</option><option value="Compras">Compras</option><option value="Servicios">Servicios</option><option value="Educación">Educación</option><option value="Ahorro">Ahorro</option><option value="Inversiones">Inversiones</option>
                  </select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-white/60 text-sm mb-1.5 block">Monto del presupuesto *</label><div className="relative"><DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="number" step="0.01" value={editFormData.amount} onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" required /></div></div>
                  <div><label className="text-white/60 text-sm mb-1.5 block">Umbral de alerta (%)</label><div className="relative"><Percent size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="number" value={editFormData.alertThreshold} onChange={(e) => setEditFormData({...editFormData, alertThreshold: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" /></div></div>
                </div>
                <div className="flex items-center gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={editFormData.notifications} onChange={(e) => setEditFormData({...editFormData, notifications: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" /><span className="text-white text-sm">Recibir notificaciones</span></label><label className="flex items-center gap-2"><input type="checkbox" checked={editFormData.rollover} onChange={(e) => setEditFormData({...editFormData, rollover: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" /><span className="text-white text-sm">Permitir rollover</span></label></div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors font-medium">Cancelar</button>
                  <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"><Save size={18} /><span>Guardar Cambios</span></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
