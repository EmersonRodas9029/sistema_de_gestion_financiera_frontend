import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
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
  Mail,
  Phone,
  User,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Upload,
  Printer,
  Share2,
  Tag,
  FolderTree,
  Users,
  Home,
  Briefcase,
  Gift,
  Award,
  Smartphone,
  Laptop,
  Car,
  Heart,
  BookOpen,
  Coffee,
  ShoppingBag,
  Zap,
  Wifi,
  Droplet,
  Home as HomeIcon,
  ChevronDown
} from 'lucide-react';

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

interface IncomeSummary {
  total: number;
  monthly: number;
  weekly: number;
  daily: number;
  pending: number;
  scheduled: number;
  average: number;
  growth: number;
}

interface CategorySummary {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  count: number;
}

export const IncomesPage = () => {
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

  const itemsPerPage = 10;

  // Resumen de ingresos
  const summary: IncomeSummary = {
    total: 45250.75,
    monthly: 3250.50,
    weekly: 812.50,
    daily: 162.50,
    pending: 2340.00,
    scheduled: 1250.00,
    average: 108.50,
    growth: 12.5
  };

  // Datos de ejemplo - Ingresos
  const incomes: Income[] = [
    {
      id: 'INC-001',
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
      id: 'INC-002',
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
      id: 'INC-003',
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
      id: 'INC-004',
      description: 'Pago de alquiler',
      amount: 1200.00,
      category: 'Ingresos pasivos',
      subcategory: 'Alquiler',
      date: '2024-02-20',
      paymentMethod: 'transferencia',
      status: 'completado',
      client: 'Carlos Rodríguez',
      clientId: 'CLI-004',
      invoice: 'INV-2024-004',
      attachments: 2,
      recurring: true,
      recurringFrequency: 'mensual',
      tax: 0.15,
      tags: ['alquiler', 'pasivo', 'mensual']
    },
    {
      id: 'INC-005',
      description: 'Pago de cliente - Consultoría',
      amount: 850.00,
      category: 'Consultoría',
      subcategory: 'Consultoría financiera',
      date: '2024-02-19',
      paymentMethod: 'transferencia',
      status: 'completado',
      client: 'Ana Martínez',
      clientId: 'CLI-005',
      project: 'Asesoría financiera',
      invoice: 'INV-2024-005',
      attachments: 1,
      recurring: false,
      tax: 0.21,
      tags: ['consultoría', 'servicios']
    },
    {
      id: 'INC-006',
      description: 'Pago pendiente - Proyecto',
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
      id: 'INC-007',
      description: 'Pago programado - Membresía',
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
      tags: ['suscripción', 'recurrente']
    }
  ];

  // Categorías con resumen
  const categories: CategorySummary[] = [
    {
      name: 'Salario',
      amount: 2500.00,
      percentage: 32,
      color: 'from-green-500 to-green-600',
      icon: <Briefcase size={16} />,
      count: 1
    },
    {
      name: 'Servicios profesionales',
      amount: 4340.00,
      percentage: 28,
      color: 'from-blue-500 to-blue-600',
      icon: <Laptop size={16} />,
      count: 2
    },
    {
      name: 'Ventas',
      amount: 1250.50,
      percentage: 16,
      color: 'from-purple-500 to-purple-600',
      icon: <ShoppingBag size={16} />,
      count: 1
    },
    {
      name: 'Ingresos pasivos',
      amount: 1200.00,
      percentage: 15,
      color: 'from-orange-500 to-orange-600',
      icon: <HomeIcon size={16} />,
      count: 1
    },
    {
      name: 'Consultoría',
      amount: 850.00,
      percentage: 11,
      color: 'from-pink-500 to-pink-600',
      icon: <Users size={16} />,
      count: 1
    },
    {
      name: 'Suscripciones',
      amount: 1250.00,
      percentage: 8,
      color: 'from-indigo-500 to-indigo-600',
      icon: <CreditCard size={16} />,
      count: 1
    }
  ];

  const filteredIncomes = incomes.filter(income => {
    const matchesSearch = income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todas' || income.category === selectedCategory;
    const matchesStatus = selectedStatus === 'todos' || income.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Ordenar ingresos
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

  // Paginación
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
            <span className="hidden sm:inline">Nuevo Ingreso</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Total Ingresos</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(summary.total)}</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUp size={14} className="text-green-400" />
            <span className="text-green-400 text-xs">+{summary.growth}%</span>
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
          <p className="text-white/60 text-sm">Proyección</p>
          <p className="text-xl font-bold text-green-400">{formatCurrency(summary.monthly * 1.12)}</p>
          <p className="text-white/40 text-xs mt-1">+12% estimado</p>
        </div>
      </div>

      {/* Categories Summary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-3">Ingresos por categoría</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
                placeholder="Buscar por descripción, cliente o ID..."
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
                    <option value="Salario">Salario</option>
                    <option value="Servicios profesionales">Servicios profesionales</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Ingresos pasivos">Ingresos pasivos</option>
                    <option value="Consultoría">Consultoría</option>
                    <option value="Suscripciones">Suscripciones</option>
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
            {filteredIncomes.length} resultados
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
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Fecha</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Método</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Estado</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Monto</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedIncomes.map((income) => (
                  <tr key={income.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-white/60 text-sm">{income.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">{income.description}</p>
                        {income.notes && (
                          <p className="text-white/40 text-xs">{income.notes.substring(0, 30)}...</p>
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
                      <div className="flex items-center gap-1">
                        {getPaymentMethodIcon(income.paymentMethod)}
                        <span className="text-white text-sm capitalize">{income.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(income.status)}`}>
                        {getStatusIcon(income.status)}
                        {income.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-white font-medium">{formatCurrency(income.amount)}</span>
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
            {paginatedIncomes.map((income) => (
              <div key={income.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#F05984]/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white/40 text-xs">{income.id}</p>
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
                    <span className="text-white capitalize">{income.paymentMethod}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-lg font-bold text-white">{formatCurrency(income.amount)}</span>
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                      <Eye size={16} className="text-white/60" />
                    </button>
                    <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                      <Edit size={16} className="text-white/60" />
                    </button>
                  </div>
                </div>

                {income.tags && income.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {income.tags.map((tag, index) => (
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
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredIncomes.length)} de {filteredIncomes.length} ingresos
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
