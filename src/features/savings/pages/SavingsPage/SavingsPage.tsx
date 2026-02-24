import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target,
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
  TrendingUp,
  DollarSign,
  Wallet,
  Home as HomeIcon,
  Briefcase,
  Gift,
  Award,
  Laptop,
  Plane,
  Car,
  Heart,
  BookOpen,
  Coffee,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUp,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  PiggyBank,
  Crown,
  Repeat,
  BarChart3
} from 'lucide-react';

interface SavingsGoal {
  id: string;
  name: string;
  description?: string;
  type: 'emergency' | 'retirement' | 'education' | 'travel' | 'purchase' | 'investment' | 'wedding' | 'house' | 'car' | 'custom';
  category: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  targetDate: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  monthlyContribution: number;
  autoContribute: boolean;
  tags: string[];
}

interface SavingsSummary {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalTarget: number;
  totalCurrent: number;
  overallProgress: number;
  monthlyContribution: number;
}

export const SavingsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'progress' | 'target' | 'date'>('progress');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const itemsPerPage = 12;

  // Resumen de metas de ahorro
  const summary: SavingsSummary = {
    totalGoals: 12,
    activeGoals: 9,
    completedGoals: 3,
    totalTarget: 185000,
    totalCurrent: 78250,
    overallProgress: 42,
    monthlyContribution: 3250
  };

  // Datos de ejemplo - Metas de ahorro
  const savingsGoals: SavingsGoal[] = [
    {
      id: 'SAV-001',
      name: 'Fondo de Emergencia',
      description: 'Ahorrar para imprevistos y emergencias',
      type: 'emergency',
      category: 'Seguridad',
      targetAmount: 15000,
      currentAmount: 8750,
      startDate: '2024-01-15',
      targetDate: '2024-12-31',
      status: 'active',
      priority: 'critical',
      progress: 58,
      monthlyContribution: 800,
      autoContribute: true,
      tags: ['emergencia', 'seguridad']
    },
    {
      id: 'SAV-002',
      name: 'Vacaciones Europa',
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
      autoContribute: true,
      tags: ['viajes', 'vacaciones']
    },
    {
      id: 'SAV-003',
      name: 'Compra de Auto',
      description: 'Ahorrar para un auto nuevo',
      type: 'car',
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
      tags: ['auto', 'vehículo']
    },
    {
      id: 'SAV-004',
      name: 'Fondo de Inversión',
      description: 'Ahorrar para invertir',
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
      tags: ['inversión']
    },
    {
      id: 'SAV-005',
      name: 'Maestría',
      description: 'Ahorrar para una maestría',
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
      autoContribute: true,
      tags: ['educación']
    },
    {
      id: 'SAV-006',
      name: 'Enganche para Casa',
      description: 'Ahorrar para el enganche de una casa',
      type: 'house',
      category: 'Vivienda',
      targetAmount: 50000,
      currentAmount: 4500,
      startDate: '2024-01-01',
      targetDate: '2026-12-31',
      status: 'active',
      priority: 'medium',
      progress: 9,
      monthlyContribution: 800,
      autoContribute: true,
      tags: ['casa', 'vivienda']
    },
    {
      id: 'SAV-007',
      name: 'Boda',
      description: 'Ahorrar para la boda',
      type: 'wedding',
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
      tags: ['boda']
    },
    {
      id: 'SAV-008',
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
      tags: ['jubilación', 'retiro']
    },
    {
      id: 'SAV-009',
      name: 'iPhone 15 Pro',
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
      autoContribute: true,
      tags: ['tecnología']
    },
    {
      id: 'SAV-010',
      name: 'Gimnasio Anual',
      description: 'Membresía anual del gimnasio',
      type: 'custom',
      category: 'Salud',
      targetAmount: 600,
      currentAmount: 150,
      startDate: '2024-03-01',
      targetDate: '2024-12-31',
      status: 'active',
      priority: 'low',
      progress: 25,
      monthlyContribution: 50,
      autoContribute: true,
      tags: ['salud']
    },
    {
      id: 'SAV-011',
      name: 'Curso de Inglés',
      description: 'Curso intensivo de inglés',
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
      tags: ['inglés']
    },
    {
      id: 'SAV-012',
      name: 'Viaje a Japón',
      description: 'Ahorrar para viaje a Japón',
      type: 'travel',
      category: 'Viajes',
      targetAmount: 4000,
      currentAmount: 600,
      startDate: '2024-02-15',
      targetDate: '2025-03-31',
      status: 'active',
      priority: 'medium',
      progress: 15,
      monthlyContribution: 200,
      autoContribute: true,
      tags: ['viajes', 'japón']
    }
  ];

  const filteredGoals = savingsGoals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'todos' || goal.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    if (sortBy === 'progress') {
      return sortOrder === 'asc' ? a.progress - b.progress : b.progress - a.progress;
    } else if (sortBy === 'target') {
      return sortOrder === 'asc' ? a.targetAmount - b.targetAmount : b.targetAmount - a.targetAmount;
    } else {
      return sortOrder === 'asc'
        ? new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
        : new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime();
    }
  });

  const totalPages = Math.ceil(sortedGoals.length / itemsPerPage);
  const paginatedGoals = sortedGoals.slice(
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
      minimumFractionDigits: 0
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
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Activa</span>;
      case 'completed':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">Completada</span>;
      case 'paused':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">En pausa</span>;
      case 'cancelled':
        return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">Cancelada</span>;
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
      case 'emergency':
        return <AlertCircle size={16} className="text-white" />;
      case 'retirement':
        return <Crown size={16} className="text-white" />;
      case 'education':
        return <BookOpen size={16} className="text-white" />;
      case 'travel':
        return <Plane size={16} className="text-white" />;
      case 'purchase':
        return <Laptop size={16} className="text-white" />;
      case 'investment':
        return <TrendingUp size={16} className="text-white" />;
      case 'wedding':
        return <Gift size={16} className="text-white" />;
      case 'house':
        return <HomeIcon size={16} className="text-white" />;
      case 'car':
        return <Car size={16} className="text-white" />;
      default:
        return <PiggyBank size={16} className="text-white" />;
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Metas de Ahorro</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">
              {savingsGoals.length} metas
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Define y da seguimiento a tus metas de ahorro
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
            <PiggyBank size={20} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={20} />
            <span className="hidden sm:inline">Nueva Meta</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Ahorro Total</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalCurrent)}</p>
          <div className="flex items-center gap-1 mt-1">
            <Target size={14} className="text-[#F05984]" />
            <span className="text-white/60 text-xs">Meta: {formatCurrency(summary.totalTarget)}</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full"
              style={{ width: `${summary.overallProgress}%` }}
            />
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Metas Activas</p>
          <p className="text-xl font-bold text-white">{summary.activeGoals}</p>
          <p className="text-white/40 text-xs mt-1">{summary.completedGoals} completadas</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Aportación Mensual</p>
          <p className="text-xl font-bold text-white">{formatCurrency(summary.monthlyContribution)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Progreso General</p>
          <p className="text-xl font-bold text-white">{summary.overallProgress}%</p>
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
                placeholder="Buscar metas por nombre..."
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
                setSortBy('progress');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'progress' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Activity size={14} />
              <span>Progreso</span>
              {sortBy === 'progress' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('target');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'target' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <DollarSign size={14} />
              <span>Monto</span>
              {sortBy === 'target' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('date');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'date' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Calendar size={14} />
              <span>Fecha</span>
              {sortBy === 'date' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
          </div>
          <span className="text-white/40 text-sm">
            {filteredGoals.length} resultados
          </span>
        </div>

        {/* Grid/List View */}
        <div className="p-4">
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedGoals.map((goal) => {
                const daysRemaining = Math.ceil(
                  (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                const isAtRisk = daysRemaining < 60 && goal.progress < 30;
                
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
                          goal.type === 'house' ? 'from-cyan-500 to-cyan-600' :
                          goal.type === 'car' ? 'from-orange-500 to-orange-600' :
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
                      <p className="text-white/60 text-xs mb-3 line-clamp-2">{goal.description}</p>
                    )}

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Progreso:</span>
                        <span className="text-white font-medium">{goal.progress}%</span>
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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Aportación:</span>
                        <span className="text-white">{formatCurrency(goal.monthlyContribution)}/mes</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1 text-white/40">
                        <Calendar size={12} />
                        <span>{formatDate(goal.targetDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {daysRemaining > 0 ? (
                          <span className={isAtRisk ? 'text-red-400 font-medium' : 'text-white/40'}>
                            {daysRemaining} días
                          </span>
                        ) : (
                          <span className="text-green-400">¡Completada!</span>
                        )}
                      </div>
                    </div>

                    {getPriorityBadge(goal.priority)}

                    <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-white/10">
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <Eye size={14} className="text-white/60" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <Edit size={14} className="text-white/60" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <Trash2 size={14} className="text-white/60 hover:text-red-400" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <MoreVertical size={14} className="text-white/60" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {paginatedGoals.map((goal) => {
                const daysRemaining = Math.ceil(
                  (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                const isAtRisk = daysRemaining < 60 && goal.progress < 30;
                
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
                        goal.type === 'house' ? 'from-cyan-500 to-cyan-600' :
                        goal.type === 'car' ? 'from-orange-500 to-orange-600' :
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
                        <p className="text-white/40 text-xs">{goal.category}</p>
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
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredGoals.length)} de {filteredGoals.length} metas
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

      {/* Modal de detalles de meta */}
      {selectedGoal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedGoal.name}</h2>
                  <p className="text-white/40 text-sm">{selectedGoal.id}</p>
                </div>
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XCircle size={20} className="text-white/60" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60 text-xs mb-1">Progreso</p>
                  <p className="text-white text-lg font-bold">{selectedGoal.progress}%</p>
                  <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full"
                      style={{ width: `${selectedGoal.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs">Actual</p>
                    <p className="text-white font-bold">{formatCurrency(selectedGoal.currentAmount)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/60 text-xs">Meta</p>
                    <p className="text-white font-bold">{formatCurrency(selectedGoal.targetAmount)}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 text-sm">
                    Cerrar
                  </button>
                  <button className="px-3 py-1.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg text-sm">
                    Editar
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
