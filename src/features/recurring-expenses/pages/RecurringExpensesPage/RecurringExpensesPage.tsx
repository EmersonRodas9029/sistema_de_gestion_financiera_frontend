import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Repeat,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  CreditCard,
  Wallet,
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
  ArrowUp,
  ArrowDown,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  PiggyBank,
  Target,
  BarChart3,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Play,
  Pause,
  StopCircle,
  Zap as ZapIcon,
  Shield,
  Bell,
  Settings,
  X,
  Save,
  Copy,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

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

interface RecurringSummary {
  totalMonthly: number;
  totalAnnual: number;
  activeExpenses: number;
  pausedExpenses: number;
  totalExpenses: number;
  upcomingThisMonth: number;
  upcomingThisWeek: number;
  averagePerDay: number;
  topCategory: string;
  monthlyChange: number;
}

interface CategorySummary {
  name: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
  icon: React.ReactNode;
}

export const RecurringExpensesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<RecurringExpense | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'nextPayment' | 'frequency'>('nextPayment');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 12;

  // Resumen de gastos recurrentes
  const summary: RecurringSummary = {
    totalMonthly: 2450.75,
    totalAnnual: 29409.00,
    activeExpenses: 12,
    pausedExpenses: 3,
    totalExpenses: 18,
    upcomingThisMonth: 8,
    upcomingThisWeek: 3,
    averagePerDay: 81.69,
    topCategory: 'Servicios',
    monthlyChange: 5.2
  };

  // Datos de ejemplo - Gastos recurrentes
  const recurringExpenses: RecurringExpense[] = [
    {
      id: 'REC-001',
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
      updatedAt: '2024-02-23',
      paymentHistory: [
        { id: 'PAY-001', date: '2024-02-01', amount: 1200, status: 'paid', reference: 'REF-001' },
        { id: 'PAY-002', date: '2024-01-01', amount: 1200, status: 'paid', reference: 'REF-002' }
      ]
    },
    {
      id: 'REC-002',
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
      id: 'REC-003',
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
      id: 'REC-004',
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
      id: 'REC-005',
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
      id: 'REC-006',
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
      id: 'REC-007',
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
      id: 'REC-008',
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
      id: 'REC-009',
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
      id: 'REC-010',
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
    },
    {
      id: 'REC-011',
      name: 'Gas',
      description: 'Factura del gas natural',
      amount: 65.00,
      category: 'Servicios',
      subcategory: 'Gas',
      frequency: 'monthly',
      startDate: '2024-01-18',
      nextPayment: '2024-03-18',
      lastPayment: '2024-02-18',
      paymentMethod: 'transfer',
      status: 'active',
      autoPay: true,
      vendor: 'Naturgy',
      tags: ['servicios', 'gas', 'hogar'],
      createdAt: '2024-01-18',
      updatedAt: '2024-02-23'
    },
    {
      id: 'REC-012',
      name: 'Seguro de Vida',
      description: 'Seguro de vida familiar',
      amount: 120.00,
      category: 'Seguros',
      subcategory: 'Vida',
      frequency: 'monthly',
      startDate: '2024-01-01',
      nextPayment: '2024-03-01',
      lastPayment: '2024-02-01',
      paymentMethod: 'direct_debit',
      status: 'active',
      autoPay: true,
      vendor: 'AXA',
      tags: ['seguros', 'vida', 'protección'],
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    }
  ];

  // Resumen por categoría
  const categorySummary: CategorySummary[] = [
    {
      name: 'Vivienda',
      amount: 1200.00,
      percentage: 49,
      count: 1,
      color: 'from-blue-500 to-blue-600',
      icon: <HomeIcon size={16} />
    },
    {
      name: 'Servicios',
      amount: 236.29,
      percentage: 10,
      count: 4,
      color: 'from-cyan-500 to-cyan-600',
      icon: <Zap size={16} />
    },
    {
      name: 'Entretenimiento',
      amount: 80.97,
      percentage: 3,
      count: 3,
      color: 'from-purple-500 to-purple-600',
      icon: <Film size={16} />
    },
    {
      name: 'Salud',
      amount: 45.00,
      percentage: 2,
      count: 1,
      color: 'from-red-500 to-red-600',
      icon: <Heart size={16} />
    },
    {
      name: 'Seguros',
      amount: 570.00,
      percentage: 23,
      count: 2,
      color: 'from-orange-500 to-orange-600',
      icon: <Shield size={16} />
    },
    {
      name: 'Hogar',
      amount: 80.00,
      percentage: 3,
      count: 1,
      color: 'from-green-500 to-green-600',
      icon: <Home size={16} />
    }
  ];

  const filteredExpenses = recurringExpenses.filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todas' || expense.category === selectedCategory;
    const matchesFrequency = selectedFrequency === 'todos' || expense.frequency === selectedFrequency;
    const matchesStatus = selectedStatus === 'todos' || expense.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesFrequency && matchesStatus;
  });

  // Ordenar gastos recurrentes
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortBy === 'frequency') {
      const freqOrder = { daily: 1, weekly: 2, biweekly: 3, monthly: 4, quarterly: 5, semiannual: 6, annual: 7 };
      return sortOrder === 'asc'
        ? freqOrder[a.frequency] - freqOrder[b.frequency]
        : freqOrder[b.frequency] - freqOrder[a.frequency];
    } else {
      return sortOrder === 'asc'
        ? new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime()
        : new Date(b.nextPayment).getTime() - new Date(a.nextPayment).getTime();
    }
  });

  // Paginación
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

  const getFrequencyLabel = (frequency: string) => {
    switch(frequency) {
      case 'daily':
        return 'Diario';
      case 'weekly':
        return 'Semanal';
      case 'biweekly':
        return 'Quincenal';
      case 'monthly':
        return 'Mensual';
      case 'quarterly':
        return 'Trimestral';
      case 'semiannual':
        return 'Semestral';
      case 'annual':
        return 'Anual';
      default:
        return frequency;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return (
          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Play size={12} />
            Activo
          </span>
        );
      case 'paused':
        return (
          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Pause size={12} />
            En pausa
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <StopCircle size={12} />
            Cancelado
          </span>
        );
      case 'completed':
        return (
          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <CheckCircle size={12} />
            Completado
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch(method) {
      case 'cash':
        return <DollarSign size={14} className="text-green-400" />;
      case 'card':
        return <CreditCard size={14} className="text-blue-400" />;
      case 'transfer':
        return <Wallet size={14} className="text-purple-400" />;
      case 'direct_debit':
        return <ZapIcon size={14} className="text-yellow-400" />;
      default:
        return <CreditCard size={14} />;
    }
  };

  const getDaysUntilNext = (nextPayment: string) => {
    const today = new Date();
    const next = new Date(nextPayment);
    const diffTime = next.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Gastos Recurrentes</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">
              {recurringExpenses.length} gastos
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Gestiona tus suscripciones y pagos periódicos
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
            <Repeat size={20} />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'calendar' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Calendar size={20} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Nuevo Gasto Recurrente</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Total Mensual</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalMonthly)}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUp size={14} className="text-red-400" />
            <span className="text-red-400 text-xs">+{summary.monthlyChange}%</span>
            <span className="text-white/40 text-xs ml-1">vs mes anterior</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Total Anual</p>
          <p className="text-xl font-bold text-white">{formatCurrency(summary.totalAnnual)}</p>
          <p className="text-white/40 text-xs mt-1">{summary.activeExpenses} gastos activos</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Próximos pagos</p>
          <p className="text-xl font-bold text-yellow-400">{summary.upcomingThisMonth}</p>
          <p className="text-white/40 text-xs mt-1">{summary.upcomingThisWeek} esta semana</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Promedio diario</p>
          <p className="text-xl font-bold text-green-400">{formatCurrency(summary.averagePerDay)}</p>
          <p className="text-white/40 text-xs mt-1">Categoría principal: {summary.topCategory}</p>
        </div>
      </div>

      {/* Category Summary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-3">Distribución por Categoría</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categorySummary.map((cat, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>
                  {cat.icon}
                </div>
                <span className="text-white text-sm">{cat.name}</span>
              </div>
              <p className="text-white font-semibold text-sm">{formatCurrency(cat.amount)}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white/40 text-xs">{cat.percentage}%</span>
                <span className="text-white/40 text-xs">{cat.count} gastos</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                  style={{ width: `${cat.percentage}%` }}
                />
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
              <input
                type="text"
                placeholder="Buscar gastos recurrentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
              >
                <option value="todas">Todas las categorías</option>
                <option value="Vivienda">Vivienda</option>
                <option value="Servicios">Servicios</option>
                <option value="Entretenimiento">Entretenimiento</option>
                <option value="Salud">Salud</option>
                <option value="Seguros">Seguros</option>
                <option value="Hogar">Hogar</option>
              </select>
              <select
                value={selectedFrequency}
                onChange={(e) => setSelectedFrequency(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
              >
                <option value="todos">Todas las frecuencias</option>
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quincenal</option>
                <option value="monthly">Mensual</option>
                <option value="quarterly">Trimestral</option>
                <option value="semiannual">Semestral</option>
                <option value="annual">Anual</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
              >
                <option value="todos">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="paused">En pausa</option>
                <option value="cancelled">Cancelados</option>
                <option value="completed">Completados</option>
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
            </div>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">Ordenar por:</span>
            <button
              onClick={() => {
                setSortBy('name');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'name' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <span>Nombre</span>
              {sortBy === 'name' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('amount');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'amount' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <DollarSign size={14} />
              <span>Monto</span>
              {sortBy === 'amount' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('frequency');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'frequency' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Repeat size={14} />
              <span>Frecuencia</span>
              {sortBy === 'frequency' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('nextPayment');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'nextPayment' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Calendar size={14} />
              <span>Próximo pago</span>
              {sortBy === 'nextPayment' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
          </div>
          <span className="text-white/40 text-sm">
            {filteredExpenses.length} resultados
          </span>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedExpenses.map((expense) => {
              const daysUntil = getDaysUntilNext(expense.nextPayment);
              const isUrgent = daysUntil <= 3 && expense.status === 'active';
              
              return (
                <div
                  key={expense.id}
                  className={`bg-white/5 rounded-xl p-4 border transition-all cursor-pointer hover:border-[#F05984]/50 ${
                    isUrgent ? 'border-red-500/30' : 'border-white/10'
                  }`}
                  onClick={() => setSelectedExpense(expense)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${
                        expense.category === 'Vivienda' ? 'from-blue-500 to-blue-600' :
                        expense.category === 'Servicios' ? 'from-cyan-500 to-cyan-600' :
                        expense.category === 'Entretenimiento' ? 'from-purple-500 to-purple-600' :
                        expense.category === 'Salud' ? 'from-red-500 to-red-600' :
                        expense.category === 'Seguros' ? 'from-orange-500 to-orange-600' :
                        'from-green-500 to-green-600'
                      } bg-opacity-20`}>
                        {expense.category === 'Vivienda' ? <HomeIcon size={16} /> :
                         expense.category === 'Servicios' ? <Zap size={16} /> :
                         expense.category === 'Entretenimiento' ? <Film size={16} /> :
                         expense.category === 'Salud' ? <Heart size={16} /> :
                         expense.category === 'Seguros' ? <Shield size={16} /> :
                         <Repeat size={16} />}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{expense.name}</h3>
                        <p className="text-white/40 text-xs">{expense.vendor || expense.category}</p>
                      </div>
                    </div>
                    {getStatusBadge(expense.status)}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Monto:</span>
                      <span className="text-white font-bold">{formatCurrency(expense.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Frecuencia:</span>
                      <span className="text-white">{getFrequencyLabel(expense.frequency)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Próximo pago:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-white">{formatDate(expense.nextPayment)}</span>
                        {isUrgent && (
                          <span className="text-red-400 text-xs">({daysUntil} días)</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Método:</span>
                      <div className="flex items-center gap-1">
                        {getPaymentMethodIcon(expense.paymentMethod)}
                        <span className="text-white capitalize">
                          {expense.paymentMethod === 'direct_debit' ? 'Domiciliado' : expense.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {expense.autoPay && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                      <ZapIcon size={12} />
                      <span>Pago automático</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-white/10">
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Eye size={14} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Edit size={14} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Copy size={14} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <MoreVertical size={14} className="text-white/60" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="p-4 space-y-2">
            {paginatedExpenses.map((expense) => {
              const daysUntil = getDaysUntilNext(expense.nextPayment);
              const isUrgent = daysUntil <= 3 && expense.status === 'active';
              
              return (
                <div
                  key={expense.id}
                  className={`bg-white/5 rounded-lg p-3 border transition-all cursor-pointer hover:border-[#F05984]/50 ${
                    isUrgent ? 'border-red-500/30' : 'border-white/10'
                  }`}
                  onClick={() => setSelectedExpense(expense)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${
                      expense.category === 'Vivienda' ? 'from-blue-500 to-blue-600' :
                      expense.category === 'Servicios' ? 'from-cyan-500 to-cyan-600' :
                      expense.category === 'Entretenimiento' ? 'from-purple-500 to-purple-600' :
                      expense.category === 'Salud' ? 'from-red-500 to-red-600' :
                      expense.category === 'Seguros' ? 'from-orange-500 to-orange-600' :
                      'from-green-500 to-green-600'
                    } bg-opacity-20`}>
                      {expense.category === 'Vivienda' ? <HomeIcon size={16} /> :
                       expense.category === 'Servicios' ? <Zap size={16} /> :
                       expense.category === 'Entretenimiento' ? <Film size={16} /> :
                       expense.category === 'Salud' ? <Heart size={16} /> :
                       expense.category === 'Seguros' ? <Shield size={16} /> :
                       <Repeat size={16} />}
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
                        <p className="text-white/60 text-xs">Monto</p>
                        <p className="text-white text-sm font-bold">{formatCurrency(expense.amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Frecuencia</p>
                        <p className="text-white text-sm">{getFrequencyLabel(expense.frequency)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Próximo pago</p>
                        <div className="flex items-center gap-1">
                          <span className="text-white text-sm">{formatDate(expense.nextPayment)}</span>
                          {isUrgent && (
                            <span className="text-red-400 text-xs">({daysUntil} días)</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs">Método</p>
                        <div className="flex items-center gap-1">
                          {getPaymentMethodIcon(expense.paymentMethod)}
                          <span className="text-white text-sm capitalize">
                            {expense.paymentMethod === 'direct_debit' ? 'Domiciliado' : expense.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
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
                </div>
              );
            })}
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="p-4">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                <div key={day} className="text-center text-white/60 text-sm font-medium py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 2;
                const hasPayment = day === 1 || day === 5 || day === 15 || day === 20;
                return (
                  <div
                    key={i}
                    className={`min-h-[100px] bg-white/5 rounded-lg p-2 border border-white/10 ${
                      hasPayment ? 'border-[#F05984]/50' : ''
                    }`}
                  >
                    <span className="text-white/60 text-sm">{day > 0 ? day : ''}</span>
                    {hasPayment && day === 1 && (
                      <div className="mt-1 p-1 bg-red-500/20 rounded text-xs text-red-400">Alquiler $1,200</div>
                    )}
                    {hasPayment && day === 5 && (
                      <div className="mt-1 p-1 bg-blue-500/20 rounded text-xs text-blue-400">Internet $49.99</div>
                    )}
                    {hasPayment && day === 15 && (
                      <div className="mt-1 p-1 bg-purple-500/20 rounded text-xs text-purple-400">Netflix $15.99</div>
                    )}
                    {hasPayment && day === 20 && (
                      <div className="mt-1 p-1 bg-green-500/20 rounded text-xs text-green-400">Gimnasio $45</div>
                    )}
                  </div>
                );
              })}
            </div>
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
    </div>
  );
};
