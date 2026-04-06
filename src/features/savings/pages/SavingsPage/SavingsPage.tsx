import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, Plus, Search, Edit, Trash2, Eye, ChevronRight, ChevronLeft,
  Calendar, TrendingUp, TrendingDown, PieChart, BarChart3, RefreshCw,
  Download, Filter, Home as HomeIcon, Briefcase, Gift, Award, Smartphone,
  Laptop, Plane, Hotel, Shirt, Dumbbell, BookOpen, Coffee, Dog, Sparkles,
  AlertCircle, CheckCircle, Clock, ArrowUp, ArrowDown, X, Save, Flag,
  Trophy, Rocket, Star, Crown, Gem, Wallet, CreditCard, DollarSign, Percent,
  LineChart, Activity, XCircle, User, Hash, Calendar as CalendarIcon,
  Car, Heart, ShoppingBag, ChevronDown, ChevronUp, PiggyBank, Shield
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
  createdAt: string;
  updatedAt: string;
}

// Función para generar ID único
const generateUniqueId = () => {
  return `SAV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Datos iniciales por defecto
const getDefaultSavingsGoals = (): SavingsGoal[] => [
  {
    id: generateUniqueId(),
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
    tags: ['emergencia', 'seguridad'],
    createdAt: '2024-01-15',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    tags: ['viajes', 'vacaciones'],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    tags: ['auto', 'vehículo'],
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    tags: ['inversión'],
    createdAt: '2024-01-10',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    tags: ['educación'],
    createdAt: '2024-01-15',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    tags: ['casa', 'vivienda'],
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    tags: ['boda'],
    createdAt: '2024-01-01',
    updatedAt: '2024-03-15'
  },
  {
    id: generateUniqueId(),
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
    tags: ['jubilación', 'retiro'],
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    tags: ['tecnología'],
    createdAt: '2024-02-15',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    tags: ['salud'],
    createdAt: '2024-03-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    tags: ['inglés'],
    createdAt: '2024-03-15',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    tags: ['viajes', 'japón'],
    createdAt: '2024-02-15',
    updatedAt: '2024-02-23'
  }
];

export const SavingsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPriority, setSelectedPriority] = useState<string>('todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'progress' | 'target' | 'date'>('progress');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editFormData, setEditFormData] = useState({
    name: '',
    targetAmount: '',
    monthlyContribution: '',
    priority: 'medium'
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'savings',
    category: '',
    targetAmount: '',
    monthlyContribution: '',
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
    priority: 'medium',
    autoContribute: false,
    notes: ''
  });

  const itemsPerPage = 6;

  // Cargar datos desde localStorage o usar datos por defecto
  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem('savingsGoals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return getDefaultSavingsGoals();
    } catch (error) {
      console.error('Error loading savings goals:', error);
      return getDefaultSavingsGoals();
    }
  });

  // Guardar en localStorage cuando cambien las metas
  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
  }, [goals]);

  // Calcular estadísticas en tiempo real
  const totalGoals = goals.length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
  const monthlyContribution = goals.reduce((sum, g) => sum + (g.monthlyContribution || 0), 0);

  // Calcular categorías
  const categoryMap = new Map<string, { count: number; totalTarget: number; totalCurrent: number }>();
  goals.forEach(g => {
    const existing = categoryMap.get(g.category);
    if (existing) {
      existing.count += 1;
      existing.totalTarget += g.targetAmount;
      existing.totalCurrent += g.currentAmount;
    } else {
      categoryMap.set(g.category, { count: 1, totalTarget: g.targetAmount, totalCurrent: g.currentAmount });
    }
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Seguridad': 'from-red-500 to-red-600',
      'Viajes': 'from-blue-500 to-blue-600',
      'Vehículo': 'from-orange-500 to-orange-600',
      'Inversiones': 'from-purple-500 to-purple-600',
      'Educación': 'from-indigo-500 to-indigo-600',
      'Vivienda': 'from-cyan-500 to-cyan-600',
      'Eventos': 'from-pink-500 to-pink-600',
      'Jubilación': 'from-teal-500 to-teal-600',
      'Tecnología': 'from-gray-500 to-gray-600',
      'Salud': 'from-amber-500 to-amber-600'
    };
    return colors[category] || 'from-green-500 to-green-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Seguridad': <Shield size={16} />,
      'Viajes': <Plane size={16} />,
      'Vehículo': <Car size={16} />,
      'Inversiones': <TrendingUp size={16} />,
      'Educación': <BookOpen size={16} />,
      'Vivienda': <HomeIcon size={16} />,
      'Eventos': <Gift size={16} />,
      'Jubilación': <Crown size={16} />,
      'Tecnología': <Laptop size={16} />,
      'Salud': <Heart size={16} />
    };
    return icons[category] || <PiggyBank size={16} />;
  };

  const categorySummary = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    totalTarget: data.totalTarget,
    totalCurrent: data.totalCurrent,
    progress: data.totalTarget > 0 ? (data.totalCurrent / data.totalTarget) * 100 : 0,
    color: getCategoryColor(name),
    icon: getCategoryIcon(name)
  })).sort((a, b) => b.totalTarget - a.totalTarget);

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'todos' || goal.status === selectedStatus;
    const matchesPriority = selectedPriority === 'todas' || goal.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
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

  const handleCreateGoal = () => {
    const newGoal: SavingsGoal = {
      id: generateUniqueId(),
      name: formData.name,
      description: formData.description || undefined,
      type: formData.type as any,
      category: formData.category,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: formData.targetDate,
      status: 'active',
      priority: formData.priority as any,
      progress: 0,
      monthlyContribution: parseFloat(formData.monthlyContribution) || 0,
      autoContribute: formData.autoContribute,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setGoals(prev => [newGoal, ...prev]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      description: '',
      type: 'savings',
      category: '',
      targetAmount: '',
      monthlyContribution: '',
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
      priority: 'medium',
      autoContribute: false,
      notes: ''
    });
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setEditFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      monthlyContribution: goal.monthlyContribution.toString(),
      priority: goal.priority
    });
    setShowEditModal(true);
  };

  const handleUpdateGoal = () => {
    if (selectedGoal) {
      const updatedGoals = goals.map(g => 
        g.id === selectedGoal.id ? {
          ...g,
          name: editFormData.name,
          targetAmount: parseFloat(editFormData.targetAmount),
          monthlyContribution: parseFloat(editFormData.monthlyContribution),
          priority: editFormData.priority as any,
          updatedAt: new Date().toISOString()
        } : g
      );
      setGoals(updatedGoals);
      setShowEditModal(false);
      setSelectedGoal(null);
    }
  };

  const handleEditStatus = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setNewStatus(goal.status);
    setShowEditStatusModal(true);
  };

  const handleUpdateStatus = () => {
    if (selectedGoal && newStatus && newStatus !== selectedGoal.status) {
      setGoals(prev => 
        prev.map(g => 
          g.id === selectedGoal.id ? { ...g, status: newStatus as any, updatedAt: new Date().toISOString() } : g
        )
      );
    }
    setShowEditStatusModal(false);
    setSelectedGoal(null);
    setNewStatus('');
  };

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta meta de ahorro?')) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const resetData = () => {
    if (window.confirm('¿Esto restaurará los datos a los valores por defecto. ¿Continuar?')) {
      localStorage.removeItem('savingsGoals');
      setGoals(getDefaultSavingsGoals());
    }
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
      case 'active': return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Activity size={12} /> Activa</span>;
      case 'completed': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle size={12} /> Completada</span>;
      case 'paused': return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Clock size={12} /> En pausa</span>;
      case 'cancelled': return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><XCircle size={12} /> Cancelada</span>;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'critical': return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">Crítica</span>;
      case 'high': return <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">Alta</span>;
      case 'medium': return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">Media</span>;
      case 'low': return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Baja</span>;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'emergency': return <AlertCircle size={16} className="text-white" />;
      case 'retirement': return <Crown size={16} className="text-white" />;
      case 'education': return <BookOpen size={16} className="text-white" />;
      case 'travel': return <Plane size={16} className="text-white" />;
      case 'purchase': return <Laptop size={16} className="text-white" />;
      case 'investment': return <TrendingUp size={16} className="text-white" />;
      case 'wedding': return <Gift size={16} className="text-white" />;
      case 'house': return <HomeIcon size={16} className="text-white" />;
      case 'car': return <Car size={16} className="text-white" />;
      default: return <PiggyBank size={16} className="text-white" />;
    }
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const hasActiveFilters = searchTerm !== '' || selectedStatus !== 'todos' || selectedPriority !== 'todas';

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Metas de Ahorro</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">{goals.length} metas</span>
          </div>
          <p className="text-white/60 text-sm mt-1">Define y da seguimiento a tus metas de ahorro</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleRefresh} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"><RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}><BarChart3 size={20} /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}><PiggyBank size={20} /></button>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"><Plus size={20} /><span className="hidden sm:inline">Nueva Meta</span></button>
          <button onClick={resetData} className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors text-yellow-400 hover:text-yellow-300" title="Restaurar datos por defecto"><RefreshCw size={20} /></button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Ahorro Total</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalCurrent)}</p>
          <div className="flex items-center gap-1 mt-1"><Target size={14} className="text-[#F05984]" /><span className="text-white/60 text-xs">Meta: {formatCurrency(totalTarget)}</span></div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full" style={{ width: `${overallProgress}%` }} /></div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Metas Activas</p>
          <p className="text-xl font-bold text-white">{activeGoals}</p>
          <p className="text-white/40 text-xs mt-1">{completedGoals} completadas</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Aportación Mensual</p>
          <p className="text-xl font-bold text-white">{formatCurrency(monthlyContribution)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Progreso General</p>
          <p className="text-xl font-bold text-white">{overallProgress.toFixed(0)}%</p>
        </div>
      </div>

      {/* Category Summary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-3">Metas por Categoría</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categorySummary.map((cat, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-2"><div className={`p-1.5 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>{cat.icon}</div><span className="text-white text-sm">{cat.name}</span></div>
              <p className="text-white font-semibold text-sm">{cat.count} metas</p>
              <div className="flex items-center justify-between mt-1"><span className="text-white/40 text-xs">{cat.progress.toFixed(0)}%</span><span className="text-white/40 text-xs">{formatCurrency(cat.totalCurrent)}</span></div>
              <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden"><div className={`h-full bg-gradient-to-r ${cat.color} rounded-full`} style={{ width: `${cat.progress}%` }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} /><input type="text" placeholder="Buscar metas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors" /></div>
            <div className="flex flex-wrap gap-2">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos los estados</option>
                <option value="active" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Activas</option>
                <option value="completed" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Completadas</option>
                <option value="paused" style={{ backgroundColor: '#1a0f14', color: 'white' }}>En pausa</option>
              </select>
              <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}><Filter size={20} /></button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"><Download size={20} /></button>
              {hasActiveFilters && (<button onClick={() => { setSearchTerm(''); setSelectedStatus('todos'); setSelectedPriority('todas'); setCurrentPage(1); }} className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 text-sm"><XCircle size={16} /><span>Limpiar filtros</span></button>)}
            </div>
          </div>
          {showFilters && (<div className="mt-4 pt-4 border-t border-white/10"><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-white/60 text-xs mb-1 block">Prioridad</label><select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
              <option value="todas">Todas las prioridades</option><option value="critical">Crítica</option><option value="high">Alta</option><option value="medium">Media</option><option value="low">Baja</option>
            </select></div>
          </div></div>)}
        </div>

        {/* Sort Bar */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4"><span className="text-white/40 text-sm">Ordenar por:</span>
            <button onClick={() => { setSortBy('progress'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'progress' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}><Activity size={14} /><span>Progreso</span>{sortBy === 'progress' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</button>
            <button onClick={() => { setSortBy('target'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'target' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}><DollarSign size={14} /><span>Monto</span>{sortBy === 'target' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</button>
            <button onClick={() => { setSortBy('date'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'date' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}><Calendar size={14} /><span>Fecha</span>{sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</button>
          </div>
          <span className="text-white/40 text-sm">{filteredGoals.length} resultados</span>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedGoals.map((goal) => {
              const daysRemaining = getDaysRemaining(goal.targetDate);
              const isAtRisk = daysRemaining < 60 && goal.progress < 30;
              return (
                <div key={goal.id} className={`bg-white/5 rounded-xl p-4 border transition-all cursor-pointer hover:border-[#F05984]/50 ${isAtRisk ? 'border-red-500/30' : 'border-white/10'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3"><div className={`p-2 rounded-lg bg-gradient-to-r ${goal.type === 'emergency' ? 'from-red-500 to-red-600' : goal.type === 'investment' ? 'from-purple-500 to-purple-600' : goal.type === 'travel' ? 'from-blue-500 to-blue-600' : goal.type === 'education' ? 'from-indigo-500 to-indigo-600' : goal.type === 'house' ? 'from-cyan-500 to-cyan-600' : goal.type === 'car' ? 'from-orange-500 to-orange-600' : goal.type === 'retirement' ? 'from-teal-500 to-teal-600' : 'from-green-500 to-green-600'} bg-opacity-20`}>{getTypeIcon(goal.type)}</div><div><h3 className="text-white font-medium">{goal.name}</h3><p className="text-white/40 text-xs">{goal.category}</p></div></div>
                      {getStatusBadge(goal.status)}
                  </div>
                  {goal.description && <p className="text-white/60 text-sm mb-3 line-clamp-2">{goal.description}</p>}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm"><span className="text-white/60">Progreso:</span><span className="text-white font-medium">{goal.progress}%</span></div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className={`h-full rounded-full ${goal.progress === 100 ? 'bg-green-500' : isAtRisk ? 'bg-red-500' : 'bg-gradient-to-r from-[#F05984] to-[#BC455F]'}`} style={{ width: `${goal.progress}%` }} /></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-white/60">Actual:</span><span className="text-white font-medium">{formatCurrency(goal.currentAmount)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-white/60">Meta:</span><span className="text-white">{formatCurrency(goal.targetAmount)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="text-white/60">Aportación:</span><span className="text-white">{formatCurrency(goal.monthlyContribution)}/mes</span></div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10"><div className="flex items-center gap-1 text-white/40"><Calendar size={12} /><span>{formatDate(goal.targetDate)}</span></div><div>{daysRemaining > 0 ? <span className={isAtRisk ? 'text-red-400 font-medium' : 'text-white/40'}>{daysRemaining} días</span> : <span className="text-green-400">¡Completada!</span>}</div></div>
                  {getPriorityBadge(goal.priority)}
                  <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-white/10">
                    <button onClick={() => handleEditGoal(goal)} className="p-1 hover:bg-blue-500/20 rounded transition-colors text-blue-400"><Edit size={14} /></button>
                    <button onClick={() => handleEditStatus(goal)} className="p-1 hover:bg-purple-500/20 rounded transition-colors text-purple-400"><Activity size={14} /></button>
                    <button onClick={() => handleDeleteGoal(goal.id)} className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="p-4 space-y-2">
            {paginatedGoals.map((goal) => {
              const daysRemaining = getDaysRemaining(goal.targetDate);
              const isAtRisk = daysRemaining < 60 && goal.progress < 30;
              return (
                <div key={goal.id} className={`bg-white/5 rounded-lg p-3 border transition-all cursor-pointer hover:border-[#F05984]/50 ${isAtRisk ? 'border-red-500/30' : 'border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${goal.type === 'emergency' ? 'from-red-500 to-red-600' : goal.type === 'investment' ? 'from-purple-500 to-purple-600' : goal.type === 'travel' ? 'from-blue-500 to-blue-600' : goal.type === 'education' ? 'from-indigo-500 to-indigo-600' : goal.type === 'house' ? 'from-cyan-500 to-cyan-600' : goal.type === 'car' ? 'from-orange-500 to-orange-600' : goal.type === 'retirement' ? 'from-teal-500 to-teal-600' : 'from-green-500 to-green-600'} bg-opacity-20`}>{getTypeIcon(goal.type)}</div>
                    <div className="flex-1"><div className="flex items-center gap-2"><h3 className="text-white font-medium">{goal.name}</h3>{getStatusBadge(goal.status)}{getPriorityBadge(goal.priority)}</div><p className="text-white/40 text-sm">{goal.category}</p></div>
                    <div className="flex items-center gap-6">
                      <div className="text-right"><p className="text-white/60 text-xs">Progreso</p><p className="text-white text-sm font-medium">{goal.progress}%</p></div>
                      <div className="text-right"><p className="text-white/60 text-xs">Actual</p><p className="text-white text-sm">{formatCurrency(goal.currentAmount)}</p></div>
                      <div className="text-right"><p className="text-white/60 text-xs">Meta</p><p className="text-white text-sm">{formatCurrency(goal.targetAmount)}</p></div>
                      <div className="w-32"><div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className={`h-full rounded-full ${goal.progress === 100 ? 'bg-green-500' : isAtRisk ? 'bg-red-500' : 'bg-gradient-to-r from-[#F05984] to-[#BC455F]'}`} style={{ width: `${goal.progress}%` }} /></div></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEditGoal(goal)} className="p-1 hover:bg-blue-500/20 rounded transition-colors text-blue-400"><Edit size={16} /></button>
                      <button onClick={() => handleEditStatus(goal)} className="p-1 hover:bg-purple-500/20 rounded transition-colors text-purple-400"><Activity size={16} /></button>
                      <button onClick={() => handleDeleteGoal(goal.id)} className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredGoals.length)} de {filteredGoals.length} metas</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50"><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = totalPages <= 5 ? i + 1 : (currentPage <= 3 ? i + 1 : (currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i));
              return <button key={i} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${currentPage === pageNum ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>{pageNum}</button>;
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Modal para crear nueva meta */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="p-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-lg"><PiggyBank size={20} className="text-white" /></div><div><h2 className="text-xl font-bold text-white">Nueva Meta de Ahorro</h2><p className="text-white/40 text-sm">Define un nuevo objetivo de ahorro</p></div></div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={20} className="text-white/60" /></button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateGoal(); }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-white/60 text-sm mb-1.5 block">Nombre de la meta *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" placeholder="Ej: Ahorro para viaje" required /></div>
                  <div><label className="text-white/60 text-sm mb-1.5 block">Categoría *</label><input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" placeholder="Ej: Viajes, Ahorro, Inversión" required /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-white/60 text-sm mb-1.5 block">Tipo de meta</label><select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                    <option value="emergency">Fondo de emergencia</option><option value="retirement">Jubilación</option><option value="education">Educación</option><option value="travel">Viaje</option><option value="purchase">Compra</option><option value="investment">Inversión</option><option value="wedding">Boda</option><option value="house">Casa</option><option value="car">Auto</option><option value="custom">Personalizado</option>
                  </select></div>
                  <div><label className="text-white/60 text-sm mb-1.5 block">Prioridad</label><select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                    <option value="low">Baja</option><option value="medium">Media</option><option value="high">Alta</option><option value="critical">Crítica</option>
                  </select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-white/60 text-sm mb-1.5 block">Monto objetivo *</label><div className="relative"><DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="number" step="0.01" value={formData.targetAmount} onChange={(e) => setFormData({...formData, targetAmount: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" placeholder="0.00" required /></div></div>
                  <div><label className="text-white/60 text-sm mb-1.5 block">Aportación mensual</label><div className="relative"><DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="number" step="0.01" value={formData.monthlyContribution} onChange={(e) => setFormData({...formData, monthlyContribution: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" placeholder="0.00" /></div></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-white/60 text-sm mb-1.5 block">Fecha objetivo *</label><div className="relative"><CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="date" value={formData.targetDate} onChange={(e) => setFormData({...formData, targetDate: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" required /></div></div>
                  <div className="flex items-center pt-6"><label className="flex items-center gap-2"><input type="checkbox" checked={formData.autoContribute} onChange={(e) => setFormData({...formData, autoContribute: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" /><span className="text-white text-sm">Aportación automática</span></label></div>
                </div>
                <div><label className="text-white/60 text-sm mb-1.5 block">Descripción</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" placeholder="Descripción opcional..." /></div>
                <div><label className="text-white/60 text-sm mb-1.5 block">Notas adicionales</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" placeholder="Notas adicionales..." /></div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors font-medium">Cancelar</button>
                  <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"><Save size={18} /><span>Guardar Meta</span></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar meta */}
      {showEditModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="p-2 bg-blue-500/20 rounded-lg"><Edit size={20} className="text-blue-400" /></div><div><h2 className="text-xl font-bold text-white">Editar Meta</h2><p className="text-white/40 text-sm">Modifica los datos de la meta</p></div></div>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={20} className="text-white/60" /></button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateGoal(); }} className="space-y-4">
                <div><label className="text-white/60 text-sm mb-1.5 block">Nombre</label><input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" required /></div>
                <div><label className="text-white/60 text-sm mb-1.5 block">Monto objetivo</label><div className="relative"><DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="number" step="0.01" value={editFormData.targetAmount} onChange={(e) => setEditFormData({...editFormData, targetAmount: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" required /></div></div>
                <div><label className="text-white/60 text-sm mb-1.5 block">Aportación mensual</label><div className="relative"><DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" /><input type="number" step="0.01" value={editFormData.monthlyContribution} onChange={(e) => setEditFormData({...editFormData, monthlyContribution: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" /></div></div>
                <div><label className="text-white/60 text-sm mb-1.5 block">Prioridad</label><select value={editFormData.priority} onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  <option value="low">Baja</option><option value="medium">Media</option><option value="high">Alta</option><option value="critical">Crítica</option>
                </select></div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">Guardar Cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar estado */}
      {showEditStatusModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="p-2 bg-purple-500/20 rounded-lg"><Activity size={20} className="text-purple-400" /></div><div><h2 className="text-xl font-bold text-white">Cambiar Estado</h2><p className="text-white/40 text-sm">Actualiza el estado de la meta</p></div></div>
              <button onClick={() => setShowEditStatusModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={20} className="text-white/60" /></button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div><label className="text-white/60 text-sm mb-1.5 block">Meta</label><p className="text-white font-medium">{selectedGoal.name}</p><p className="text-white/40 text-sm">{formatCurrency(selectedGoal.targetAmount)}</p></div>
                <div><label className="text-white/60 text-sm mb-1.5 block">Nuevo Estado</label><select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  <option value="active">Activa</option><option value="paused">En pausa</option><option value="completed">Completada</option><option value="cancelled">Cancelada</option>
                </select></div>
                <div className="flex justify-end gap-3 pt-4"><button onClick={() => setShowEditStatusModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">Cancelar</button><button onClick={handleUpdateStatus} className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">Actualizar Estado</button></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
