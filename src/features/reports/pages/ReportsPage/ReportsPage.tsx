import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Download, Printer, Share2, Calendar, Filter, RefreshCw,
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, BarChart3,
  Activity, Wallet, Target, Users, Plus, X, Eye, MoreVertical, Clock,
  CheckCircle, AlertCircle, Search, PieChart, LineChart, Save, Trash2, Edit,
  Copy, Send, Mail, Phone, MapPin, Building2, Briefcase, Award, Gift, Sparkles,
  ArrowUp, ArrowDown, XCircle, Calendar as CalendarIcon, User, Hash, Link,
  Image, FileJson, FileSpreadsheet, File, FolderTree, Star, ChevronDown, ChevronUp
} from 'lucide-react';

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

export const ReportsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedFormat, setSelectedFormat] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
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
      type: formData.type as any,
      format: formData.format as any,
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
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
      case 'excel': return <FileSpreadsheet size={14} className="text-green-400" />;
      case 'csv': return <FileJson size={14} className="text-blue-400" />;
      case 'json': return <FileJson size={14} className="text-purple-400" />;
      default: return <File size={14} />;
    }
  };

  const hasActiveFilters = searchTerm !== '' || selectedType !== 'todos' || selectedFormat !== 'todos' || showFavoritesOnly || dateRange.start || dateRange.end;

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Reportes</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">
              {reports.length} reportes
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Genera y descarga reportes financieros personalizados
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleRefresh} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10'}`}>
            <BarChart3 size={20} />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10'}`}>
            <FileText size={20} />
          </button>
          <button onClick={() => setShowGenerateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90">
            <Plus size={20} />
            <span className="hidden sm:inline">Generar Reporte</span>
          </button>
          <button onClick={resetData} className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors text-yellow-400 hover:text-yellow-300" title="Restaurar datos por defecto">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Total Reportes</p>
          <p className="text-2xl font-bold text-white">{totalReports}</p>
          <p className="text-white/40 text-xs mt-1">{thisMonth} este mes</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Descargas Totales</p>
          <p className="text-2xl font-bold text-white">{totalDownloads}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Favoritos</p>
          <p className="text-2xl font-bold text-yellow-400">{favoriteReports}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Recientes</p>
          <p className="text-2xl font-bold text-blue-400">{recentReports}</p>
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
                placeholder="Buscar reportes por nombre, descripción o etiquetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
              >
                <option value="todos">Todos los tipos</option>
                <option value="financial">Financiero</option>
                <option value="income">Ingresos</option>
                <option value="expense">Gastos</option>
                <option value="client">Clientes</option>
                <option value="budget">Presupuesto</option>
                <option value="goal">Metas</option>
              </select>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
              >
                <option value="todos">Todos los formatos</option>
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10'}`}
              >
                <Filter size={20} />
              </button>
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`p-2 rounded-lg transition-colors ${showFavoritesOnly ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 hover:bg-white/10 text-white/70'}`}
              >
                <Star size={20} />
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('todos');
                    setSelectedFormat('todos');
                    setShowFavoritesOnly(false);
                    setDateRange({ start: '', end: '' });
                    setCurrentPage(1);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 text-sm"
                >
                  <XCircle size={16} />
                  <span>Limpiar filtros</span>
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Fecha desde</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Fecha hasta</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                  />
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

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedReports.map((report) => (
              <div
                key={report.id}
                className={`bg-white/5 rounded-xl p-4 border transition-all cursor-pointer hover:border-[#F05984]/50 ${report.favorite ? 'border-yellow-500/30' : 'border-white/10'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      {getTypeIcon(report.type)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">{report.name}</h3>
                      <p className="text-white/40 text-xs">{report.id}</p>
                    </div>
                  </div>
                  <button onClick={() => handleToggleFavorite(report.id)}>
                    <Star size={16} className={report.favorite ? 'text-yellow-400 fill-yellow-400' : 'text-white/40'} />
                  </button>
                </div>

                {report.description && (
                  <p className="text-white/60 text-xs mb-3 line-clamp-2">{report.description}</p>
                )}

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Tipo:</span>
                    <span className="text-white">{getTypeLabel(report.type)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Período:</span>
                    <span className="text-white text-xs">{report.dateRange}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Formato:</span>
                    <div className="flex items-center gap-1">
                      {getFormatIcon(report.format)}
                      <span className="text-white uppercase">{report.format}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Tamaño:</span>
                    <span className="text-white">{report.size}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {report.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">
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
                    <button onClick={() => handleDownload(report)} className="p-1 hover:bg-white/10 rounded transition-colors" title="Descargar">
                      <Download size={14} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors" title="Compartir">
                      <Share2 size={14} className="text-white/60" />
                    </button>
                    <button onClick={() => { setSelectedReport(report); setShowDeleteModal(true); }} className="p-1 hover:bg-white/10 rounded transition-colors" title="Eliminar">
                      <Trash2 size={14} className="text-white/60 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="p-4 space-y-2">
            {paginatedReports.map((report) => (
              <div
                key={report.id}
                className={`bg-white/5 rounded-lg p-3 border transition-all cursor-pointer hover:border-[#F05984]/50 ${report.favorite ? 'border-yellow-500/30' : 'border-white/10'}`}
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
                      <p className="text-white/60 text-xs">Período</p>
                      <p className="text-white text-xs">{report.dateRange}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs">Descargas</p>
                      <p className="text-white text-sm">{report.downloads}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => handleToggleFavorite(report.id)} className="p-1 hover:bg-white/10 rounded transition-colors" title="Favorito">
                      <Star size={16} className={report.favorite ? 'text-yellow-400 fill-yellow-400' : 'text-white/60'} />
                    </button>
                    <button onClick={() => handleDownload(report)} className="p-1 hover:bg-white/10 rounded transition-colors" title="Descargar">
                      <Download size={16} className="text-white/60" />
                    </button>
                    <button onClick={() => { setSelectedReport(report); setShowDeleteModal(true); }} className="p-1 hover:bg-white/10 rounded transition-colors" title="Eliminar">
                      <Trash2 size={16} className="text-white/60 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredReports.length)} de {filteredReports.length} reportes
          </p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = totalPages <= 5 ? i + 1 : (currentPage <= 3 ? i + 1 : (currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i));
              return <button key={i} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${currentPage === pageNum ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>{pageNum}</button>;
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de generación de reporte */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Generar Reporte</h2>
                <button onClick={() => setShowGenerateModal(false)} className="p-1 hover:bg-white/10 rounded-lg">
                  <X size={20} className="text-white/60" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Nombre del reporte</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
                    placeholder="Ej: Reporte Financiero Q1 2024"
                    required
                  />
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Tipo de Reporte</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
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
                  <label className="text-white/60 text-sm mb-1 block">Formato</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({...formData, format: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Rango de fechas</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
                    />
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-1 block">Descripción (opcional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
                    placeholder="Descripción del reporte..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button onClick={() => setShowGenerateModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
                    Cancelar
                  </button>
                  <button onClick={handleGenerateReport} className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">
                    Generar Reporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && selectedReport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertCircle className="text-red-400" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Eliminar Reporte</h2>
              </div>
              
              <p className="text-white/60 mb-4">
                ¿Estás seguro de que quieres eliminar el reporte "{selectedReport.name}"? Esta acción es irreversible.
              </p>

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
                  Cancelar
                </button>
                <button onClick={handleDeleteReport} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
