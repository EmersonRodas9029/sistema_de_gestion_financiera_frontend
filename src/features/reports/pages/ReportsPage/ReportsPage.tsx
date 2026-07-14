import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Calendar, Filter, BarChart3,
  Plus, X, Search, PieChart as PieChartIcon, Trash2, Edit,
  XCircle, AlertCircle, User, Clock, Download, Eye, Loader2, TrendingUp,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';
import { formatDate, containerVariants, itemVariants } from '../../../../shared/utils';
import { getViewPreferences } from '../../../../shared/hooks/useViewPreferences';
import { PageSkeleton } from '../../../../shared/components/ui/PageSkeleton';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { SortBar } from '../../../../shared/components/ui/SortBar';
import { ModalOverlay } from '../../../../shared/components/ui/ModalOverlay';
import { ViewModeToggle } from '../../../../shared/components/ui/ViewModeToggle';
import { tooltipStyle } from '../../../../shared/components/ui/chartConfig';
import { reportesService, type ApiReporte, type TipoReporte } from '../../services';
import { clientesService, usuariosService, type ApiCliente, type ApiUsuario } from '../../../clients/services';
import { gastosService } from '../../../expenses/services';
import { ingresosService } from '../../../incomes/services';
import { categoriasService } from '../../../categories/services';
import { presupuestosService } from '../../../budgets/services';

const TIPO_LABEL: Record<TipoReporte, string> = {
  GASTOS_MENSUAL: 'Gastos Mensual',
  GASTOS_ANUAL: 'Gastos Anual',
  INGRESOS_MENSUAL: 'Ingresos Mensual',
  INGRESOS_ANUAL: 'Ingresos Anual',
  PRESUPUESTO: 'Presupuesto',
  PERSONALIZADO: 'Personalizado',
};

const TIPO_COLOR: Record<TipoReporte, string> = {
  GASTOS_MENSUAL: '#EF4444',
  GASTOS_ANUAL: '#B91C1C',
  INGRESOS_MENSUAL: '#10B981',
  INGRESOS_ANUAL: '#047857',
  PRESUPUESTO: '#F59E0B',
  PERSONALIZADO: '#8B5CF6',
};

const formatValue = (v: unknown): string =>
  v && typeof v === 'object' ? JSON.stringify(v) : String(v);

