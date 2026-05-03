import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingDown, 
  Calendar,
  Filter,
  Search,
  Plus,
  RefreshCw,
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
  Hash,
  Calendar as CalendarIcon,
  Target,
  Receipt,
  AlertTriangle,
  TrendingUp,
  PieChart,
  Info,
  Building,
  Film
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

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
  fiscalCategory?: string;
  deductionType?: 'parcial' | 'total' | 'ninguna';
}

interface CategoryBudget {
  name: string;
  budget: number;
  actual: number;
  percentage: number;
  color: string;
}

interface MonthlyTrend {
  month: string;
  amount: number;
}

interface WeeklyTrend {
  week: string;
  amount: number;
}


// Función para generar ID único
const generateUniqueId = () => {
  return `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Datos de presupuesto por categoría
const categoryBudgets: CategoryBudget[] = [
  { name: 'Alimentación', budget: 500, actual: 350.75, percentage: 70.15, color: '#F59E0B' },
  { name: 'Vivienda', budget: 1300, actual: 1200, percentage: 92.31, color: '#3B82F6' },
  { name: 'Servicios', budget: 250, actual: 196.79, percentage: 78.72, color: '#06B6D4' },
  { name: 'Transporte', budget: 200, actual: 65, percentage: 32.5, color: '#10B981' },
  { name: 'Ocio', budget: 150, actual: 45.8, percentage: 30.53, color: '#8B5CF6' },
  { name: 'Salud', budget: 100, actual: 45, percentage: 45, color: '#EF4444' },
  { name: 'Compras', budget: 200, actual: 120.5, percentage: 60.25, color: '#EC4899' },
  { name: 'Seguros', budget: 500, actual: 450, percentage: 90, color: '#6366F1' },
];

// Datos de tendencia mensual
const monthlyTrends: MonthlyTrend[] = [
  { month: 'Sep', amount: 1850 },
  { month: 'Oct', amount: 1920 },
  { month: 'Nov', amount: 1780 },
  { month: 'Dic', amount: 2100 },
  { month: 'Ene', amount: 1950 },
  { month: 'Feb', amount: 2020 },
];

// Datos de tendencia semanal
const weeklyTrends: WeeklyTrend[] = [
  { week: 'Sem 1', amount: 450 },
  { week: 'Sem 2', amount: 520 },
  { week: 'Sem 3', amount: 480 },
  { week: 'Sem 4', amount: 610 },
];

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
    receipt: true,
    fiscalCategory: 'Consumo',
    deductionType: 'ninguna'
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
    receipt: true,
    fiscalCategory: 'Vivienda',
    deductionType: 'total'
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
    receipt: true,
    fiscalCategory: 'Servicios',
    deductionType: 'total'
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
    receipt: true,
    fiscalCategory: 'Servicios',
    deductionType: 'total'
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
    receipt: true,
    fiscalCategory: 'Transporte',
    deductionType: 'ninguna'
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
    receipt: false,
    fiscalCategory: 'Ocio',
    deductionType: 'ninguna'
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
    receipt: true,
    fiscalCategory: 'Salud',
    deductionType: 'ninguna'
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
    receipt: false,
    fiscalCategory: 'Compras',
    deductionType: 'ninguna'
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
    receipt: false,
    fiscalCategory: 'Servicios',
    deductionType: 'total'
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
    receipt: false,
    fiscalCategory: 'Seguros',
    deductionType: 'total'
  }
];

// Colores para el gráfico de pastel
const CHART_COLORS = ['#F59E0B', '#3B82F6', '#06B6D4', '#10B981', '#8B5CF6', '#EF4444', '#EC4899', '#6366F1'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const ExpensesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('todos');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('todos');
  const [trendView, setTrendView] = useState<'mensual' | 'semanal'>('mensual');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDeductibleOnly, setShowDeductibleOnly] = useState(false);
  const [showNoReceiptOnly, setShowNoReceiptOnly] = useState(false);
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
    deductible: false,
    fiscalCategory: '',
    deductionType: 'ninguna' as 'parcial' | 'total' | 'ninguna'
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

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

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

  // Calcular mes anterior
  const previousMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return exp.status === 'completado' && 
           expDate.getMonth() === prevMonth && 
           expDate.getFullYear() === prevYear;
  });
  const totalPreviousMonth = previousMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyChange = totalPreviousMonth > 0 
    ? ((totalMonthlyExpense - totalPreviousMonth) / totalPreviousMonth) * 100 
    : 0;

  const pendingExpenses = expenses.filter(exp => exp.status === 'pendiente');
  const totalPending = pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const completedExpenses = expenses.filter(exp => exp.status === 'completado');
  const totalCompletedAmount = completedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageTicket = completedExpenses.length > 0 ? totalCompletedAmount / completedExpenses.length : 0;

  const deductibleExpenses = expenses.filter(exp => exp.deductible && exp.status === 'completado');
  const totalDeductible = deductibleExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalNonDeductible = totalYearlyExpense - totalDeductible;

  // Gastos que vencen pronto (próximos 7 días)
  const upcomingExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const today = new Date();
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return exp.status === 'pendiente' && diffDays <= 7 && diffDays >= 0;
  });

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

  const pieChartData = Array.from(categoryMap.entries()).map(([name, data], idx) => ({
    name,
    value: data.amount,
    color: CHART_COLORS[idx % CHART_COLORS.length],
    count: data.count,
    deductible: data.deductible
  }));

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Alimentación': 'from-amber-500 to-amber-600',
      'Vivienda': 'from-blue-500 to-blue-600',
      'Servicios': 'from-cyan-500 to-cyan-600',
      'Transporte': 'from-emerald-500 to-emerald-600',
      'Ocio': 'from-violet-500 to-violet-600',
      'Salud': 'from-rose-500 to-rose-600',
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

  const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    amount: data.amount,
    percentage: totalCompletedAmount > 0 ? (data.amount / totalCompletedAmount) * 100 : 0,
    color: getCategoryColor(name),
    icon: getCategoryIcon(name),
    count: data.count,
    deductible: data.deductible
  })).sort((a, b) => b.amount - a.amount);

  // Top 5 categorías
  const top5Categories = categories.slice(0, 5);

  // Función para filtrar por período
  const filterByPeriod = (date: string, period: string): boolean => {
    if (period === 'todos') return true;
    
    const expenseDate = new Date(date);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    switch(period) {
      case 'este-mes': {
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      }
      case 'este-semana': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
      }
      case 'este-ano': {
        return expenseDate.getFullYear() === currentYear;
      }
      default:
        return true;
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('todas');
    setSelectedStatus('todos');
    setSelectedPaymentMethod('todos');
    setSelectedPeriod('todos');
    setCurrentPage(1);
    setShowDeductibleOnly(false);
    setShowNoReceiptOnly(false);
  };

  const handleCreateExpense = () => {
    const newExpense: Expense = {
      id: generateUniqueId(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod as Expense['paymentMethod'],
      status: formData.status as Expense['status'],
      vendor: formData.vendor || undefined,
      invoice: formData.invoice || undefined,
      notes: formData.notes || undefined,
      deductible: formData.deductible,
      recurring: false,
      tax: 0.21,
      tags: [],
      receipt: false,
      fiscalCategory: formData.fiscalCategory || undefined,
      deductionType: formData.deductionType
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
      deductible: false,
      fiscalCategory: '',
      deductionType: 'ninguna'
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
          exp.id === selectedExpense.id ? { ...exp, status: newStatus as Expense['status'] } : exp
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
    const matchesNoReceipt = showNoReceiptOnly ? !expense.receipt : true;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPaymentMethod && matchesPeriod && matchesDeductible && matchesNoReceipt;
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
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pendiente':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'programado':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelado':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

  // Verificar si un gasto es "alto" (más de $300)
  const isHighExpense = (amount: number) => amount >= 300;

  // Verificar gastos recurrentes próximos
  const getRecurringAlert = (expense: Expense) => {
    if (!expense.recurring) return null;
    const expDate = new Date(expense.date);
    const today = new Date();
    if (expDate.getDate() === today.getDate() || expDate.getDate() === today.getDate() + 1) {
      return { type: 'upcoming', message: 'Próximo pago recurrente' };
    }
    return null;
  };

  const hasActiveFilters = searchTerm !== '' || 
    selectedCategory !== 'todas' || 
    selectedStatus !== 'todos' || 
    selectedPaymentMethod !== 'todos' ||
    selectedPeriod !== 'todos' ||
    showDeductibleOnly ||
    showNoReceiptOnly;

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-64 bg-white/10 rounded-xl" />
            <div className="h-64 bg-white/10 rounded-xl" />
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
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
            <span className="hidden sm:inline">Nuevo Gasto</span>
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

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Gastos del Año</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalYearlyExpense)}</p>
              <p className="text-white/40 text-xs mt-1">{currentYear}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <Calendar size={20} className="text-[#F05984]" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Este mes</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalMonthlyExpense)}</p>
              <div className={`flex items-center gap-1 mt-1 ${monthlyChange >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                {monthlyChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span className="text-xs">{Math.abs(monthlyChange).toFixed(1)}% vs mes anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-red-500/20">
              <TrendingDown size={20} className="text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Pendiente por pagar</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{formatCurrency(totalPending)}</p>
              <p className="text-white/40 text-xs mt-1">{pendingExpenses.length} facturas pendientes</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Clock size={20} className="text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Ticket Promedio</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(averageTicket)}</p>
              <p className="text-white/40 text-xs mt-1">{completedExpenses.length} transacciones</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Target size={20} className="text-blue-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Gastos Deducibles - Reducido */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-r from-emerald-900/40 to-green-900/30 backdrop-blur-sm rounded-xl p-3 border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20">
                <Shield size={18} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold">Gastos Deducibles</h3>
                <p className="text-white/40 text-[10px]">Gastos que puedes deducir de impuestos</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-400">{formatCurrency(totalDeductible)}</p>
              <p className="text-white/40 text-[10px]">de {formatCurrency(totalYearlyExpense)} totales</p>
            </div>
          </div>
          
          <div className="flex flex-row items-center gap-4 mt-2">
            {/* Gráfico de dona pequeño */}
            <div className="w-20 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={[
                      { name: 'Deducible', value: totalDeductible, color: '#10B981' },
                      { name: 'No Deducible', value: totalNonDeductible, color: '#6B7280' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={32}
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#6B7280" />
                  </Pie>
                  <ReTooltip
                    contentStyle={{ backgroundColor: '#1a0f14', border: '1px solid #10B981', borderRadius: '8px', fontSize: '10px', padding: '4px 8px' }}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1">
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${totalYearlyExpense > 0 ? (totalDeductible / totalYearlyExpense) * 100 : 0}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-white/50 text-[10px]">Deducible: {((totalDeductible / totalYearlyExpense) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    <span className="text-white/50 text-[10px]">No deducible: {((totalNonDeductible / totalYearlyExpense) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="relative group">
                  <Info size={12} className="text-white/40 cursor-help" />
                  <div className="absolute bottom-full right-0 mb-2 w-56 p-1.5 bg-[#1a0f14] border border-white/10 rounded-lg text-white/60 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Los gastos deducibles son aquellos relacionados con actividad económica, alquiler de vivienda habitual, o donaciones.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard de Presupuesto y Tendencia */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Presupuesto vs Gasto Real */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Target size={18} className="text-[#F05984]" />
              Presupuesto vs Gasto Real
            </h3>
            <span className="text-white/40 text-xs">Últimos 30 días</span>
          </div>
          <div className="space-y-4">
            {categoryBudgets.map((cat, idx) => {
              const isOverBudget = cat.percentage > 100;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-white/70">{cat.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-xs">Presupuesto: {formatCurrency(cat.budget)}</span>
                      <span className={`font-medium ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                        {formatCurrency(cat.actual)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-gradient-to-r from-[#F05984] to-[#BC455F]'}`}
                    />
                  </div>
                  {isOverBudget && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle size={10} className="text-red-400" />
                      <span className="text-red-400 text-[10px]">Excede presupuesto en {formatCurrency(cat.actual - cat.budget)}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tendencia de Gastos */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#F05984]" />
              <h3 className="text-white font-semibold">Tendencia de Gastos</h3>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTrendView('semanal')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  trendView === 'semanal' 
                    ? 'bg-[#F05984] text-white' 
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                Por semana
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTrendView('mensual')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  trendView === 'mensual' 
                    ? 'bg-[#F05984] text-white' 
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                Por mes
              </motion.button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            {trendView === 'mensual' ? (
              <LineChart 
                data={monthlyTrends}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="month"
                  stroke="#ffffff60" 
                  tick={{ fill: '#ffffff60', fontSize: 11 }}
                  axisLine={{ stroke: '#ffffff20' }}
                  tickLine={{ stroke: '#ffffff20' }}
                />
                <YAxis 
                  stroke="#ffffff60" 
                  tick={{ fill: '#ffffff60', fontSize: 11 }}
                  axisLine={{ stroke: '#ffffff20' }}
                  tickLine={{ stroke: '#ffffff20' }}
                  domain={[0, 'auto']}
                  tickFormatter={(value) => {
                    if (value >= 1000) {
                      return `$${(value / 1000).toFixed(0)}k`;
                    }
                    return `$${value}`;
                  }}
                  width={50}
                  allowDecimals={false}
                />
                <ReTooltip
                  contentStyle={{ backgroundColor: '#1a0f14', border: '1px solid #F05984', borderRadius: '8px' }}
                  formatter={(value: number) => [formatCurrency(value), 'Gastos']}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#F05984" 
                  strokeWidth={2} 
                  dot={{ fill: '#F05984', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#BC455F' }}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            ) : (
              <LineChart 
                data={weeklyTrends}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="week"
                  stroke="#ffffff60" 
                  tick={{ fill: '#ffffff60', fontSize: 11 }}
                  axisLine={{ stroke: '#ffffff20' }}
                  tickLine={{ stroke: '#ffffff20' }}
                />
                <YAxis 
                  stroke="#ffffff60" 
                  tick={{ fill: '#ffffff60', fontSize: 11 }}
                  axisLine={{ stroke: '#ffffff20' }}
                  tickLine={{ stroke: '#ffffff20' }}
                  domain={[0, 'auto']}
                  tickFormatter={(value) => {
                    if (value >= 1000) {
                      return `$${(value / 1000).toFixed(0)}k`;
                    }
                    return `$${value}`;
                  }}
                  width={50}
                  allowDecimals={false}
                />
                <ReTooltip
                  contentStyle={{ backgroundColor: '#1a0f14', border: '1px solid #F05984', borderRadius: '8px' }}
                  formatter={(value: number) => [formatCurrency(value), 'Gastos']}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#F05984" 
                  strokeWidth={2} 
                  dot={{ fill: '#F05984', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#BC455F' }}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Gráfico de Dona de Categorías y Top 5 */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Dona Interactivo */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-[#F05984]" />
            Distribución por Categoría
          </h3>
          <div className="h-[260px]">
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
                  formatter={(value: number) => [formatCurrency(value), 'Monto']}
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

        {/* Top 5 Categorías con Barras Horizontales */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#F05984]" />
            Top 5 Categorías
          </h3>
          <div className="space-y-4">
            {top5Categories.map((cat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>
                      {cat.icon}
                    </div>
                    <span className="text-white text-sm">{cat.name}</span>
                    {cat.deductible && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                        deducible
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/50 text-xs">{cat.percentage.toFixed(1)}%</span>
                    <span className="text-white text-sm font-medium">{formatCurrency(cat.amount)}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Alertas de Gastos Próximos */}
      {upcomingExpenses.length > 0 && (
        <motion.div variants={itemVariants} className="bg-yellow-500/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-yellow-400" />
            <div>
              <p className="text-yellow-400 font-medium">Gastos por vencer</p>
              <p className="text-white/60 text-sm">Tienes {upcomingExpenses.length} gasto(s) pendiente(s) en los próximos 7 días</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
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
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors text-sm"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
              >
                <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos</option>
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
                <Filter size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNoReceiptOnly(!showNoReceiptOnly)}
                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                  showNoReceiptOnly ? 'bg-red-500/30 text-red-400 border border-red-500/50' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                Sin recibo
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
                <div className="mt-4 pt-4 border-t border-white/10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDeductibleOnly}
                      onChange={(e) => setShowDeductibleOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
                    />
                    <span className="text-white/60 text-sm">Mostrar solo gastos deducibles</span>
                  </label>
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
            {filteredExpenses.length} resultados
          </span>
        </div>

        {/* Table View */}
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="overflow-x-auto custom-scrollbar"
            >
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
                    <th className="text-center py-3 px-4 text-white/60 text-sm font-medium">Recibo</th>
                    <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExpenses.map((expense, index) => {
                    const highExpense = isHighExpense(expense.amount);
                    const recurringAlert = getRecurringAlert(expense);
                    const isPending = expense.status === 'pendiente';
                    
                    return (
                      <motion.tr
                        key={expense.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors group ${isPending ? 'border-l-4 border-l-yellow-500' : ''}`}
                      >
                        <td className="py-3 px-4">
                          <span className="text-white/40 text-xs font-mono">{expense.id.slice(-8)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium">{expense.description}</p>
                              {highExpense && (
                                <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertTriangle size={10} />
                                  Alto gasto
                                </span>
                              )}
                              {recurringAlert && (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                                  {recurringAlert.message}
                                </span>
                              )}
                            </div>
                            {expense.notes && (
                              <p className="text-white/40 text-xs mt-0.5">{expense.notes.substring(0, 40)}...</p>
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
                          <span className={`font-bold ${highExpense ? 'text-red-400' : 'text-white'}`}>
                            {formatCurrency(expense.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {expense.deductible ? (
                            <div className="relative group">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                                <CheckCircle size={12} />
                                Sí
                              </span>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1a0f14] border border-white/10 rounded text-white/60 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                Gasto deducible de impuestos
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                              <XCircle size={12} />
                              No
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {expense.receipt ? (
                            <span className="text-green-400" title="Recibo disponible">
                              <Receipt size={16} />
                            </span>
                          ) : (
                            <span className="text-red-400/50" title="Sin recibo">
                              <XCircle size={16} />
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditStatus(expense)}
                              className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                              title="Editar estado"
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
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
              {paginatedExpenses.map((expense, index) => {
                const highExpense = isHighExpense(expense.amount);
                const isPending = expense.status === 'pendiente';
                
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
                    className={`bg-white/5 rounded-xl p-4 border ${isPending ? 'border-yellow-500/50' : 'border-white/10'} hover:border-[#F05984]/50 transition-all group`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white/40 text-xs font-mono">{expense.id.slice(-8)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <h3 className="text-white font-medium">{expense.description}</h3>
                          {highExpense && (
                            <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <AlertTriangle size={10} />
                              Alto
                            </span>
                          )}
                        </div>
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
                        <span className={expense.deductible ? 'text-emerald-400' : 'text-gray-400'}>
                          {expense.deductible ? 'Sí' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Recibo:</span>
                        <span className={expense.receipt ? 'text-green-400' : 'text-red-400'}>
                          {expense.receipt ? 'Disponible' : 'Faltante'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className={`text-lg font-bold ${highExpense ? 'text-red-400' : 'text-white'}`}>
                        {formatCurrency(expense.amount)}
                      </span>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditStatus(expense)}
                          className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>

                    {expense.tags && expense.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {expense.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
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
      </motion.div>

      {/* Modal para crear nuevo gasto */}
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
                    <TrendingDown size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Nuevo Gasto</h2>
                    <p className="text-white/40 text-sm">Completa los campos para registrar un nuevo gasto</p>
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
                        <Building size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
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

                  {/* Información Fiscal */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Shield size={16} className="text-emerald-400" />
                      Información Fiscal
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/60 text-sm mb-1.5 block">Categoría Fiscal</label>
                        <select
                          value={formData.fiscalCategory}
                          onChange={(e) => setFormData({...formData, fiscalCategory: e.target.value})}
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                        >
                          <option value="" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Seleccionar</option>
                          <option value="Consumo" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Consumo</option>
                          <option value="Vivienda" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Vivienda</option>
                          <option value="Servicios" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Servicios</option>
                          <option value="Transporte" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Transporte</option>
                          <option value="Seguros" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Seguros</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm mb-1.5 block">Tipo de Deducción</label>
                        <select
                          value={formData.deductionType}
                          onChange={(e) => setFormData({...formData, deductionType: e.target.value as 'parcial' | 'total' | 'ninguna'})}
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                        >
                          <option value="ninguna" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Ninguna</option>
                          <option value="parcial" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Parcial (50%)</option>
                          <option value="total" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Total (100%)</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.deductible}
                          onChange={(e) => setFormData({...formData, deductible: e.target.checked})}
                          className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
                        />
                        <span className="text-white/80 text-sm">Marcar como gasto deducible</span>
                      </label>
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

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
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

      {/* Modal para editar estado */}
      <AnimatePresence>
        {showEditStatusModal && selectedExpense && (
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
                    <p className="text-white/40 text-sm">Cambia el estado del gasto</p>
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
                    <p className="text-white font-medium">{selectedExpense.description}</p>
                    <p className="text-white/40 text-sm mt-1">{formatCurrency(selectedExpense.amount)}</p>
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
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowEditStatusModal(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpdateStatus}
                      className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
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

      {/* Estilos CSS para el scrollbar personalizado */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #F05984 #1a0f14;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
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