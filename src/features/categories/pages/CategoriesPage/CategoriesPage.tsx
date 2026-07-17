import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { categoriasService, type ApiCategoria } from '../../services';
import { getViewPreferences } from '../../../../shared/hooks/useViewPreferences';
import { clientesService } from '../../../clients/services';
import { gastosService } from '../../../expenses/services';
import { getCurrentClientSession } from '../../../../shared/hooks/useCurrentClient';
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
  PieChart as PieChartIcon,
  Target
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';

interface Category {
  id: string;
  name: string;
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

// ponytail: registros antiguos guardaban el tipo como prefijo "expense:utensils" en el campo
// icono (los ingresos nunca llegaron a usar categorías); se sigue aceptando el prefijo al leer.
const decodeIcono = (icono: string): string => {
  const i = icono.indexOf(':');
  return i > -1 ? icono.slice(i + 1) : icono;
};

const HEX_TO_TW: Record<string, string> = {
  '#F59E0B': 'from-amber-500 to-amber-600',
  '#3B82F6': 'from-blue-500 to-blue-600',
  '#10B981': 'from-emerald-500 to-emerald-600',
  '#F43F5E': 'from-rose-500 to-rose-600',
  '#8B5CF6': 'from-violet-500 to-violet-600',
  '#EC4899': 'from-pink-500 to-pink-600',
  '#6366F1': 'from-indigo-500 to-indigo-600',
};
const hexToTw = (hex: string) => HEX_TO_TW[hex] ?? 'from-amber-500 to-amber-600';
// bg-opacity-* no afecta bg-gradient-to-r (solo a bg-{color}), así que el atenuado del chip
// de ícono se hace poniendo el modificador /20 directo en cada stop del gradiente.
const softBg = (twGradient: string) => twGradient.split(' ').map(c => `${c}/20`).join(' ');

const toCategory = (api: ApiCategoria): Category => ({
  id: String(api.id),
  name: api.nombre ?? '',
  icon: decodeIcono(api.icono ?? 'home'),
  color: hexToTw(api.color ?? '#F59E0B'),
  description: api.descripcion,
  budget: api.presupuestoMensual,
  spent: 0,
  transactions: 0,
  totalAmount: 0,
  isActive: api.activa ?? true,
  createdAt: api.fechaCreacion ?? new Date().toISOString(),
  updatedAt: api.fechaModificacion ?? new Date().toISOString(),
});

// Mapa de iconos disponibles
const iconMap: { [key: string]: React.ComponentType<{ size?: number; className?: string }> } = {
  home: HomeIcon,
  utensils: Utensils,
  car: Car,
  heart: Heart,
  shopping: ShoppingBag,
  film: Film,
  zap: Zap,
  wifi: Wifi,
  droplet: Droplet,
  briefcase: Briefcase,
  gift: Gift,
  award: Award,
  smartphone: Smartphone,
  laptop: Laptop,
  plane: Plane,
  hotel: Hotel,
  shirt: Shirt,
  dumbbell: Dumbbell,
  book: BookOpen,
  coffee: Coffee,
  dog: Dog,
  sparkles: Sparkles,
  shield: Shield,
  dollar: DollarSign,
  credit: CreditCard,
  wallet: Wallet,
  users: Users,
  home2: Home
};

// Tamaño y color consistentes entre el ícono resuelto y el fallback (antes divergían: iconMap
// quedaba fijo en size=20 sin color mientras el fallback usaba size=16 con text-white).
const renderCategoryIcon = (icon: string, size: 16 | 20 = 20) => {
  const Icon = iconMap[icon] ?? Tag;
  return <Icon size={size} className="text-white" />;
};


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const CategoriesPage = () => {
  const { isClientRole, ownClienteId } = getCurrentClientSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => getViewPreferences().defaultView);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [clientesList, setClientesList] = useState<{ id: number; nombre: string }[]>([]);
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
    clienteId: isClientRole ? ownClienteId : '',
    name: '',
    icon: 'utensils',
    color: '#F59E0B',
    description: '',
    budget: '',
    isActive: true
  });
  const [showInactive, setShowInactive] = useState(false);
  const [showWithBudget, setShowWithBudget] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'transactions' | 'amount'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = getViewPreferences().itemsPerPage;

  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async (clienteId: number) => {
    setIsLoading(true);
    try {
      const [list, gastosList] = await Promise.all([
        categoriasService.getByCliente(clienteId),
        gastosService.getAll(),
      ]);
      const [fullCats, fullGastos] = await Promise.all([
        Promise.all(list.map(item => categoriasService.getById(item.id!).catch(() => item))),
        Promise.all(gastosList.map(g => gastosService.getById(g.id!).catch(() => g))),
      ]);

      // Agregar gastos activos de este cliente por categoriaId
      const byCategoria = new Map<number, { spent: number; transactions: number }>();
      fullGastos.forEach(g => {
        if (g.clienteId !== clienteId || !g.activo) return;
        const id = g.categoriaId!;
        const cur = byCategoria.get(id) ?? { spent: 0, transactions: 0 };
        byCategoria.set(id, { spent: cur.spent + (g.monto ?? 0), transactions: cur.transactions + 1 });
      });

      setCategories(fullCats.map(api => {
        const cat = toCategory(api);
        const agg = byCategoria.get(Number(api.id));
        return agg ? { ...cat, spent: agg.spent, transactions: agg.transactions, totalAmount: agg.spent } : cat;
      }));
    } catch (e) {
      console.error('Error cargando categorías:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const [activeClienteId, setActiveClienteId] = useState(() => Number(ownClienteId || 0));
  useEffect(() => { if (activeClienteId) fetchCategories(activeClienteId); else setIsLoading(false); }, [fetchCategories, activeClienteId]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, showInactive, showWithBudget]);

  useEffect(() => {
    if (!showCreateModal) return;
    clientesService.getAll().then(clientes => {
      setClientesList(clientes.filter(c => c.id != null && c.activo !== false).map(c => ({ id: Number(c.id), nombre: c.nombreCompleto })));
    }).catch(() => {});
  }, [showCreateModal]);

  // Calcular estadísticas
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.isActive).length;
  const categoriesWithBudget = categories.filter(c => c.budget && c.budget > 0).length;
  const mostUsedCategory = categories.reduce((max, cat) => cat.transactions > max.transactions ? cat : max, categories[0]);

  // Datos para el gráfico de pastel
  const categoryPieData = categories.map((cat, idx) => ({
    name: cat.name,
    value: cat.totalAmount,
    color: CHART_COLORS[idx % CHART_COLORS.length],
    transactions: cat.transactions
  }));

  // Top 3 categorías más utilizadas
  const topCategories = [...categories]
    .sort((a, b) => b.transactions - a.transactions)
    .slice(0, 3);

  // Filtrar categorías
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = showInactive ? true : category.isActive;
    const matchesBudget = showWithBudget ? (category.budget || 0) > 0 : true;
    return matchesSearch && matchesActive && matchesBudget;
  });

  // Ordenar categorías
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'transactions') {
      return sortOrder === 'asc' ? a.transactions - b.transactions : b.transactions - a.transactions;
    } else {
      return sortOrder === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
    }
  });

  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handleCreateCategory = async () => {
    try {
      const clienteId = Number(formData.clienteId);
      await categoriasService.create({
        clienteId,
        nombre: formData.name,
        descripcion: formData.description || undefined,
        color: formData.color,
        icono: formData.icon,
        presupuestoMensual: formData.budget ? parseFloat(formData.budget) : undefined,
      });
      localStorage.setItem('clienteId', String(clienteId));
      setActiveClienteId(clienteId);
      await fetchCategories(clienteId);
      setShowCreateModal(false);
      setFormData({ clienteId: isClientRole ? ownClienteId : '', name: '', icon: 'utensils', color: '#F59E0B', description: '', budget: '', isActive: true });
      toast.success('Categoría creada');
    } catch (e) {
      toast.error(`Error al crear: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
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

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    try {
      await categoriasService.update(Number(selectedCategory.id), {
        nombre: editFormData.name,
        descripcion: editFormData.description || undefined,
        presupuestoMensual: editFormData.budget ? parseFloat(editFormData.budget) : undefined,
        activa: editFormData.isActive,
      });
      await fetchCategories(activeClienteId);
      setShowEditModal(false);
      setSelectedCategory(null);
      toast.success('Categoría actualizada');
    } catch (e) {
      toast.error(`Error al actualizar: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await categoriasService.remove(Number(id));
        await fetchCategories(activeClienteId);
        toast.success('Categoría eliminada');
      } catch (e) {
        toast.error(`Error al eliminar: ${e instanceof Error ? e.message : 'Error desconocido'}`);
      }
    }
  };


  const clearAllFilters = () => {
    setSearchTerm('');
    setShowInactive(false);
    setShowWithBudget(false);
    setCurrentPage(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const hasActiveFilters = searchTerm !== '' || showInactive || showWithBudget;

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
              <p className="text-white/50 text-sm mt-1">Organiza y gestiona tus categorías de gastos</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300"
            >
              <Plus size={20} />
              <span className="hidden sm:inline font-medium">Nueva Categoría</span>
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
              <p className="text-2xl font-bold text-rose-400 mt-1 tracking-tight">{formatCurrency(categories.reduce((sum, c) => sum + c.totalAmount, 0))}</p>
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
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {categoryPieData.map((entry, index) => (
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
              const totalTransactions = categories.reduce((sum, c) => sum + c.transactions, 0);
              const usagePercentage = totalTransactions > 0 ? (cat.transactions / totalTransactions) * 100 : 0;
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
                      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${softBg(cat.color)}`}>
                        {renderCategoryIcon(cat.icon, 16)}
                      </div>
                      <span className="text-white text-sm font-medium">{cat.name}</span>
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
        {/* Fila de vista — encima del buscador */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-white/10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <BarChart3 size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <FolderTree size={20} />
          </motion.button>
        </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <span className="text-white/40 text-sm">{filteredCategories.length} resultados</span>
        </div>

        {/* Estado Vacío */}
        {filteredCategories.length === 0 && (
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

        {/* Lista de Categorías */}
        {filteredCategories.length > 0 && (
          <div className="p-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {paginatedCategories.map((category) => {
                    const budgetPercentage = category.budget ? ((category.spent || 0) / category.budget) * 100 : 0;
                    const isOverBudget = budgetPercentage >= 90;
                    const isWarning = budgetPercentage >= 70 && budgetPercentage < 90;
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
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
                            <div className={`p-2 rounded-xl bg-gradient-to-r ${softBg(category.color)} shadow-lg`}>
                              {renderCategoryIcon(category.icon, 20)}
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{category.name}</h3>
                              <p className="text-white/40 text-xs">{category.id.slice(-8)}</p>
                            </div>
                          </div>
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
                            title="Editar Categoría"
                          >
                            <Edit size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400"
                            title="Eliminar Categoría"
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
                  {paginatedCategories.map((category) => {
                    const budgetPercentage = category.budget ? ((category.spent || 0) / category.budget) * 100 : 0;
                    const isOverBudget = budgetPercentage >= 90;
                    const isWarning = budgetPercentage >= 70 && budgetPercentage < 90;
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ scale: 1.01 }}
                        className={`bg-gradient-to-r from-white/5 to-white/0 rounded-lg p-3 border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                          category.isActive ? 'border-white/10 hover:border-[#F05984]/30' : 'border-rose-500/20 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${softBg(category.color)}`}>
                            {renderCategoryIcon(category.icon, 16)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-medium">{category.name}</h3>
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
                              title="Editar Categoría"
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteCategory(category.id)}
                              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400"
                              title="Eliminar Categoría"
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
        )}

        {/* Pagination */}
        {filteredCategories.length > 0 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-white/40 text-sm">
              Mostrando página {currentPage} de {totalPages}
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

      {/* Modal para crear nueva categoría */}
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
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Cliente *</label>
                    {isClientRole ? (
                      <div className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/70">
                        {clientesList.find(c => c.id === Number(ownClienteId))?.nombre || localStorage.getItem('userName') || 'Tu cuenta'}
                      </div>
                    ) : (
                      <select value={formData.clienteId} onChange={(e) => setFormData({...formData, clienteId: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                        style={{ backgroundColor: '#1a0f14', color: 'white' }} required>
                        <option value="" style={{ backgroundColor: '#1a0f14' }}>Seleccionar cliente</option>
                        {clientesList.map(c => (
                          <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14' }}>{c.nombre}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Nombre *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Ej: Alimentación" required />
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
                        <option value="#F59E0B">Amarillo</option>
                        <option value="#3B82F6">Azul</option>
                        <option value="#10B981">Verde</option>
                        <option value="#F43F5E">Rojo</option>
                        <option value="#8B5CF6">Púrpura</option>
                        <option value="#EC4899">Rosa</option>
                        <option value="#6366F1">Índigo</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Descripción</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Descripción opcional..." />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Presupuesto mensual</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                      <input type="number" step="0.01" min="0" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="0.00" />
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

      {/* Modal para editar categoría */}
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
                      <input type="number" step="0.01" min="0" value={editFormData.budget} onChange={(e) => setEditFormData({...editFormData, budget: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
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
    </motion.div>
  );
};