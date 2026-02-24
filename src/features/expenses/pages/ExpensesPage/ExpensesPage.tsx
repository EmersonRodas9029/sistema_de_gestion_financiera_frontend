import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingDown, 
  Calendar,
  Download,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  DollarSign,
  CreditCard,
  Wallet,
  BarChart3,
  PieChart,
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
  Fuel,
  Film,
  Shirt,
  Dumbbell,
  Plane,
  Hotel,
  Wrench,
  Stethoscope,
  GraduationCap,
  Dog,
  Sparkles
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

interface ExpenseSummary {
  total: number;
  monthly: number;
  weekly: number;
  daily: number;
  pending: number;
  scheduled: number;
  average: number;
  growth: number;
  deductible: number;
  nonDeductible: number;
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

export const ExpensesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('este-mes');
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'calendar'>('table');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDeductibleOnly, setShowDeductibleOnly] = useState(false);

  const itemsPerPage = 10;

  // Resumen de gastos
  const summary: ExpenseSummary = {
    total: 32450.50,
    monthly: 2840.75,
    weekly: 710.25,
    daily: 142.05,
    pending: 1850.00,
    scheduled: 920.00,
    average: 94.50,
    growth: -5.2,
    deductible: 12580.30,
    nonDeductible: 19870.20
  };

  // Datos de ejemplo - Gastos
  const expenses: Expense[] = [
    {
      id: 'EXP-001',
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
      id: 'EXP-002',
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
      id: 'EXP-003',
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
      id: 'EXP-004',
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
      id: 'EXP-005',
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
      id: 'EXP-006',
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
      id: 'EXP-007',
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
      id: 'EXP-008',
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
      id: 'EXP-009',
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
      id: 'EXP-010',
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

  // Categorías con resumen
  const categories: CategorySummary[] = [
    {
      name: 'Alimentación',
      amount: 350.75,
      percentage: 12,
      color: 'from-yellow-500 to-yellow-600',
      icon: <Utensils size={16} />,
      count: 1,
      deductible: false
    },
    {
      name: 'Vivienda',
      amount: 1200.00,
      percentage: 42,
      color: 'from-blue-500 to-blue-600',
      icon: <HomeIcon size={16} />,
      count: 1,
      deductible: true
    },
    {
      name: 'Servicios',
      amount: 196.79,
      percentage: 7,
      color: 'from-cyan-500 to-cyan-600',
      icon: <Zap size={16} />,
      count: 3,
      deductible: true
    },
    {
      name: 'Transporte',
      amount: 65.00,
      percentage: 2,
      color: 'from-green-500 to-green-600',
      icon: <Car size={16} />,
      count: 1,
      deductible: false
    },
    {
      name: 'Ocio',
      amount: 45.80,
      percentage: 1.6,
      color: 'from-purple-500 to-purple-600',
      icon: <Film size={16} />,
      count: 1,
      deductible: false
    },
    {
      name: 'Salud',
      amount: 45.00,
      percentage: 1.6,
      color: 'from-red-500 to-red-600',
      icon: <Heart size={16} />,
      count: 1,
      deductible: false
    },
    {
      name: 'Compras',
      amount: 120.50,
      percentage: 4,
      color: 'from-pink-500 to-pink-600',
      icon: <ShoppingBag size={16} />,
      count: 1,
      deductible: false
    },
    {
      name: 'Seguros',
      amount: 450.00,
      percentage: 16,
      color: 'from-indigo-500 to-indigo-600',
      icon: <Shield size={16} />,
      count: 1,
      deductible: true
    }
  ];

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todas' || expense.category === selectedCategory;
    const matchesStatus = selectedStatus === 'todos' || expense.status === selectedStatus;
    const matchesDeductible = showDeductibleOnly ? expense.deductible : true;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDeductible;
  });

  // Ordenar gastos
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
      default:
        return <CreditCard size={14} />;
    }
  };

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
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={20} />
            <span className="hidden sm:inline">Nuevo Gasto</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Total Gastos</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(summary.total)}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowDown size={14} className="text-red-400" />
            <span className="text-red-400 text-xs">{Math.abs(summary.growth)}%</span>
            <span className="text-white/40 text-xs ml-1">vs mes anterior</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Este mes</p>
          <p className="text-xl font-bold text-white">{formatCurrency(summary.monthly)}</p>
          <p className="text-white/40 text-xs mt-1">Promedio: {formatCurrency(summary.average)}/día</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Pendiente</p>
          <p className="text-xl font-bold text-yellow-400">{formatCurrency(summary.pending)}</p>
          <p className="text-white/40 text-xs mt-1">Programado: {formatCurrency(summary.scheduled)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Deducible</p>
          <p className="text-xl font-bold text-green-400">{formatCurrency(summary.deductible)}</p>
          <p className="text-white/40 text-xs mt-1">No deducible: {formatCurrency(summary.nonDeductible)}</p>
        </div>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          {categories.map((cat, index) => (
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
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
              >
                <option value="este-mes">Este mes</option>
                <option value="este-semana">Esta semana</option>
                <option value="este-ano">Este año</option>
                <option value="personalizado">Personalizado</option>
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
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Categoría</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                  >
                    <option value="todas">Todas las categorías</option>
                    <option value="Alimentación">Alimentación</option>
                    <option value="Vivienda">Vivienda</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Ocio">Ocio</option>
                    <option value="Salud">Salud</option>
                    <option value="Compras">Compras</option>
                    <option value="Seguros">Seguros</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Estado</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="completado">Completado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="programado">Programado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Método de pago</label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm">
                    <option>Todos los métodos</option>
                    <option>Efectivo</option>
                    <option>Tarjeta</option>
                    <option>Transferencia</option>
                    <option>Cheque</option>
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
                        <span className="text-white text-sm capitalize">{expense.paymentMethod}</span>
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
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white">
                          <MoreVertical size={16} />
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
                    <span className="text-white capitalize">{expense.paymentMethod}</span>
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
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                      <Eye size={16} className="text-white/60" />
                    </button>
                    <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                      <Edit size={16} className="text-white/60" />
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
    </div>
  );
};