// ponytail: covers object/array JSON shapes only (mirrors backend PDF rendering); anything else falls back to raw text
const ReportContentPreview = ({ contenido }: { contenido?: string }) => {
  if (!contenido?.trim()) return <p className="text-white/40 text-sm">Sin contenido</p>;

  let data: unknown;
  try { data = JSON.parse(contenido); } catch {
    return <pre className="text-white/70 text-xs whitespace-pre-wrap bg-white/5 rounded-lg p-3">{contenido}</pre>;
  }

  if (Array.isArray(data) && data.every(item => item && typeof item === 'object' && !Array.isArray(item))) {
    const columns = [...new Set(data.flatMap(item => Object.keys(item as object)))];
    return (
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {columns.map(col => <th key={col} className="text-left py-2 px-3 text-white/60 font-medium">{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                {columns.map(col => <td key={col} className="py-2 px-3 text-white/80">{formatValue((item as Record<string, unknown>)[col] ?? '—')}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data && typeof data === 'object') {
    return (
      <div className="rounded-lg border border-white/10 divide-y divide-white/5">
        {Object.entries(data as Record<string, unknown>).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between gap-4 py-2 px-3">
            <span className="text-white/50 text-sm">{key}</span>
            <span className="text-white text-sm text-right break-all">{formatValue(value)}</span>
          </div>
        ))}
      </div>
    );
  }

  return <p className="text-white text-sm">{formatValue(data)}</p>;
};

const AUTO_FILL_TYPES = new Set<TipoReporte>(['GASTOS_MENSUAL', 'GASTOS_ANUAL', 'INGRESOS_MENSUAL', 'INGRESOS_ANUAL', 'PRESUPUESTO']);

const sumBy = (rows: number[]) => rows.reduce((s, n) => s + n, 0);
const round2 = (n: number) => Math.round(n * 100) / 100;

// meses calendario (mes/año) cubiertos por un rango de fechas, para casar con Presupuesto (que se define por mes/año, no por fecha)
const monthsInRange = (inicio: string, fin: string) => {
  const start = new Date(`${inicio}T00:00:00`);
  const end = new Date(`${fin}T00:00:00`);
  const meses: { mes: number; anio: number }[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cursor <= end) {
    meses.push({ mes: cursor.getMonth() + 1, anio: cursor.getFullYear() });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return meses;
};

// ponytail: /gastos y /ingresos solo listan campos resumidos (sin clienteId) — se filtra por fecha primero
// y se pide el detalle completo solo de los candidatos, en vez de pedir el detalle de todo.
const buildAutoContent = async (clienteId: number, tipo: TipoReporte, inicio: string, fin: string): Promise<string | null> => {
  if (tipo === 'GASTOS_MENSUAL' || tipo === 'GASTOS_ANUAL') {
    const [lista, categorias] = await Promise.all([gastosService.getAll(), categoriasService.getByCliente(clienteId)]);
    const candidatos = lista.filter(g => g.fecha && g.fecha >= inicio && g.fecha <= fin);
    const detalleCompleto = await Promise.all(candidatos.map(g => gastosService.getById(g.id!)));
    const catName = new Map(categorias.map(c => [c.id, c.nombre ?? 'Sin categoría']));
    const filtrados = detalleCompleto.filter(g => g.clienteId === clienteId);
    const categoriasTotales: Record<string, number> = {};
    filtrados.forEach(g => {
      const nombre = catName.get(g.categoriaId!) ?? 'Sin categoría';
      categoriasTotales[nombre] = (categoriasTotales[nombre] ?? 0) + (g.monto ?? 0);
    });
    return JSON.stringify({
      total: sumBy(filtrados.map(g => g.monto ?? 0)),
      categorias: categoriasTotales,
      detalle: filtrados.map(g => ({ fecha: g.fecha, monto: g.monto, metodoPago: g.metodoPago, descripcion: g.descripcion })),
    }, null, 2);
  }
  if (tipo === 'INGRESOS_MENSUAL' || tipo === 'INGRESOS_ANUAL') {
    const lista = await ingresosService.getAll();
    const candidatos = lista.filter(i => i.fecha && i.fecha >= inicio && i.fecha <= fin);
    const detalleCompleto = await Promise.all(candidatos.map(i => ingresosService.getById(i.id!)));
    const filtrados = detalleCompleto.filter(i => i.clienteId === clienteId);
    const fuentesTotales: Record<string, number> = {};
    filtrados.forEach(i => {
      const nombre = i.fuente || i.tipo || 'Otro';
      fuentesTotales[nombre] = (fuentesTotales[nombre] ?? 0) + (i.monto ?? 0);
    });
    return JSON.stringify({
      total: sumBy(filtrados.map(i => i.monto ?? 0)),
      fuentes: fuentesTotales,
      detalle: filtrados.map(i => ({ fecha: i.fecha, monto: i.monto, fuente: i.fuente, descripcion: i.descripcion })),
    }, null, 2);
  }
  if (tipo === 'PRESUPUESTO') {
    const meses = monthsInRange(inicio, fin);
    const mesesSet = new Set(meses.map(m => `${m.anio}-${m.mes}`));

    const [presupuestosLista, gastosLista, categorias] = await Promise.all([
      presupuestosService.getAll(), gastosService.getAll(), categoriasService.getByCliente(clienteId),
    ]);
    const presupuestoCandidatos = presupuestosLista.filter(p => mesesSet.has(`${p.anio}-${p.mes}`));
    const gastoCandidatos = gastosLista.filter(g => g.fecha && g.fecha >= inicio && g.fecha <= fin);
    const [presupuestoDetalle, gastoDetalle] = await Promise.all([
      Promise.all(presupuestoCandidatos.map(p => presupuestosService.getById(p.id!))),
      Promise.all(gastoCandidatos.map(g => gastosService.getById(g.id!))),
    ]);
    const presupuestosCliente = presupuestoDetalle.filter(p => p.clienteId === clienteId && p.activo !== false);
    const gastosCliente = gastoDetalle.filter(g => g.clienteId === clienteId);

    const catName = new Map(categorias.map(c => [c.id, c.nombre ?? 'Sin categoría']));
    const presupuestadoPorCategoria: Record<string, number> = {};
    presupuestosCliente.forEach(p => {
      const nombre = catName.get(p.categoriaId!) ?? 'Sin categoría';
      presupuestadoPorCategoria[nombre] = (presupuestadoPorCategoria[nombre] ?? 0) + (p.montoPresupuestado ?? 0);
    });
    const realPorCategoria: Record<string, number> = {};
    gastosCliente.forEach(g => {
      const nombre = catName.get(g.categoriaId!) ?? 'Sin categoría';
      realPorCategoria[nombre] = (realPorCategoria[nombre] ?? 0) + (g.monto ?? 0);
    });

    const categoriasComparativa: Record<string, { presupuestado: number; real: number; variacion: number }> = {};
    new Set([...Object.keys(presupuestadoPorCategoria), ...Object.keys(realPorCategoria)]).forEach(nombre => {
      const presupuestado = presupuestadoPorCategoria[nombre] ?? 0;
      const real = realPorCategoria[nombre] ?? 0;
      categoriasComparativa[nombre] = { presupuestado, real, variacion: round2(real - presupuestado) };
    });

    const totalPresupuestado = round2(sumBy(Object.values(presupuestadoPorCategoria)));
    const totalReal = round2(sumBy(Object.values(realPorCategoria)));

    return JSON.stringify({
      presupuestado: totalPresupuestado,
      real: totalReal,
      variacion: round2(totalReal - totalPresupuestado),
      categorias: categoriasComparativa,
    }, null, 2);
  }
  return null;
};

const emptyForm = () => ({
  clienteId: '',
  contadorId: '',
  nombre: '',
  tipoReporte: 'GASTOS_MENSUAL' as TipoReporte,
  periodoInicio: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  periodoFin: new Date().toISOString().split('T')[0],
  contenido: '',
  rutaArchivo: '',
});

export const ReportsPage = () => {
  const [reports, setReports] = useState<ApiReporte[]>([]);
  const [clientes, setClientes] = useState<ApiCliente[]>([]);
  const [contadores, setContadores] = useState<ApiUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<'todos' | TipoReporte>('todos');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(() => getViewPreferences().defaultView === 'list' ? 'table' : 'grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'nombre' | 'fecha' | 'periodo'>('fecha');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ApiReporte | null>(null);
  const [formData, setFormData] = useState(emptyForm());
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const itemsPerPage = getViewPreferences().itemsPerPage;

  const clienteNombre = (id?: number) => clientes.find(c => Number(c.id) === id)?.nombreCompleto ?? (id ? `Cliente #${id}` : '—');
  const contadorNombre = (id?: number) => contadores.find(c => Number(c.id) === id)?.username ?? (id ? `Contador #${id}` : 'Sin asignar');

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await reportesService.getAll();
      const full = await Promise.all(list.map(item => reportesService.getById(item.id!)));
      setReports(full);
    } catch (e) {
      toast.error(`Error al cargar reportes: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);
  useEffect(() => { clientesService.getAll().then(setClientes).catch(() => {}); }, []);
  useEffect(() => { usuariosService.getAll().then(list => setContadores(list.filter(u => u.rol === 'CONTADOR'))).catch(() => {}); }, []);

  // Autocompleta "contenido" con datos reales de gastos/ingresos al elegir cliente + tipo + período (solo al crear)
  useEffect(() => {
    if (!showCreateModal) return;
    const { clienteId, tipoReporte, periodoInicio, periodoFin } = formData;
    if (!clienteId || !periodoInicio || !periodoFin || !AUTO_FILL_TYPES.has(tipoReporte)) return;
    let cancelled = false;
    setIsAutoFilling(true);
    buildAutoContent(Number(clienteId), tipoReporte, periodoInicio, periodoFin)
      .then(contenido => { if (!cancelled && contenido) setFormData(prev => ({ ...prev, contenido })); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsAutoFilling(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only these 4 fields should retrigger auto-fill, not all of formData (would re-run on every keystroke in nombre/contenido)
  }, [showCreateModal, formData.clienteId, formData.tipoReporte, formData.periodoInicio, formData.periodoFin]);

  const validateForm = () => {
    if (!formData.clienteId) { toast.error('Selecciona un cliente'); return false; }
    if (!formData.nombre.trim()) { toast.error('El nombre del reporte es requerido'); return false; }
    if (formData.periodoFin < formData.periodoInicio) { toast.error('El período fin no puede ser anterior al período inicio'); return false; }
    if (formData.contenido.trim()) {
      try { JSON.parse(formData.contenido); } catch { toast.error('El contenido debe ser un JSON válido'); return false; }
    }
    return true;
  };

  const buildPayload = () => ({
    clienteId: Number(formData.clienteId),
    contadorId: formData.contadorId ? Number(formData.contadorId) : undefined,
    nombre: formData.nombre,
    tipoReporte: formData.tipoReporte,
    periodoInicio: formData.periodoInicio,
    periodoFin: formData.periodoFin,
    contenido: formData.contenido.trim() || undefined,
    rutaArchivo: formData.rutaArchivo.trim() || null,
  });

  const handleCreateReport = async () => {
    if (!validateForm()) return;
    try {
      await reportesService.create(buildPayload());
      toast.success('Reporte generado');
      setShowCreateModal(false);
      setFormData(emptyForm());
      fetchReports();
    } catch (e) {
      toast.error(`Error al generar: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
  };

  const openEditModal = (report: ApiReporte) => {
    setSelectedReport(report);
    setFormData({
      clienteId: String(report.clienteId ?? ''),
      contadorId: String(report.contadorId ?? ''),
      nombre: report.nombre ?? '',
      tipoReporte: report.tipoReporte ?? 'GASTOS_MENSUAL',
      periodoInicio: report.periodoInicio ?? '',
      periodoFin: report.periodoFin ?? '',
      contenido: report.contenido ?? '',
      rutaArchivo: report.rutaArchivo ?? '',
    });
    setShowEditModal(true);
  };

  const handleUpdateReport = async () => {
    if (!selectedReport?.id) return;
    if (!validateForm()) return;
    try {
      await reportesService.update(selectedReport.id, buildPayload());
      toast.success('Reporte actualizado');
      setShowEditModal(false);
      setSelectedReport(null);
      fetchReports();
    } catch (e) {
      toast.error(`Error al actualizar: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
  };

  const handleDownloadPdf = async (report: ApiReporte) => {
    if (!report.id || downloadingId) return;
    setDownloadingId(report.id);
    try {
      const blob = await reportesService.downloadPdf(report.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.nombre ?? 'reporte'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(`Error al descargar PDF: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const openDetailModal = (report: ApiReporte) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleDeleteReport = async () => {
    if (!selectedReport?.id) return;
    try {
      await reportesService.remove(selectedReport.id);
      toast.success('Reporte eliminado');
      setReports(prev => prev.filter(r => r.id !== selectedReport.id));
      setShowDeleteModal(false);
      setSelectedReport(null);
    } catch (e) {
      toast.error(`Error al eliminar: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = (r.nombre ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = selectedTipo === 'todos' || r.tipoReporte === selectedTipo;
    return matchesSearch && matchesTipo;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    const dir = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'nombre') return dir * (a.nombre ?? '').localeCompare(b.nombre ?? '');
    if (sortBy === 'periodo') return dir * (new Date(a.periodoInicio ?? 0).getTime() - new Date(b.periodoInicio ?? 0).getTime());
    return dir * (new Date(a.fechaGeneracion ?? 0).getTime() - new Date(b.fechaGeneracion ?? 0).getTime());
  });

  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);
  const paginatedReports = sortedReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalReports = reports.length;
  const thisMonth = reports.filter(r => {
    if (!r.fechaGeneracion) return false;
    const d = new Date(r.fechaGeneracion);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const withFile = reports.filter(r => r.rutaArchivo).length;
  const clientesConReporte = new Set(reports.map(r => r.clienteId).filter(Boolean)).size;

  const tipoDistribution = (Object.keys(TIPO_LABEL) as TipoReporte[])
    .map(tipo => ({ name: TIPO_LABEL[tipo], value: reports.filter(r => r.tipoReporte === tipo).length, color: TIPO_COLOR[tipo] }))
    .filter(d => d.value > 0);

  const topClientesReportes = Object.entries(
    reports.reduce<Record<number, number>>((acc, r) => {
      if (r.clienteId) acc[r.clienteId] = (acc[r.clienteId] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([clienteId, count]) => ({ clienteId: Number(clienteId), nombre: clienteNombre(Number(clienteId)), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxClienteReportes = topClientesReportes[0]?.count ?? 0;

  const clearAllFilters = () => { setSearchTerm(''); setSelectedTipo('todos'); setCurrentPage(1); };
  const hasActiveFilters = searchTerm !== '' || selectedTipo !== 'todos';

  const getTipoBadge = (tipo?: TipoReporte) => {
    const t = tipo ?? 'PERSONALIZADO';
    return (
      <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: `${TIPO_COLOR[t]}33`, color: TIPO_COLOR[t] }}>
        {TIPO_LABEL[t]}
      </span>
    );
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-r from-[#321D28] via-[#4a2d40] to-[#321D28] rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05984]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#BC455F]/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#F05984] to-[#BC455F] rounded-xl shadow-lg">
              <FileText size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Reportes</h1>
              <p className="text-white/50 text-sm mt-1">Genera y administra reportes financieros por cliente</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setFormData(emptyForm()); setShowCreateModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300">
              <Plus size={20} />
              <span className="hidden sm:inline font-medium">Generar Reporte</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Total Reportes</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{totalReports}</p>
              <p className="text-white/30 text-xs mt-1">{thisMonth} este mes</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10"><FileText size={24} className="text-[#F05984]" /></div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Con Archivo</p>
              <p className="text-2xl font-bold text-green-400 mt-1 tracking-tight">{withFile}</p>
              <p className="text-white/30 text-xs mt-1">reportes con adjunto</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20"><FileText size={24} className="text-green-400" /></div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gradient-to-br from-[#1e1b2e] to-[#2d2a3d] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Clientes</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1 tracking-tight">{clientesConReporte}</p>
              <p className="text-white/30 text-xs mt-1">con reportes generados</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/20"><User size={24} className="text-yellow-400" /></div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gradient-to-br from-[#1a2e2a] to-[#2d403a] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Tipos Usados</p>
              <p className="text-2xl font-bold text-blue-400 mt-1 tracking-tight">{tipoDistribution.length}</p>
              <p className="text-white/30 text-xs mt-1">de 6 tipos disponibles</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20"><BarChart3 size={24} className="text-blue-400" /></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Distribución por tipo + Top usuarios */}
      {(tipoDistribution.length > 0 || topClientesReportes.length > 0) && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tipoDistribution.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon size={20} className="text-[#F05984]" />
                <h3 className="text-white font-semibold">Distribución por Tipo</h3>
              </div>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <Pie data={tipoDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" animationBegin={0} animationDuration={800}>
                      {tipoDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                    </Pie>
                    <ReTooltip contentStyle={tooltipStyle} formatter={(value: number) => [value, 'reportes']} labelStyle={{ color: 'white' }} />
                    <Legend formatter={(value) => <span className="text-white/70 text-xs">{value}</span>} wrapperStyle={{ paddingTop: '20px' }} verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {topClientesReportes.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#F05984]" />
                Usuarios con más Reportes
              </h3>
              <div className="space-y-4">
                {topClientesReportes.map((c, index) => {
                  const percentage = maxClienteReportes > 0 ? (c.count / maxClienteReportes) * 100 : 0;
                  return (
                    <motion.div
                      key={c.clienteId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-gradient-to-r from-[#F05984] to-[#BC455F] bg-opacity-20 w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-white text-sm font-medium">{c.nombre}</span>
                        </div>
                        <span className="text-white text-sm font-semibold">{c.count} reportes</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Filters and list */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
        <div className="flex items-center px-4 pt-4">
          <ViewModeToggle viewMode={viewMode} onToggle={setViewMode} />
        </div>
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Buscar reportes por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>
                <Filter size={20} />
              </motion.button>
              {hasActiveFilters && (
                <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={clearAllFilters}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 text-sm">
                  <XCircle size={16} />
                  <span>Limpiar filtros</span>
                </motion.button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-white/10 overflow-hidden">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Tipo de Reporte</label>
                  <select value={selectedTipo} onChange={(e) => setSelectedTipo(e.target.value as 'todos' | TipoReporte)}
                    className="w-full md:w-64 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                    <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos los tipos</option>
                    {(Object.keys(TIPO_LABEL) as TipoReporte[]).map(tipo => (
                      <option key={tipo} value={tipo} style={{ backgroundColor: '#1a0f14', color: 'white' }}>{TIPO_LABEL[tipo]}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <SortBar
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(field) => { setSortBy(field as typeof sortBy); setSortOrder(prev => (sortBy === field && prev === 'desc') ? 'asc' : 'desc'); }}
          fields={[
            { key: 'nombre', label: 'Nombre', icon: <FileText size={14} /> },
            { key: 'periodo', label: 'Período', icon: <Calendar size={14} /> },
            { key: 'fecha', label: 'Generación', icon: <Clock size={14} /> },
          ]}
          totalResults={filteredReports.length}
        />

        {filteredReports.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-4 bg-white/10 rounded-full mb-4"><FileText size={48} className="text-white/30" /></div>
            <h3 className="text-white font-semibold text-lg mb-2">No hay reportes</h3>
            <p className="text-white/40 text-sm text-center max-w-md">No se encontraron reportes con los filtros actuales. Prueba a ajustar los filtros o genera un nuevo reporte.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setFormData(emptyForm()); setShowCreateModal(true); }}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">
              <Plus size={18} />
              <span>Generar nuevo reporte</span>
            </motion.button>
          </motion.div>
        )}

        {/* Table View */}
        {filteredReports.length > 0 && viewMode === 'table' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Reporte</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Período</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Generado</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedReports.map((report, index) => (
                    <motion.tr key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.03 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-[#F05984]" />
                          <span className="text-white font-medium">{report.nombre}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/70 text-sm">{clienteNombre(report.clienteId)}</td>
                      <td className="py-3 px-4">{getTipoBadge(report.tipoReporte)}</td>
                      <td className="py-3 px-4 text-white/70 text-sm">{report.periodoInicio && report.periodoFin ? `${formatDate(report.periodoInicio)} - ${formatDate(report.periodoFin)}` : '—'}</td>
                      <td className="py-3 px-4 text-white/70 text-sm">{report.fechaGeneracion ? formatDate(report.fechaGeneracion) : '—'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openDetailModal(report)} className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 text-white/60" title="Ver detalle">
                            <Eye size={14} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDownloadPdf(report)} disabled={downloadingId === report.id} className="p-1.5 hover:bg-green-500/20 rounded-lg transition-all duration-300 text-green-400 disabled:opacity-50" title="Descargar PDF">
                            {downloadingId === report.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEditModal(report)} className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400">
                            <Edit size={14} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setSelectedReport(report); setShowDeleteModal(true); }} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400">
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Grid View */}
        {filteredReports.length > 0 && viewMode === 'grid' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {paginatedReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10 hover:border-[#F05984]/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/10 shadow-lg">
                        <FileText size={16} className="text-[#F05984]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{report.nombre}</h3>
                        <p className="text-white/40 text-xs flex items-center gap-1"><User size={12} /> {clienteNombre(report.clienteId)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Tipo:</span>
                      {getTipoBadge(report.tipoReporte)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Período:</span>
                      <span className="text-white text-xs">{report.periodoInicio && report.periodoFin ? `${formatDate(report.periodoInicio)} - ${formatDate(report.periodoFin)}` : '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Contador:</span>
                      <span className="text-white text-xs">{contadorNombre(report.contadorId)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1 text-white/40 text-xs">
                      <Clock size={12} />
                      <span>{report.fechaGeneracion ? formatDate(report.fechaGeneracion) : '—'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openDetailModal(report)} className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 text-white/60" title="Ver detalle">
                        <Eye size={14} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDownloadPdf(report)} disabled={downloadingId === report.id} className="p-1.5 hover:bg-green-500/20 rounded-lg transition-all duration-300 text-white/60 hover:text-green-400 disabled:opacity-50" title="Descargar PDF">
                        {downloadingId === report.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEditModal(report)} className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400" title="Editar">
                        <Edit size={14} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setSelectedReport(report); setShowDeleteModal(true); }} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-white/60 hover:text-red-400" title="Eliminar">
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredReports.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredReports.length} itemsPerPage={itemsPerPage} label="reportes" onPageChange={setCurrentPage} />
        )}
      </motion.div>

      {/* Modal crear */}
      <AnimatePresence>
        <ModalOverlay isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Generar Reporte" subtitle="Crea un nuevo reporte financiero" icon={<FileText size={20} className="text-white" />} maxWidth="max-w-2xl">
          <form onSubmit={(e) => { e.preventDefault(); handleCreateReport(); }} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Cliente *</label>
                <select value={formData.clienteId} onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }} required>
                  <option value="" style={{ backgroundColor: '#1a0f14' }}>Seleccionar cliente</option>
                  {clientes.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14' }}>{c.nombreCompleto}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Contador (opcional)</label>
                <select value={formData.contadorId} onChange={(e) => setFormData({ ...formData, contadorId: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  <option value="" style={{ backgroundColor: '#1a0f14' }}>Sin asignar</option>
                  {contadores.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14' }}>{c.username}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Nombre del reporte *</label>
              <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Ej: Reporte de gastos - Junio" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Tipo de Reporte</label>
                <select value={formData.tipoReporte} onChange={(e) => setFormData({ ...formData, tipoReporte: e.target.value as TipoReporte })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  {(Object.keys(TIPO_LABEL) as TipoReporte[]).map(tipo => <option key={tipo} value={tipo}>{TIPO_LABEL[tipo]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Ruta de archivo (opcional)</label>
                <input type="text" value={formData.rutaArchivo} onChange={(e) => setFormData({ ...formData, rutaArchivo: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="/reportes/archivo.pdf" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Período inicio *</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="date" value={formData.periodoInicio} onChange={(e) => setFormData({ ...formData, periodoInicio: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Período fin *</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="date" value={formData.periodoFin} onChange={(e) => setFormData({ ...formData, periodoFin: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                </div>
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 flex items-center gap-2">
                Contenido (JSON, opcional)
                {isAutoFilling && <span className="flex items-center gap-1 text-[#F05984] text-xs"><Loader2 size={12} className="animate-spin" /> Calculando datos reales...</span>}
                {!isAutoFilling && AUTO_FILL_TYPES.has(formData.tipoReporte) && <span className="text-white/30 text-xs">(se autocompleta con datos reales)</span>}
              </label>
              <textarea value={formData.contenido} onChange={(e) => setFormData({ ...formData, contenido: e.target.value })} rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#F05984] transition-all" placeholder='{"total": 1500.00, "categorias": {...}}' />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg">
                Generar Reporte
              </motion.button>
            </div>
          </form>
        </ModalOverlay>
      </AnimatePresence>

      {/* Modal editar */}
      <AnimatePresence>
        <ModalOverlay isOpen={showEditModal && !!selectedReport} onClose={() => setShowEditModal(false)} title="Editar Reporte" subtitle="Modifica los datos del reporte" icon={<Edit size={20} className="text-white" />} maxWidth="max-w-2xl">
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateReport(); }} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Cliente *</label>
                <select value={formData.clienteId} onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }} required>
                  {clientes.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14' }}>{c.nombreCompleto}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Contador (opcional)</label>
                <select value={formData.contadorId} onChange={(e) => setFormData({ ...formData, contadorId: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  <option value="" style={{ backgroundColor: '#1a0f14' }}>Sin asignar</option>
                  {contadores.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14' }}>{c.username}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Nombre</label>
              <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Tipo de Reporte</label>
                <select value={formData.tipoReporte} onChange={(e) => setFormData({ ...formData, tipoReporte: e.target.value as TipoReporte })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  {(Object.keys(TIPO_LABEL) as TipoReporte[]).map(tipo => <option key={tipo} value={tipo}>{TIPO_LABEL[tipo]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Ruta de archivo (opcional)</label>
                <input type="text" value={formData.rutaArchivo} onChange={(e) => setFormData({ ...formData, rutaArchivo: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Período inicio</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="date" value={formData.periodoInicio} onChange={(e) => setFormData({ ...formData, periodoInicio: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Período fin</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="date" value={formData.periodoFin} onChange={(e) => setFormData({ ...formData, periodoFin: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                </div>
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Contenido (JSON, opcional)</label>
              <textarea value={formData.contenido} onChange={(e) => setFormData({ ...formData, contenido: e.target.value })} rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#F05984] transition-all" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg">
                Guardar Cambios
              </motion.button>
            </div>
          </form>
        </ModalOverlay>
      </AnimatePresence>

      {/* Modal ver detalle */}
      <AnimatePresence>
        <ModalOverlay isOpen={showDetailModal && !!selectedReport} onClose={() => setShowDetailModal(false)} title={selectedReport?.nombre ?? 'Reporte'} subtitle="Detalle del reporte" icon={<Eye size={20} className="text-white" />} maxWidth="max-w-2xl">
          {selectedReport && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-white/50 block mb-1">Cliente</span><span className="text-white">{clienteNombre(selectedReport.clienteId)}</span></div>
                <div><span className="text-white/50 block mb-1">Contador</span><span className="text-white">{contadorNombre(selectedReport.contadorId)}</span></div>
                <div><span className="text-white/50 block mb-1">Tipo</span>{getTipoBadge(selectedReport.tipoReporte)}</div>
                <div><span className="text-white/50 block mb-1">Generado</span><span className="text-white">{selectedReport.fechaGeneracion ? formatDate(selectedReport.fechaGeneracion) : '—'}</span></div>
                <div className="col-span-2"><span className="text-white/50 block mb-1">Período</span><span className="text-white">{selectedReport.periodoInicio && selectedReport.periodoFin ? `${formatDate(selectedReport.periodoInicio)} - ${formatDate(selectedReport.periodoFin)}` : '—'}</span></div>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-2">Contenido</p>
                <ReportContentPreview contenido={selectedReport.contenido} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleDownloadPdf(selectedReport)} disabled={downloadingId === selectedReport.id}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50">
                  {downloadingId === selectedReport.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  Descargar PDF
                </motion.button>
              </div>
            </div>
          )}
        </ModalOverlay>
      </AnimatePresence>

      {/* Modal confirmación eliminar */}
      <AnimatePresence>
        {showDeleteModal && selectedReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full shadow-2xl">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg"><AlertCircle size={20} className="text-red-400" /></div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Eliminar Reporte</h2>
                    <p className="text-white/40 text-sm">Esta acción es irreversible</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>
              <div className="p-6">
                <p className="text-white/60 mb-4">
                  ¿Estás seguro de que quieres eliminar el reporte <span className="text-white font-medium">"{selectedReport.nombre}"</span>? Esta acción es irreversible.
                </p>
                <div className="flex justify-end gap-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium">
                    Cancelar
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDeleteReport} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all font-medium">
                    Eliminar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
