import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderTree,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  ChevronRight,
  ChevronLeft,
  Tag,
  TrendingDown,
  PieChart,
  BarChart3,
  RefreshCw,
  Download,
  Filter,
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
  ArrowDown,
  Settings,
  Save,
  X,
  Shield,
  Fuel,
  Wrench,
  Stethoscope,
  GraduationCap
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  type: 'expense'; // Solo gastos
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

interface CategorySummary {
  totalCategories: number;
  activeCategories: number;
  expenseCategories: number;
  totalBudget: number;
  totalSpent: number;
  budgetUtilization: number;
  averageSpent: number;
  mostUsedCategory: string;
}

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [showWithBudget, setShowWithBudget] = useState(false);

  // Resumen de categorías
  const summary: CategorySummary = {
    totalCategories: 16,
    activeCategories: 15,
    expenseCategories: 16,
    totalBudget: 3950,
    totalSpent: 2472.34,
    budgetUtilization: 63,
    averageSpent: 154.52,
    mostUsedCategory: 'Alimentación'
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
    fuel: <Fuel size={20} />,
    wrench: <Wrench size={20} />,
    stethoscope: <Stethoscope size={20} />,
    graduation: <GraduationCap size={20} />
  };

  // Datos de ejemplo - Solo categorías de gastos
  const expenseCategories: Category[] = [
    {
      id: 'CAT-101',
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
      updatedAt: '2024-02-23',
      subcategories: [
        {
          id: 'CAT-101-1',
          name: 'Supermercado',
          type: 'expense',
          icon: 'utensils',
          color: 'from-yellow-500 to-yellow-600',
          transactions: 15,
          totalAmount: 2850.75,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-02-23'
        },
        {
          id: 'CAT-101-2',
          name: 'Restaurantes',
          type: 'expense',
          icon: 'utensils',
          color: 'from-yellow-500 to-yellow-600',
          transactions: 9,
          totalAmount: 1399.75,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-02-23'
        }
      ]
    },
    {
      id: 'CAT-102',
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
      id: 'CAT-103',
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
      updatedAt: '2024-02-23',
      subcategories: [
        {
          id: 'CAT-103-1',
          name: 'Electricidad',
          type: 'expense',
          icon: 'zap',
          color: 'from-cyan-500 to-cyan-600',
          transactions: 6,
          totalAmount: 721.50,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-02-23'
        },
        {
          id: 'CAT-103-2',
          name: 'Agua',
          type: 'expense',
          icon: 'droplet',
          color: 'from-cyan-500 to-cyan-600',
          transactions: 6,
          totalAmount: 540.30,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-02-23'
        },
        {
          id: 'CAT-103-3',
          name: 'Internet',
          type: 'expense',
          icon: 'wifi',
          color: 'from-cyan-500 to-cyan-600',
          transactions: 6,
          totalAmount: 1099.68,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-02-23'
        }
      ]
    },
    {
      id: 'CAT-104',
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
      updatedAt: '2024-02-23',
      subcategories: [
        {
          id: 'CAT-104-1',
          name: 'Combustible',
          type: 'expense',
          icon: 'fuel',
          color: 'from-green-500 to-green-600',
          transactions: 5,
          totalAmount: 975.00,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-02-23'
        },
        {
          id: 'CAT-104-2',
          name: 'Mantenimiento',
          type: 'expense',
          icon: 'wrench',
          color: 'from-green-500 to-green-600',
          transactions: 3,
          totalAmount: 585.00,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-02-23'
        }
      ]
    },
    {
      id: 'CAT-105',
      name: 'Ocio',
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
      id: 'CAT-106',
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
      updatedAt: '2024-02-23',
      subcategories: [
        {
          id: 'CAT-106-1',
          name: 'Farmacia',
          type: 'expense',
          icon: 'heart',
          color: 'from-red-500 to-red-600',
          transactions: 2,
          totalAmount: 345.00,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-02-23'
        },
        {
          id: 'CAT-106-2',
          name: 'Consultas',
          type: 'expense',
          icon: 'stethoscope',
          color: 'from-red-500 to-red-600',
          transactions: 2,
          totalAmount: 545.00,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-02-23'
        }
      ]
    },
    {
      id: 'CAT-107',
      name: 'Compras',
      type: 'expense',
      icon: 'shopping',
      color: 'from-pink-500 to-pink-600',
      description: 'Ropa, electrónica, artículos para el hogar',
      budget: 300,
      spent: 120.50,
      transactions: 7,
      totalAmount: 2140.00,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'CAT-108',
      name: 'Seguros',
      type: 'expense',
      icon: 'shield',
      color: 'from-indigo-500 to-indigo-600',
      description: 'Seguros de vida, coche, hogar',
      budget: 150,
      spent: 450.00,
      transactions: 2,
      totalAmount: 1800.00,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'CAT-109',
      name: 'Educación',
      type: 'expense',
      icon: 'book',
      color: 'from-orange-500 to-orange-600',
      description: 'Cursos, libros, formación, material educativo',
      budget: 200,
      spent: 0,
      transactions: 3,
      totalAmount: 650.00,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'CAT-110',
      name: 'Mascotas',
      type: 'expense',
      icon: 'dog',
      color: 'from-amber-500 to-amber-600',
      description: 'Alimento, veterinario, accesorios',
      budget: 100,
      spent: 0,
      transactions: 2,
      totalAmount: 320.00,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'CAT-111',
      name: 'Viajes',
      type: 'expense',
      icon: 'plane',
      color: 'from-teal-500 to-teal-600',
      description: 'Vacaciones, transporte, alojamiento',
      budget: 500,
      spent: 0,
      transactions: 1,
      totalAmount: 850.00,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'CAT-112',
      name: 'Gimnasio',
      type: 'expense',
      icon: 'dumbbell',
      color: 'from-lime-500 to-lime-600',
      description: 'Membresías de gimnasio, clases deportivas',
      budget: 50,
      spent: 45.00,
      transactions: 2,
      totalAmount: 90.00,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'CAT-113',
      name: 'Cafetería',
      type: 'expense',
      icon: 'coffee',
      color: 'from-brown-500 to-brown-600',
      description: 'Café, desayunos fuera de casa',
      budget: 60,
      spent: 32.50,
      transactions: 8,
      totalAmount: 260.00,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'CAT-114',
      name: 'Suscripciones',
      type: 'expense',
      icon: 'award',
      color: 'from-violet-500 to-violet-600',
      description: 'Netflix, Spotify, Prime, otras suscripciones',
      budget: 40,
      spent: 32.99,
      transactions: 4,
      totalAmount: 395.88,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'CAT-115',
      name: 'Regalos',
      type: 'expense',
      icon: 'gift',
      color: 'from-rose-500 to-rose-600',
      description: 'Regalos para cumpleaños, celebraciones',
      budget: 100,
      spent: 0,
      transactions: 2,
      totalAmount: 180.00,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'CAT-116',
      name: 'Otros gastos',
      type: 'expense',
      icon: 'sparkles',
      color: 'from-gray-500 to-gray-600',
      description: 'Gastos varios no categorizados',
      budget: 100,
      spent: 23.50,
      transactions: 5,
      totalAmount: 470.00,
      isActive: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    }
  ];

  // Filtrar categorías
  const filteredCategories = expenseCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = showInactive ? true : category.isActive;
    const matchesBudget = showWithBudget ? (category.budget || 0) > 0 : true;
    
    return matchesSearch && matchesActive && matchesBudget;
  });

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

  const getTypeBadge = () => {
    return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">Gasto</span>;
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Categorías de Gastos</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">
              {expenseCategories.length} categorías
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Organiza y gestiona tus categorías de gastos
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
            <FolderTree size={20} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Nueva Categoría</span>
          </button>
        </div>
      </div>

      {/* Summary Cards - Adaptado solo para gastos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Total Categorías</p>
          <p className="text-2xl font-bold text-white">{summary.totalCategories}</p>
          <p className="text-green-400 text-xs mt-1">{summary.activeCategories} activas</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <TrendingDown size={16} className="text-red-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Categorías de Gasto</p>
              <p className="text-white font-bold">{summary.expenseCategories}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Gasto Promedio</p>
          <p className="text-xl font-bold text-white">{formatCurrency(summary.averageSpent)}</p>
          <p className="text-white/40 text-xs mt-1">por categoría</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Más usada</p>
          <p className="text-xl font-bold text-white">{summary.mostUsedCategory}</p>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-3">Resumen de Presupuesto de Gastos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-white/60 text-sm">Presupuesto Total</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalBudget)}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Gastado</p>
            <p className="text-2xl font-bold text-yellow-400">{formatCurrency(summary.totalSpent)}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Utilización</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-green-400">{summary.budgetUtilization}%</p>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full"
                  style={{ width: `${summary.budgetUtilization}%` }}
                />
              </div>
            </div>
          </div>
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
                placeholder="Buscar categorías de gastos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors"
              />
            </div>
            <div className="flex gap-2">
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

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 text-white/60">
                  <input
                    type="checkbox"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
                  />
                  Mostrar inactivas
                </label>
                <label className="flex items-center gap-2 text-white/60">
                  <input
                    type="checkbox"
                    checked={showWithBudget}
                    onChange={(e) => setShowWithBudget(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
                  />
                  Solo con presupuesto
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10">
          <span className="text-white/40 text-sm">
            {filteredCategories.length} categorías encontradas
          </span>
        </div>

        {/* Categories Grid/List View */}
        <div className="p-4">
          {viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className={`bg-white/5 rounded-xl p-4 border transition-all cursor-pointer ${
                    category.isActive 
                      ? 'border-white/10 hover:border-[#F05984]/50' 
                      : 'border-red-500/20 opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} bg-opacity-20`}>
                        {iconMap[category.icon] || <Tag size={20} className="text-white" />}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{category.name}</h3>
                        <p className="text-white/40 text-xs">{category.id}</p>
                      </div>
                    </div>
                    {getTypeBadge()}
                  </div>

                  {category.description && (
                    <p className="text-white/60 text-sm mb-3 line-clamp-2">{category.description}</p>
                  )}

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Transacciones:</span>
                      <span className="text-white">{category.transactions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Total gastado:</span>
                      <span className="text-white font-medium">{formatCurrency(category.totalAmount)}</span>
                    </div>
                    {category.budget && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/60">Presupuesto:</span>
                          <span className="text-white">{formatCurrency(category.budget)}</span>
                        </div>
                        {category.spent !== undefined && (
                          <>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/40">Gastado:</span>
                              <span className="text-white/80">{formatCurrency(category.spent)}</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  (category.spent / category.budget) > 0.9 
                                    ? 'bg-red-500' 
                                    : (category.spent / category.budget) > 0.7 
                                    ? 'bg-yellow-500' 
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${(category.spent / category.budget) * 100}%` }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-white/40 text-xs mb-1">Subcategorías:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.slice(0, 3).map((sub) => (
                          <span key={sub.id} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                            {sub.name}
                          </span>
                        ))}
                        {category.subcategories.length > 3 && (
                          <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                            +{category.subcategories.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {!category.isActive && (
                    <div className="mt-2">
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                        Inactiva
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-white/10">
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Eye size={16} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Edit size={16} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Trash2 size={16} className="text-white/60 hover:text-red-400" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <MoreVertical size={16} className="text-white/60" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-2">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className={`bg-white/5 rounded-lg p-3 border transition-all cursor-pointer flex items-center justify-between ${
                    category.isActive 
                      ? 'border-white/10 hover:border-[#F05984]/50' 
                      : 'border-red-500/20 opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} bg-opacity-20`}>
                      {iconMap[category.icon] || <Tag size={16} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{category.name}</h3>
                        {getTypeBadge()}
                        {!category.isActive && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                            Inactiva
                          </span>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-white/40 text-sm">{category.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Transacciones</p>
                        <p className="text-white text-sm">{category.transactions}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Total</p>
                        <p className="text-white text-sm font-medium">{formatCurrency(category.totalAmount)}</p>
                      </div>
                      {category.budget && (
                        <div className="text-right">
                          <p className="text-white/60 text-xs">Presupuesto</p>
                          <p className="text-white text-sm">{formatCurrency(category.budget)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
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
              ))}
            </div>
          )}
        </div>

        {/* Simple Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">
            Mostrando {filteredCategories.length} de {expenseCategories.length} categorías
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded bg-[#F05984] text-white">1</button>
            <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white">2</button>
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalles de categoría (solo gastos) */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${selectedCategory.color} bg-opacity-20`}>
                    {iconMap[selectedCategory.icon] || <Tag size={24} className="text-white" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedCategory.name}</h2>
                    <p className="text-white/40 text-sm">{selectedCategory.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Descripción</p>
                  <p className="text-white">{selectedCategory.description || 'Sin descripción'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs">Tipo</p>
                    <div className="mt-1">{getTypeBadge()}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs">Estado</p>
                    <p className={`text-sm font-medium mt-1 ${selectedCategory.isActive ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedCategory.isActive ? 'Activa' : 'Inactiva'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs">Total transacciones</p>
                    <p className="text-white text-lg font-bold">{selectedCategory.transactions}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs">Total gastado</p>
                    <p className="text-white text-lg font-bold">{formatCurrency(selectedCategory.totalAmount)}</p>
                  </div>
                </div>

                {selectedCategory.budget && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs mb-2">Presupuesto mensual</p>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white">Presupuesto: {formatCurrency(selectedCategory.budget)}</span>
                      <span className="text-white/60">Gastado: {selectedCategory.spent ? formatCurrency(selectedCategory.spent) : '$0'}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          ((selectedCategory.spent || 0) / selectedCategory.budget) > 0.9 
                            ? 'bg-red-500' 
                            : ((selectedCategory.spent || 0) / selectedCategory.budget) > 0.7 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${((selectedCategory.spent || 0) / selectedCategory.budget) * 100}%` }}
                      />
                    </div>
                    <p className="text-white/40 text-xs mt-2">
                      {((selectedCategory.spent || 0) / selectedCategory.budget * 100).toFixed(1)}% del presupuesto utilizado
                    </p>
                  </div>
                )}

                {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
                  <div>
                    <p className="text-white/60 text-sm mb-2">Subcategorías</p>
                    <div className="space-y-2">
                      {selectedCategory.subcategories.map((sub) => (
                        <div key={sub.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-lg bg-gradient-to-r ${sub.color} bg-opacity-20`}>
                              {iconMap[sub.icon] || <Tag size={14} className="text-white" />}
                            </div>
                            <span className="text-white">{sub.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-white/60 text-sm">{sub.transactions} ops</span>
                            <span className="text-white font-medium">{formatCurrency(sub.totalAmount)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                  >
                    Cerrar
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">
                    Editar Categoría
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de creación de categoría (solo gastos) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Nueva Categoría de Gasto</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Nombre</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                    placeholder="Ej: Alimentación"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Icono</label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors">
                    <option value="utensils">Alimentación</option>
                    <option value="home">Vivienda</option>
                    <option value="car">Transporte</option>
                    <option value="heart">Salud</option>
                    <option value="shopping">Compras</option>
                    <option value="film">Ocio</option>
                    <option value="zap">Servicios</option>
                    <option value="plane">Viajes</option>
                    <option value="dumbbell">Gimnasio</option>
                    <option value="dog">Mascotas</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Color</label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors">
                    <option value="from-yellow-500 to-yellow-600">Amarillo</option>
                    <option value="from-blue-500 to-blue-600">Azul</option>
                    <option value="from-green-500 to-green-600">Verde</option>
                    <option value="from-red-500 to-red-600">Rojo</option>
                    <option value="from-purple-500 to-purple-600">Púrpura</option>
                    <option value="from-pink-500 to-pink-600">Rosa</option>
                    <option value="from-orange-500 to-orange-600">Naranja</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Descripción</label>
                  <textarea
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                    rows={3}
                    placeholder="Descripción opcional..."
                  />
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Presupuesto mensual (opcional)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
                    defaultChecked
                  />
                  <label htmlFor="isActive" className="text-white/60 text-sm">
                    Activa (visible en transacciones)
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Crear Categoría
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
