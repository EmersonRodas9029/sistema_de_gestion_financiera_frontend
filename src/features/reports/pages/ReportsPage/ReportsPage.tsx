import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Share2, Calendar, Filter, RefreshCw,
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, BarChart3,
  Activity, Wallet, Target, Users, Plus, X, Search,
  PieChart as PieChartIcon, Trash2,
  XCircle, Star, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';

interface Report {
  id: string;
  name: string;
  type: 'financial' | 'income' | 'expense' | 'client' | 'budget' | 'goal' | 'tax' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  dateRange: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  generatedBy: string;
  size: string;
  downloads: number;
  lastDownload?: string;
  favorite: boolean;
  tags: string[];
  description?: string;
}

// Función para generar ID único
const generateUniqueId = () => {
  return `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Datos iniciales por defecto
const getDefaultReports = (): Report[] => [
  {
    id: generateUniqueId(),
    name: 'Reporte Financiero Q1 2024',
    type: 'financial',
    format: 'pdf',
    dateRange: '01/01/2024 - 31/03/2024',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    generatedAt: '2024-03-31 10:30',
    generatedBy: 'Emerson Rodríguez',
    size: '2.4 MB',
    downloads: 45,
    lastDownload: '2024-03-31',
    favorite: true,
    tags: ['financiero', 'trimestral', '2024'],
    description: 'Reporte completo del primer trimestre 2024'
  },
  {
    id: generateUniqueId(),
    name: 'Análisis de Ingresos - Febrero 2024',
    type: 'income',
    format: 'excel',
    dateRange: '01/02/2024 - 29/02/2024',
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    generatedAt: '2024-03-01 09:15',
    generatedBy: 'Emerson Rodríguez',
    size: '1.2 MB',
    downloads: 23,
    lastDownload: '2024-03-15',
    favorite: false,
    tags: ['ingresos', 'mensual', '2024'],
    description: 'Análisis detallado de ingresos de febrero'
  },
  {
    id: generateUniqueId(),
    name: 'Reporte de Gastos - Enero 2024',
    type: 'expense',
    format: 'pdf',
    dateRange: '01/01/2024 - 31/01/2024',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    generatedAt: '2024-02-01 14:20',
    generatedBy: 'Emerson Rodríguez',
    size: '1.8 MB',
    downloads: 31,
    lastDownload: '2024-02-10',
    favorite: true,
    tags: ['gastos', 'mensual', '2024'],
    description: 'Reporte completo de gastos de enero'
  },
  {
    id: generateUniqueId(),
    name: 'Reporte de Clientes - Q1 2024',
    type: 'client',
    format: 'excel',
    dateRange: '01/01/2024 - 31/03/2024',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    generatedAt: '2024-03-30 16:45',
    generatedBy: 'Emerson Rodríguez',
    size: '3.1 MB',
    downloads: 12,
    favorite: false,
    tags: ['clientes', 'trimestral'],
    description: 'Análisis de clientes del primer trimestre'
  },
  {
    id: generateUniqueId(),
    name: 'Presupuesto vs Real - Marzo 2024',
    type: 'budget',
    format: 'pdf',
    dateRange: '01/03/2024 - 31/03/2024',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    generatedAt: '2024-03-31 11:00',
    generatedBy: 'Emerson Rodríguez',
    size: '1.5 MB',
    downloads: 18,
    favorite: false,
    tags: ['presupuesto', 'comparativa'],
    description: 'Comparativa entre presupuesto y real'
  },
  {
    id: generateUniqueId(),
    name: 'Metas Financieras - Reporte Anual',
    type: 'goal',
    format: 'pdf',
    dateRange: '01/01/2024 - 31/12/2024',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    generatedAt: '2024-03-28 13:30',
    generatedBy: 'Emerson Rodríguez',
    size: '2.1 MB',
    downloads: 9,
    favorite: true,
    tags: ['metas', 'anual', '2024'],
    description: 'Seguimiento de metas financieras 2024'
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

export const ReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedFormat, setSelectedFormat] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'downloads'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [formData, setFormData] = useState({
    name: '',
    type: 'financial',
    format: 'pdf',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const itemsPerPage = 8;

  // Cargar datos desde localStorage o usar datos por defecto
  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem('reports');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return getDefaultReports();
    } catch (error) {
      console.error('Error loading reports:', error);
      return getDefaultReports();
    }
  });

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Guardar en localStorage cuando cambien los reportes
  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  // Calcular estadísticas
  const totalReports = reports.length;
  const thisMonth = reports.filter(r => {
    const genDate = new Date(r.generatedAt);
    const now = new Date();
    return genDate.getMonth() === now.getMonth() && genDate.getFullYear() === now.getFullYear();
  }).length;
  const totalDownloads = reports.reduce((sum, r) => sum + r.downloads, 0);
  const favoriteReports = reports.filter(r => r.favorite).length;
  const recentReports = reports.filter(r => {
    const genDate = new Date(r.generatedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return genDate >= weekAgo;
  }).length;

  // Datos para el gráfico de distribución por tipo
  const typeDistribution = [
    { name: 'Financiero', value: reports.filter(r => r.type === 'financial').length, color: '#F05984' },
    { name: 'Ingresos', value: reports.filter(r => r.type === 'income').length, color: '#10B981' },
    { name: 'Gastos', value: reports.filter(r => r.type === 'expense').length, color: '#EF4444' },
    { name: 'Clientes', value: reports.filter(r => r.type === 'client').length, color: '#3B82F6' },
    { name: 'Presupuesto', value: reports.filter(r => r.type === 'budget').length, color: '#F59E0B' },
    { name: 'Metas', value: reports.filter(r => r.type === 'goal').length, color: '#8B5CF6' }
  ].filter(d => d.value > 0);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'todos' || report.type === selectedType;
    const matchesFormat = selectedFormat === 'todos' || report.format === selectedFormat;
    const matchesFavorite = showFavoritesOnly ? report.favorite : true;
    const matchesDate = (!dateRange.start || report.startDate >= dateRange.start) &&
                        (!dateRange.end || report.endDate <= dateRange.end);
    
    return matchesSearch && matchesType && matchesFormat && matchesFavorite && matchesDate;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'downloads') {
      return sortOrder === 'asc' ? a.downloads - b.downloads : b.downloads - a.downloads;
    } else {
      return sortOrder === 'asc'
        ? new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime()
        : new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime();
    }
  });

  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);
  const paginatedReports = sortedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleGenerateReport = () => {
    const newReport: Report = {
      id: generateUniqueId(),
      name: formData.name,
      type: formData.type as Report['type'],
      format: formData.format as Report['format'],
      dateRange: `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}`,
      startDate: formData.startDate,
      endDate: formData.endDate,
      generatedAt: new Date().toLocaleString(),
      generatedBy: 'Emerson Rodríguez',
      size: '0 KB',
      downloads: 0,
      favorite: false,
      tags: [formData.type],
      description: formData.description || undefined
    };
    
    setReports([newReport, ...reports]);
    setShowGenerateModal(false);
    setFormData({
      name: '',
      type: 'financial',
      format: 'pdf',
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleDeleteReport = () => {
    if (selectedReport) {
      setReports(reports.filter(r => r.id !== selectedReport.id));
      setShowDeleteModal(false);
      setSelectedReport(null);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, favorite: !r.favorite } : r
    ));
  };

  const handleDownload = (report: Report) => {
    console.log('Descargando reporte:', report);
    setReports(reports.map(r => 
      r.id === report.id ? { ...r, downloads: r.downloads + 1, lastDownload: new Date().toISOString().split('T')[0] } : r
    ));
  };

  const resetData = () => {
    if (window.confirm('¿Esto restaurará los datos a los valores por defecto. ¿Continuar?')) {
      localStorage.removeItem('reports');
      setReports(getDefaultReports());
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('todos');
    setSelectedFormat('todos');
    setShowFavoritesOnly(false);
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'financial': return <FileText size={16} className="text-purple-400" />;
      case 'income': return <TrendingUp size={16} className="text-green-400" />;
      case 'expense': return <TrendingDown size={16} className="text-red-400" />;
      case 'client': return <Users size={16} className="text-blue-400" />;
      case 'budget': return <Wallet size={16} className="text-yellow-400" />;
      case 'goal': return <Target size={16} className="text-orange-400" />;
      case 'tax': return <FileText size={16} className="text-gray-400" />;
      default: return <FileText size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'financial': return 'Financiero';
      case 'income': return 'Ingresos';
      case 'expense': return 'Gastos';
      case 'client': return 'Clientes';
      case 'budget': return 'Presupuesto';
      case 'goal': return 'Metas';
      case 'tax': return 'Fiscal';
      default: return type;
    }
  };

  const getFormatIcon = (format: string) => {
    switch(format) {
      case 'pdf': return <FileText size={14} className="text-red-400" />;
      case 'excel': return <FileText size={14} className="text-green-400" />;
      case 'csv': return <FileText size={14} className="text-blue-400" />;
      case 'json': return <FileText size={14} className="text-purple-400" />;
      default: return <FileText size={14} />;
    }
  };

  const hasActiveFilters = searchTerm !== '' || selectedType !== 'todos' || selectedFormat !== 'todos' || showFavoritesOnly || dateRange.start || dateRange.end;

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
              <FileText size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Reportes</h1>
              <p className="text-white/50 text-sm mt-1">Genera y descarga reportes financieros personalizados</p>
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
              <FileText size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300"
            >
              <Plus size={20} />
              <span className="hidden sm:inline font-medium">Generar Reporte</span>
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
              <p className="text-white/50 text-sm font-medium">Total Reportes</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{totalReports}</p>
              <p className="text-white/30 text-xs mt-1">{thisMonth} este mes</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <FileText size={24} className="text-[#F05984]" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Descargas Totales</p>
              <p className="text-2xl font-bold text-green-400 mt-1 tracking-tight">{totalDownloads}</p>
              <p className="text-white/30 text-xs mt-1">reportes descargados</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <Download size={24} className="text-green-400" />
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
              <p className="text-white/50 text-sm font-medium">Favoritos</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1 tracking-tight">{favoriteReports}</p>
              <p className="text-white/30 text-xs mt-1">reportes destacados</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Star size={24} className="text-yellow-400" />
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
              <p className="text-white/50 text-sm font-medium">Recientes</p>
              <p className="text-2xl font-bold text-blue-400 mt-1 tracking-tight">{recentReports}</p>
              <p className="text-white/30 text-xs mt-1">últimos 7 días</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Activity size={24} className="text-blue-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Gráfico de Distribución y Top Estadísticas */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Dona - Distribución por Tipo */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={20} className="text-[#F05984]" />
            <h3 className="text-white font-semibold">Distribución por Tipo</h3>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <ReTooltip
                  contentStyle={{ backgroundColor: '#1a0f14', border: '1px solid #F05984', borderRadius: '8px' }}
                  formatter={(value: number) => [value, 'reportes']}
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

        {/* Top Formatos de Reporte */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#F05984]" />
            Formatos de Reporte
          </h3>
          <div className="space-y-4">
            {['pdf', 'excel', 'csv'].map((format, index) => {
              const count = reports.filter(r => r.format === format).length;
              const percentage = totalReports > 0 ? (count / totalReports) * 100 : 0;
              const getFormatColor = () => {
                switch(format) {
                  case 'pdf': return 'from-red-500 to-red-600';
                  case 'excel': return 'from-green-500 to-green-600';
                  case 'csv': return 'from-blue-500 to-blue-600';
                  default: return 'from-gray-500 to-gray-600';
                }
              };
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${getFormatColor()} bg-opacity-20`}>
                        {getFormatIcon(format)}
                      </div>
                      <span className="text-white text-sm font-medium uppercase">{format}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/50 text-xs">{percentage.toFixed(1)}%</span>
                      <span className="text-white text-sm font-semibold">{count} reportes</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${getFormatColor()} rounded-full`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Filters and Search con panel colapsable */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Buscar reportes por nombre, descripción o etiquetas..."
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`p-2 rounded-lg transition-colors ${
                  showFavoritesOnly ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Star size={20} />
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
                    <label className="text-white/60 text-xs mb-1 block">Tipo de Reporte</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos los tipos</option>
                      <option value="financial" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Financiero</option>
                      <option value="income" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Ingresos</option>
                      <option value="expense" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Gastos</option>
                      <option value="client" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Clientes</option>
                      <option value="budget" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Presupuesto</option>
                      <option value="goal" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Metas</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Formato</label>
                    <select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos los formatos</option>
                      <option value="pdf" style={{ backgroundColor: '#1a0f14', color: 'white' }}>PDF</option>
                      <option value="excel" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Excel</option>
                      <option value="csv" style={{ backgroundColor: '#1a0f14', color: 'white' }}>CSV</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Rango de fechas</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                        placeholder="Desde"
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                        placeholder="Hasta"
                      />
                    </div>
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
              onClick={() => { setSortBy('date'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'date' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <Calendar size={14} />
              <span>Fecha</span>
              {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            <button
              onClick={() => { setSortBy('downloads'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'downloads' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <Download size={14} />
              <span>Descargas</span>
              {sortBy === 'downloads' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
          </div>
          <span className="text-white/40 text-sm">{filteredReports.length} resultados</span>
        </div>

        {/* Estado Vacío */}
        {filteredReports.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-4"
          >
            <div className="p-4 bg-white/10 rounded-full mb-4">
              <FileText size={48} className="text-white/30" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No hay reportes</h3>
            <p className="text-white/40 text-sm text-center max-w-md">
              No se encontraron reportes con los filtros actuales.
              Prueba a ajustar los filtros o genera un nuevo reporte.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGenerateModal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              <span>Generar nuevo reporte</span>
            </motion.button>
          </motion.div>
        )}

        {/* Grid View Mejorado */}
        {filteredReports.length > 0 && viewMode === 'grid' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {paginatedReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border transition-all duration-300 cursor-pointer hover:shadow-xl ${
                    report.favorite ? 'border-yellow-500/50 shadow-yellow-500/20' : 'border-white/10 hover:border-[#F05984]/50'
                  }`}
                >
                  {report.favorite && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full blur-2xl" />
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/10 shadow-lg">
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{report.name}</h3>
                        <p className="text-white/40 text-xs">{report.id.slice(-8)}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleFavorite(report.id)}
                      className="p-1"
                    >
                      <Star size={16} className={report.favorite ? 'text-yellow-400 fill-yellow-400' : 'text-white/40'} />
                    </motion.button>
                  </div>

                  {report.description && (
                    <p className="text-white/60 text-xs mb-3 line-clamp-2">{report.description}</p>
                  )}

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Tipo:</span>
                      <span className="text-white">{getTypeLabel(report.type)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Período:</span>
                      <span className="text-white text-xs">{report.dateRange}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Formato:</span>
                      <div className="flex items-center gap-1">
                        {getFormatIcon(report.format)}
                        <span className="text-white uppercase text-xs">{report.format}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Tamaño:</span>
                      <span className="text-white">{report.size}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {report.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                    {report.tags.length > 3 && (
                      <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
                        +{report.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1 text-white/40 text-xs">
                      <Download size={12} />
                      <span>{report.downloads}</span>
                      {report.lastDownload && <span className="ml-1">• Última: {report.lastDownload}</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDownload(report)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 text-white/60 hover:text-white"
                        title="Descargar"
                      >
                        <Download size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 text-white/60 hover:text-white"
                        title="Compartir"
                      >
                        <Share2 size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setSelectedReport(report); setShowDeleteModal(true); }}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-white/60 hover:text-red-400"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* List View Mejorado */}
        {filteredReports.length > 0 && viewMode === 'list' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 space-y-2"
          >
            <AnimatePresence>
              {paginatedReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.01 }}
                  className={`bg-gradient-to-r from-white/5 to-white/0 rounded-lg p-3 border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                    report.favorite ? 'border-yellow-500/30' : 'border-white/10 hover:border-[#F05984]/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white/10">
                      {getTypeIcon(report.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{report.name}</h3>
                        <div className="flex items-center gap-1">
                          {getFormatIcon(report.format)}
                          <span className="text-white/40 text-xs uppercase">{report.format}</span>
                        </div>
                        {report.favorite && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                      </div>
                      <p className="text-white/40 text-xs">{getTypeLabel(report.type)} • Generado: {report.generatedAt}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-white/50 text-xs">Período</p>
                        <p className="text-white text-xs">{report.dateRange}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/50 text-xs">Descargas</p>
                        <p className="text-white text-sm font-medium">{report.downloads}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleFavorite(report.id)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300"
                        title="Favorito"
                      >
                        <Star size={16} className={report.favorite ? 'text-yellow-400 fill-yellow-400' : 'text-white/60'} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDownload(report)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 text-white/60 hover:text-white"
                        title="Descargar"
                      >
                        <Download size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setSelectedReport(report); setShowDeleteModal(true); }}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-white/60 hover:text-red-400"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {filteredReports.length > 0 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-white/40 text-sm">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredReports.length)} de {filteredReports.length} reportes
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

      {/* Modal para generar reporte - Mejorado con animación */}
      <AnimatePresence>
        {showGenerateModal && (
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
              className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-md shadow-2xl"
            >
              <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-lg shadow-lg">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Generar Reporte</h2>
                    <p className="text-white/40 text-sm">Crea un nuevo reporte personalizado</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowGenerateModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Nombre del reporte</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                      placeholder="Ej: Reporte Financiero Q1 2024"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Tipo de Reporte</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="financial">Reporte Financiero</option>
                      <option value="income">Reporte de Ingresos</option>
                      <option value="expense">Reporte de Gastos</option>
                      <option value="client">Reporte de Clientes</option>
                      <option value="budget">Reporte de Presupuesto</option>
                      <option value="goal">Reporte de Metas</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Formato</label>
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData({...formData, format: e.target.value})}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Rango de fechas</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                      />
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Descripción (opcional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                      placeholder="Descripción del reporte..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowGenerateModal(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenerateReport}
                      className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
                    >
                      Generar Reporte
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmación de eliminación - Mejorado con animación */}
      <AnimatePresence>
        {showDeleteModal && selectedReport && (
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
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertCircle size={20} className="text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Eliminar Reporte</h2>
                    <p className="text-white/40 text-sm">Esta acción es irreversible</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>
              <div className="p-6">
                <p className="text-white/60 mb-4">
                  ¿Estás seguro de que quieres eliminar el reporte <span className="text-white font-medium">"{selectedReport.name}"</span>? Esta acción es irreversible.
                </p>
                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteReport}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all font-medium"
                  >
                    Eliminar
                  </motion.button>
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