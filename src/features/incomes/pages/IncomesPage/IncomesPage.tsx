import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  Search,
  Plus,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  DollarSign,
  CreditCard,
  Wallet,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Printer,
  Tag,
  Briefcase,
  Laptop,
  ShoppingBag,
  Home as HomeIcon,
  Users,
  ChevronDown,
  ChevronUp,
  XCircle as XCircleIcon,
  X,
  Save,
  User,
  Hash,
  Calendar as CalendarIcon,
  Target,
  Trash2,
  Edit,
  PieChart,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';

interface Income {
  id: string;
  description: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia' | 'cheque' | 'otro';
  status: 'completado' | 'pendiente' | 'programado' | 'cancelado';
  client?: string;
  clientId?: string;
  project?: string;
  invoice?: string;
  notes?: string;
  attachments?: number;
  recurring: boolean;
  recurringFrequency?: 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'anual';
  tax: number;
  tags: string[];
}

interface CategorySummary {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  count: number;
  chartColor: string;
}

// Función para generar ID único
const generateUniqueId = () => {
  return `INC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Datos iniciales por defecto con IDs únicos
const getDefaultIncomes = (): Income[] => [
  {
    id: generateUniqueId(),
    description: 'Pago de nómina - Febrero',
    amount: 2500.00,
    category: 'Salario',
    subcategory: 'Salario mensual',
    date: '2024-02-23',
    paymentMethod: 'transferencia',
    status: 'completado',
    client: 'Tech Solutions S.L.',
    clientId: 'CLI-001',
    project: 'Desarrollo Web',
    invoice: 'INV-2024-001',
    notes: 'Pago correspondiente a nómina de febrero',
    attachments: 2,
    recurring: true,
    recurringFrequency: 'mensual',
    tax: 0.15,
    tags: ['salario', 'mensual', 'fijo']
  },
  {
    id: generateUniqueId(),
    description: 'Pago de cliente - Proyecto Web',
    amount: 3500.00,
    category: 'Servicios profesionales',
    subcategory: 'Desarrollo web',
    date: '2024-02-22',
    paymentMethod: 'transferencia',
    status: 'completado',
    client: 'María González',
    clientId: 'CLI-002',
    project: 'Rediseño Web',
    invoice: 'INV-2024-002',
    attachments: 3,
    recurring: false,
    tax: 0.21,
    tags: ['servicios', 'proyecto']
  },
  {
    id: generateUniqueId(),
    description: 'Venta de productos',
    amount: 1250.50,
    category: 'Ventas',
    subcategory: 'Productos digitales',
    date: '2024-02-21',
    paymentMethod: 'tarjeta',
    status: 'completado',
    client: 'Juan Pérez',
    clientId: 'CLI-003',
    invoice: 'INV-2024-003',
    attachments: 1,
    recurring: false,
    tax: 0.21,
    tags: ['ventas', 'digital']
  },
  {
    id: generateUniqueId(),
    description: 'Pago de alquiler oficina',
    amount: 1200.00,
    category: 'Ingresos pasivos',
    subcategory: 'Alquiler',
    date: '2024-02-20',
    paymentMethod: 'transferencia',
    status: 'completado',
    client: 'Empresa ABC',
    clientId: 'CLI-004',
    invoice: 'INV-2024-004',
    attachments: 0,
    recurring: true,
    recurringFrequency: 'mensual',
    tax: 0.15,
    tags: ['alquiler', 'pasivo']
  },
  {
    id: generateUniqueId(),
    description: 'Consultoría empresarial',
    amount: 850.00,
    category: 'Consultoría',
    subcategory: 'Consultoría financiera',
    date: '2024-02-19',
    paymentMethod: 'transferencia',
    status: 'completado',
    client: 'Ana Martínez',
    clientId: 'CLI-005',
    invoice: 'INV-2024-005',
    attachments: 1,
    recurring: false,
    tax: 0.21,
    tags: ['consultoría']
  },
  {
    id: generateUniqueId(),
    description: 'Pago pendiente - Proyecto App',
    amount: 2340.00,
    category: 'Servicios profesionales',
    date: '2024-03-01',
    paymentMethod: 'transferencia',
    status: 'pendiente',
    client: 'Roberto Sánchez',
    clientId: 'CLI-006',
    project: 'Desarrollo App',
    invoice: 'INV-2024-006',
    attachments: 0,
    recurring: false,
    tax: 0.21,
    tags: ['servicios', 'pendiente']
  },
  {
    id: generateUniqueId(),
    description: 'Membresía Premium',
    amount: 1250.00,
    category: 'Suscripciones',
    subcategory: 'Membresía anual',
    date: '2024-03-15',
    paymentMethod: 'tarjeta',
    status: 'programado',
    client: 'Laura Torres',
    clientId: 'CLI-007',
    invoice: 'INV-2024-007',
    attachments: 0,
    recurring: true,
    recurringFrequency: 'anual',
    tax: 0.21,
    tags: ['suscripción']
  },
  {
    id: generateUniqueId(),
    description: 'Venta en efectivo',
    amount: 500.00,
    category: 'Ventas',
    date: '2024-02-18',
    paymentMethod: 'efectivo',
    status: 'completado',
    client: 'Cliente Anónimo',
    invoice: 'INV-2024-008',
    attachments: 0,
    recurring: false,
    tax: 0.21,
    tags: ['ventas', 'efectivo']
  },
  {
    id: generateUniqueId(),
    description: 'Pago con cheque - Atrasado',
    amount: 750.00,
    category: 'Servicios profesionales',
    date: '2024-02-17',
    paymentMethod: 'cheque',
    status: 'pendiente',
    client: 'Empresa XYZ',
    clientId: 'CLI-009',
    invoice: 'INV-2024-009',
    attachments: 1,
    recurring: false,
    tax: 0.21,
    tags: ['servicios', 'cheque']
  },
  {
    id: generateUniqueId(),
    description: 'Bono anual',
    amount: 3000.00,
    category: 'Salario',
    date: '2024-02-16',
    paymentMethod: 'transferencia',
    status: 'completado',
    client: 'Tech Solutions S.L.',
    clientId: 'CLI-001',
    invoice: 'INV-2024-010',
    attachments: 0,
    recurring: false,
    tax: 0.15,
    tags: ['salario', 'bono']
  },
  {
    id: generateUniqueId(),
    description: 'Pago de nómina - Marzo',
    amount: 2500.00,
    category: 'Salario',
    date: '2024-03-25',
    paymentMethod: 'transferencia',
    status: 'programado',
    client: 'Tech Solutions S.L.',
    invoice: 'INV-2024-011',
    attachments: 0,
    recurring: true,
    tax: 0.15,
    tags: ['salario']
  },
  {
    id: generateUniqueId(),
    description: 'Dividendos',
    amount: 500.00,
    category: 'Ingresos pasivos',
    date: '2023-12-15',
    paymentMethod: 'transferencia',
    status: 'completado',
    client: 'Inversiones',
    invoice: 'INV-2023-012',
    attachments: 0,
    recurring: false,
    tax: 0.19,
    tags: ['dividendos']
  }
];

// Colores para el gráfico de pastel
const CHART_COLORS = ['#F05984', '#BC455F', '#6E4068', '#321D28', '#2DD4BF', '#F59E0B', '#10B981', '#6366F1'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const IncomesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('todos');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('este-mes');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'transferencia',
    status: 'completado',
    client: '',
    invoice: '',
    notes: ''
  });

  const itemsPerPage = 6;

  // Cargar datos desde localStorage o usar datos por defecto
  const [incomes, setIncomes] = useState<Income[]>(() => {
    try {
      const saved = localStorage.getItem('incomes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return getDefaultIncomes();
    } catch (error) {
      console.error('Error loading incomes:', error);
      return getDefaultIncomes();
    }
  });

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Guardar en localStorage cuando cambien los ingresos
  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }, [incomes]);

  // Obtener la fecha actual
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Calcular estadísticas
  const yearlyIncomes = incomes.filter(inc => {
    const incDate = new Date(inc.date);
    return inc.status === 'completado' && incDate.getFullYear() === currentYear;
  });
  const totalYearlyIncome = yearlyIncomes.reduce((sum, inc) => sum + inc.amount, 0);

  const monthlyIncomes = incomes.filter(inc => {
    const incDate = new Date(inc.date);
    return inc.status === 'completado' && 
           incDate.getMonth() === currentMonth && 
           incDate.getFullYear() === currentYear;
  });
  const totalMonthlyIncome = monthlyIncomes.reduce((sum, inc) => sum + inc.amount, 0);

  const pendingIncomes = incomes.filter(inc => inc.status === 'pendiente');
  const totalPending = pendingIncomes.reduce((sum, inc) => sum + inc.amount, 0);

  const monthlyGoal = 5000;
  const monthlyProgress = (totalMonthlyIncome / monthlyGoal) * 100;

  const completedIncomes = incomes.filter(inc => inc.status === 'completado');
  const totalCompletedAmount = completedIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  const averageTicket = completedIncomes.length > 0 ? totalCompletedAmount / completedIncomes.length : 0;

  // Calcular categorías para el gráfico
  const categoryMap = new Map<string, { amount: number; count: number; color: string }>();
  let colorIndex = 0;
  
  completedIncomes.forEach(inc => {
    const existing = categoryMap.get(inc.category);
    if (existing) {
      existing.amount += inc.amount;
      existing.count += 1;
    } else {
      categoryMap.set(inc.category, { 
        amount: inc.amount, 
        count: 1, 
        color: CHART_COLORS[colorIndex % CHART_COLORS.length] 
      });
      colorIndex++;
    }
  });

  const pieChartData = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    value: data.amount,
    color: data.color,
    count: data.count
  }));

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Salario': 'from-green-500 to-green-600',
      'Servicios profesionales': 'from-blue-500 to-blue-600',
      'Ventas': 'from-purple-500 to-purple-600',
      'Ingresos pasivos': 'from-orange-500 to-orange-600',
      'Consultoría': 'from-pink-500 to-pink-600',
      'Suscripciones': 'from-indigo-500 to-indigo-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Salario': <Briefcase size={16} />,
      'Servicios profesionales': <Laptop size={16} />,
      'Ventas': <ShoppingBag size={16} />,
      'Ingresos pasivos': <HomeIcon size={16} />,
      'Consultoría': <Users size={16} />,
      'Suscripciones': <CreditCard size={16} />
    };
    return icons[category] || <Tag size={16} />;
  };

  const categories: CategorySummary[] = Array.from(categoryMap.entries()).map(([name, data], idx) => ({
    name,
    amount: data.amount,
    percentage: totalCompletedAmount > 0 ? (data.amount / totalCompletedAmount) * 100 : 0,
    color: getCategoryColor(name),
    icon: getCategoryIcon(name),
    count: data.count,
    chartColor: CHART_COLORS[idx % CHART_COLORS.length]
  })).sort((a, b) => b.amount - a.amount);

  const filterByPeriod = (date: string, period: string): boolean => {
    const incomeDate = new Date(date);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    switch(period) {
      case 'este-mes':
        return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
      case 'este-semana':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        return incomeDate >= startOfWeek && incomeDate <= endOfWeek;
      case 'este-ano':
        return incomeDate.getFullYear() === currentYear;
      default:
        return true;
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('todas');
    setSelectedStatus('todos');
    setSelectedPaymentMethod('todos');
    setSelectedPeriod('este-mes');
    setCurrentPage(1);
  };

  const handleCreateIncome = () => {
    const newIncome: Income = {
      id: generateUniqueId(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod as any,
      status: formData.status as any,
      client: formData.client || undefined,
      invoice: formData.invoice || undefined,
      notes: formData.notes || undefined,
      recurring: false,
      tax: 0.21,
      tags: []
    };

    setIncomes(prevIncomes => [newIncome, ...prevIncomes]);
    setShowCreateModal(false);
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'transferencia',
      status: 'completado',
      client: '',
      invoice: '',
      notes: ''
    });
  };

  const handleDeleteIncome = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este ingreso?')) {
      setIncomes(prevIncomes => prevIncomes.filter(inc => inc.id !== id));
    }
  };

  const handleEditStatus = (income: Income) => {
    setSelectedIncome(income);
    setNewStatus(income.status);
    setShowEditStatusModal(true);
  };

  const handleUpdateStatus = () => {
    if (selectedIncome && newStatus && newStatus !== selectedIncome.status) {
      setIncomes(prevIncomes => 
        prevIncomes.map(inc => 
          inc.id === selectedIncome.id ? { ...inc, status: newStatus as any } : inc
        )
      );
    }
    setShowEditStatusModal(false);
    setSelectedIncome(null);
    setNewStatus('');
  };

  const resetData = () => {
    if (window.confirm('¿Esto restaurará los datos a los valores por defecto. ¿Continuar?')) {
      localStorage.removeItem('incomes');
      setIncomes(getDefaultIncomes());
    }
  };

  const filteredIncomes = incomes.filter(income => {
    const matchesSearch = income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todas' || income.category === selectedCategory;
    const matchesStatus = selectedStatus === 'todos' || income.status === selectedStatus;
    const matchesPaymentMethod = selectedPaymentMethod === 'todos' || income.paymentMethod === selectedPaymentMethod;
    const matchesPeriod = filterByPeriod(income.date, selectedPeriod);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPaymentMethod && matchesPeriod;
  });

  const sortedIncomes = [...filteredIncomes].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' 
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'amount') {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    } else {
      return sortOrder === 'desc'
        ? b.category.localeCompare(a.category)
        : a.category.localeCompare(b.category);
    }
  });

  const totalPages = Math.ceil(sortedIncomes.length / itemsPerPage);
  const paginatedIncomes = sortedIncomes.slice(
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completado':
        return 'bg-green-500/20 text-green-400';
      case 'pendiente':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'programado':
        return 'bg-blue-500/20 text-blue-400';
      case 'cancelado':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completado':
        return <CheckCircle size={14} />;
      case 'pendiente':
        return <Clock size={14} />;
      case 'programado':
        return <Calendar size={14} />;
      case 'cancelado':
        return <XCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch(method) {
      case 'efectivo':
        return 'Efectivo';
      case 'tarjeta':
        return 'Tarjeta';
      case 'transferencia':
        return 'Transferencia';
      case 'cheque':
        return 'Cheque';
      case 'otro':
        return 'Otro';
      default:
        return method;
    }
  };

  const hasActiveFilters = searchTerm !== '' || 
    selectedCategory !== 'todas' || 
    selectedStatus !== 'todos' || 
    selectedPaymentMethod !== 'todos' ||
    selectedPeriod !== 'este-mes';

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
          <div className="h-64 bg-white/10 rounded-xl" />
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
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Ingresos</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">
              {incomes.length} registros
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Gestiona y controla todos tus ingresos
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <FileText size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <BarChart3 size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Nuevo Ingreso</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetData}
            className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors text-yellow-400 hover:text-yellow-300"
            title="Restaurar datos por defecto"
          >
            <RefreshCw size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards con gradientes mejorados */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
          className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Ingresos del Año</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalYearlyIncome)}</p>
              <p className="text-white/40 text-xs mt-1">{currentYear}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <Calendar size={20} className="text-[#F05984]" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Este mes</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalMonthlyIncome)}</p>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(monthlyProgress, 100)}%` }}
                />
              </div>
              <p className="text-white/40 text-xs mt-1">{monthlyProgress.toFixed(0)}% de meta mensual</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <TrendingUp size={20} className="text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Pendiente por cobrar</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{formatCurrency(totalPending)}</p>
              <p className="text-white/40 text-xs mt-1">{pendingIncomes.length} facturas pendientes</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Clock size={20} className="text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Ticket Promedio</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(averageTicket)}</p>
              <p className="text-white/40 text-xs mt-1">{completedIncomes.length} transacciones</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Target size={20} className="text-blue-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Gráfico de Pastel y Categorías */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-4">Distribución de Ingresos</h3>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
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
                  contentStyle={{
                    backgroundColor: '#1a0f14',
                    border: '1px solid #BC455F',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Monto']}
                  labelStyle={{ color: 'white' }}
                />
                <Legend 
                  formatter={(value) => <span className="text-white/80 text-xs">{value}</span>}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-white/40 text-center">No hay datos de ingresos completados</p>
            </div>
          )}
        </div>

        {/* Categories Summary */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-4">Ingresos por categoría</h3>
          {categories.length > 0 ? (
            <div className="space-y-4">
              {categories.map((cat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>
                        {cat.icon}
                      </div>
                      <span className="text-white text-sm font-medium">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/60 text-xs">{cat.percentage.toFixed(1)}%</span>
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
                  <p className="text-white/40 text-xs mt-1">{cat.count} transacciones</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-center py-8">No hay datos de ingresos completados</p>
          )}
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Buscar por descripción, cliente o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] focus:ring-1 focus:ring-[#F05984] transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
              >
                <option value="este-mes" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Este mes</option>
                <option value="este-semana" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Esta semana</option>
                <option value="este-ano" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Este año</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Filter size={18} />
              </motion.button>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 text-sm"
                >
                  <XCircleIcon size={16} />
                  <span>Limpiar filtros</span>
                </motion.button>
              )}
            </div>
          </div>

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
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name} style={{ backgroundColor: '#1a0f14', color: 'white' }}>{cat.name}</option>
                      ))}
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
                      <option value="completado" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Completado</option>
                      <option value="pendiente" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Pendiente</option>
                      <option value="programado" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Programado</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Método de pago</label>
                    <select
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos los métodos</option>
                      <option value="efectivo" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Efectivo</option>
                      <option value="tarjeta" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Tarjeta</option>
                      <option value="transferencia" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Transferencia</option>
                      <option value="cheque" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Cheque</option>
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
              onClick={() => {
                setSortBy('date');
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'date' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Calendar size={14} />
              <span>Fecha</span>
              {sortBy === 'date' && (
                sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('amount');
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'amount' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <DollarSign size={14} />
              <span>Monto</span>
              {sortBy === 'amount' && (
                sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('category');
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'category' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Tag size={14} />
              <span>Categoría</span>
              {sortBy === 'category' && (
                sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />
              )}
            </button>
          </div>
          <span className="text-white/40 text-sm">
            {filteredIncomes.length} resultados
          </span>
        </div>

        {/* Table View con animaciones */}
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="overflow-x-auto"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">ID</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Descripción</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Categoría</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Cliente</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Fecha</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Método</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Estado</th>
                    <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Monto</th>
                    <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedIncomes.map((income, index) => (
                    <motion.tr
                      key={income.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <span className="text-white/40 text-xs font-mono">{income.id.slice(-8)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium">{income.description}</p>
                          {income.notes && (
                            <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{income.notes.substring(0, 40)}...</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm">{income.category}</span>
                          {income.recurring && (
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                              recurrente
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {income.client ? (
                          <div>
                            <p className="text-white text-sm">{income.client}</p>
                            <p className="text-white/40 text-xs">{income.clientId}</p>
                          </div>
                        ) : (
                          <span className="text-white/40 text-sm">-</span>
                        )}
                       </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-white/40" />
                          <span className="text-white text-sm">{formatDate(income.date)}</span>
                        </div>
                       </td>
                      <td className="py-3 px-4">
                        <span className="text-white text-sm capitalize">{getPaymentMethodLabel(income.paymentMethod)}</span>
                       </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(income.status)}`}>
                          {getStatusIcon(income.status)}
                          {income.status}
                        </span>
                       </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-white font-bold">{formatCurrency(income.amount)}</span>
                       </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditStatus(income)}
                            className="p-1.5 rounded-lg hover:bg-blue-500/20 transition-all text-blue-400"
                            title="Editar estado"
                          >
                            <Edit size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteIncome(income.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 transition-all text-red-400"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                       </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {paginatedIncomes.map((income, index) => (
                <motion.div
                  key={income.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#F05984]/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white/40 text-xs font-mono">{income.id.slice(-8)}</p>
                      <h3 className="text-white font-medium mt-1">{income.description}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(income.status)}`}>
                      {getStatusIcon(income.status)}
                      {income.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Categoría:</span>
                      <span className="text-white">{income.category}</span>
                    </div>
                    {income.client && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Cliente:</span>
                        <span className="text-white">{income.client}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Fecha:</span>
                      <span className="text-white">{formatDate(income.date)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Método:</span>
                      <span className="text-white capitalize">{getPaymentMethodLabel(income.paymentMethod)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-lg font-bold text-white">{formatCurrency(income.amount)}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditStatus(income)}
                        className="p-1.5 rounded-lg hover:bg-blue-500/20 transition-all text-blue-400"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteIncome(income.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 transition-all text-red-400"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>

                  {income.tags && income.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {income.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredIncomes.length)} de {filteredIncomes.length} ingresos
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
      </motion.div>

      {/* Modal para crear nuevo ingreso - Mejorado */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-lg">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Nuevo Ingreso</h2>
                    <p className="text-white/40 text-sm">Completa los campos para registrar un nuevo ingreso</p>
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
                <form onSubmit={(e) => { e.preventDefault(); handleCreateIncome(); }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Descripción *</label>
                      <div className="relative">
                        <FileText size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] focus:ring-1 focus:ring-[#F05984] transition-all"
                          placeholder="Ej: Pago de nómina"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Monto *</label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] focus:ring-1 focus:ring-[#F05984] transition-all"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Categoría *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                        required
                      >
                        <option value="" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Seleccionar categoría</option>
                        {categories.map(cat => (
                          <option key={cat.name} value={cat.name} style={{ backgroundColor: '#1a0f14', color: 'white' }}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Fecha *</label>
                      <div className="relative">
                        <CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Método de pago</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                      >
                        <option value="efectivo" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Efectivo</option>
                        <option value="tarjeta" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Tarjeta</option>
                        <option value="transferencia" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Transferencia</option>
                        <option value="cheque" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Cheque</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Estado</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                      >
                        <option value="completado" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Completado</option>
                        <option value="pendiente" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Pendiente</option>
                        <option value="programado" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Programado</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Cliente / Empresa</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          value={formData.client}
                          onChange={(e) => setFormData({...formData, client: e.target.value})}
                          className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                          placeholder="Nombre del cliente"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Factura / Referencia</label>
                      <div className="relative">
                        <Hash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          value={formData.invoice}
                          onChange={(e) => setFormData({...formData, invoice: e.target.value})}
                          className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                          placeholder="INV-2024-001"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Notas adicionales</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                      placeholder="Notas adicionales sobre este ingreso..."
                    />
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
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium"
                    >
                      <Save size={18} />
                      <span>Guardar Ingreso</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para editar estado */}
      <AnimatePresence>
        {showEditStatusModal && selectedIncome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
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
                    <p className="text-white/40 text-sm">Cambia el estado del ingreso</p>
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
                    <label className="text-white/60 text-sm mb-1.5 block">Ingreso</label>
                    <p className="text-white font-medium">{selectedIncome.description}</p>
                    <p className="text-white/40 text-sm mt-1">{formatCurrency(selectedIncome.amount)}</p>
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Nuevo Estado</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="completado" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Completado</option>
                      <option value="pendiente" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Pendiente</option>
                      <option value="programado" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Programado</option>
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
                      className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all"
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
