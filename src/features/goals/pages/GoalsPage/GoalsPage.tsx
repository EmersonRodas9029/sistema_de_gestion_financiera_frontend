import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  ChevronRight,
  ChevronLeft,
  Calendar,
  TrendingUp,
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
  ArrowUp,
  ArrowDown,
  Settings,
  Save,
  X,
  Flag,
  Trophy,
  Rocket,
  Star,
  Crown,
  Gem,
  Wallet,
  CreditCard,
  DollarSign,
  Percent,
  LineChart,
  Activity
} from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  description?: string;
  type: 'savings' | 'investment' | 'debt' | 'purchase' | 'travel' | 'education' | 'emergency' | 'retirement' | 'custom';
  category: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  targetDate: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  monthlyContribution?: number;
  autoContribute?: boolean;
  contributionFrequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annual';
  contributors?: Contributor[];
  linkedAccounts?: string[];
  notes?: string;
  attachments?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Contributor {
  id: string;
  name: string;
  amount: number;
  date: string;
}

interface GoalSummary {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalTarget: number;
  totalCurrent: number;
  overallProgress: number;
  monthlyContribution: number;
  estimatedCompletion: string;
  onTrackGoals: number;
  atRiskGoals: number;
}

interface CategoryGoal {
  name: string;
  count: number;
  totalTarget: number;
  totalCurrent: number;
  progress: number;
  color: string;
  icon: React.ReactNode;
}

