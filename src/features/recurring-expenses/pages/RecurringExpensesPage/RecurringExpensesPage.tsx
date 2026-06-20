import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Repeat,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Home as HomeIcon,
  Film,
  Zap,
  Shield,
  Heart,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  StopCircle,
  User,
  Calendar as CalendarIcon,
  Activity,
  Tag,
  PieChart
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';
import { formatCurrency, formatDate, generateUniqueId, containerVariants, itemVariants, getPaymentMethodLabel } from '../../../../shared/utils';

interface RecurringExpense {
  id: string;
  name: string;
  description?: string;
  amount: number;
  category: string;
  subcategory?: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual';
  frequencyValue?: number;
  startDate: string;
  endDate?: string;
  nextPayment: string;
  lastPayment?: string;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'direct_debit' | 'check';
  status: 'active' | 'paused' | 'cancelled' | 'completed';
  autoPay: boolean;
  vendor?: string;
  vendorId?: string;
  invoice?: string;
  notes?: string;
  tags: string[];
  attachments?: number;
  createdAt: string;
  updatedAt: string;
  paymentHistory?: PaymentHistory[];
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'skipped';
  reference?: string;
}

// Colores para el gráfico de pastel
const CHART_COLORS = ['#F05984', '#BC455F', '#6E4068', '#321D28', '#2DD4BF', '#F59E0B', '#10B981', '#6366F1'];

// Función para generar ID único

// Datos iniciales por defecto
const getDefaultExpenses = (): RecurringExpense[] => [
  {
    id: generateUniqueId('REC'),
    name: 'Alquiler',
    description: 'Alquiler del apartamento',
    amount: 1200.00,
    category: 'Vivienda',
    subcategory: 'Alquiler',
    frequency: 'monthly',
    startDate: '2024-01-01',
    nextPayment: '2024-03-01',
    lastPayment: '2024-02-01',
    paymentMethod: 'transfer',
    status: 'active',
    autoPay: true,
    vendor: 'Inmobiliaria Pérez',
    vendorId: 'VEN-001',
    invoice: 'RENT-2024-002',
    notes: 'Alquiler mensual del apartamento',
    tags: ['vivienda', 'alquiler', 'fijo'],
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId('REC'),
    name: 'Netflix',
    description: 'Suscripción mensual',
    amount: 15.99,
    category: 'Entretenimiento',
    subcategory: 'Streaming',
    frequency: 'monthly',
    startDate: '2024-01-15',
    nextPayment: '2024-03-15',
    lastPayment: '2024-02-15',
    paymentMethod: 'card',
    status: 'active',
    autoPay: true,
    vendor: 'Netflix',
    notes: 'Plan estándar HD',
    tags: ['entretenimiento', 'streaming', 'suscripción'],
    createdAt: '2024-01-15',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId('REC'),
    name: 'Electricidad',
    description: 'Factura de luz',
    amount: 85.50,
    category: 'Servicios',
    subcategory: 'Electricidad',
    frequency: 'monthly',
    startDate: '2024-01-10',
    nextPayment: '2024-03-10',
    lastPayment: '2024-02-10',
    paymentMethod: 'transfer',
    status: 'active',
    autoPay: false,
    vendor: 'Endesa',
    tags: ['servicios', 'electricidad', 'hogar'],
    createdAt: '2024-01-10',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId('REC'),
    name: 'Internet',
    description: 'Fibra óptica 300Mb',
    amount: 49.99,
    category: 'Servicios',
    subcategory: 'Internet',
    frequency: 'monthly',
    startDate: '2024-01-05',
    nextPayment: '2024-03-05',
    lastPayment: '2024-02-05',
    paymentMethod: 'direct_debit',
    status: 'active',
    autoPay: true,
    vendor: 'Movistar',
    tags: ['internet', 'servicios', 'hogar'],
    createdAt: '2024-01-05',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId('REC'),
    name: 'Gimnasio',
    description: 'Membresía mensual',
    amount: 45.00,
    category: 'Salud',
    subcategory: 'Deporte',
    frequency: 'monthly',
    startDate: '2024-01-20',
    nextPayment: '2024-03-20',
    lastPayment: '2024-02-20',
    paymentMethod: 'card',
    status: 'active',
    autoPay: true,
    vendor: 'Basic Fit',
    tags: ['salud', 'deporte', 'suscripción'],
    createdAt: '2024-01-20',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId('REC'),
    name: 'Seguro de Coche',
    description: 'Seguro a todo riesgo',
    amount: 450.00,
    category: 'Seguros',
    subcategory: 'Vehículo',
    frequency: 'annual',
    startDate: '2024-03-15',
    nextPayment: '2024-03-15',
    lastPayment: '2023-03-15',
    paymentMethod: 'transfer',
    status: 'active',
    autoPay: true,
    vendor: 'Mapfre',
    tags: ['seguros', 'coche', 'anual'],
    createdAt: '2023-03-15',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId('REC'),
    name: 'Spotify',
    description: 'Suscripción familiar',
    amount: 14.99,
    category: 'Entretenimiento',
    subcategory: 'Streaming',
    frequency: 'monthly',
    startDate: '2024-01-25',
    nextPayment: '2024-03-25',
    lastPayment: '2024-02-25',
    paymentMethod: 'card',
    status: 'active',
    autoPay: true,
    vendor: 'Spotify',
    tags: ['música', 'streaming', 'suscripción'],
    createdAt: '2024-01-25',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId('REC'),
    name: 'Agua',
    description: 'Factura del agua',
    amount: 35.80,
    category: 'Servicios',
    subcategory: 'Agua',
    frequency: 'monthly',
    startDate: '2024-01-12',
    nextPayment: '2024-03-12',
    lastPayment: '2024-02-12',
    paymentMethod: 'transfer',
    status: 'paused',
    autoPay: false,
    vendor: 'Aguas de Barcelona',
    tags: ['servicios', 'agua', 'hogar'],
    createdAt: '2024-01-12',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId('REC'),
    name: 'Amazon Prime',
    description: 'Suscripción anual',
    amount: 49.99,
    category: 'Entretenimiento',
    subcategory: 'Streaming',
    frequency: 'annual',
    startDate: '2024-02-10',
    nextPayment: '2025-02-10',
    lastPayment: '2024-02-10',
    paymentMethod: 'card',
    status: 'active',
    autoPay: true,
    vendor: 'Amazon',
    tags: ['streaming', 'compras', 'anual'],
    createdAt: '2024-02-10',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId('REC'),
    name: 'Limpieza',
    description: 'Servicio de limpieza semanal',
    amount: 80.00,
    category: 'Hogar',
    subcategory: 'Limpieza',
    frequency: 'weekly',
    startDate: '2024-01-08',
    nextPayment: '2024-03-01',
    lastPayment: '2024-02-23',
    paymentMethod: 'cash',
    status: 'active',
    autoPay: false,
    vendor: 'Limpiezas Express',
    tags: ['hogar', 'limpieza', 'semanal'],
    createdAt: '2024-01-08',
    updatedAt: '2024-02-23'
  }
];

