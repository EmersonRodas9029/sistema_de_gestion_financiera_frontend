import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Plus, Search, Edit, Trash2, ChevronRight, ChevronLeft,
  Calendar, TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3, RefreshCw,
  Filter, Home as HomeIcon, Briefcase, Gift, Award, Smartphone,
  Laptop, Plane, Hotel, Shirt, Dumbbell, BookOpen, Coffee, Dog, Sparkles,
  AlertCircle, CheckCircle, Clock, X, Save, Flag,
  Trophy, Rocket, Star, Crown, Gem, Wallet, CreditCard, DollarSign, Percent,
  Activity, XCircle, Tag,
  Car, Heart, ShoppingBag, ChevronDown, ChevronUp,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line 
} from 'recharts';

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
  linkedAccounts?: string[];
  notes?: string;
  attachments?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Colores para el gráfico de pastel
const CHART_COLORS = ['#F05984', '#BC455F', '#6E4068', '#321D28', '#2DD4BF', '#F59E0B', '#10B981', '#6366F1'];

// Datos de tendencia mensual (simulados)
const monthlyTrends = [
  { month: 'Sep', amount: 1250 },
  { month: 'Oct', amount: 1480 },
  { month: 'Nov', amount: 1320 },
  { month: 'Dic', amount: 1670 },
  { month: 'Ene', amount: 1820 },
  { month: 'Feb', amount: 2150 },
];

