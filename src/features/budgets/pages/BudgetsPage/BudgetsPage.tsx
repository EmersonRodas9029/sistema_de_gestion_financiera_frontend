import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
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
  Calendar as CalendarIcon,
  Percent,
  TrendingUp as TrendingUpIcon,
  XCircle,
  Tag,
  PieChart
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';

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
  chartColor: string;
}

// Colores para el gráfico de pastel
const CHART_COLORS = ['#F05984', '#BC455F', '#6E4068', '#321D28', '#2DD4BF', '#F59E0B', '#10B981', '#6366F1'];

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const BudgetsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

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

  // Calcular categorías para el gráfico
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
      'Alimentación': 'from-amber-500 to-amber-600',
      'Vivienda': 'from-blue-500 to-blue-600',
      'Transporte': 'from-emerald-500 to-emerald-600',
      'Entretenimiento': 'from-purple-500 to-purple-600',
      'Salud': 'from-rose-500 to-rose-600',
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

  // Datos para el gráfico de dona
  const pieChartData = Array.from(categoryMap.entries()).map(([name, data], idx) => ({
    name,
    value: data.budgeted,
    spent: data.spent,
    color: CHART_COLORS[idx % CHART_COLORS.length]
  }));

  const categoryBudgets: CategoryBudget[] = Array.from(categoryMap.entries()).map(([name, data], idx) => {
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
      status,
      chartColor: CHART_COLORS[idx % CHART_COLORS.length]
    };
  }).sort((a, b) => b.budgeted - a.budgeted);

  // Top 3 categorías
  const topThreeCategories = categoryBudgets.slice(0, 3);

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
      period: formData.period as Budget['period'],
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

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPeriod('todos');
    setSelectedStatus('todos');
    setCurrentPage(1);
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

  const hasActiveFilters = searchTerm !== '' || selectedPeriod !== 'todos' || selectedStatus !== 'todos';

  // Skeleton Loader
  if (isLoading) {
    return (
      <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between">
            <div className="h-8 w-48 bg-white/10 rounded-lg" />
            <div className="h-10 w-32 bg-white/10 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white/10 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-white/10 rounded-xl" />
            <div className="h-80 bg-white/10 rounded-xl" />
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
              <Wallet size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Presupuestos</h1>
              <p className="text-white/50 text-sm mt-1">Controla tus límites de gasto por categoría</p>
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
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all duration-300 ${
                viewMode === 'grid' ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white backdrop-blur-sm'
              }`}
            >
              <BarChart3 size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all duration-300 ${
                viewMode === 'list' ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white backdrop-blur-sm'
              }`}
            >
              <Wallet size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300"
            >
              <Plus size={20} />
              <span className="hidden sm:inline font-medium">Nuevo Presupuesto</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetData}
              className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-xl transition-all duration-300 text-yellow-400 hover:text-yellow-300 backdrop-blur-sm"
              title="Restaurar datos por defecto"
            >
              <RefreshCw size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards Mejoradas */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Presupuesto Total</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{formatCurrency(totalBudget)}</p>
              <p className="text-white/30 text-xs mt-1">Gastado: {formatCurrency(totalSpent)}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <Wallet size={24} className="text-[#F05984]" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Restante</p>
              <p className="text-2xl font-bold text-green-400 mt-1 tracking-tight">{formatCurrency(remainingBudget)}</p>
              <p className="text-white/30 text-xs mt-1">Utilización: {utilization.toFixed(0)}%</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <Target size={24} className="text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#1e1b2e] to-[#2d2a3d] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Presupuestos Activos</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1 tracking-tight">{activeBudgets}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-red-400 text-xs">{exceededBudgets} excedidos</span>
                <span className="text-blue-400 text-xs">{completedBudgets} completados</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Activity size={24} className="text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#1a2e2a] to-[#2d403a] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Ahorro Proyectado</p>
              <p className="text-2xl font-bold text-blue-400 mt-1 tracking-tight">{formatCurrency(projectedSavings)}</p>
              <p className="text-white/30 text-xs mt-1">Basado en restante</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <TrendingUp size={24} className="text-blue-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Progreso General</h3>
          <span className="text-white/60 text-sm">{utilization.toFixed(0)}% utilizado</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${utilization}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full"
          />
        </div>
      </motion.div>

      {/* Distribución por Categoría - Gráfico de Dona y Top 3 */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Dona */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={20} className="text-[#F05984]" />
            <h3 className="text-white font-semibold">Distribución por Categoría</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <ReTooltip
                  contentStyle={{ backgroundColor: '#1a0f14', border: '1px solid #F05984', borderRadius: '8px' }}
                  formatter={(value: number) => [formatCurrency(value), 'Presupuesto']}
                  labelStyle={{ color: 'white' }}
                />
                <Legend 
                  formatter={(value) => <span className="text-white/70 text-xs">{value}</span>}
                  wrapperStyle={{ paddingTop: '20px' }}
                  verticalAlign="bottom"
                  height={36}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 3 Categorías */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#F05984]" />
            Top 3 Categorías
          </h3>
          <div className="space-y-4">
            {topThreeCategories.map((cat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>
                      {cat.icon}
                    </div>
                    <span className="text-white text-sm font-medium">{cat.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      cat.status === 'good' ? 'bg-green-500/20 text-green-400' : 
                      cat.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {cat.status === 'good' ? 'Bien' : cat.status === 'warning' ? 'Cuidado' : 'Excedido'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/50 text-xs">{cat.percentage.toFixed(1)}%</span>
                    <span className="text-white text-sm font-semibold">{formatCurrency(cat.budgeted)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/60">Gastado: {formatCurrency(cat.spent)}</span>
                  <span className={cat.remaining >= 0 ? 'text-green-400' : 'text-red-400'}>
                    Restante: {formatCurrency(cat.remaining)}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full rounded-full ${
                      cat.percentage >= 100 ? 'bg-red-500' : 
                      cat.percentage >= 80 ? 'bg-yellow-500' : 
                      `bg-gradient-to-r ${cat.color}`
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Filters and Search con panel colapsable */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Filter size={20} />
              </motion.button>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 text-sm"
                >
                  <XCircle size={16} />
                  <span>Limpiar filtros</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Panel de filtros colapsable */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Período</label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos</option>
                      <option value="monthly" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Mensual</option>
                      <option value="quarterly" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Trimestral</option>
                      <option value="yearly" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Anual</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Estado</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos</option>
                      <option value="active" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Activos</option>
                      <option value="completed" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Completados</option>
                      <option value="exceeded" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Excedidos</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Bar */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">Ordenar por:</span>
            <button
              onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'name' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <span>Nombre</span>
              {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            <button
              onClick={() => { setSortBy('amount'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'amount' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <DollarSign size={14} />
              <span>Presupuesto</span>
              {sortBy === 'amount' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            <button
              onClick={() => { setSortBy('spent'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'spent' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <Activity size={14} />
              <span>Gastado</span>
              {sortBy === 'spent' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            <button
              onClick={() => { setSortBy('utilization'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'utilization' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <Percent size={14} />
              <span>Utilización</span>
              {sortBy === 'utilization' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
          </div>
          <span className="text-white/40 text-sm">{filteredBudgets.length} resultados</span>
        </div>

        {/* Estado Vacío */}
        {filteredBudgets.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-4"
          >
            <div className="p-4 bg-white/10 rounded-full mb-4">
              <Wallet size={48} className="text-white/30" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No hay presupuestos</h3>
            <p className="text-white/40 text-sm text-center max-w-md">
              No se encontraron presupuestos con los filtros actuales.
              Prueba a ajustar los filtros o crea un nuevo presupuesto.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              <span>Crear nuevo presupuesto</span>
            </motion.button>
          </motion.div>
        )}

        {/* Grid View Mejorado */}
        {filteredBudgets.length > 0 && viewMode === 'grid' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {paginatedBudgets.map((budget, index) => {
                const utilizationPercent = (budget.spent / budget.amount) * 100;
                const isExceeded = utilizationPercent >= 100;
                const isWarning = utilizationPercent >= 80 && utilizationPercent < 100;
                return (
                  <motion.div
                    key={budget.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border transition-all duration-300 cursor-pointer hover:shadow-xl ${
                      isExceeded ? 'border-red-500/50 shadow-red-500/20' : 
                      isWarning ? 'border-yellow-500/50 shadow-yellow-500/20' : 
                      'border-white/10 hover:border-[#F05984]/50'
                    }`}
                  >
                    {isExceeded && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full blur-2xl" />
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-gradient-to-r ${getCategoryColor(budget.category)} bg-opacity-20 shadow-lg`}>
                          {getCategoryIcon(budget.category)}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{budget.name}</h3>
                          <p className="text-white/40 text-xs">{budget.category}</p>
                        </div>
                      </div>
                      {getStatusBadge(budget.status)}
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Presupuesto:</span>
                        <span className="text-white font-bold text-lg">{formatCurrency(budget.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Gastado:</span>
                        <span className={isExceeded ? 'text-red-400 font-bold' : 'text-white'}>{formatCurrency(budget.spent)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Restante:</span>
                        <span className={isExceeded ? 'text-red-400' : 'text-green-400'}>{formatCurrency(budget.amount - budget.spent)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Utilización:</span>
                        <span className={isExceeded ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-white'}>{utilizationPercent.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${
                          isExceeded ? 'bg-red-500' : 
                          isWarning ? 'bg-yellow-500' : 
                          'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditBudget(budget)}
                        className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400"
                      >
                        <Edit size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* List View Mejorado */}
        {filteredBudgets.length > 0 && viewMode === 'list' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 space-y-2"
          >
            <AnimatePresence>
              {paginatedBudgets.map((budget, index) => {
                const utilizationPercent = (budget.spent / budget.amount) * 100;
                const isExceeded = utilizationPercent >= 100;
                const isWarning = utilizationPercent >= 80 && utilizationPercent < 100;
                return (
                  <motion.div
                    key={budget.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.01 }}
                    className={`bg-gradient-to-r from-white/5 to-white/0 rounded-lg p-3 border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                      isExceeded ? 'border-red-500/30' : 
                      isWarning ? 'border-yellow-500/30' : 
                      'border-white/10 hover:border-[#F05984]/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(budget.category)} bg-opacity-20`}>
                        {getCategoryIcon(budget.category)}
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
                          <p className="text-white/50 text-xs">Presupuesto</p>
                          <p className="text-white text-sm font-bold">{formatCurrency(budget.amount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-xs">Gastado</p>
                          <p className={isExceeded ? 'text-red-400 text-sm font-bold' : 'text-white text-sm'}>{formatCurrency(budget.spent)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-xs">Restante</p>
                          <p className={isExceeded ? 'text-red-400 text-sm' : 'text-green-400 text-sm'}>{formatCurrency(budget.amount - budget.spent)}</p>
                        </div>
                        <div className="w-32">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/60">{utilizationPercent.toFixed(0)}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                              transition={{ duration: 0.6 }}
                              className={`h-full rounded-full ${
                                isExceeded ? 'bg-red-500' : 
                                isWarning ? 'bg-yellow-500' : 
                                'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditBudget(budget)}
                          className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteBudget(budget.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {filteredBudgets.length > 0 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-white/40 text-sm">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredBudgets.length)} de {filteredBudgets.length} presupuestos
            </p>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </motion.button>
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
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                      currentPage === pageNum
                        ? 'bg-[#F05984] text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal para crear nuevo presupuesto - Mejorado con animación */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-lg shadow-lg">
                    <Wallet size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Nuevo Presupuesto</h2>
                    <p className="text-white/40 text-sm">Define un nuevo límite de gasto por categoría</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>
              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleCreateBudget(); }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Nombre del presupuesto *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Ej: Presupuesto Alimentación" required />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Categoría *</label>
                      <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }} required>
                        <option value="" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Seleccionar categoría</option>
                        <option value="Alimentación" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Alimentación</option>
                        <option value="Vivienda" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Vivienda</option>
                        <option value="Transporte" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Transporte</option>
                        <option value="Entretenimiento" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Entretenimiento</option>
                        <option value="Salud" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Salud</option>
                        <option value="Compras" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Compras</option>
                        <option value="Servicios" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Servicios</option>
                        <option value="Educación" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Educación</option>
                        <option value="Ahorro" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Ahorro</option>
                        <option value="Inversiones" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Inversiones</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Monto del presupuesto *</label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="0.00" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Período</label>
                      <select value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="monthly">Mensual</option>
                        <option value="quarterly">Trimestral</option>
                        <option value="yearly">Anual</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Umbral de alerta (%)</label>
                    <div className="relative">
                      <Percent size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                      <input type="number" value={formData.alertThreshold} onChange={(e) => setFormData({...formData, alertThreshold: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.notifications} onChange={(e) => setFormData({...formData, notifications: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                      <span className="text-white text-sm">Recibir notificaciones</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.rollover} onChange={(e) => setFormData({...formData, rollover: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                      <span className="text-white text-sm">Permitir rollover</span>
                    </label>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Notas adicionales</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Notas adicionales..." />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
                    >
                      <Save size={18} />
                      <span>Guardar Presupuesto</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para editar presupuesto - Mejorado con animación */}
      <AnimatePresence>
        {showEditModal && selectedBudget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Edit size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Editar Presupuesto</h2>
                    <p className="text-white/40 text-sm">Modifica los datos del presupuesto</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>
              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleUpdateBudget(); }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Nombre del presupuesto *</label>
                      <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Categoría *</label>
                      <select value={editFormData.category} onChange={(e) => setEditFormData({...editFormData, category: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="Alimentación">Alimentación</option>
                        <option value="Vivienda">Vivienda</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Entretenimiento">Entretenimiento</option>
                        <option value="Salud">Salud</option>
                        <option value="Compras">Compras</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Educación">Educación</option>
                        <option value="Ahorro">Ahorro</option>
                        <option value="Inversiones">Inversiones</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Monto del presupuesto *</label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input type="number" step="0.01" value={editFormData.amount} onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Umbral de alerta (%)</label>
                      <div className="relative">
                        <Percent size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input type="number" value={editFormData.alertThreshold} onChange={(e) => setEditFormData({...editFormData, alertThreshold: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={editFormData.notifications} onChange={(e) => setEditFormData({...editFormData, notifications: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                      <span className="text-white text-sm">Recibir notificaciones</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={editFormData.rollover} onChange={(e) => setEditFormData({...editFormData, rollover: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                      <span className="text-white text-sm">Permitir rollover</span>
                    </label>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
                    >
                      <Save size={18} />
                      <span>Guardar Cambios</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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