export const GoalsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPriority, setSelectedPriority] = useState<string>('todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Resumen de metas
  const summary: GoalSummary = {
    totalGoals: 12,
    activeGoals: 8,
    completedGoals: 4,
    totalTarget: 78500,
    totalCurrent: 32450,
    overallProgress: 41,
    monthlyContribution: 1250,
    estimatedCompletion: '18 meses',
    onTrackGoals: 6,
    atRiskGoals: 2
  };

  // Datos de ejemplo - Metas
  const goals: Goal[] = [
    {
      id: 'GOAL-001',
      name: 'Fondo de Emergencia',
      description: 'Ahorrar para imprevistos y emergencias',
      type: 'emergency',
      category: 'Ahorro',
      targetAmount: 10000,
      currentAmount: 6500,
      startDate: '2024-01-15',
      targetDate: '2024-12-31',
      status: 'active',
      priority: 'critical',
      progress: 65,
      monthlyContribution: 500,
      autoContribute: true,
      contributionFrequency: 'monthly',
      linkedAccounts: ['ACC-001', 'ACC-002'],
      notes: 'Fondo para 6 meses de gastos',
      attachments: 0,
      tags: ['emergencia', 'seguridad', 'fondo'],
      createdAt: '2024-01-15',
      updatedAt: '2024-02-23',
      contributors: [
        { id: 'CON-001', name: 'Ahorro automático', amount: 500, date: '2024-02-23' }
      ]
    },
    {
      id: 'GOAL-002',
      name: 'Vacaciones a Europa',
      description: 'Viaje de 15 días por Europa',
      type: 'travel',
      category: 'Viajes',
      targetAmount: 5000,
      currentAmount: 2350,
      startDate: '2024-02-01',
      targetDate: '2024-08-31',
      status: 'active',
      priority: 'high',
      progress: 47,
      monthlyContribution: 400,
      autoContribute: false,
      linkedAccounts: ['ACC-003'],
      notes: 'Destinos: París, Roma, Barcelona',
      attachments: 3,
      tags: ['viajes', 'vacaciones', 'europa'],
      createdAt: '2024-02-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'GOAL-003',
      name: 'Compra de Auto',
      description: 'Ahorrar para un auto nuevo',
      type: 'purchase',
      category: 'Vehículo',
      targetAmount: 15000,
      currentAmount: 5200,
      startDate: '2024-01-01',
      targetDate: '2025-06-30',
      status: 'active',
      priority: 'high',
      progress: 35,
      monthlyContribution: 600,
      autoContribute: true,
      contributionFrequency: 'monthly',
      linkedAccounts: ['ACC-001'],
      notes: 'Auto seminuevo, presupuesto máximo $15,000',
      attachments: 1,
      tags: ['auto', 'vehículo', 'compra'],
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'GOAL-004',
      name: 'Inversión en CETES',
      description: 'Inversión en instrumentos de deuda',
      type: 'investment',
      category: 'Inversiones',
      targetAmount: 20000,
      currentAmount: 8500,
      startDate: '2024-01-10',
      targetDate: '2024-12-31',
      status: 'active',
      priority: 'medium',
      progress: 43,
      monthlyContribution: 1000,
      autoContribute: true,
      contributionFrequency: 'monthly',
      linkedAccounts: ['ACC-004'],
      notes: 'Portafolio diversificado',
      attachments: 0,
      tags: ['inversión', 'cetes', 'rendimiento'],
      createdAt: '2024-01-10',
      updatedAt: '2024-02-23'
    },
    {
      id: 'GOAL-005',
      name: 'Pago de Deuda TC',
      description: 'Liquidar deuda de tarjeta de crédito',
      type: 'debt',
      category: 'Deudas',
      targetAmount: 3500,
      currentAmount: 1800,
      startDate: '2024-02-01',
      targetDate: '2024-05-31',
      status: 'active',
      priority: 'critical',
      progress: 51,
      monthlyContribution: 900,
      autoContribute: true,
      contributionFrequency: 'biweekly',
      linkedAccounts: ['ACC-005'],
      notes: 'Tarjeta con interés del 30% anual',
      attachments: 2,
      tags: ['deuda', 'tarjeta', 'interés'],
      createdAt: '2024-02-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'GOAL-006',
      name: 'Maestría',
      description: 'Ahorrar para una maestría en el extranjero',
      type: 'education',
      category: 'Educación',
      targetAmount: 15000,
      currentAmount: 3200,
      startDate: '2024-01-15',
      targetDate: '2025-08-31',
      status: 'active',
      priority: 'high',
      progress: 21,
      monthlyContribution: 500,
      autoContribute: false,
      linkedAccounts: ['ACC-003'],
      notes: 'Maestría en Data Science',
      attachments: 4,
      tags: ['educación', 'maestría', 'estudio'],
      createdAt: '2024-01-15',
      updatedAt: '2024-02-23'
    },
    {
      id: 'GOAL-007',
      name: 'Fondo para Casa',
      description: 'Enganche para comprar una casa',
      type: 'purchase',
      category: 'Vivienda',
      targetAmount: 50000,
      currentAmount: 4500,
      startDate: '2024-01-01',
      targetDate: '2026-12-31',
      status: 'paused',
      priority: 'medium',
      progress: 9,
      monthlyContribution: 800,
      autoContribute: true,
      contributionFrequency: 'monthly',
      linkedAccounts: ['ACC-001'],
      notes: 'Meta a largo plazo',
      attachments: 0,
      tags: ['casa', 'vivienda', 'largo plazo'],
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'GOAL-008',
      name: 'Ahorro para Bodas',
      description: 'Ahorrar para la boda',
      type: 'savings',
      category: 'Eventos',
      targetAmount: 8000,
      currentAmount: 8000,
      startDate: '2024-01-01',
      targetDate: '2024-03-15',
      status: 'completed',
      priority: 'high',
      progress: 100,
      monthlyContribution: 2000,
      autoContribute: false,
      linkedAccounts: ['ACC-002'],
      notes: '¡Meta cumplida!',
      attachments: 5,
      tags: ['boda', 'evento', 'celebración'],
      createdAt: '2024-01-01',
      updatedAt: '2024-03-15'
    },
    {
      id: 'GOAL-009',
      name: 'Jubilación',
      description: 'Fondo para el retiro',
      type: 'retirement',
      category: 'Jubilación',
      targetAmount: 200000,
      currentAmount: 12500,
      startDate: '2024-01-01',
      targetDate: '2045-12-31',
      status: 'active',
      priority: 'medium',
      progress: 6,
      monthlyContribution: 500,
      autoContribute: true,
      contributionFrequency: 'monthly',
      linkedAccounts: ['ACC-006'],
      notes: 'Fondo de retiro a largo plazo',
      attachments: 0,
      tags: ['jubilación', 'retiro', 'largo plazo'],
      createdAt: '2024-01-01',
      updatedAt: '2024-02-23'
    },
    {
      id: 'GOAL-010',
      name: 'Comprar iPhone',
      description: 'Ahorrar para un iPhone nuevo',
      type: 'purchase',
      category: 'Tecnología',
      targetAmount: 1200,
      currentAmount: 400,
      startDate: '2024-02-15',
      targetDate: '2024-04-30',
      status: 'active',
      priority: 'low',
      progress: 33,
      monthlyContribution: 200,
      autoContribute: false,
      linkedAccounts: ['ACC-003'],
      notes: 'iPhone 15 Pro',
      attachments: 0,
      tags: ['tecnología', 'iphone', 'compra'],
      createdAt: '2024-02-15',
      updatedAt: '2024-02-23'
    },
    {
      id: 'GOAL-011',
      name: 'Gimnasio anual',
      description: 'Pagar membresía anual del gimnasio',
      type: 'savings',
      category: 'Salud',
      targetAmount: 600,
      currentAmount: 0,
      startDate: '2024-03-01',
      targetDate: '2024-12-31',
      status: 'active',
      priority: 'low',
      progress: 0,
      monthlyContribution: 50,
      autoContribute: true,
      contributionFrequency: 'monthly',
      linkedAccounts: ['ACC-001'],
      notes: 'Membresía Basic Fit',
      attachments: 0,
      tags: ['salud', 'gimnasio', 'suscripción'],
      createdAt: '2024-02-20',
      updatedAt: '2024-02-23'
    },
    {
      id: 'GOAL-012',
      name: 'Curso de Inglés',
      description: 'Financiar curso intensivo de inglés',
      type: 'education',
      category: 'Educación',
      targetAmount: 1500,
      currentAmount: 0,
      startDate: '2024-03-15',
      targetDate: '2024-06-30',
      status: 'paused',
      priority: 'medium',
      progress: 0,
      monthlyContribution: 300,
      autoContribute: false,
      linkedAccounts: [],
      notes: 'Esperando fecha de inicio',
      attachments: 0,
      tags: ['inglés', 'curso', 'educación'],
      createdAt: '2024-02-10',
      updatedAt: '2024-02-23'
    }
  ];

  // Resumen por categoría
  const categorySummary: CategoryGoal[] = [
    {
      name: 'Ahorro',
      count: 2,
      totalTarget: 18000,
      totalCurrent: 10500,
      progress: 58,
      color: 'from-green-500 to-green-600',
      icon: <Wallet size={16} />
    },
    {
      name: 'Viajes',
      count: 1,
      totalTarget: 5000,
      totalCurrent: 2350,
      progress: 47,
      color: 'from-blue-500 to-blue-600',
      icon: <Plane size={16} />
    },
    {
      name: 'Vehículo',
      count: 1,
      totalTarget: 15000,
      totalCurrent: 5200,
      progress: 35,
      color: 'from-orange-500 to-orange-600',
      icon: <Car size={16} />
    },
    {
      name: 'Inversiones',
      count: 1,
      totalTarget: 20000,
      totalCurrent: 8500,
      progress: 43,
      color: 'from-purple-500 to-purple-600',
      icon: <TrendingUp size={16} />
    },
    {
      name: 'Deudas',
      count: 1,
      totalTarget: 3500,
      totalCurrent: 1800,
      progress: 51,
      color: 'from-red-500 to-red-600',
      icon: <CreditCard size={16} />
    },
    {
      name: 'Educación',
      count: 2,
      totalTarget: 16500,
      totalCurrent: 3200,
      progress: 19,
      color: 'from-indigo-500 to-indigo-600',
      icon: <BookOpen size={16} />
    },
    {
      name: 'Vivienda',
      count: 1,
      totalTarget: 50000,
      totalCurrent: 4500,
      progress: 9,
      color: 'from-cyan-500 to-cyan-600',
      icon: <HomeIcon size={16} />
    },
    {
      name: 'Eventos',
      count: 1,
      totalTarget: 8000,
      totalCurrent: 8000,
      progress: 100,
      color: 'from-pink-500 to-pink-600',
      icon: <Gift size={16} />
    },
    {
      name: 'Jubilación',
      count: 1,
      totalTarget: 200000,
      totalCurrent: 12500,
      progress: 6,
      color: 'from-teal-500 to-teal-600',
      icon: <Crown size={16} />
    },
    {
      name: 'Tecnología',
      count: 1,
      totalTarget: 1200,
      totalCurrent: 400,
      progress: 33,
      color: 'from-gray-500 to-gray-600',
      icon: <Laptop size={16} />
    },
    {
      name: 'Salud',
      count: 1,
      totalTarget: 600,
      totalCurrent: 0,
      progress: 0,
      color: 'from-amber-500 to-amber-600',
      icon: <Heart size={16} />
    }
  ];

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todas' || goal.type === selectedType;
    const matchesStatus = selectedStatus === 'todos' || goal.status === selectedStatus;
    const matchesPriority = selectedPriority === 'todas' || goal.priority === selectedPriority;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Activity size={12} /> Activa</span>;
      case 'completed':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle size={12} /> Completada</span>;
      case 'paused':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Clock size={12} /> En pausa</span>;
      case 'cancelled':
        return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><XCircle size={12} /> Cancelada</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'critical':
        return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">Crítica</span>;
      case 'high':
        return <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">Alta</span>;
      case 'medium':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">Media</span>;
      case 'low':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Baja</span>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'savings':
        return <Wallet size={16} className="text-white" />;
      case 'investment':
        return <TrendingUp size={16} className="text-white" />;
      case 'debt':
        return <CreditCard size={16} className="text-white" />;
      case 'purchase':
        return <ShoppingBag size={16} className="text-white" />;
      case 'travel':
        return <Plane size={16} className="text-white" />;
      case 'education':
        return <BookOpen size={16} className="text-white" />;
      case 'emergency':
        return <AlertCircle size={16} className="text-white" />;
      case 'retirement':
        return <Crown size={16} className="text-white" />;
      default:
        return <Target size={16} className="text-white" />;
    }
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Metas Financieras</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">
              {goals.length} metas
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Define y da seguimiento a tus objetivos financieros
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
            <Target size={20} />
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'timeline' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Calendar size={20} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Nueva Meta</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Progreso General</p>
          <p className="text-2xl font-bold text-white">{summary.overallProgress}%</p>
          <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full"
              style={{ width: `${summary.overallProgress}%` }}
            />
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Total Ahorrado</p>
          <p className="text-xl font-bold text-white">{formatCurrency(summary.totalCurrent)}</p>
          <p className="text-white/40 text-xs mt-1">de {formatCurrency(summary.totalTarget)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Metas Activas</p>
          <p className="text-xl font-bold text-white">{summary.activeGoals}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-green-400 text-xs">{summary.onTrackGoals} en camino</span>
            <span className="text-red-400 text-xs">{summary.atRiskGoals} en riesgo</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Aportación Mensual</p>
          <p className="text-xl font-bold text-white">{formatCurrency(summary.monthlyContribution)}</p>
          <p className="text-white/40 text-xs mt-1">Completas en {summary.estimatedCompletion}</p>
        </div>
      </div>

      {/* Category Summary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-3">Metas por Categoría</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {categorySummary.map((cat, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>
                  {cat.icon}
                </div>
                <span className="text-white text-sm">{cat.name}</span>
              </div>
              <p className="text-white font-semibold text-sm">{cat.count} metas</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white/40 text-xs">{cat.progress}%</span>
                <span className="text-white/40 text-xs">{formatCurrency(cat.totalCurrent)}</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                  style={{ width: `${cat.progress}%` }}
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
                placeholder="Buscar metas por nombre, descripción o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
              >
                <option value="todos">Todos los estados</option>
                <option value="active">Activas</option>
                <option value="completed">Completadas</option>
                <option value="paused">En pausa</option>
                <option value="cancelled">Canceladas</option>
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

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Tipo de Meta</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                  >
                    <option value="todas">Todos los tipos</option>
                    <option value="savings">Ahorro</option>
                    <option value="investment">Inversión</option>
                    <option value="debt">Deuda</option>
                    <option value="purchase">Compra</option>
                    <option value="travel">Viaje</option>
                    <option value="education">Educación</option>
                    <option value="emergency">Emergencia</option>
                    <option value="retirement">Jubilación</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Prioridad</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                  >
                    <option value="todas">Todas las prioridades</option>
                    <option value="critical">Crítica</option>
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Rango de fechas</label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm">
                    <option>Último mes</option>
                    <option>Últimos 3 meses</option>
                    <option>Último año</option>
                    <option>Personalizado</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Goals Views */}
        <div className="p-4">
          {viewMode === 'grid' && (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredGoals.map((goal) => {
                const daysRemaining = getDaysRemaining(goal.targetDate);
                const isAtRisk = daysRemaining < 30 && goal.progress < 50;
                
                return (
                  <div
                    key={goal.id}
                    className={`bg-white/5 rounded-xl p-4 border transition-all cursor-pointer hover:border-[#F05984]/50 ${
                      isAtRisk ? 'border-red-500/30' : 'border-white/10'
                    }`}
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${
                          goal.type === 'emergency' ? 'from-red-500 to-red-600' :
                          goal.type === 'investment' ? 'from-purple-500 to-purple-600' :
                          goal.type === 'travel' ? 'from-blue-500 to-blue-600' :
                          goal.type === 'education' ? 'from-indigo-500 to-indigo-600' :
                          goal.type === 'debt' ? 'from-orange-500 to-orange-600' :
                          goal.type === 'retirement' ? 'from-teal-500 to-teal-600' :
                          'from-green-500 to-green-600'
                        } bg-opacity-20`}>
                          {getTypeIcon(goal.type)}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{goal.name}</h3>
                          <p className="text-white/40 text-xs">{goal.category}</p>
                        </div>
                      </div>
                      {getStatusBadge(goal.status)}
                    </div>

                    {goal.description && (
                      <p className="text-white/60 text-sm mb-3 line-clamp-2">{goal.description}</p>
                    )}

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Progreso:</span>
                        <span className="text-white">{goal.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            goal.progress === 100 ? 'bg-green-500' :
                            isAtRisk ? 'bg-red-500' : 'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Actual:</span>
                        <span className="text-white font-medium">{formatCurrency(goal.currentAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Meta:</span>
                        <span className="text-white">{formatCurrency(goal.targetAmount)}</span>
                      </div>
                      {goal.monthlyContribution && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/60">Aportación:</span>
                          <span className="text-white">{formatCurrency(goal.monthlyContribution)}/mes</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1 text-white/40">
                        <Calendar size={12} />
                        <span>{formatDate(goal.targetDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {daysRemaining > 0 ? (
                          <span className={isAtRisk ? 'text-red-400' : 'text-white/40'}>
                            {daysRemaining} días
                          </span>
                        ) : (
                          <span className="text-green-400">¡Completada!</span>
                        )}
                      </div>
                    </div>

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

                    {goal.tags && goal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {goal.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                        {goal.tags.length > 3 && (
                          <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                            +{goal.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'list' && (
            // List View
            <div className="space-y-2">
              {filteredGoals.map((goal) => {
                const daysRemaining = getDaysRemaining(goal.targetDate);
                const isAtRisk = daysRemaining < 30 && goal.progress < 50;
                
                return (
                  <div
                    key={goal.id}
                    className={`bg-white/5 rounded-lg p-3 border transition-all cursor-pointer hover:border-[#F05984]/50 ${
                      isAtRisk ? 'border-red-500/30' : 'border-white/10'
                    }`}
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${
                        goal.type === 'emergency' ? 'from-red-500 to-red-600' :
                        goal.type === 'investment' ? 'from-purple-500 to-purple-600' :
                        goal.type === 'travel' ? 'from-blue-500 to-blue-600' :
                        goal.type === 'education' ? 'from-indigo-500 to-indigo-600' :
                        goal.type === 'debt' ? 'from-orange-500 to-orange-600' :
                        goal.type === 'retirement' ? 'from-teal-500 to-teal-600' :
                        'from-green-500 to-green-600'
                      } bg-opacity-20`}>
                        {getTypeIcon(goal.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">{goal.name}</h3>
                          {getStatusBadge(goal.status)}
                          {getPriorityBadge(goal.priority)}
                        </div>
                        <p className="text-white/40 text-sm">{goal.category}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-white/60 text-xs">Progreso</p>
                          <p className="text-white text-sm font-medium">{goal.progress}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 text-xs">Actual</p>
                          <p className="text-white text-sm">{formatCurrency(goal.currentAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 text-xs">Meta</p>
                          <p className="text-white text-sm">{formatCurrency(goal.targetAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 text-xs">Fecha</p>
                          <p className="text-white text-sm">{formatDate(goal.targetDate)}</p>
                        </div>
                        <div className="w-32">
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                goal.progress === 100 ? 'bg-green-500' :
                                isAtRisk ? 'bg-red-500' : 'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                              }`}
                              style={{ width: `${goal.progress}%` }}
                            />
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

          {viewMode === 'timeline' && (
            // Timeline View
            <div className="space-y-4">
              {filteredGoals
                .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
                .map((goal) => {
                  const daysRemaining = getDaysRemaining(goal.targetDate);
                  const isAtRisk = daysRemaining < 30 && goal.progress < 50;
                  
                  return (
                    <div
                      key={goal.id}
                      className="flex items-start gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          goal.status === 'completed' ? 'bg-green-500' :
                          isAtRisk ? 'bg-red-500' : 'bg-[#F05984]'
                        }`} />
                        <div className="w-0.5 h-full bg-white/10" />
                      </div>
                      
                      <div className="flex-1 bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${
                              goal.type === 'emergency' ? 'from-red-500 to-red-600' :
                              goal.type === 'investment' ? 'from-purple-500 to-purple-600' :
                              goal.type === 'travel' ? 'from-blue-500 to-blue-600' :
                              goal.type === 'education' ? 'from-indigo-500 to-indigo-600' :
                              goal.type === 'debt' ? 'from-orange-500 to-orange-600' :
                              goal.type === 'retirement' ? 'from-teal-500 to-teal-600' :
                              'from-green-500 to-green-600'
                            } bg-opacity-20`}>
                              {getTypeIcon(goal.type)}
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{goal.name}</h3>
                              <p className="text-white/40 text-xs">Meta: {formatCurrency(goal.targetAmount)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-white/60 text-xs">Fecha límite</p>
                              <p className="text-white text-sm">{formatDate(goal.targetDate)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white/60 text-xs">Días restantes</p>
                              <p className={isAtRisk ? 'text-red-400 text-sm' : 'text-white text-sm'}>
                                {daysRemaining > 0 ? daysRemaining : '0'}
                              </p>
                            </div>
                            <div className="w-32">
                              <p className="text-white/60 text-xs mb-1">Progreso {goal.progress}%</p>
                              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    goal.progress === 100 ? 'bg-green-500' :
                                    isAtRisk ? 'bg-red-500' : 'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                                  }`}
                                  style={{ width: `${goal.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">
            Mostrando {filteredGoals.length} de {goals.length} metas
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded bg-[#F05984] text-white">1</button>
            <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white">2</button>
            <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white">3</button>
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalles de meta */}
      {selectedGoal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${
                    selectedGoal.type === 'emergency' ? 'from-red-500 to-red-600' :
                    selectedGoal.type === 'investment' ? 'from-purple-500 to-purple-600' :
                    selectedGoal.type === 'travel' ? 'from-blue-500 to-blue-600' :
                    selectedGoal.type === 'education' ? 'from-indigo-500 to-indigo-600' :
                    selectedGoal.type === 'debt' ? 'from-orange-500 to-orange-600' :
                    selectedGoal.type === 'retirement' ? 'from-teal-500 to-teal-600' :
                    'from-green-500 to-green-600'
                  } bg-opacity-20`}>
                    {getTypeIcon(selectedGoal.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedGoal.name}</h2>
                    <p className="text-white/40 text-sm">{selectedGoal.id} • {selectedGoal.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedGoal.status)}
                  {getPriorityBadge(selectedGoal.priority)}
                </div>

                {selectedGoal.description && (
                  <div>
                    <p className="text-white/60 text-sm mb-1">Descripción</p>
                    <p className="text-white">{selectedGoal.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs">Progreso</p>
                    <p className="text-white text-lg font-bold">{selectedGoal.progress}%</p>
                    <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          selectedGoal.progress === 100 ? 'bg-green-500' :
                          getDaysRemaining(selectedGoal.targetDate) < 30 && selectedGoal.progress < 50 ? 'bg-red-500' :
                          'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                        }`}
                        style={{ width: `${selectedGoal.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs">Tiempo restante</p>
                    <p className="text-white text-lg font-bold">{getDaysRemaining(selectedGoal.targetDate)} días</p>
                    <p className="text-white/40 text-xs mt-1">Meta: {formatDate(selectedGoal.targetDate)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs">Actual</p>
                    <p className="text-white text-lg font-bold">{formatCurrency(selectedGoal.currentAmount)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs">Meta</p>
                    <p className="text-white text-lg font-bold">{formatCurrency(selectedGoal.targetAmount)}</p>
                  </div>
                </div>

                {selectedGoal.monthlyContribution && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs mb-2">Aportación mensual</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white">{formatCurrency(selectedGoal.monthlyContribution)}</span>
                      <span className="text-white/60 text-sm">
                        {selectedGoal.contributionFrequency || 'mensual'}
                      </span>
                    </div>
                    {selectedGoal.autoContribute && (
                      <p className="text-green-400 text-xs mt-1">✓ Aportación automática activada</p>
                    )}
                  </div>
                )}

                {selectedGoal.contributors && selectedGoal.contributors.length > 0 && (
                  <div>
                    <p className="text-white/60 text-sm mb-2">Aportaciones</p>
                    <div className="space-y-2">
                      {selectedGoal.contributors.map((contributor) => (
                        <div key={contributor.id} className="bg-white/5 rounded-lg p-2 flex items-center justify-between">
                          <span className="text-white text-sm">{contributor.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{formatCurrency(contributor.amount)}</span>
                            <span className="text-white/40 text-xs">{formatDate(contributor.date)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedGoal.linkedAccounts && selectedGoal.linkedAccounts.length > 0 && (
                  <div>
                    <p className="text-white/60 text-sm mb-2">Cuentas vinculadas</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedGoal.linkedAccounts.map((account) => (
                        <span key={account} className="bg-white/10 text-white/60 px-2 py-1 rounded-lg text-sm">
                          {account}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedGoal.notes && (
                  <div>
                    <p className="text-white/60 text-sm mb-1">Notas adicionales</p>
                    <p className="text-white bg-white/5 rounded-lg p-3">{selectedGoal.notes}</p>
                  </div>
                )}

                {selectedGoal.tags && selectedGoal.tags.length > 0 && (
                  <div>
                    <p className="text-white/60 text-sm mb-2">Etiquetas</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedGoal.tags.map((tag, index) => (
                        <span key={index} className="bg-white/10 text-white/60 px-2 py-1 rounded-lg text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs text-white/40">
                  <div>
                    <p>Creada: {formatDate(selectedGoal.createdAt)}</p>
                  </div>
                  <div>
                    <p>Actualizada: {formatDate(selectedGoal.updatedAt)}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
                    Cancelar
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">
                    Editar Meta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de creación de meta */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Nueva Meta Financiera</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Nombre de la meta</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                    placeholder="Ej: Ahorro para viaje"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Tipo de meta</label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors">
                    <option value="savings">Ahorro</option>
                    <option value="investment">Inversión</option>
                    <option value="debt">Pago de deuda</option>
                    <option value="purchase">Compra</option>
                    <option value="travel">Viaje</option>
                    <option value="education">Educación</option>
                    <option value="emergency">Fondo de emergencia</option>
                    <option value="retirement">Jubilación</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Monto objetivo</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Fecha objetivo</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Prioridad</label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors">
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Aportación mensual</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoContribute"
                    className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
                  />
                  <label htmlFor="autoContribute" className="text-white/60 text-sm">
                    Activar aportación automática
                  </label>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Descripción</label>
                  <textarea
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                    rows={3}
                    placeholder="Descripción opcional..."
                  />
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
                    Crear Meta
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
