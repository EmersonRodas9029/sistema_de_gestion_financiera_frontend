import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingDown, 
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
  Home as HomeIcon,
  ChevronDown,
  ChevronUp,
  Utensils,
  Zap,
  Car,
  Heart,
  ShoppingBag,
  Shield,
  Trash2,
  Edit,
  X,
  Save,
  User,
  Hash,
  Calendar as CalendarIcon,
  Target,
  Briefcase,
  Laptop,
  Users,
  Home,
  Film,
  Activity
} from 'lucide-react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia' | 'cheque' | 'otro';
  status: 'completado' | 'pendiente' | 'programado' | 'cancelado';
  vendor?: string;
  vendorId?: string;
  project?: string;
  invoice?: string;
  notes?: string;
  attachments?: number;
  recurring: boolean;
  recurringFrequency?: 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'anual';
  tax: number;
  deductible: boolean;
  tags: string[];
  warranty?: string;
  receipt?: boolean;
}

interface CategorySummary {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  count: number;
  deductible: boolean;
}

// Función para generar ID único
const generateUniqueId = () => {
  return `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Datos iniciales por defecto
const getDefaultExpenses = (): Expense[] => [
  {
    id: generateUniqueId(),
    description: 'Supermercado Mensual',
    amount: 350.75,
    category: 'Alimentación',
    subcategory: 'Supermercado',
    date: '2024-02-23',
    paymentMethod: 'tarjeta',
    status: 'completado',
    vendor: 'Mercadona',
    vendorId: 'VEN-001',
    invoice: 'FAC-2024-001',
    notes: 'Compra mensual de alimentos',
    attachments: 1,
    recurring: true,
    recurringFrequency: 'mensual',
    tax: 0.10,
    deductible: false,
    tags: ['alimentación', 'hogar', 'mensual'],
    receipt: true
  },
  {
    id: generateUniqueId(),
    description: 'Pago de alquiler',
    amount: 1200.00,
    category: 'Vivienda',
    subcategory: 'Alquiler',
    date: '2024-02-22',
    paymentMethod: 'transferencia',
    status: 'completado',
    vendor: 'Inmobiliaria Pérez',
    vendorId: 'VEN-002',
    invoice: 'FAC-2024-002',
    notes: 'Alquiler del mes de febrero',
    attachments: 2,
    recurring: true,
    recurringFrequency: 'mensual',
    tax: 0.21,
    deductible: true,
    tags: ['vivienda', 'alquiler', 'fijo'],
    receipt: true
  },
  {
    id: generateUniqueId(),
    description: 'Electricidad',
    amount: 85.50,
    category: 'Servicios',
    subcategory: 'Electricidad',
    date: '2024-02-21',
    paymentMethod: 'transferencia',
    status: 'completado',
    vendor: 'Endesa',
    vendorId: 'VEN-003',
    invoice: 'FAC-2024-003',
    notes: 'Factura de luz febrero',
    attachments: 1,
    recurring: true,
    recurringFrequency: 'mensual',
    tax: 0.21,
    deductible: true,
    tags: ['servicios', 'electricidad', 'hogar'],
    receipt: true
  },
  {
    id: generateUniqueId(),
    description: 'Internet y telefonía',
    amount: 65.99,
    category: 'Servicios',
    subcategory: 'Internet',
    date: '2024-02-20',
    paymentMethod: 'tarjeta',
    status: 'completado',
    vendor: 'Movistar',
    vendorId: 'VEN-004',
    invoice: 'FAC-2024-004',
    notes: 'Fibra + móvil',
    attachments: 1,
    recurring: true,
    recurringFrequency: 'mensual',
    tax: 0.21,
    deductible: true,
    tags: ['internet', 'telefonía', 'hogar'],
    receipt: true
  },
  {
    id: generateUniqueId(),
    description: 'Gasolina',
    amount: 65.00,
    category: 'Transporte',
    subcategory: 'Combustible',
    date: '2024-02-19',
    paymentMethod: 'tarjeta',
    status: 'completado',
    vendor: 'Repsol',
    vendorId: 'VEN-005',
    notes: 'Llenar depósito',
    attachments: 0,
    recurring: false,
    tax: 0.21,
    deductible: false,
    tags: ['transporte', 'combustible', 'coche'],
    receipt: true
  },
  {
    id: generateUniqueId(),
    description: 'Cena restaurante',
    amount: 45.80,
    category: 'Ocio',
    subcategory: 'Restaurantes',
    date: '2024-02-18',
    paymentMethod: 'tarjeta',
    status: 'completado',
    vendor: 'La Tagliatella',
    notes: 'Cena familiar',
    attachments: 0,
    recurring: false,
    tax: 0.10,
    deductible: false,
    tags: ['ocio', 'restaurante', 'familia'],
    receipt: true
  },
  {
    id: generateUniqueId(),
    description: 'Gimnasio',
    amount: 45.00,
    category: 'Salud',
    subcategory: 'Deporte',
    date: '2024-02-17',
    paymentMethod: 'tarjeta',
    status: 'completado',
    vendor: 'Basic Fit',
    vendorId: 'VEN-006',
    notes: 'Cuota mensual gimnasio',
    attachments: 0,
    recurring: true,
    recurringFrequency: 'mensual',
    tax: 0.10,
    deductible: false,
    tags: ['salud', 'deporte', 'suscripción'],
    receipt: true
  },
  {
    id: generateUniqueId(),
    description: 'Ropa',
    amount: 120.50,
    category: 'Compras',
    subcategory: 'Ropa',
    date: '2024-02-16',
    paymentMethod: 'tarjeta',
    status: 'completado',
    vendor: 'Zara',
    vendorId: 'VEN-007',
    notes: 'Compra de ropa',
    attachments: 0,
    recurring: false,
    tax: 0.21,
    deductible: false,
    tags: ['compras', 'ropa', 'personal'],
    receipt: true
  },
  {
    id: generateUniqueId(),
    description: 'Factura pendiente - Agua',
    amount: 45.30,
    category: 'Servicios',
    subcategory: 'Agua',
    date: '2024-03-05',
    paymentMethod: 'transferencia',
    status: 'pendiente',
    vendor: 'Aguas de Barcelona',
    vendorId: 'VEN-008',
    invoice: 'FAC-2024-009',
    notes: 'Factura de agua pendiente',
    attachments: 0,
    recurring: true,
    recurringFrequency: 'mensual',
    tax: 0.10,
    deductible: true,
    tags: ['servicios', 'agua', 'pendiente'],
    receipt: false
  },
  {
    id: generateUniqueId(),
    description: 'Seguro de coche',
    amount: 450.00,
    category: 'Seguros',
    subcategory: 'Coche',
    date: '2024-03-15',
    paymentMethod: 'tarjeta',
    status: 'programado',
    vendor: 'Mapfre',
    vendorId: 'VEN-009',
    invoice: 'FAC-2024-010',
    notes: 'Seguro anual programado',
    attachments: 2,
    recurring: true,
    recurringFrequency: 'anual',
    tax: 0.21,
    deductible: true,
    tags: ['seguros', 'coche', 'anual'],
    receipt: false
  }
];

export const ExpensesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('todos');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('este-mes');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDeductibleOnly, setShowDeductibleOnly] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'transferencia',
    status: 'completado',
    vendor: '',
    invoice: '',
    notes: '',
    deductible: false
  });

  const itemsPerPage = 6;

  // Cargar datos desde localStorage o usar datos por defecto
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem('expenses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return getDefaultExpenses();
    } catch (error) {
      console.error('Error loading expenses:', error);
      return getDefaultExpenses();
    }
  });

  // Guardar en localStorage cuando cambien los gastos
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Obtener la fecha actual
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Calcular estadísticas en tiempo real
  const yearlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return exp.status === 'completado' && expDate.getFullYear() === currentYear;
  });
  const totalYearlyExpense = yearlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return exp.status === 'completado' && 
           expDate.getMonth() === currentMonth && 
           expDate.getFullYear() === currentYear;
  });
  const totalMonthlyExpense = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const pendingExpenses = expenses.filter(exp => exp.status === 'pendiente');
  const totalPending = pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const completedExpenses = expenses.filter(exp => exp.status === 'completado');
  const totalCompletedAmount = completedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageTicket = completedExpenses.length > 0 ? totalCompletedAmount / completedExpenses.length : 0;

  const deductibleExpenses = expenses.filter(exp => exp.deductible && exp.status === 'completado');
  const totalDeductible = deductibleExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalNonDeductible = totalYearlyExpense - totalDeductible;

  // Calcular categorías en tiempo real
  const categoryMap = new Map<string, { amount: number; count: number; deductible: boolean }>();
  
  completedExpenses.forEach(exp => {
    const existing = categoryMap.get(exp.category);
    if (existing) {
      existing.amount += exp.amount;
      existing.count += 1;
    } else {
      categoryMap.set(exp.category, { amount: exp.amount, count: 1, deductible: exp.deductible });
    }
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Alimentación': 'from-yellow-500 to-yellow-600',
      'Vivienda': 'from-blue-500 to-blue-600',
      'Servicios': 'from-cyan-500 to-cyan-600',
      'Transporte': 'from-green-500 to-green-600',
      'Ocio': 'from-purple-500 to-purple-600',
      'Salud': 'from-red-500 to-red-600',
      'Compras': 'from-pink-500 to-pink-600',
      'Seguros': 'from-indigo-500 to-indigo-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Alimentación': <Utensils size={16} />,
      'Vivienda': <HomeIcon size={16} />,
      'Servicios': <Zap size={16} />,
      'Transporte': <Car size={16} />,
      'Ocio': <Film size={16} />,
      'Salud': <Heart size={16} />,
      'Compras': <ShoppingBag size={16} />,
      'Seguros': <Shield size={16} />
    };
    return icons[category] || <Tag size={16} />;
  };

  const categories: CategorySummary[] = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    amount: data.amount,
    percentage: totalCompletedAmount > 0 ? (data.amount / totalCompletedAmount) * 100 : 0,
    color: getCategoryColor(name),
    icon: getCategoryIcon(name),
    count: data.count,
    deductible: data.deductible
  })).sort((a, b) => b.amount - a.amount);

  // Función para filtrar por período
  const filterByPeriod = (date: string, period: string): boolean => {
    const expenseDate = new Date(date);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    switch(period) {
      case 'este-mes':
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      case 'este-semana':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
      case 'este-ano':
        return expenseDate.getFullYear() === currentYear;
      case 'personalizado':
        return true;
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
    setShowDeductibleOnly(false);
  };

  const handleCreateExpense = () => {
    const newExpense: Expense = {
      id: generateUniqueId(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod as any,
      status: formData.status as any,
      vendor: formData.vendor || undefined,
      invoice: formData.invoice || undefined,
      notes: formData.notes || undefined,
      deductible: formData.deductible,
      recurring: false,
      tax: 0.21,
      tags: []
    };

    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    setShowCreateModal(false);
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'transferencia',
      status: 'completado',
      vendor: '',
      invoice: '',
      notes: '',
      deductible: false
    });
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== id));
    }
  };

  const handleEditStatus = (expense: Expense) => {
    setSelectedExpense(expense);
    setNewStatus(expense.status);
    setShowEditStatusModal(true);
  };

  const handleUpdateStatus = () => {
    if (selectedExpense && newStatus && newStatus !== selectedExpense.status) {
      setExpenses(prevExpenses => 
        prevExpenses.map(exp => 
          exp.id === selectedExpense.id ? { ...exp, status: newStatus as any } : exp
        )
      );
    }
    setShowEditStatusModal(false);
    setSelectedExpense(null);
    setNewStatus('');
  };

  const resetData = () => {
    if (window.confirm('¿Esto restaurará los datos a los valores por defecto. ¿Continuar?')) {
      localStorage.removeItem('expenses');
      setExpenses(getDefaultExpenses());
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todas' || expense.category === selectedCategory;
    const matchesStatus = selectedStatus === 'todos' || expense.status === selectedStatus;
    const matchesPaymentMethod = selectedPaymentMethod === 'todos' || expense.paymentMethod === selectedPaymentMethod;
    const matchesPeriod = filterByPeriod(expense.date, selectedPeriod);
    const matchesDeductible = showDeductibleOnly ? expense.deductible : true;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPaymentMethod && matchesPeriod && matchesDeductible;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);
  const paginatedExpenses = sortedExpenses.slice(
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

  const getPaymentMethodIcon = (method: string) => {
    switch(method) {
      case 'efectivo':
        return <DollarSign size={14} />;
      case 'tarjeta':
        return <CreditCard size={14} />;
      case 'transferencia':
        return <Wallet size={14} />;
      case 'cheque':
        return <FileText size={14} />;
      default:
        return <CreditCard size={14} />;
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
    selectedPeriod !== 'este-mes' ||
    showDeductibleOnly;

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Gastos</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">
              {expenses.length} registros
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Controla y gestiona todos tus gastos
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
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <FileText size={20} />
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
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Nuevo Gasto</span>
          </button>
          <button
            onClick={resetData}
            className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors text-yellow-400 hover:text-yellow-300"
            title="Restaurar datos por defecto"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-sm">Gastos del Año</p>
            <Calendar size={18} className="text-[#F05984]" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalYearlyExpense)}</p>
          <p className="text-white/40 text-xs mt-1">{currentYear}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-sm">Este mes</p>
            <TrendingDown size={18} className="text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalMonthlyExpense)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-sm">Pendiente por pagar</p>
            <Clock size={18} className="text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{formatCurrency(totalPending)}</p>
          <p className="text-white/40 text-xs mt-1">{pendingExpenses.length} facturas pendientes</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-sm">Ticket Promedio</p>
            <Target size={18} className="text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(averageTicket)}</p>
          <p className="text-white/40 text-xs mt-1">{completedExpenses.length} transacciones</p>
        </div>
      </div>

      {/* Deducible Summary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Gastos Deducibles</h3>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-sm">Deducible: {formatCurrency(totalDeductible)}</span>
            <span className="text-white/40 text-sm">No deducible: {formatCurrency(totalNonDeductible)}</span>
          </div>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
            style={{ width: `${totalYearlyExpense > 0 ? (totalDeductible / totalYearlyExpense) * 100 : 0}%` }}
          />
        </div>
        <p className="text-white/40 text-xs mt-2">
          {((totalDeductible / totalYearlyExpense) * 100).toFixed(1)}% de tus gastos son deducibles
        </p>
      </div>

      {/* Categories Summary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Gastos por categoría</h3>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-white/60 text-sm">
              <input
                type="checkbox"
                checked={showDeductibleOnly}
                onChange={(e) => setShowDeductibleOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
              />
              Solo deducibles
            </label>
          </div>
        </div>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>
                    {cat.icon}
                  </div>
                  <span className="text-white text-sm truncate">{cat.name}</span>
                </div>
                <p className="text-white font-semibold text-sm">{formatCurrency(cat.amount)}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white/40 text-xs">{cat.percentage.toFixed(1)}%</span>
                  <span className="text-white/40 text-xs">{cat.count} ops</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                {cat.deductible && (
                  <div className="mt-1">
                    <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                      deducible
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-center py-4">No hay datos de gastos completados</p>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Buscar por descripción, proveedor o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
              >
                <option value="este-mes" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Este mes</option>
                <option value="este-semana" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Esta semana</option>
                <option value="este-ano" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Este año</option>
                <option value="personalizado" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Personalizado</option>
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
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
                <Printer size={20} />
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 text-sm"
                >
                  <XCircle size={16} />
                  <span>Limpiar filtros</span>
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Categoría</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
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
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
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
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
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
            </div>
          )}
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
            {filteredExpenses.length} resultados
          </span>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Descripción</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Categoría</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Proveedor</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Fecha</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Método</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Estado</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Monto</th>
                  <th className="text-center py-3 px-4 text-white/60 text-sm font-medium">Deduc.</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-white/60 text-sm">{expense.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">{expense.description}</p>
                        {expense.notes && (
                          <p className="text-white/40 text-xs">{expense.notes.substring(0, 30)}...</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm">{expense.category}</span>
                        {expense.recurring && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                            recurrente
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {expense.vendor ? (
                        <div>
                          <p className="text-white text-sm">{expense.vendor}</p>
                          <p className="text-white/40 text-xs">{expense.vendorId}</p>
                        </div>
                      ) : (
                        <span className="text-white/40 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-white/40" />
                        <span className="text-white text-sm">{formatDate(expense.date)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {getPaymentMethodIcon(expense.paymentMethod)}
                        <span className="text-white text-sm capitalize">{getPaymentMethodLabel(expense.paymentMethod)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                        {getStatusIcon(expense.status)}
                        {expense.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-white font-medium">{formatCurrency(expense.amount)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {expense.deductible ? (
                        <span className="text-green-400" title="Deducible">✓</span>
                      ) : (
                        <span className="text-red-400/50" title="No deducible">✗</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditStatus(expense)}
                          className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                          title="Editar estado"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedExpenses.map((expense) => (
              <div key={expense.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#F05984]/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white/40 text-xs">{expense.id}</p>
                    <h3 className="text-white font-medium mt-1">{expense.description}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(expense.status)}`}>
                    {getStatusIcon(expense.status)}
                    {expense.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Categoría:</span>
                    <span className="text-white">{expense.category}</span>
                  </div>
                  {expense.vendor && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Proveedor:</span>
                      <span className="text-white">{expense.vendor}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Fecha:</span>
                    <span className="text-white">{formatDate(expense.date)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Método:</span>
                    <span className="text-white capitalize">{getPaymentMethodLabel(expense.paymentMethod)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Deducible:</span>
                    <span className={expense.deductible ? 'text-green-400' : 'text-red-400'}>
                      {expense.deductible ? 'Sí' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-lg font-bold text-white">{formatCurrency(expense.amount)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditStatus(expense)}
                      className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                      title="Editar estado"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {expense.tags && expense.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {expense.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} de {filteredExpenses.length} gastos
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

      {/* Modal para crear nuevo gasto */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-lg">
                  <TrendingDown size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Nuevo Gasto</h2>
                  <p className="text-white/40 text-sm">Completa los campos para registrar un nuevo gasto</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-white/60" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateExpense(); }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Descripción *</label>
                    <div className="relative">
                      <FileText size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                        placeholder="Ej: Supermercado"
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
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
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
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                      required
                    >
                      <option value="" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Seleccionar categoría</option>
                      <option value="Alimentación" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Alimentación</option>
                      <option value="Vivienda" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Vivienda</option>
                      <option value="Servicios" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Servicios</option>
                      <option value="Transporte" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Transporte</option>
                      <option value="Ocio" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Ocio</option>
                      <option value="Salud" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Salud</option>
                      <option value="Compras" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Compras</option>
                      <option value="Seguros" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Seguros</option>
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
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
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
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
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
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
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
                    <label className="text-white/60 text-sm mb-1.5 block">Proveedor</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        value={formData.vendor}
                        onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                        placeholder="Nombre del proveedor"
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
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                        placeholder="FAC-2024-001"
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
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                    placeholder="Notas adicionales sobre este gasto..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="deductible"
                    checked={formData.deductible}
                    onChange={(e) => setFormData({...formData, deductible: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
                  />
                  <label htmlFor="deductible" className="text-white text-sm">
                    Gasto deducible de impuestos
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    <Save size={18} />
                    <span>Guardar Gasto</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar estado */}
      {showEditStatusModal && selectedExpense && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Edit size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Editar Estado</h2>
                  <p className="text-white/40 text-sm">Cambia el estado del gasto</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditStatusModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-white/60" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Gasto</label>
                  <p className="text-white font-medium">{selectedExpense.description}</p>
                  <p className="text-white/40 text-sm">{formatCurrency(selectedExpense.amount)}</p>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Nuevo Estado</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                  >
                    <option value="completado" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Completado</option>
                    <option value="pendiente" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Pendiente</option>
                    <option value="programado" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Programado</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowEditStatusModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Actualizar Estado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
