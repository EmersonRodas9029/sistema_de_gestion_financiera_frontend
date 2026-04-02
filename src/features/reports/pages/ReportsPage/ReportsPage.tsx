import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText,
  Download,
  Printer,
  Share2,
  Calendar,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Wallet,
  Target,
  Users,
  Plus,
  X,
  Eye,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'financial' | 'income' | 'expense' | 'client' | 'budget' | 'goal';
  format: 'pdf' | 'excel' | 'csv';
  dateRange: string;
  generatedAt: string;
  size: string;
  downloads: number;
}

export const ReportsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  // Resumen de reportes
  const summary = {
    totalReports: 12,
    thisMonth: 4,
    totalDownloads: 156,
    storageUsed: '124 MB'
  };

  // Resumen financiero
  const financialSummary = {
    totalIncome: 41250.75,
    totalExpense: 28450.50,
    netIncome: 12800.25,
    savingsRate: 31
  };

  // Datos de ejemplo - Reportes
  const reports: Report[] = [
    {
      id: 'RPT-001',
      name: 'Reporte Financiero Q1 2024',
      type: 'financial',
      format: 'pdf',
      dateRange: '01/01/2024 - 31/03/2024',
      generatedAt: '2024-03-31 10:30',
      size: '2.4 MB',
      downloads: 45
    },
    {
      id: 'RPT-002',
      name: 'Análisis de Ingresos - Febrero 2024',
      type: 'income',
      format: 'excel',
      dateRange: '01/02/2024 - 29/02/2024',
      generatedAt: '2024-03-01 09:15',
      size: '1.2 MB',
      downloads: 23
    },
    {
      id: 'RPT-003',
      name: 'Reporte de Gastos - Enero 2024',
      type: 'expense',
      format: 'pdf',
      dateRange: '01/01/2024 - 31/01/2024',
      generatedAt: '2024-02-01 14:20',
      size: '1.8 MB',
      downloads: 31
    },
    {
      id: 'RPT-004',
      name: 'Reporte de Clientes - Q1 2024',
      type: 'client',
      format: 'excel',
      dateRange: '01/01/2024 - 31/03/2024',
      generatedAt: '2024-03-30 16:45',
      size: '3.1 MB',
      downloads: 12
    },
    {
      id: 'RPT-005',
      name: 'Presupuesto vs Real - Marzo 2024',
      type: 'budget',
      format: 'pdf',
      dateRange: '01/03/2024 - 31/03/2024',
      generatedAt: '2024-03-31 11:00',
      size: '1.5 MB',
      downloads: 18
    },
    {
      id: 'RPT-006',
      name: 'Metas Financieras - Reporte Anual',
      type: 'goal',
      format: 'pdf',
      dateRange: '01/01/2024 - 31/12/2024',
      generatedAt: '2024-03-28 13:30',
      size: '2.1 MB',
      downloads: 9
    },
    {
      id: 'RPT-007',
      name: 'Reporte de Ingresos - Marzo 2024',
      type: 'income',
      format: 'excel',
      dateRange: '01/03/2024 - 31/03/2024',
      generatedAt: '2024-03-31 08:45',
      size: '1.1 MB',
      downloads: 15
    },
    {
      id: 'RPT-008',
      name: 'Análisis de Gastos - Q1 2024',
      type: 'expense',
      format: 'csv',
      dateRange: '01/01/2024 - 31/03/2024',
      generatedAt: '2024-03-30 15:20',
      size: '2.3 MB',
      downloads: 22
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todos' || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleDownload = (report: Report) => {
    console.log('Descargando reporte:', report);
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
      case 'financial':
        return <FileText size={16} className="text-purple-400" />;
      case 'income':
        return <TrendingUp size={16} className="text-green-400" />;
      case 'expense':
        return <TrendingDown size={16} className="text-red-400" />;
      case 'client':
        return <Users size={16} className="text-blue-400" />;
      case 'budget':
        return <Wallet size={16} className="text-yellow-400" />;
      case 'goal':
        return <Target size={16} className="text-orange-400" />;
      default:
        return <FileText size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'financial':
        return 'Financiero';
      case 'income':
        return 'Ingresos';
      case 'expense':
        return 'Gastos';
      case 'client':
        return 'Clientes';
      case 'budget':
        return 'Presupuesto';
      case 'goal':
        return 'Metas';
      default:
        return type;
    }
  };

  const getFormatIcon = (format: string) => {
    switch(format) {
      case 'pdf':
        return <FileText size={14} className="text-red-400" />;
      case 'excel':
        return <FileText size={14} className="text-green-400" />;
      case 'csv':
        return <FileText size={14} className="text-blue-400" />;
      default:
        return <FileText size={14} />;
    }
  };

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
            <FileText size={20} />
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Generar Reporte</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Total Reportes</p>
          <p className="text-2xl font-bold text-white">{summary.totalReports}</p>
          <p className="text-white/40 text-xs mt-1">{summary.thisMonth} este mes</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Descargas Totales</p>
          <p className="text-2xl font-bold text-white">{summary.totalDownloads}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Almacenamiento</p>
          <p className="text-2xl font-bold text-blue-400">{summary.storageUsed}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Tasa de Ahorro</p>
          <p className="text-2xl font-bold text-green-400">{financialSummary.savingsRate}%</p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-3">Resumen Financiero</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-white/40 text-xs">Ingresos Totales</p>
            <p className="text-green-400 font-bold text-lg">{formatCurrency(financialSummary.totalIncome)}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Gastos Totales</p>
            <p className="text-red-400 font-bold text-lg">{formatCurrency(financialSummary.totalExpense)}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Ingreso Neto</p>
            <p className="text-blue-400 font-bold text-lg">{formatCurrency(financialSummary.netIncome)}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Tasa de Ahorro</p>
            <p className="text-purple-400 font-bold text-lg">{financialSummary.savingsRate}%</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Buscar reportes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors"
              />
            </div>
            <div className="flex gap-2">
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
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedReports.map((report) => (
              <div
                key={report.id}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#F05984]/50 transition-all"
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
                  <div className="flex items-center gap-1">
                    {getFormatIcon(report.format)}
                    <span className="text-white/40 text-xs uppercase">{report.format}</span>
                  </div>
                </div>

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
                    <span className="text-white/60">Tamaño:</span>
                    <span className="text-white">{report.size}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1 text-white/40 text-xs">
                    <Download size={12} />
                    <span>{report.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleDownload(report)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Download size={14} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Printer size={14} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Share2 size={14} className="text-white/60" />
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
                className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-[#F05984]/50 transition-all"
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
                    </div>
                    <p className="text-white/40 text-xs">{getTypeLabel(report.type)} • Generado: {report.generatedAt}</p>
                  </div>

                  <div className="flex items-center gap-4">
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
                    <button 
                      onClick={() => handleDownload(report)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Download size={16} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Printer size={16} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Share2 size={16} className="text-white/60" />
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

      {/* Modal de generación de reporte */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Generar Reporte</h2>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Tipo de Reporte</label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]">
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
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]">
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
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
                      placeholder="Fecha inicio"
                    />
                    <input
                      type="date"
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
                      placeholder="Fecha fin"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Generar Reporte
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
