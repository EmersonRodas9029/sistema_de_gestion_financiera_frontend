import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Download,
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
  ArrowDown,
  ArrowUp,
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
  Percent
} from 'lucide-react';

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
  // Categorías de Gastos
  {
    id: generateUniqueId(),
    name: 'Alimentación',
    type: 'expense',
    icon: 'utensils',
    color: 'from-yellow-500 to-yellow-600',
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
    color: 'from-green-500 to-green-600',
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
    color: 'from-red-500 to-red-600',
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
    color: 'from-purple-500 to-purple-600',
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
    color: 'from-green-500 to-green-600',
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

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
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
    color: 'from-yellow-500 to-yellow-600',
    description: '',
    budget: '',
    isActive: true
  });
  const [showInactive, setShowInactive] = useState(false);
  const [showWithBudget, setShowWithBudget] = useState(false);
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

  // Guardar en localStorage cuando cambien las categorías
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Categorías de Gastos
  const expenseCategories = categories.filter(c => c.type === 'expense');
  // Categorías de Ingresos
  const incomeCategories = categories.filter(c => c.type === 'income');

  // Filtrar categorías de gastos
  const filteredExpenseCategories = expenseCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = showInactive ? true : category.isActive;
    const matchesBudget = showWithBudget ? (category.budget || 0) > 0 : true;
    return matchesSearch && matchesActive && matchesBudget;
  });

  // Filtrar categorías de ingresos
  const filteredIncomeCategories = incomeCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = showInactive ? true : category.isActive;
    const matchesBudget = showWithBudget ? (category.budget || 0) > 0 : true;
    return matchesSearch && matchesActive && matchesBudget;
  });

  // Ordenar categorías de gastos
  const sortedExpenseCategories = [...filteredExpenseCategories].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'transactions') {
      return sortOrder === 'asc' ? a.transactions - b.transactions : b.transactions - a.transactions;
    } else {
      return sortOrder === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
    }
  });

  // Ordenar categorías de ingresos
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
      color: 'from-yellow-500 to-yellow-600',
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTypeBadge = (type: string) => {
    if (type === 'income') {
      return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><TrendingUp size={12} /> Ingreso</span>;
    } else {
      return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><TrendingDown size={12} /> Gasto</span>;
    }
  };

  const renderCategoryCard = (category: Category) => (
    <div key={category.id} className={`bg-white/5 rounded-xl p-4 border transition-all cursor-pointer ${category.isActive ? 'border-white/10 hover:border-[#F05984]/50' : 'border-red-500/20 opacity-60 hover:opacity-100'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} bg-opacity-20`}>{iconMap[category.icon] || <Tag size={20} className="text-white" />}</div>
          <div><h3 className="text-white font-medium">{category.name}</h3><p className="text-white/40 text-xs">{category.id}</p></div>
        </div>
        {getTypeBadge(category.type)}
      </div>
      {category.description && <p className="text-white/60 text-sm mb-3 line-clamp-2">{category.description}</p>}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm"><span className="text-white/60">Transacciones:</span><span className="text-white">{category.transactions}</span></div>
        <div className="flex items-center justify-between text-sm"><span className="text-white/60">Total {category.type === 'income' ? 'ingresado' : 'gastado'}:</span><span className="text-white font-medium">{formatCurrency(category.totalAmount)}</span></div>
        {category.budget && category.type === 'expense' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm"><span className="text-white/60">Presupuesto:</span><span className="text-white">{formatCurrency(category.budget)}</span></div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden"><div className={`h-full rounded-full ${((category.spent || 0) / category.budget) > 0.9 ? 'bg-red-500' : ((category.spent || 0) / category.budget) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${((category.spent || 0) / category.budget) * 100}%` }} /></div>
          </div>
        )}
      </div>
      {!category.isActive && <div className="mt-2"><span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Inactiva</span></div>}
      <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-white/10">
        <button onClick={() => handleEditCategory(category)} className="p-1 hover:bg-blue-500/20 rounded transition-colors text-blue-400"><Edit size={14} /></button>
        <button onClick={() => handleDeleteCategory(category.id)} className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400"><Trash2 size={14} /></button>
      </div>
    </div>
  );

  const renderCategoryListItem = (category: Category) => (
    <div key={category.id} className={`bg-white/5 rounded-lg p-3 border transition-all cursor-pointer flex items-center justify-between ${category.isActive ? 'border-white/10 hover:border-[#F05984]/50' : 'border-red-500/20 opacity-60 hover:opacity-100'}`}>
      <div className="flex items-center gap-4 flex-1">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} bg-opacity-20`}>{iconMap[category.icon] || <Tag size={16} className="text-white" />}</div>
        <div className="flex-1"><div className="flex items-center gap-2"><h3 className="text-white font-medium">{category.name}</h3>{getTypeBadge(category.type)}{!category.isActive && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Inactiva</span>}</div>{category.description && <p className="text-white/40 text-sm">{category.description}</p>}</div>
        <div className="flex items-center gap-6">
          <div className="text-right"><p className="text-white/60 text-xs">Transacciones</p><p className="text-white text-sm">{category.transactions}</p></div>
          <div className="text-right"><p className="text-white/60 text-xs">Total</p><p className="text-white text-sm font-medium">{formatCurrency(category.totalAmount)}</p></div>
          {category.budget && category.type === 'expense' && <div className="text-right"><p className="text-white/60 text-xs">Presupuesto</p><p className="text-white text-sm">{formatCurrency(category.budget)}</p></div>}
        </div>
      </div>
      <div className="flex items-center gap-1 ml-4">
        <button onClick={() => handleEditCategory(category)} className="p-1 hover:bg-blue-500/20 rounded transition-colors text-blue-400"><Edit size={16} /></button>
        <button onClick={() => handleDeleteCategory(category.id)} className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400"><Trash2 size={16} /></button>
      </div>
    </div>
  );

  const hasActiveFilters = searchTerm !== '' || showInactive || showWithBudget;

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Categorías</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">{categories.length} categorías</span>
          </div>
          <p className="text-white/60 text-sm mt-1">Organiza y gestiona tus categorías de ingresos y gastos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleRefresh} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"><RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}><BarChart3 size={20} /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}><FolderTree size={20} /></button>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"><Plus size={20} /><span className="hidden sm:inline">Nueva Categoría</span></button>
          <button onClick={resetData} className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors text-yellow-400 hover:text-yellow-300" title="Restaurar datos por defecto"><RefreshCw size={20} /></button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} /><input type="text" placeholder="Buscar categorías..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors" /></div>
            <div className="flex gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}><Filter size={20} /></button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"><Download size={20} /></button>
              {hasActiveFilters && (<button onClick={() => { setSearchTerm(''); setShowInactive(false); setShowWithBudget(false); setCurrentPage(1); }} className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 text-sm"><XCircle size={16} /><span>Limpiar filtros</span></button>)}
            </div>
          </div>
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-white/60"><input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />Mostrar inactivas</label>
                <label className="flex items-center gap-2 text-white/60"><input type="checkbox" checked={showWithBudget} onChange={(e) => setShowWithBudget(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />Solo con presupuesto</label>
              </div>
            </div>
          )}
        </div>

        {/* Sort Bar */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4"><span className="text-white/40 text-sm">Ordenar por:</span>
            <button onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'name' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}><span>Nombre</span>{sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</button>
            <button onClick={() => { setSortBy('transactions'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'transactions' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}><Activity size={14} /><span>Transacciones</span>{sortBy === 'transactions' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</button>
            <button onClick={() => { setSortBy('amount'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'amount' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}><DollarSign size={14} /><span>Monto</span>{sortBy === 'amount' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</button>
          </div>
          <span className="text-white/40 text-sm">{filteredExpenseCategories.length + filteredIncomeCategories.length} resultados</span>
        </div>

        {/* Sección de Gastos */}
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <TrendingDown size={20} className="text-red-400" />
              <h2 className="text-lg font-semibold text-white">Categorías de Gastos</h2>
              <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full">{filteredExpenseCategories.length}</span>
            </div>
            {filteredExpenseCategories.length === 0 ? (
              <div className="text-center py-8 text-white/40">No hay categorías de gastos que coincidan con los filtros</div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{paginatedExpenseCategories.map(renderCategoryCard)}</div>
            ) : (
              <div className="space-y-2">{paginatedExpenseCategories.map(renderCategoryListItem)}</div>
            )}
          </div>

          {/* Sección de Ingresos */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <TrendingUp size={20} className="text-green-400" />
              <h2 className="text-lg font-semibold text-white">Categorías de Ingresos</h2>
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">{filteredIncomeCategories.length}</span>
            </div>
            {filteredIncomeCategories.length === 0 ? (
              <div className="text-center py-8 text-white/40">No hay categorías de ingresos que coincidan con los filtros</div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{paginatedIncomeCategories.map(renderCategoryCard)}</div>
            ) : (
              <div className="space-y-2">{paginatedIncomeCategories.map(renderCategoryListItem)}</div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">Mostrando página {currentPage} de {Math.max(totalExpensePages, totalIncomePages)}</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50"><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(5, Math.max(totalExpensePages, totalIncomePages)) }, (_, i) => {
              let pageNum = Math.max(totalExpensePages, totalIncomePages) <= 5 ? i + 1 : (currentPage <= 3 ? i + 1 : (currentPage >= Math.max(totalExpensePages, totalIncomePages) - 2 ? Math.max(totalExpensePages, totalIncomePages) - 4 + i : currentPage - 2 + i));
              return <button key={i} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${currentPage === pageNum ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>{pageNum}</button>;
            })}
            <button onClick={() => setCurrentPage(p => Math.min(Math.max(totalExpensePages, totalIncomePages), p + 1))} disabled={currentPage === Math.max(totalExpensePages, totalIncomePages)} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Modal para crear nueva categoría */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="p-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-lg"><FolderTree size={20} className="text-white" /></div><div><h2 className="text-xl font-bold text-white">Nueva Categoría</h2><p className="text-white/40 text-sm">Define una nueva categoría para tus finanzas</p></div></div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={20} className="text-white/60" /></button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateCategory(); }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-white/60 text-sm mb-1.5 block">Nombre *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" placeholder="Ej: Alimentación" required /></div>
                  <div><label className="text-white/60 text-sm mb-1.5 block">Tipo *</label><select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                    <option value="expense">Gasto</option><option value="income">Ingreso</option>
                  </select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-white/60 text-sm mb-1.5 block">Icono</label><select value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                    <option value="utensils">Alimentación</option><option value="home">Vivienda</option><option value="car">Transporte</option><option value="heart">Salud</option><option value="shopping">Compras</option><option value="film">Ocio</option><option value="briefcase">Trabajo</option><option value="plane">Viajes</option><option value="dumbbell">Gimnasio</option><option value="book">Educación</option>
                  </select></div>
                  <div><label className="text-white/60 text-sm mb-1.5 block">Color</label><select value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                    <option value="from-yellow-500 to-yellow-600">Amarillo</option><option value="from-blue-500 to-blue-600">Azul</option><option value="from-green-500 to-green-600">Verde</option><option value="from-red-500 to-red-600">Rojo</option><option value="from-purple-500 to-purple-600">Púrpura</option>
                  </select></div>
                </div>
                <div><label className="text-white/60 text-sm mb-1.5 block">Descripción</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" placeholder="Descripción opcional..." /></div>
                <div><label className="text-white/60 text-sm mb-1.5 block">Presupuesto mensual (solo para gastos)</label><div className="relative"><DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="number" step="0.01" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" placeholder="0.00" /></div></div>
                <div className="flex items-center gap-2"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" /><label htmlFor="isActive" className="text-white/60 text-sm">Activa (visible en transacciones)</label></div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors font-medium">Cancelar</button>
                  <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"><Save size={18} /><span>Guardar Categoría</span></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar categoría */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="p-2 bg-blue-500/20 rounded-lg"><Edit size={20} className="text-blue-400" /></div><div><h2 className="text-xl font-bold text-white">Editar Categoría</h2><p className="text-white/40 text-sm">Modifica los datos de la categoría</p></div></div>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={20} className="text-white/60" /></button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateCategory(); }} className="space-y-4">
                <div><label className="text-white/60 text-sm mb-1.5 block">Nombre</label><input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" required /></div>
                <div><label className="text-white/60 text-sm mb-1.5 block">Descripción</label><textarea value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" /></div>
                <div><label className="text-white/60 text-sm mb-1.5 block">Presupuesto mensual</label><div className="relative"><DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="number" step="0.01" value={editFormData.budget} onChange={(e) => setEditFormData({...editFormData, budget: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" /></div></div>
                <div className="flex items-center gap-2"><input type="checkbox" id="editIsActive" checked={editFormData.isActive} onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" /><label htmlFor="editIsActive" className="text-white/60 text-sm">Activa</label></div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">Guardar Cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