export const RecurringExpensesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<RecurringExpense | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'nextPayment' | 'frequency'>('nextPayment');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'transfer',
    status: 'active',
    vendor: '',
    notes: '',
    autoPay: false
  });

  const itemsPerPage = 6;

  // Cargar datos desde localStorage o usar datos por defecto
  const [expenses, setExpenses] = useState<RecurringExpense[]>(() => {
    try {
      const saved = localStorage.getItem('recurringExpenses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return getDefaultExpenses();
    } catch (error) {
      console.error('Error loading recurring expenses:', error);
      return getDefaultExpenses();
    }
  });

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Guardar en localStorage cuando cambien los gastos recurrentes
  useEffect(() => {
    localStorage.setItem('recurringExpenses', JSON.stringify(expenses));
  }, [expenses]);

  // Calcular estadísticas en tiempo real
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const activeExpenses = expenses.filter(exp => exp.status === 'active');
  const totalMonthly = activeExpenses.reduce((sum, exp) => {
    if (exp.frequency === 'monthly') return sum + exp.amount;
    if (exp.frequency === 'weekly') return sum + (exp.amount * 4);
    if (exp.frequency === 'annual') return sum + (exp.amount / 12);
    if (exp.frequency === 'quarterly') return sum + (exp.amount / 3);
    return sum + exp.amount;
  }, 0);

  const totalAnnual = totalMonthly * 12;

  const upcomingThisMonth = expenses.filter(exp => {
    if (exp.status !== 'active') return false;
    const nextDate = new Date(exp.nextPayment);
    return nextDate.getMonth() === currentMonth && nextDate.getFullYear() === currentYear;
  }).length;

  const upcomingThisWeek = expenses.filter(exp => {
    if (exp.status !== 'active') return false;
    const nextDate = new Date(exp.nextPayment);
    const today = new Date();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);
    return nextDate >= today && nextDate <= weekFromNow;
  }).length;

  const averagePerDay = totalMonthly / 30;

  // Calcular categorías para el gráfico
  const categoryMap = new Map<string, { amount: number; count: number }>();
  activeExpenses.forEach(exp => {
    let monthlyAmount = exp.amount;
    if (exp.frequency === 'weekly') monthlyAmount = exp.amount * 4;
    if (exp.frequency === 'annual') monthlyAmount = exp.amount / 12;
    if (exp.frequency === 'quarterly') monthlyAmount = exp.amount / 3;
    
    const existing = categoryMap.get(exp.category);
    if (existing) {
      existing.amount += monthlyAmount;
      existing.count += 1;
    } else {
      categoryMap.set(exp.category, { amount: monthlyAmount, count: 1 });
    }
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Vivienda': 'from-blue-500 to-blue-600',
      'Servicios': 'from-cyan-500 to-cyan-600',
      'Entretenimiento': 'from-purple-500 to-purple-600',
      'Salud': 'from-rose-500 to-rose-600',
      'Seguros': 'from-orange-500 to-orange-600',
      'Hogar': 'from-emerald-500 to-emerald-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Vivienda': <HomeIcon size={18} />,
      'Servicios': <Zap size={18} />,
      'Entretenimiento': <Film size={18} />,
      'Salud': <Heart size={18} />,
      'Seguros': <Shield size={18} />,
      'Hogar': <HomeIcon size={18} />
    };
    return icons[category] || <Tag size={18} />;
  };

  const totalCategoryAmount = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.amount, 0);
  
  // Datos para el gráfico de dona
  const pieChartData = Array.from(categoryMap.entries()).map(([name, data], idx) => ({
    name,
    value: data.amount,
    color: CHART_COLORS[idx % CHART_COLORS.length],
    count: data.count
  }));

  const allCategories = Array.from(categoryMap.entries()).map(([name, data], idx) => ({
    name,
    amount: data.amount,
    percentage: totalCategoryAmount > 0 ? (data.amount / totalCategoryAmount) * 100 : 0,
    count: data.count,
    color: getCategoryColor(name),
    icon: getCategoryIcon(name),
    chartColor: CHART_COLORS[idx % CHART_COLORS.length]
  })).sort((a, b) => b.amount - a.amount);

  // Solo las 3 categorías más usadas
  const topThreeCategories = allCategories.slice(0, 3);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todas' || expense.category === selectedCategory;
    const matchesFrequency = selectedFrequency === 'todos' || expense.frequency === selectedFrequency;
    const matchesStatus = selectedStatus === 'todos' || expense.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesFrequency && matchesStatus;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortBy === 'frequency') {
      const freqOrder: Record<string, number> = { daily: 1, weekly: 2, biweekly: 3, monthly: 4, quarterly: 5, semiannual: 6, annual: 7 };
      return sortOrder === 'asc'
        ? freqOrder[a.frequency] - freqOrder[b.frequency]
        : freqOrder[b.frequency] - freqOrder[a.frequency];
    } else {
      return sortOrder === 'asc'
        ? new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime()
        : new Date(b.nextPayment).getTime() - new Date(a.nextPayment).getTime();
    }
  });

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);
  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleCreateExpense = () => {
    const startDate = formData.startDate;
    const nextPayment = new Date(startDate);
    if (formData.frequency === 'monthly') nextPayment.setMonth(nextPayment.getMonth() + 1);
    if (formData.frequency === 'weekly') nextPayment.setDate(nextPayment.getDate() + 7);
    if (formData.frequency === 'annual') nextPayment.setFullYear(nextPayment.getFullYear() + 1);
    if (formData.frequency === 'quarterly') nextPayment.setMonth(nextPayment.getMonth() + 3);

    const newExpense: RecurringExpense = {
      id: generateUniqueId('REC'),
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      frequency: formData.frequency as RecurringExpense['frequency'],
      startDate: startDate,
      nextPayment: nextPayment.toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod as RecurringExpense['paymentMethod'],
      status: formData.status as RecurringExpense['status'],
      autoPay: formData.autoPay,
      vendor: formData.vendor || undefined,
      notes: formData.notes || undefined,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setExpenses(prev => [newExpense, ...prev]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      amount: '',
      category: '',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'transfer',
      status: 'active',
      vendor: '',
      notes: '',
      autoPay: false
    });
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este gasto recurrente?')) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const handleEditStatus = (expense: RecurringExpense) => {
    setSelectedExpense(expense);
    setNewStatus(expense.status);
    setShowEditStatusModal(true);
  };

  const handleUpdateStatus = () => {
    if (selectedExpense && newStatus && newStatus !== selectedExpense.status) {
      setExpenses(prev => 
        prev.map(exp => 
          exp.id === selectedExpense.id ? { ...exp, status: newStatus as RecurringExpense['status'] } : exp
        )
      );
    }
    setShowEditStatusModal(false);
    setSelectedExpense(null);
    setNewStatus('');
  };

  const resetData = () => {
    if (window.confirm('¿Esto restaurará los datos a los valores por defecto. ¿Continuar?')) {
      localStorage.removeItem('recurringExpenses');
      setExpenses(getDefaultExpenses());
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('todas');
    setSelectedFrequency('todos');
    setSelectedStatus('todos');
    setCurrentPage(1);
  };

  const getFrequencyLabel = (frequency: string) => {
    switch(frequency) {
      case 'daily': return 'Diario';
      case 'weekly': return 'Semanal';
      case 'biweekly': return 'Quincenal';
      case 'monthly': return 'Mensual';
      case 'quarterly': return 'Trimestral';
      case 'semiannual': return 'Semestral';
      case 'annual': return 'Anual';
      default: return frequency;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Play size={12} /> Activo</span>;
      case 'paused': return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Pause size={12} /> En pausa</span>;
      case 'cancelled': return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><StopCircle size={12} /> Cancelado</span>;
      case 'completed': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle size={12} /> Completado</span>;
      default: return null;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch(method) {
      case 'cash': return 'Efectivo';
      case 'card': return 'Tarjeta';
      case 'transfer': return 'Transferencia';
      case 'direct_debit': return 'Domiciliado';
      case 'check': return 'Cheque';
      default: return method;
    }
  };

  const getDaysUntilNext = (nextPayment: string) => {
    const today = new Date();
    const next = new Date(nextPayment);
    const diffTime = next.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const hasActiveFilters = searchTerm !== '' || 
    selectedCategory !== 'todas' || 
    selectedFrequency !== 'todos' || 
    selectedStatus !== 'todos';

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
              <Repeat size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Gastos Recurrentes</h1>
              <p className="text-white/50 text-sm mt-1">Gestiona tus suscripciones y pagos periódicos</p>
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
              <Repeat size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300"
            >
              <Plus size={20} />
              <span className="hidden sm:inline font-medium">Nuevo Gasto</span>
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
              <p className="text-white/50 text-sm font-medium">Total Mensual</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{formatCurrency(totalMonthly)}</p>
              <p className="text-white/30 text-xs mt-1">Gastos fijos mensuales</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <DollarSign size={24} className="text-[#F05984]" />
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
              <p className="text-white/50 text-sm font-medium">Total Anual</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{formatCurrency(totalAnnual)}</p>
              <p className="text-white/30 text-xs mt-1">{activeExpenses.length} gastos activos</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <Calendar size={24} className="text-[#F05984]" />
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
              <p className="text-white/50 text-sm font-medium">Próximos pagos</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1 tracking-tight">{upcomingThisMonth}</p>
              <p className="text-white/30 text-xs mt-1">{upcomingThisWeek} esta semana</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Clock size={24} className="text-yellow-400" />
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
              <p className="text-white/50 text-sm font-medium">Promedio diario</p>
              <p className="text-2xl font-bold text-green-400 mt-1 tracking-tight">{formatCurrency(averagePerDay)}</p>
              <p className="text-white/30 text-xs mt-1">Gasto diario promedio</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <Activity size={24} className="text-green-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Distribución por Categoría - Solo 3 más usadas */}
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
                  formatter={(value: number) => [formatCurrency(value), 'Monto mensual']}
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

        {/* Top 3 Categorías más usadas */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Tag size={18} className="text-[#F05984]" />
            Top 3 Categorías
          </h3>
          <div className="space-y-4">
            {topThreeCategories.length > 0 ? (
              topThreeCategories.map((cat, index) => (
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
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/50 text-xs">{cat.percentage.toFixed(1)}%</span>
                      <span className="text-white text-sm font-semibold">{formatCurrency(cat.amount)}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                    />
                  </div>
                  <p className="text-white/30 text-[10px] mt-1">{cat.count} gasto(s)</p>
                </motion.div>
              ))
            ) : (
              <p className="text-white/40 text-center py-6 text-sm">No hay datos de categorías</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filters and Search - Simplificado con botón de filtros */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Buscar gastos recurrentes..."
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

          {/* Panel de filtros desplegable */}
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
                    <label className="text-white/60 text-xs mb-1 block">Categoría</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todas" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todas las categorías</option>
                      {allCategories.map(cat => (
                        <option key={cat.name} value={cat.name} style={{ backgroundColor: '#1a0f14', color: 'white' }}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Frecuencia</label>
                    <select
                      value={selectedFrequency}
                      onChange={(e) => setSelectedFrequency(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todas las frecuencias</option>
                      <option value="daily" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Diario</option>
                      <option value="weekly" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Semanal</option>
                      <option value="biweekly" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Quincenal</option>
                      <option value="monthly" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Mensual</option>
                      <option value="quarterly" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Trimestral</option>
                      <option value="semiannual" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Semestral</option>
                      <option value="annual" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Anual</option>
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
                      <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos los estados</option>
                      <option value="active" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Activos</option>
                      <option value="paused" style={{ backgroundColor: '#1a0f14', color: 'white' }}>En pausa</option>
                      <option value="cancelled" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Cancelados</option>
                      <option value="completed" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Completados</option>
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
              <span>Monto</span>
              {sortBy === 'amount' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            <button
              onClick={() => { setSortBy('frequency'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'frequency' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <Repeat size={14} />
              <span>Frecuencia</span>
              {sortBy === 'frequency' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            <button
              onClick={() => { setSortBy('nextPayment'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'nextPayment' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <Calendar size={14} />
              <span>Próximo pago</span>
              {sortBy === 'nextPayment' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
          </div>
          <span className="text-white/40 text-sm">{filteredExpenses.length} resultados</span>
        </div>

        {/* Estado Vacío */}
        {filteredExpenses.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-4"
          >
            <div className="p-4 bg-white/10 rounded-full mb-4">
              <Repeat size={48} className="text-white/30" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No hay gastos recurrentes</h3>
            <p className="text-white/40 text-sm text-center max-w-md">
              No se encontraron gastos recurrentes con los filtros actuales.
              Prueba a ajustar los filtros o crea un nuevo gasto recurrente.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              <span>Crear nuevo gasto</span>
            </motion.button>
          </motion.div>
        )}

        {/* Grid View Mejorado */}
        {filteredExpenses.length > 0 && viewMode === 'grid' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {paginatedExpenses.map((expense, index) => {
                const daysUntil = getDaysUntilNext(expense.nextPayment);
                const isUrgent = daysUntil <= 3 && expense.status === 'active';
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border transition-all duration-300 cursor-pointer hover:shadow-xl ${
                      isUrgent ? 'border-red-500/50 shadow-red-500/20' : 'border-white/10 hover:border-[#F05984]/50'
                    }`}
                  >
                    {isUrgent && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full blur-2xl" />
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-gradient-to-r ${getCategoryColor(expense.category)} bg-opacity-20 shadow-lg`}>
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{expense.name}</h3>
                          <p className="text-white/40 text-xs">{expense.vendor || expense.category}</p>
                        </div>
                      </div>
                      {getStatusBadge(expense.status)}
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Monto:</span>
                        <span className="text-white font-bold text-lg">{formatCurrency(expense.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Frecuencia:</span>
                        <span className="text-white">{getFrequencyLabel(expense.frequency)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Próximo pago:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-white">{formatDate(expense.nextPayment)}</span>
                          {isUrgent && (
                            <span className="text-red-400 text-xs font-medium animate-pulse">({daysUntil} días)</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Método:</span>
                        <span className="text-white">{getPaymentMethodLabel(expense.paymentMethod)}</span>
                      </div>
                    </div>
                    {expense.autoPay && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full w-fit">
                        <Zap size={12} /> Pago automático
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditStatus(expense)}
                        className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400"
                      >
                        <Edit size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteExpense(expense.id)}
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
        {filteredExpenses.length > 0 && viewMode === 'list' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 space-y-2"
          >
            <AnimatePresence>
              {paginatedExpenses.map((expense, index) => {
                const daysUntil = getDaysUntilNext(expense.nextPayment);
                const isUrgent = daysUntil <= 3 && expense.status === 'active';
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.01 }}
                    className={`bg-gradient-to-r from-white/5 to-white/0 rounded-lg p-3 border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                      isUrgent ? 'border-red-500/30' : 'border-white/10 hover:border-[#F05984]/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(expense.category)} bg-opacity-20`}>
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">{expense.name}</h3>
                          {getStatusBadge(expense.status)}
                        </div>
                        <p className="text-white/40 text-xs">{expense.vendor || expense.category}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-white/50 text-xs">Monto</p>
                          <p className="text-white text-sm font-bold">{formatCurrency(expense.amount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-xs">Frecuencia</p>
                          <p className="text-white text-sm">{getFrequencyLabel(expense.frequency)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-xs">Próximo pago</p>
                          <div className="flex items-center gap-1">
                            <span className="text-white text-sm">{formatDate(expense.nextPayment)}</span>
                            {isUrgent && (
                              <span className="text-red-400 text-xs font-medium animate-pulse">({daysUntil} días)</span>
                            )}
                          </div>
                        </div>
                        {expense.autoPay && (
                          <div className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                            <Zap size={12} className="inline mr-1" /> Auto
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditStatus(expense)}
                          className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteExpense(expense.id)}
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
        {filteredExpenses.length > 0 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-white/40 text-sm">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} de {filteredExpenses.length} gastos
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

      {/* Modal para crear nuevo gasto recurrente - Mejorado con animación */}
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
              className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-lg shadow-lg">
                    <Repeat size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Nuevo Gasto Recurrente</h2>
                    <p className="text-white/40 text-sm">Completa los campos para registrar un nuevo gasto recurrente</p>
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
                <form onSubmit={(e) => { e.preventDefault(); handleCreateExpense(); }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Nombre *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Ej: Netflix" required />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Monto *</label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="0.00" required />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Categoría *</label>
                      <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }} required>
                        <option value="" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Seleccionar categoría</option>
                        {allCategories.map(cat => <option key={cat.name} value={cat.name} style={{ backgroundColor: '#1a0f14', color: 'white' }}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Frecuencia *</label>
                      <select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="daily">Diario</option><option value="weekly">Semanal</option><option value="biweekly">Quincenal</option><option value="monthly">Mensual</option><option value="quarterly">Trimestral</option><option value="semiannual">Semestral</option><option value="annual">Anual</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Fecha de inicio *</label>
                      <div className="relative">
                        <CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Método de pago</label>
                      <select value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="cash">Efectivo</option><option value="card">Tarjeta</option><option value="transfer">Transferencia</option><option value="direct_debit">Domiciliado</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Proveedor</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input type="text" value={formData.vendor} onChange={(e) => setFormData({...formData, vendor: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Nombre del proveedor" />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Estado</label>
                      <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="active">Activo</option><option value="paused">En pausa</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Notas adicionales</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Notas adicionales..." />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="autoPay" checked={formData.autoPay} onChange={(e) => setFormData({...formData, autoPay: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                    <label htmlFor="autoPay" className="text-white text-sm">Pago automático</label>
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
                      <span>Guardar Gasto</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para editar estado - Mejorado con animación */}
      <AnimatePresence>
        {showEditStatusModal && selectedExpense && (
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
              className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Edit size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Editar Estado</h2>
                    <p className="text-white/40 text-sm">Cambia el estado del gasto recurrente</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditStatusModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Gasto</label>
                    <p className="text-white font-medium">{selectedExpense.name}</p>
                    <p className="text-white/40 text-sm mt-1">{formatCurrency(selectedExpense.amount)}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Nuevo Estado</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="active">Activo</option><option value="paused">En pausa</option><option value="cancelled">Cancelado</option><option value="completed">Completado</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowEditStatusModal(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpdateStatus}
                      className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all shadow-lg"
                    >
                      Actualizar Estado
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};