// Función para generar ID único
const generateUniqueId = () => {
  return `GOAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Datos iniciales por defecto
const getDefaultGoals = (): Goal[] => [
  {
    id: generateUniqueId(),
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
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    id: generateUniqueId(),
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
    contributionFrequency: 'monthly',
    linkedAccounts: ['ACC-006'],
    notes: 'Fondo de retiro a largo plazo',
    attachments: 0,
    tags: ['jubilación', 'retiro', 'largo plazo'],
    createdAt: '2024-01-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const GoalsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPriority, setSelectedPriority] = useState<string>('todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'target' | 'date'>('progress');
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
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem('goals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return getDefaultGoals();
    } catch (error) {
      console.error('Error loading goals:', error);
      return getDefaultGoals();
    }
  });

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Guardar en localStorage cuando cambien las metas
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  // Calcular estadísticas en tiempo real
  const totalGoals = goals.length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
  const monthlyContribution = goals.reduce((sum, g) => sum + (g.monthlyContribution || 0), 0);
  
  const onTrackGoals = goals.filter(g => {
    if (g.status !== 'active') return false;
    const daysRemaining = Math.ceil((new Date(g.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const expectedProgress = daysRemaining > 0 ? (g.currentAmount / g.targetAmount) * 100 : 100;
    return expectedProgress >= (g.progress || 0);
  }).length;
  
  const atRiskGoals = activeGoals - onTrackGoals;

  // Calcular categorías para el gráfico
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

  // Datos para el gráfico de pastel
  const pieChartData = Array.from(categoryMap.entries()).map(([name, data], idx) => ({
    name,
    value: data.totalTarget,
    current: data.totalCurrent,
    color: CHART_COLORS[idx % CHART_COLORS.length],
    count: data.count
  }));

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Ahorro': 'from-green-500 to-green-600',
      'Viajes': 'from-blue-500 to-blue-600',
      'Vehículo': 'from-orange-500 to-orange-600',
      'Inversiones': 'from-purple-500 to-purple-600',
      'Deudas': 'from-red-500 to-red-600',
      'Educación': 'from-indigo-500 to-indigo-600',
      'Vivienda': 'from-cyan-500 to-cyan-600',
      'Eventos': 'from-pink-500 to-pink-600',
      'Jubilación': 'from-teal-500 to-teal-600',
      'Tecnología': 'from-gray-500 to-gray-600',
      'Salud': 'from-amber-500 to-amber-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Ahorro': <Wallet size={16} />,
      'Viajes': <Plane size={16} />,
      'Vehículo': <Car size={16} />,
      'Inversiones': <TrendingUp size={16} />,
      'Deudas': <CreditCard size={16} />,
      'Educación': <BookOpen size={16} />,
      'Vivienda': <HomeIcon size={16} />,
      'Eventos': <Gift size={16} />,
      'Jubilación': <Crown size={16} />,
      'Tecnología': <Laptop size={16} />,
      'Salud': <Heart size={16} />
    };
    return icons[category] || <Target size={16} />;
  };

  const categorySummary = Array.from(categoryMap.entries()).map(([name, data], idx) => ({
    name,
    count: data.count,
    totalTarget: data.totalTarget,
    totalCurrent: data.totalCurrent,
    progress: data.totalTarget > 0 ? (data.totalCurrent / data.totalTarget) * 100 : 0,
    color: getCategoryColor(name),
    icon: getCategoryIcon(name),
    chartColor: CHART_COLORS[idx % CHART_COLORS.length]
  })).sort((a, b) => b.totalTarget - a.totalTarget);

  const topCategories = categorySummary.slice(0, 5);

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todas' || goal.type === selectedType;
    const matchesStatus = selectedStatus === 'todos' || goal.status === selectedStatus;
    const matchesPriority = selectedPriority === 'todas' || goal.priority === selectedPriority;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'progress') {
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
    const newGoal: Goal = {
      id: generateUniqueId(),
      name: formData.name,
      description: formData.description || undefined,
      type: formData.type as Goal['type'],
      category: formData.category,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: formData.targetDate,
      status: 'active',
      priority: formData.priority as Goal['priority'],
      progress: 0,
      monthlyContribution: parseFloat(formData.monthlyContribution) || undefined,
      autoContribute: formData.autoContribute,
      notes: formData.notes || undefined,
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

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setEditFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      monthlyContribution: goal.monthlyContribution?.toString() || '',
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
          monthlyContribution: editFormData.monthlyContribution ? parseFloat(editFormData.monthlyContribution) : undefined,
          priority: editFormData.priority as Goal['priority'],
          updatedAt: new Date().toISOString()
        } : g
      );
      setGoals(updatedGoals);
      setShowEditModal(false);
      setSelectedGoal(null);
    }
  };

  const handleEditStatus = (goal: Goal) => {
    setSelectedGoal(goal);
    setNewStatus(goal.status);
    setShowEditStatusModal(true);
  };

  const handleUpdateStatus = () => {
    if (selectedGoal && newStatus && newStatus !== selectedGoal.status) {
      setGoals(prev => 
        prev.map(g => 
          g.id === selectedGoal.id ? { ...g, status: newStatus as Goal['status'], updatedAt: new Date().toISOString() } : g
        )
      );
    }
    setShowEditStatusModal(false);
    setSelectedGoal(null);
    setNewStatus('');
  };

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta meta?')) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const resetData = () => {
    if (window.confirm('¿Esto restaurará los datos a los valores por defecto. ¿Continuar?')) {
      localStorage.removeItem('goals');
      setGoals(getDefaultGoals());
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('todas');
    setSelectedStatus('todos');
    setSelectedPriority('todas');
    setCurrentPage(1);
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
      case 'savings': return <Wallet size={16} className="text-white" />;
      case 'investment': return <TrendingUp size={16} className="text-white" />;
      case 'debt': return <CreditCard size={16} className="text-white" />;
      case 'purchase': return <ShoppingBag size={16} className="text-white" />;
      case 'travel': return <Plane size={16} className="text-white" />;
      case 'education': return <BookOpen size={16} className="text-white" />;
      case 'emergency': return <AlertCircle size={16} className="text-white" />;
      case 'retirement': return <Crown size={16} className="text-white" />;
      default: return <Target size={16} className="text-white" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'emergency': return 'from-red-500 to-red-600';
      case 'investment': return 'from-purple-500 to-purple-600';
      case 'travel': return 'from-blue-500 to-blue-600';
      case 'education': return 'from-indigo-500 to-indigo-600';
      case 'debt': return 'from-orange-500 to-orange-600';
      case 'retirement': return 'from-teal-500 to-teal-600';
      default: return 'from-green-500 to-green-600';
    }
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const hasActiveFilters = searchTerm !== '' || selectedType !== 'todas' || selectedStatus !== 'todos' || selectedPriority !== 'todas';

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
              <Target size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Metas Financieras</h1>
              <p className="text-white/50 text-sm mt-1">Define y da seguimiento a tus objetivos financieros</p>
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
              <Target size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300"
            >
              <Plus size={20} />
              <span className="hidden sm:inline font-medium">Nueva Meta</span>
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
              <p className="text-white/50 text-sm font-medium">Progreso General</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{overallProgress.toFixed(0)}%</p>
              <p className="text-white/30 text-xs mt-1">{totalCurrent > 0 ? formatCurrency(totalCurrent) : '$0'} ahorrados</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <Target size={24} className="text-[#F05984]" />
            </div>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full"
            />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Total Ahorrado</p>
              <p className="text-2xl font-bold text-green-400 mt-1 tracking-tight">{formatCurrency(totalCurrent)}</p>
              <p className="text-white/30 text-xs mt-1">de {formatCurrency(totalTarget)}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <Wallet size={24} className="text-green-400" />
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
              <p className="text-white/50 text-sm font-medium">Metas Activas</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1 tracking-tight">{activeGoals}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-400 text-xs">{onTrackGoals} en camino</span>
                <span className="text-red-400 text-xs">{atRiskGoals} en riesgo</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Flag size={24} className="text-yellow-400" />
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
              <p className="text-white/50 text-sm font-medium">Aportación Mensual</p>
              <p className="text-2xl font-bold text-blue-400 mt-1 tracking-tight">{formatCurrency(monthlyContribution)}</p>
              <p className="text-white/30 text-xs mt-1">Total de aportaciones</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <TrendingUp size={24} className="text-blue-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Gráficos de Distribución y Tendencia */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pastel - Distribución por Categoría */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={20} className="text-[#F05984]" />
            <h3 className="text-white font-semibold">Distribución por Categoría</h3>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
                  formatter={(value: number) => [formatCurrency(value), 'Meta']}
                  labelStyle={{ color: 'white' }}
                />
                <Legend 
                  formatter={(value) => <span className="text-white/70 text-xs">{value}</span>}
                  wrapperStyle={{ paddingTop: '20px' }}
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Categorías */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#F05984]" />
            Top 5 Categorías
          </h3>
          <div className="space-y-4">
            {topCategories.map((cat, index) => (
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
                    <span className="text-white/50 text-xs">{cat.progress.toFixed(0)}%</span>
                    <span className="text-white text-sm font-semibold">{formatCurrency(cat.totalTarget)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/60">{cat.count} meta(s)</span>
                  <span className="text-white/60">Progreso: {formatCurrency(cat.totalCurrent)}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.progress}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gráfico de Tendencia de Ahorros */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LineChartIcon size={18} className="text-[#F05984]" />
            <h3 className="text-white font-semibold">Tendencia de Ahorros</h3>
          </div>
          <span className="text-white/40 text-xs">Últimos 6 meses</span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyTrends} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="month" stroke="#ffffff60" tick={{ fill: '#ffffff60', fontSize: 12 }} />
            <YAxis 
              stroke="#ffffff60" 
              tick={{ fill: '#ffffff60', fontSize: 11 }}
              tickFormatter={(value) => formatCurrency(value)}
              width={65}
            />
            <ReTooltip
              contentStyle={{ backgroundColor: '#1a0f14', border: '1px solid #F05984', borderRadius: '8px' }}
              formatter={(value: number) => [formatCurrency(value), 'Ahorrado']}
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
        </ResponsiveContainer>
      </motion.div>

      {/* Filters and Search con panel colapsable */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Buscar metas..."
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

          {/* Panel de filtros colapsable */}
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
                    <label className="text-white/60 text-xs mb-1 block">Tipo de Meta</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todas" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos los tipos</option>
                      <option value="savings" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Ahorro</option>
                      <option value="investment" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Inversión</option>
                      <option value="debt" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Deuda</option>
                      <option value="purchase" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Compra</option>
                      <option value="travel" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Viaje</option>
                      <option value="education" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Educación</option>
                      <option value="emergency" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Emergencia</option>
                      <option value="retirement" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Jubilación</option>
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
                      <option value="active" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Activas</option>
                      <option value="completed" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Completadas</option>
                      <option value="paused" style={{ backgroundColor: '#1a0f14', color: 'white' }}>En pausa</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Prioridad</label>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todas" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todas las prioridades</option>
                      <option value="critical" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Crítica</option>
                      <option value="high" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Alta</option>
                      <option value="medium" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Media</option>
                      <option value="low" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Baja</option>
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
              onClick={() => { setSortBy('progress'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'progress' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <Activity size={14} />
              <span>Progreso</span>
              {sortBy === 'progress' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            <button
              onClick={() => { setSortBy('target'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'target' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <DollarSign size={14} />
              <span>Monto</span>
              {sortBy === 'target' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            <button
              onClick={() => { setSortBy('date'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'date' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <Calendar size={14} />
              <span>Fecha</span>
              {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
          </div>
          <span className="text-white/40 text-sm">{filteredGoals.length} resultados</span>
        </div>

        {/* Estado Vacío */}
        {filteredGoals.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-4"
          >
            <div className="p-4 bg-white/10 rounded-full mb-4">
              <Target size={48} className="text-white/30" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No hay metas financieras</h3>
            <p className="text-white/40 text-sm text-center max-w-md">
              No se encontraron metas con los filtros actuales.
              Prueba a ajustar los filtros o crea una nueva meta.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              <span>Crear nueva meta</span>
            </motion.button>
          </motion.div>
        )}

        {/* Grid View Mejorado */}
        {filteredGoals.length > 0 && viewMode === 'grid' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {paginatedGoals.map((goal, index) => {
                const daysRemaining = getDaysRemaining(goal.targetDate);
                const isAtRisk = daysRemaining < 30 && goal.progress < 50;
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border transition-all duration-300 cursor-pointer hover:shadow-xl ${
                      isAtRisk ? 'border-red-500/50 shadow-red-500/20' : 
                      goal.status === 'completed' ? 'border-green-500/50 shadow-green-500/20' :
                      'border-white/10 hover:border-[#F05984]/50'
                    }`}
                  >
                    {isAtRisk && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full blur-2xl" />
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-gradient-to-r ${getTypeColor(goal.type)} bg-opacity-20 shadow-lg`}>
                          {getTypeIcon(goal.type)}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{goal.name}</h3>
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
                        <span className="text-white/50">Progreso:</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            goal.progress === 100 ? 'text-green-400' : 
                            isAtRisk ? 'text-red-400' : 'text-white'
                          }`}>{goal.progress}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${
                            goal.progress === 100 ? 'bg-green-500' : 
                            isAtRisk ? 'bg-red-500' : 
                            'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Actual:</span>
                        <span className="text-white font-medium">{formatCurrency(goal.currentAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Meta:</span>
                        <span className="text-white">{formatCurrency(goal.targetAmount)}</span>
                      </div>
                      {goal.monthlyContribution && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/50">Aportación:</span>
                          <span className="text-white">{formatCurrency(goal.monthlyContribution)}/mes</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1 text-white/40">
                        <Calendar size={12} />
                        <span>{formatDate(goal.targetDate)}</span>
                      </div>
                      <div>
                        {daysRemaining > 0 ? (
                          <span className={isAtRisk ? 'text-red-400 font-medium' : 'text-white/40'}>
                            {daysRemaining} días
                          </span>
                        ) : (
                          <span className="text-green-400">¡Completada!</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {getPriorityBadge(goal.priority)}
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditGoal(goal)}
                        className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400"
                        title="Editar meta"
                      >
                        <Edit size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditStatus(goal)}
                        className="p-1.5 hover:bg-purple-500/20 rounded-lg transition-all duration-300 text-purple-400"
                        title="Cambiar estado"
                      >
                        <Activity size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400"
                        title="Eliminar meta"
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
        {filteredGoals.length > 0 && viewMode === 'list' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 space-y-2"
          >
            <AnimatePresence>
              {paginatedGoals.map((goal, index) => {
                const daysRemaining = getDaysRemaining(goal.targetDate);
                const isAtRisk = daysRemaining < 30 && goal.progress < 50;
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.01 }}
                    className={`bg-gradient-to-r from-white/5 to-white/0 rounded-lg p-3 border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                      isAtRisk ? 'border-red-500/30' : 
                      goal.status === 'completed' ? 'border-green-500/30' :
                      'border-white/10 hover:border-[#F05984]/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(goal.type)} bg-opacity-20`}>
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
                          <p className="text-white/50 text-xs">Progreso</p>
                          <p className={`text-sm font-medium ${
                            goal.progress === 100 ? 'text-green-400' : 
                            isAtRisk ? 'text-red-400' : 'text-white'
                          }`}>{goal.progress}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-xs">Actual</p>
                          <p className="text-white text-sm">{formatCurrency(goal.currentAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-xs">Meta</p>
                          <p className="text-white text-sm">{formatCurrency(goal.targetAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-xs">Fecha</p>
                          <p className="text-white text-sm">{formatDate(goal.targetDate)}</p>
                        </div>
                        <div className="w-32">
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.progress}%` }}
                              transition={{ duration: 0.6 }}
                              className={`h-full rounded-full ${
                                goal.progress === 100 ? 'bg-green-500' : 
                                isAtRisk ? 'bg-red-500' : 
                                'bg-gradient-to-r from-[#F05984] to-[#BC455F]'
                              }`}
                            />
                          </div>
                          <p className="text-white/40 text-xs text-right mt-1">{goal.progress}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditGoal(goal)}
                          className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditStatus(goal)}
                          className="p-1.5 hover:bg-purple-500/20 rounded-lg transition-all duration-300 text-purple-400"
                        >
                          <Activity size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteGoal(goal.id)}
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
        {filteredGoals.length > 0 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-white/40 text-sm">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredGoals.length)} de {filteredGoals.length} metas
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

      {/* Modal para crear nueva meta - Mejorado con animación */}
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
              className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-lg shadow-lg">
                    <Target size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Nueva Meta Financiera</h2>
                    <p className="text-white/40 text-sm">Define un nuevo objetivo financiero</p>
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
                <form onSubmit={(e) => { e.preventDefault(); handleCreateGoal(); }} className="space-y-5">
                  {/* Formulario simplificado por brevedad, mantener el mismo contenido del código original */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Nombre de la meta *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Ej: Ahorro para viaje" required />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Categoría *</label>
                      <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Ej: Viajes, Ahorro, Inversión" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Tipo de meta</label>
                      <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
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
                      <label className="text-white/60 text-sm mb-1.5 block">Prioridad</label>
                      <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="critical">Crítica</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Monto objetivo *</label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input type="number" step="0.01" value={formData.targetAmount} onChange={(e) => setFormData({...formData, targetAmount: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="0.00" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Aportación mensual</label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input type="number" step="0.01" value={formData.monthlyContribution} onChange={(e) => setFormData({...formData, monthlyContribution: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="0.00" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Fecha objetivo *</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input type="date" value={formData.targetDate} onChange={(e) => setFormData({...formData, targetDate: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                      </div>
                    </div>
                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.autoContribute} onChange={(e) => setFormData({...formData, autoContribute: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                        <span className="text-white text-sm">Activar aportación automática</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Descripción</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Descripción opcional..." />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Notas adicionales</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Notas adicionales..." />
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
                      <span>Guardar Meta</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para editar meta - Mejorado con animación */}
      <AnimatePresence>
        {showEditModal && selectedGoal && (
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
              className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Edit size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Editar Meta</h2>
                    <p className="text-white/40 text-sm">Modifica los datos de la meta</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>
              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleUpdateGoal(); }} className="space-y-4">
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Nombre</label>
                    <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Monto objetivo</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                      <input type="number" step="0.01" value={editFormData.targetAmount} onChange={(e) => setEditFormData({...editFormData, targetAmount: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Aportación mensual</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                      <input type="number" step="0.01" value={editFormData.monthlyContribution} onChange={(e) => setEditFormData({...editFormData, monthlyContribution: e.target.value})} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Prioridad</label>
                    <select value={editFormData.priority} onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="critical">Crítica</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
                    >
                      Guardar Cambios
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
        {showEditStatusModal && selectedGoal && (
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
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Activity size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Cambiar Estado</h2>
                    <p className="text-white/40 text-sm">Actualiza el estado de la meta</p>
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
                    <label className="text-white/60 text-sm mb-1.5 block">Meta</label>
                    <p className="text-white font-medium">{selectedGoal.name}</p>
                    <p className="text-white/40 text-sm mt-1">{formatCurrency(selectedGoal.targetAmount)}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Nuevo Estado</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="active">Activa</option>
                      <option value="paused">En pausa</option>
                      <option value="completed">Completada</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowEditStatusModal(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpdateStatus}
                      className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
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
          width: 6px;
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