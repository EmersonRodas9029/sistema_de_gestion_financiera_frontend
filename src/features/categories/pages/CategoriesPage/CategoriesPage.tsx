import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderTree,
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Tag,
  TrendingDown,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Filter,
  Home as HomeIcon,
  Utensils,
  Car,
  Heart,
  ShoppingBag,
  Film,
  Zap,
  Wifi,
  Droplet,
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
  Save,
  X,
  Shield,
  DollarSign,
  CreditCard,
  Wallet,
  Users,
  Home,
  Activity,
  XCircle,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
  Percent,
  PieChart as PieChartIcon,
  Target
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  description?: string;
  parentId?: string;
  subcategories?: Category[];
  budget?: number;
  spent?: number;
  transactions: number;
  totalAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Colores para el gráfico de pastel
const CHART_COLORS = ['#F05984', '#BC455F', '#6E4068', '#321D28', '#2DD4BF', '#F59E0B', '#10B981', '#6366F1'];

// Función para generar ID único
const generateUniqueId = () => {
  return `CAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Mapa de iconos disponibles
const iconMap: { [key: string]: React.ReactNode } = {
  home: <HomeIcon size={20} />,
  utensils: <Utensils size={20} />,
  car: <Car size={20} />,
  heart: <Heart size={20} />,
  shopping: <ShoppingBag size={20} />,
  film: <Film size={20} />,
  zap: <Zap size={20} />,
  wifi: <Wifi size={20} />,
  droplet: <Droplet size={20} />,
  briefcase: <Briefcase size={20} />,
  gift: <Gift size={20} />,
  award: <Award size={20} />,
  smartphone: <Smartphone size={20} />,
  laptop: <Laptop size={20} />,
  plane: <Plane size={20} />,
  hotel: <Hotel size={20} />,
  shirt: <Shirt size={20} />,
  dumbbell: <Dumbbell size={20} />,
  book: <BookOpen size={20} />,
  coffee: <Coffee size={20} />,
  dog: <Dog size={20} />,
  sparkles: <Sparkles size={20} />,
  shield: <Shield size={20} />,
  dollar: <DollarSign size={20} />,
  credit: <CreditCard size={20} />,
  wallet: <Wallet size={20} />,
  users: <Users size={20} />,
  home2: <Home size={20} />
};

// Datos iniciales por defecto
const getDefaultCategories = (): Category[] => [
  {
    id: generateUniqueId(),
    name: 'Alimentación',
    type: 'expense',
    icon: 'utensils',
    color: 'from-amber-500 to-amber-600',
    description: 'Supermercado, restaurantes, comida rápida',
    budget: 600,
    spent: 350.75,
    transactions: 24,
    totalAmount: 4250.50,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
    name: 'Vivienda',
    type: 'expense',
    icon: 'home',
    color: 'from-blue-500 to-blue-600',
    description: 'Alquiler, hipoteca, mantenimiento del hogar',
    budget: 1200,
    spent: 1200.00,
    transactions: 12,
    totalAmount: 14400.00,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
    name: 'Servicios',
    type: 'expense',
    icon: 'zap',
    color: 'from-cyan-500 to-cyan-600',
    description: 'Electricidad, agua, gas, internet, teléfono',
    budget: 300,
    spent: 196.79,
    transactions: 18,
    totalAmount: 2361.48,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
    name: 'Transporte',
    type: 'expense',
    icon: 'car',
    color: 'from-emerald-500 to-emerald-600',
    description: 'Combustible, mantenimiento, taxis, transporte público',
    budget: 200,
    spent: 65.00,
    transactions: 8,
    totalAmount: 1560.00,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
    name: 'Salud',
    type: 'expense',
    icon: 'heart',
    color: 'from-rose-500 to-rose-600',
    description: 'Seguros médicos, farmacia, consultas médicas',
    budget: 200,
    spent: 45.00,
    transactions: 4,
    totalAmount: 890.00,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
    name: 'Entretenimiento',
    type: 'expense',
    icon: 'film',
    color: 'from-violet-500 to-violet-600',
    description: 'Cine, conciertos, entretenimiento, hobbies',
    budget: 150,
    spent: 45.80,
    transactions: 6,
    totalAmount: 875.40,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
    name: 'Compras',
    type: 'expense',
    icon: 'shopping',
    color: 'from-pink-500 to-pink-600',
    description: 'Ropa, electrónicos, hogar',
    budget: 300,
    spent: 120.50,
    transactions: 7,
    totalAmount: 2140.00,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
    name: 'Educación',
    type: 'expense',
    icon: 'book',
    color: 'from-indigo-500 to-indigo-600',
    description: 'Cursos, libros, formación',
    budget: 200,
    spent: 0,
    transactions: 3,
    totalAmount: 650.00,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  // Categorías de Ingresos
  {
    id: generateUniqueId(),
    name: 'Salario',
    type: 'income',
    icon: 'briefcase',
    color: 'from-emerald-500 to-emerald-600',
    description: 'Ingresos por salario y nóminas',
    budget: 3000,
    spent: 3000,
    transactions: 12,
    totalAmount: 32500,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
    name: 'Servicios profesionales',
    type: 'income',
    icon: 'laptop',
    color: 'from-blue-500 to-blue-600',
    description: 'Consultoría, freelance, servicios',
    budget: 2000,
    spent: 1850,
    transactions: 8,
    totalAmount: 18450,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
    name: 'Ventas',
    type: 'income',
    icon: 'shopping',
    color: 'from-purple-500 to-purple-600',
    description: 'Ventas de productos',
    budget: 1500,
    spent: 1250,
    transactions: 15,
    totalAmount: 12500,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
    name: 'Ingresos pasivos',
    type: 'income',
    icon: 'gift',
    color: 'from-orange-500 to-orange-600',
    description: 'Dividendos, alquileres, intereses',
    budget: 1000,
    spent: 850,
    transactions: 6,
    totalAmount: 8500,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
    name: 'Inversiones',
    type: 'income',
    icon: 'trending-up',
    color: 'from-cyan-500 to-cyan-600',
    description: 'Ganancias de inversiones',
    budget: 1000,
    spent: 0,
    transactions: 2,
    totalAmount: 3500,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
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

export const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    budget: '',
    isActive: true
  });
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    icon: 'utensils',
    color: 'from-amber-500 to-amber-600',
    description: '',
    budget: '',
    isActive: true
  });
  const [showInactive, setShowInactive] = useState(false);
  const [showWithBudget, setShowWithBudget] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('todas');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'transactions' | 'amount'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 6;

  // Cargar datos desde localStorage o usar datos por defecto
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return getDefaultCategories();
    } catch (error) {
      console.error('Error loading categories:', error);
      return getDefaultCategories();
    }
  });

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Guardar en localStorage cuando cambien las categorías
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Categorías de Gastos
  const expenseCategories = categories.filter(c => c.type === 'expense');
  // Categorías de Ingresos
  const incomeCategories = categories.filter(c => c.type === 'income');

  // Calcular estadísticas
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.isActive).length;
  const categoriesWithBudget = categories.filter(c => c.budget && c.budget > 0).length;
  const mostUsedCategory = categories.reduce((max, cat) => cat.transactions > max.transactions ? cat : max, categories[0]);

  // Datos para el gráfico de pastel
  const expensePieData = expenseCategories.map((cat, idx) => ({
    name: cat.name,
    value: cat.totalAmount,
    color: CHART_COLORS[idx % CHART_COLORS.length],
    transactions: cat.transactions
  }));

  // Top 3 categorías más utilizadas
  const topCategories = [...expenseCategories]
    .sort((a, b) => b.transactions - a.transactions)
    .slice(0, 3);

  // Filtrar categorías de gastos
  const filteredExpenseCategories = expenseCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = showInactive ? true : category.isActive;
    const matchesBudget = showWithBudget ? (category.budget || 0) > 0 : true;
    const matchesType = selectedTypeFilter === 'todas' || category.type === selectedTypeFilter;
    return matchesSearch && matchesActive && matchesBudget && matchesType;
  });

  // Filtrar categorías de ingresos
  const filteredIncomeCategories = incomeCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = showInactive ? true : category.isActive;
    const matchesBudget = showWithBudget ? (category.budget || 0) > 0 : true;
    const matchesType = selectedTypeFilter === 'todas' || category.type === selectedTypeFilter;
    return matchesSearch && matchesActive && matchesBudget && matchesType;
  });

  // Ordenar categorías
  const sortedExpenseCategories = [...filteredExpenseCategories].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'transactions') {
      return sortOrder === 'asc' ? a.transactions - b.transactions : b.transactions - a.transactions;
    } else {
      return sortOrder === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
    }
  });

  const sortedIncomeCategories = [...filteredIncomeCategories].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'transactions') {
      return sortOrder === 'asc' ? a.transactions - b.transactions : b.transactions - a.transactions;
    } else {
      return sortOrder === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
    }
  });

  const totalExpensePages = Math.ceil(sortedExpenseCategories.length / itemsPerPage);
  const totalIncomePages = Math.ceil(sortedIncomeCategories.length / itemsPerPage);
  const paginatedExpenseCategories = sortedExpenseCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedIncomeCategories = sortedIncomeCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleCreateCategory = () => {
    const newCategory: Category = {
      id: generateUniqueId(),
      name: formData.name,
      type: formData.type as any,
      icon: formData.icon,
      color: formData.color,
      description: formData.description || undefined,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      spent: 0,
      transactions: 0,
      totalAmount: 0,
      isActive: formData.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCategories(prev => [newCategory, ...prev]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      type: 'expense',
      icon: 'utensils',
      color: 'from-amber-500 to-amber-600',
      description: '',
      budget: '',
      isActive: true
    });
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditFormData({
      name: category.name,
      description: category.description || '',
      budget: category.budget?.toString() || '',
      isActive: category.isActive
    });
    setShowEditModal(true);
  };

  const handleUpdateCategory = () => {
    if (selectedCategory) {
      const updatedCategories = categories.map(c => 
        c.id === selectedCategory.id ? {
          ...c,
          name: editFormData.name,
          description: editFormData.description || undefined,
          budget: editFormData.budget ? parseFloat(editFormData.budget) : undefined,
          isActive: editFormData.isActive,
          updatedAt: new Date().toISOString()
        } : c
      );
      setCategories(updatedCategories);
      setShowEditModal(false);
      setSelectedCategory(null);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const resetData = () => {
    if (window.confirm('¿Esto restaurará los datos a los valores por defecto. ¿Continuar?')) {
      localStorage.removeItem('categories');
      setCategories(getDefaultCategories());
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setShowInactive(false);
    setShowWithBudget(false);
    setSelectedTypeFilter('todas');
    setCurrentPage(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTypeBadge = (type: string) => {
    if (type === 'income') {
      return <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><TrendingUp size={12} /> Ingreso</span>;
    } else {
      return <span className="bg-rose-500/20 text-rose-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><TrendingDown size={12} /> Gasto</span>;
    }
  };

  const getBudgetStatusColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-gradient-to-r from-[#F05984] to-[#BC455F]';
  };

  const hasActiveFilters = searchTerm !== '' || showInactive || showWithBudget || selectedTypeFilter !== 'todas';

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
              <FolderTree size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Categorías</h1>
              <p className="text-white/50 text-sm mt-1">Organiza y gestiona tus categorías de ingresos y gastos</p>
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
              <FolderTree size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300"
            >
              <Plus size={20} />
              <span className="hidden sm:inline font-medium">Nueva Categoría</span>
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
              <p className="text-white/50 text-sm font-medium">Total Categorías</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{totalCategories}</p>
              <p className="text-white/30 text-xs mt-1">{activeCategories} activas</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <FolderTree size={24} className="text-[#F05984]" />
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
              <p className="text-white/50 text-sm font-medium">Con Presupuesto</p>
              <p className="text-2xl font-bold text-green-400 mt-1 tracking-tight">{categoriesWithBudget}</p>
              <p className="text-white/30 text-xs mt-1">categorías con límite</p>
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
              <p className="text-white/50 text-sm font-medium">Más Usada</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1 tracking-tight truncate max-w-[150px]">{mostUsedCategory?.name || 'N/A'}</p>
              <p className="text-white/30 text-xs mt-1">{mostUsedCategory?.transactions || 0} transacciones</p>
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
              <p className="text-white/50 text-sm font-medium">Total Gastos</p>
              <p className="text-2xl font-bold text-rose-400 mt-1 tracking-tight">{formatCurrency(expenseCategories.reduce((sum, c) => sum + c.totalAmount, 0))}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/20">
              <TrendingDown size={24} className="text-rose-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Gráficos de Distribución y Top 3 Categorías */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Dona - Distribución de Gastos */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={20} className="text-[#F05984]" />
            <h3 className="text-white font-semibold">Distribución de Gastos</h3>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={expensePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {expensePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <ReTooltip
                  contentStyle={{ backgroundColor: '#1a0f14', border: '1px solid #F05984', borderRadius: '8px' }}
                  formatter={(value: number) => [formatCurrency(value), 'Gastado']}
                  labelStyle={{ color: 'white' }}
                />
                <Legend 
                  formatter={(value) => <span className="text-white/70 text-xs">{value}</span>}
                  wrapperStyle={{ paddingTop: '20px' }}
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 3 Categorías más utilizadas */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#F05984]" />
            Top 3 Categorías más utilizadas
          </h3>
          <div className="space-y-4">
            {topCategories.map((cat, index) => {
              const usagePercentage = (cat.transactions / expenseCategories.reduce((sum, c) => sum + c.transactions, 0)) * 100;
              return (
                <motion.div 
                  key={cat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>
                        {iconMap[cat.icon] || <Tag size={16} />}
                      </div>
                      <span className="text-white text-sm font-medium">{cat.name}</span>
                      <span className="text-xs bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full">
                        Gasto
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/50 text-xs">{usagePercentage.toFixed(1)}%</span>
                      <span className="text-white text-sm font-semibold">{cat.transactions} transacciones</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                    />
                  </div>
                  <p className="text-white/30 text-[10px] mt-1">Total: {formatCurrency(cat.totalAmount)}</p>
                </motion.div>
              );
            })}
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
                placeholder="Buscar categorías..."
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Tipo</label>
                    <select
                      value={selectedTypeFilter}
                      onChange={(e) => setSelectedTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todas" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todas</option>
                      <option value="expense" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Gastos</option>
                      <option value="income" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Ingresos</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Estado</label>
                    <label className="flex items-center gap-2 mt-2">
                      <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                      <span className="text-white/60 text-sm">Mostrar inactivas</span>
                    </label>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Filtros adicionales</label>
                    <label className="flex items-center gap-2 mt-2">
                      <input type="checkbox" checked={showWithBudget} onChange={(e) => setShowWithBudget(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                      <span className="text-white/60 text-sm">Solo con presupuesto</span>
                    </label>
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
              onClick={() => { setSortBy('transactions'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'transactions' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <Activity size={14} />
              <span>Transacciones</span>
              {sortBy === 'transactions' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            <button
              onClick={() => { setSortBy('amount'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'amount' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <DollarSign size={14} />
              <span>Monto</span>
              {sortBy === 'amount' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
          </div>
          <span className="text-white/40 text-sm">{filteredExpenseCategories.length + filteredIncomeCategories.length} resultados</span>
        </div>

        {/* Estado Vacío */}
        {filteredExpenseCategories.length === 0 && filteredIncomeCategories.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-4"
          >
            <div className="p-4 bg-white/10 rounded-full mb-4">
              <FolderTree size={48} className="text-white/30" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No hay categorías</h3>
            <p className="text-white/40 text-sm text-center max-w-md">
              No se encontraron categorías con los filtros actuales.
              Prueba a ajustar los filtros o crea una nueva categoría.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              <span>Crear nueva categoría</span>
            </motion.button>
          </motion.div>
        )}

        {/* Sección de Gastos */}
        {(filteredExpenseCategories.length > 0 || filteredIncomeCategories.length > 0) && (
          <>
            <div className="p-4">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                  <TrendingDown size={20} className="text-rose-400" />
                  <h2 className="text-lg font-semibold text-white">Categorías de Gastos</h2>
                  <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-0.5 rounded-full">{filteredExpenseCategories.length}</span>
                </div>
                {filteredExpenseCategories.length === 0 ? (
                  <div className="text-center py-8 text-white/40">No hay categorías de gastos que coincidan con los filtros</div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {paginatedExpenseCategories.map((category, index) => {
                        const budgetPercentage = category.budget ? ((category.spent || 0) / category.budget) * 100 : 0;
                        const isOverBudget = budgetPercentage >= 90;
                        const isWarning = budgetPercentage >= 70 && budgetPercentage < 90;
                        return (
                          <motion.div
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border transition-all duration-300 cursor-pointer hover:shadow-xl ${
                              category.isActive ? 'border-white/10 hover:border-[#F05984]/50' : 'border-rose-500/20 opacity-60 hover:opacity-100'
                            }`}
                          >
                            {!category.isActive && (
                              <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full blur-2xl" />
                            )}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl bg-gradient-to-r ${category.color} bg-opacity-20 shadow-lg`}>
                                  {iconMap[category.icon] || <Tag size={20} className="text-white" />}
                                </div>
                                <div>
                                  <h3 className="text-white font-semibold">{category.name}</h3>
                                  <p className="text-white/40 text-xs">{category.id.slice(-8)}</p>
                                </div>
                              </div>
                              {getTypeBadge(category.type)}
                            </div>
                            {category.description && (
                              <p className="text-white/60 text-sm mb-3 line-clamp-2">{category.description}</p>
                            )}
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-white/50">Transacciones:</span>
                                <span className="text-white font-medium">{category.transactions}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-white/50">Total gastado:</span>
                                <span className="text-white font-semibold">{formatCurrency(category.totalAmount)}</span>
                              </div>
                              {category.budget && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/50">Presupuesto:</span>
                                    <span className={`font-semibold ${isOverBudget ? 'text-rose-400' : isWarning ? 'text-yellow-400' : 'text-white'}`}>
                                      {formatCurrency(category.budget)}
                                    </span>
                                  </div>
                                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                                      transition={{ duration: 0.8 }}
                                      className={`h-full rounded-full ${
                                        isOverBudget ? 'bg-rose-500' : 
                                        isWarning ? 'bg-yellow-500' : 
                                        'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                                      }`}
                                    />
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className={`${isOverBudget ? 'text-rose-400' : isWarning ? 'text-yellow-400' : 'text-white/40'}`}>
                                      {budgetPercentage.toFixed(0)}% utilizado
                                    </span>
                                    <span className={`${(category.budget - (category.spent || 0)) < 0 ? 'text-rose-400' : 'text-green-400'}`}>
                                      Restante: {formatCurrency((category.budget - (category.spent || 0)))}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            {!category.isActive && (
                              <div className="mt-2">
                                <span className="text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full">Inactiva</span>
                              </div>
                            )}
                            <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/10">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditCategory(category)}
                                className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400"
                                title="Editar categoría"
                              >
                                <Edit size={14} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteCategory(category.id)}
                                className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400"
                                title="Eliminar categoría"
                              >
                                <Trash2 size={14} />
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {paginatedExpenseCategories.map((category, index) => {
                        const budgetPercentage = category.budget ? ((category.spent || 0) / category.budget) * 100 : 0;
                        const isOverBudget = budgetPercentage >= 90;
                        const isWarning = budgetPercentage >= 70 && budgetPercentage < 90;
                        return (
                          <motion.div
                            key={category.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ scale: 1.01 }}
                            className={`bg-gradient-to-r from-white/5 to-white/0 rounded-lg p-3 border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                              category.isActive ? 'border-white/10 hover:border-[#F05984]/30' : 'border-rose-500/20 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} bg-opacity-20`}>
                                {iconMap[category.icon] || <Tag size={16} className="text-white" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-white font-medium">{category.name}</h3>
                                  {getTypeBadge(category.type)}
                                  {!category.isActive && <span className="text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full">Inactiva</span>}
                                </div>
                                {category.description && <p className="text-white/40 text-sm">{category.description}</p>}
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <p className="text-white/50 text-xs">Transacciones</p>
                                  <p className="text-white text-sm">{category.transactions}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-white/50 text-xs">Total</p>
                                  <p className="text-white text-sm font-medium">{formatCurrency(category.totalAmount)}</p>
                                </div>
                                {category.budget && (
                                  <div className="text-right">
                                    <p className="text-white/50 text-xs">Presupuesto</p>
                                    <p className={`text-sm font-semibold ${isOverBudget ? 'text-rose-400' : isWarning ? 'text-yellow-400' : 'text-white'}`}>
                                      {formatCurrency(category.budget)}
                                    </p>
                                  </div>
                                )}
                                {category.budget && (
                                  <div className="w-32">
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                                        transition={{ duration: 0.6 }}
                                        className={`h-full rounded-full ${
                                          isOverBudget ? 'bg-rose-500' : 
                                          isWarning ? 'bg-yellow-500' : 
                                          'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                                        }`}
                                      />
                                    </div>
                                    <p className="text-white/40 text-xs text-right mt-1">{budgetPercentage.toFixed(0)}%</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEditCategory(category)}
                                  className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400"
                                >
                                  <Edit size={16} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteCategory(category.id)}
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
                  </div>
                )}
              </div>

              {/* Sección de Ingresos */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                  <TrendingUp size={20} className="text-emerald-400" />
                  <h2 className="text-lg font-semibold text-white">Categorías de Ingresos</h2>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">{filteredIncomeCategories.length}</span>
                </div>
                {filteredIncomeCategories.length === 0 ? (
                  <div className="text-center py-8 text-white/40">No hay categorías de ingresos que coincidan con los filtros</div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {paginatedIncomeCategories.map((category, index) => (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border transition-all duration-300 cursor-pointer hover:shadow-xl ${
                            category.isActive ? 'border-white/10 hover:border-[#F05984]/50' : 'border-emerald-500/20 opacity-60 hover:opacity-100'
                          }`}
                        >
                          {!category.isActive && (
                            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-2xl" />
                          )}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl bg-gradient-to-r ${category.color} bg-opacity-20 shadow-lg`}>
                                {iconMap[category.icon] || <Tag size={20} className="text-white" />}
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">{category.name}</h3>
                                <p className="text-white/40 text-xs">{category.id.slice(-8)}</p>
                              </div>
                            </div>
                            {getTypeBadge(category.type)}
                          </div>
                          {category.description && (
                            <p className="text-white/60 text-sm mb-3 line-clamp-2">{category.description}</p>
                          )}
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white/50">Transacciones:</span>
                              <span className="text-white font-medium">{category.transactions}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white/50">Total ingresado:</span>
                              <span className="text-white font-semibold">{formatCurrency(category.totalAmount)}</span>
                            </div>
                          </div>
                          {!category.isActive && (
                            <div className="mt-2">
                              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Inactiva</span>
                            </div>
                          )}
                          <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/10">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditCategory(category)}
                              className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400"
                            >
                              <Edit size={14} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteCategory(category.id)}
                              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400"
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {paginatedIncomeCategories.map((category, index) => (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                          whileHover={{ scale: 1.01 }}
                          className={`bg-gradient-to-r from-white/5 to-white/0 rounded-lg p-3 border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                            category.isActive ? 'border-white/10 hover:border-[#F05984]/30' : 'border-emerald-500/20 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} bg-opacity-20`}>
                              {iconMap[category.icon] || <Tag size={16} className="text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-white font-medium">{category.name}</h3>
                                {getTypeBadge(category.type)}
                                {!category.isActive && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Inactiva</span>}
                              </div>
                              {category.description && <p className="text-white/40 text-sm">{category.description}</p>}
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-white/50 text-xs">Transacciones</p>
                                <p className="text-white text-sm">{category.transactions}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white/50 text-xs">Total</p>
                                <p className="text-white text-sm font-medium">{formatCurrency(category.totalAmount)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditCategory(category)}
                                className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400"
                              >
                                <Edit size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteCategory(category.id)}
                                className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between">
              <p className="text-white/40 text-sm">
                Mostrando página {currentPage} de {Math.max(totalExpensePages, totalIncomePages)}
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
                {Array.from({ length: Math.min(5, Math.max(totalExpensePages, totalIncomePages)) }, (_, i) => {
                  let pageNum;
                  const maxPages = Math.max(totalExpensePages, totalIncomePages);
                  if (maxPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= maxPages - 2) {
                    pageNum = maxPages - 4 + i;
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
                  onClick={() => setCurrentPage(p => Math.min(Math.max(totalExpensePages, totalIncomePages), p + 1))}
                  disabled={currentPage === Math.max(totalExpensePages, totalIncomePages)}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Modal para crear nueva categoría - Mejorado con animación */}
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
                    <FolderTree size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Nueva Categoría</h2>
                    <p className="text-white/40 text-sm">Define una nueva categoría para tus finanzas</p>
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
                <form onSubmit={(e) => { e.preventDefault(); handleCreateCategory(); }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Nombre *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Ej: Alimentación" required />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Tipo *</label>
                      <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="expense">Gasto</option>
                        <option value="income">Ingreso</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Icono</label>
                      <select value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="utensils">Alimentación</option>
                        <option value="home">Vivienda</option>
                        <option value="car">Transporte</option>
                        <option value="heart">Salud</option>
                        <option value="shopping">Compras</option>
                        <option value="film">Ocio</option>
                        <option value="briefcase">Trabajo</option>
                        <option value="plane">Viajes</option>
                        <option value="dumbbell">Gimnasio</option>
                        <option value="book">Educación</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Color</label>
                      <select value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="from-amber-500 to-amber-600">Amarillo</option>
                        <option value="from-blue-500 to-blue-600">Azul</option>
                        <option value="from-emerald-500 to-emerald-600">Verde</option>
                        <option value="from-rose-500 to-rose-600">Rojo</option>
                        <option value="from-violet-500 to-violet-600">Púrpura</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Descripción</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Descripción opcional..." />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Presupuesto mensual (solo para gastos)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                      <input type="number" step="0.01" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                    <label htmlFor="isActive" className="text-white/60 text-sm">Activa (visible en transacciones)</label>
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
                      <span>Guardar Categoría</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para editar categoría - Mejorado con animación */}
      <AnimatePresence>
        {showEditModal && selectedCategory && (
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
              className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Edit size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Editar Categoría</h2>
                    <p className="text-white/40 text-sm">Modifica los datos de la categoría</p>
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
                <form onSubmit={(e) => { e.preventDefault(); handleUpdateCategory(); }} className="space-y-4">
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Nombre</label>
                    <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Descripción</label>
                    <textarea value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} rows={2} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Presupuesto mensual</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                      <input type="number" step="0.01" value={editFormData.budget} onChange={(e) => setEditFormData({...editFormData, budget: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="editIsActive" checked={editFormData.isActive} onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                    <label htmlFor="editIsActive" className="text-white/60 text-sm">Activa</label>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
                    >
                      Guardar Cambios
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