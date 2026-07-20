import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  Plus,
  Repeat,
  DollarSign,
  CheckCircle,
  XCircle,
  Tag,
  Save,
  Edit,
  Trash2,
  FileText,
  Zap,
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';
import { formatCurrency, formatDate, containerVariants, itemVariants, filterByPeriod, notifyConnectionError, notifyActionError } from '../../../../shared/utils';
import { getViewPreferences } from '../../../../shared/hooks/useViewPreferences';
import { ingresosService, type ApiIngreso } from '../../services';
import { clientesService } from '../../../clients/services';
import { getCurrentClientSession } from '../../../../shared/hooks/useCurrentClient';
import { PageSkeleton } from '../../../../shared/components/ui/PageSkeleton';
import { ViewModeToggle } from '../../../../shared/components/ui/ViewModeToggle';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { SearchFilterBar } from '../../../../shared/components/ui/SearchFilterBar';
import { SortBar } from '../../../../shared/components/ui/SortBar';
import { ModalOverlay } from '../../../../shared/components/ui/ModalOverlay';
import { Toggle } from '../../../../shared/components/ui/Toggle';
import { useConfirm } from '../../../../shared/hooks/useConfirm';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';
import { tooltipStyle, labelStyle } from '../../../../shared/components/ui/chartConfig';

type Tipo       = 'ESTABLE' | 'VOLATIL';
type Metodo     = 'EFECTIVO' | 'TRANSFERENCIA' | 'CHEQUE' | 'OTRO';
type Frecuencia = 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'ANUAL';

interface Ingreso {
  id: string;
  clienteId: number;
  monto: number;
  fecha: string;
  tipo: Tipo;
  fuente?: string;
  descripcion?: string;
  metodoRecepcion?: Metodo;
  esRecurrente: boolean;
  frecuencia?: Frecuencia;
  activo: boolean;
}

const toIngreso = (a: ApiIngreso): Ingreso => ({
  id: String(a.id ?? ''),
  clienteId: Number(a.clienteId ?? 0),
  monto: Number(a.monto ?? 0),
  fecha: a.fecha ?? '',
  tipo: (a.tipo as Tipo) ?? 'ESTABLE',
  fuente: a.fuente,
  descripcion: a.descripcion,
  metodoRecepcion: a.metodoRecepcion as Metodo | undefined,
  esRecurrente: a.esRecurrente ?? false,
  frecuencia: a.frecuencia as Frecuencia | undefined,
  activo: a.activo !== false,
});

const METODO_LABEL: Record<Metodo, string> = {
  EFECTIVO: 'Efectivo', TRANSFERENCIA: 'Transferencia', CHEQUE: 'Cheque', OTRO: 'Otro',
};
const FRECUENCIA_LABEL: Record<Frecuencia, string> = {
  DIARIO: 'Diario', SEMANAL: 'Semanal', MENSUAL: 'Mensual', ANUAL: 'Anual',
};

const TIPO_COLOR: Record<Tipo, string> = { ESTABLE: '#10B981', VOLATIL: '#F59E0B' };
const TIPO_GRADIENT: Record<Tipo, string> = {
  ESTABLE: 'from-green-500 to-green-600',
  VOLATIL: 'from-amber-500 to-orange-500',
};

const inputCls    = "w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all";
const selectStyle = { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' };
const optStyle    = { backgroundColor: '#1a0f14', color: 'white' };

const emptyCreate = (clienteId = '') => ({
  clienteId, monto: '',
  fecha: new Date().toISOString().split('T')[0],
  tipo: 'ESTABLE', fuente: '', descripcion: '',
  metodoRecepcion: 'TRANSFERENCIA', esRecurrente: false, frecuencia: '',
});

const FrecuenciaSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-white/60 text-sm mb-1.5 block">Frecuencia</label>
    <select value={value} onChange={e => onChange(e.target.value)} className={inputCls} style={selectStyle}>
      <option value=""        style={optStyle}>— Sin especificar —</option>
      <option value="DIARIO"  style={optStyle}>Diario</option>
      <option value="SEMANAL" style={optStyle}>Semanal</option>
      <option value="MENSUAL" style={optStyle}>Mensual</option>
      <option value="ANUAL"   style={optStyle}>Anual</option>
    </select>
  </div>
);

export const IncomesPage = () => {
  const { isClientRole, ownClienteId } = getCurrentClientSession();
  const { confirm, ConfirmDialogElement } = useConfirm();
  const [ingresos, setIngresos]   = useState<Ingreso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm]         = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm);
  const [selectedTipo, setSelectedTipo]     = useState<string>('todos');
  const [selectedActivo, setSelectedActivo] = useState<string>('todos');
  const [selectedMetodo, setSelectedMetodo] = useState<string>('todos');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('todos');
  const [showFilters, setShowFilters]       = useState(false);
  const [viewMode, setViewMode]             = useState<'table' | 'grid'>(() => getViewPreferences().defaultView === 'list' ? 'table' : 'grid');
  const [sortBy, setSortBy]                 = useState<string>('date');
  const [sortOrder, setSortOrder]           = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage]       = useState(1);

  const [clientesList, setClientesList] = useState<{ id: number; nombre: string; activo: boolean }[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [selectedIngreso, setSelectedIngreso] = useState<Ingreso | null>(null);
  const [createForm, setCreateForm] = useState(emptyCreate(isClientRole ? ownClienteId : ''));
  const [editForm, setEditForm]     = useState({
    monto: '', fecha: '', tipo: 'ESTABLE', fuente: '', descripcion: '',
    metodoRecepcion: 'TRANSFERENCIA', esRecurrente: false, frecuencia: '', activo: true,
  });

  const itemsPerPage = getViewPreferences().itemsPerPage;

  const fetchIngresos = async () => {
    setIsLoading(true);
    try {
      const list = await ingresosService.getAll();
      // El endpoint /ingresos no filtra por cliente en el backend: un usuario con rol cliente
      // solo debe ver sus propios ingresos, así que se filtra en el cliente.
      const scoped = isClientRole ? list.filter(i => Number(i.clienteId) === Number(ownClienteId)) : list;
      setIngresos(scoped.map(toIngreso));
    } catch {
      notifyConnectionError();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchIngresos(); }, []);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedTipo, selectedActivo, selectedMetodo, selectedPeriod]);

  useEffect(() => {
    clientesService.getAll().then(clientes => {
      setClientesList(clientes.filter(c => c.id != null).map(c => ({ id: Number(c.id), nombre: c.nombreCompleto, activo: c.activo !== false })));
    }).catch(() => {});
  }, []);

  const clienteNombre = (id: number) => clientesList.find(c => c.id === id)?.nombre ?? `Cliente #${id}`;
  const clientesActivos = clientesList.filter(c => c.activo);

  // Stats
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const yearlyIngresos = ingresos.filter(i => new Date(i.fecha).getFullYear() === currentYear);
  const totalYearlyIncome = yearlyIngresos.reduce((s, i) => s + i.monto, 0);

  const monthlyIngresos = ingresos.filter(i => {
    const d = new Date(i.fecha);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const totalMonthlyIncome = monthlyIngresos.reduce((s, i) => s + i.monto, 0);

  const recurrentesIngresos = ingresos.filter(i => i.esRecurrente);
  const totalRecurrentes = recurrentesIngresos.reduce((s, i) => s + i.monto, 0);

  const monthlyGoal = 5000;
  const monthlyProgress = (totalMonthlyIncome / monthlyGoal) * 100;

  const averageTicket = ingresos.length > 0
    ? ingresos.reduce((s, i) => s + i.monto, 0) / ingresos.length : 0;

  // Pie chart data
  const totalMontoAll = ingresos.reduce((s, i) => s + i.monto, 0);
  const tipoSummary = (
    [
      { tipo: 'ESTABLE' as Tipo, name: 'Estables',  icon: <TrendingUp size={16} /> },
      { tipo: 'VOLATIL' as Tipo, name: 'Volátiles', icon: <Zap size={16} /> },
    ] as const
  ).map(t => {
    const items = ingresos.filter(i => i.tipo === t.tipo);
    const amount = items.reduce((s, i) => s + i.monto, 0);
    return {
      name: t.name, tipo: t.tipo, icon: t.icon,
      amount, count: items.length,
      percentage: totalMontoAll > 0 ? (amount / totalMontoAll) * 100 : 0,
      color: TIPO_GRADIENT[t.tipo],
      chartColor: TIPO_COLOR[t.tipo],
    };
  }).filter(t => t.count > 0);

  const pieChartData = tipoSummary.map(t => ({
    name: t.name, value: t.amount, color: t.chartColor, count: t.count,
  }));

  // Filters
  const filteredIncomes = ingresos.filter(i => {
    const q = debouncedSearchTerm.toLowerCase();
    const matchesSearch = (i.descripcion ?? '').toLowerCase().includes(q) ||
                          (i.fuente ?? '').toLowerCase().includes(q) ||
                          String(i.clienteId).includes(q);
    const matchesTipo   = selectedTipo === 'todos' || i.tipo === selectedTipo;
    const matchesActivo = selectedActivo === 'todos' ||
                          (selectedActivo === 'activo' ? i.activo : !i.activo);
    const matchesMetodo = selectedMetodo === 'todos' || (i.metodoRecepcion ?? '') === selectedMetodo;
    const matchesPeriod = filterByPeriod(i.fecha, selectedPeriod);
    return matchesSearch && matchesTipo && matchesActivo && matchesMetodo && matchesPeriod;
  });

  const sortedIncomes = [...filteredIncomes].sort((a, b) => {
    if (sortBy === 'date')   return sortOrder === 'desc'
      ? new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      : new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    if (sortBy === 'amount') return sortOrder === 'desc' ? b.monto - a.monto : a.monto - b.monto;
    return sortOrder === 'desc' ? b.tipo.localeCompare(a.tipo) : a.tipo.localeCompare(b.tipo);
  });

  const totalPages = Math.ceil(sortedIncomes.length / itemsPerPage);
  const paginatedIncomes = sortedIncomes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasActiveFilters = searchTerm !== '' || selectedTipo !== 'todos' ||
    selectedActivo !== 'todos' || selectedMetodo !== 'todos' || selectedPeriod !== 'todos';

  const clearAllFilters = () => {
    setSearchTerm(''); setSelectedTipo('todos');
    setSelectedActivo('todos'); setSelectedMetodo('todos');
    setSelectedPeriod('todos'); setCurrentPage(1);
  };

  // Handlers
  const handleCreate = async () => {
    try {
      await ingresosService.create({
        clienteId:       Number(createForm.clienteId),
        monto:           Number(createForm.monto),
        fecha:           createForm.fecha,
        tipo:            createForm.tipo,
        fuente:          createForm.fuente || undefined,
        descripcion:     createForm.descripcion || undefined,
        metodoRecepcion: createForm.metodoRecepcion || undefined,
        esRecurrente:    createForm.esRecurrente,
        frecuencia:      createForm.esRecurrente && createForm.frecuencia ? createForm.frecuencia : undefined,
      });
      await fetchIngresos();
      setShowCreateModal(false);
      setCreateForm(emptyCreate(isClientRole ? ownClienteId : ''));
    } catch (e) {
      notifyActionError('crear', e, 'No se pudo crear el ingreso.');
    }
  };

  const handleEditOpen = (ingreso: Ingreso) => {
    setSelectedIngreso(ingreso);
    setEditForm({
      monto:           String(ingreso.monto),
      fecha:           ingreso.fecha,
      tipo:            ingreso.tipo,
      fuente:          ingreso.fuente ?? '',
      descripcion:     ingreso.descripcion ?? '',
      metodoRecepcion: ingreso.metodoRecepcion ?? '',
      esRecurrente:    ingreso.esRecurrente,
      frecuencia:      ingreso.frecuencia ?? '',
      activo:          ingreso.activo,
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!selectedIngreso) return;
    try {
      await ingresosService.update(selectedIngreso.id, {
        monto:           Number(editForm.monto),
        fecha:           editForm.fecha,
        tipo:            editForm.tipo,
        fuente:          editForm.fuente || undefined,
        descripcion:     editForm.descripcion || undefined,
        metodoRecepcion: editForm.metodoRecepcion || undefined,
        esRecurrente:    editForm.esRecurrente,
        frecuencia:      editForm.esRecurrente && editForm.frecuencia ? editForm.frecuencia : undefined,
        activo:          editForm.activo,
      });
      setShowEditModal(false);
      await fetchIngresos();
    } catch (e) {
      notifyActionError('actualizar', e, 'No se pudo actualizar el ingreso.');
    }
  };

  const handleDelete = async (ingreso: Ingreso) => {
    if (!(await confirm('¿Estás seguro de que deseas eliminar este ingreso?'))) return;
    try {
      await ingresosService.remove(ingreso.id);
      await fetchIngresos();
    } catch (e) {
      notifyActionError('eliminar', e, 'No se pudo eliminar el ingreso.');
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <motion.div
      variants={containerVariants} initial="hidden" animate="visible"
      className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-r from-[#321D28] via-[#4a2d40] to-[#321D28] rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05984]/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#F05984] to-[#BC455F] rounded-xl shadow-lg">
              <TrendingUp size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">Ingresos</h1>
                <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">
                  {ingresos.length} registros
                </span>
              </div>
              <p className="text-white/50 text-sm mt-1">Gestiona y controla todos tus ingresos</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setCreateForm(emptyCreate(isClientRole ? ownClienteId : '')); setShowCreateModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300"
            >
              <Plus size={20} />
              <span className="hidden sm:inline font-medium">Nuevo Ingreso</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
          className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="min-w-0">
              <p className="text-white/60 text-sm">Ingresos del Año</p>
              <p className="text-2xl font-bold text-white mt-1 break-words">{formatCurrency(totalYearlyIncome)}</p>
              <p className="text-white/40 text-xs mt-1">{currentYear}</p>
            </div>
            <div className="shrink-0 p-3 rounded-xl bg-white/10">
              <Calendar size={20} className="text-[#F05984]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="min-w-0">
              <p className="text-white/60 text-sm">Este mes</p>
              <p className="text-2xl font-bold text-white mt-1 break-words">{formatCurrency(totalMonthlyIncome)}</p>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(monthlyProgress, 100)}%` }}
                />
              </div>
              <p className="text-white/40 text-xs mt-1">{monthlyProgress.toFixed(0)}% de meta mensual</p>
            </div>
            <div className="shrink-0 p-3 rounded-xl bg-green-500/20">
              <TrendingUp size={20} className="text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="min-w-0">
              <p className="text-white/60 text-sm">Recurrentes</p>
              <p className="text-2xl font-bold text-blue-400 mt-1 break-words">{formatCurrency(totalRecurrentes)}</p>
              <p className="text-white/40 text-xs mt-1">{recurrentesIngresos.length} ingresos recurrentes</p>
            </div>
            <div className="shrink-0 p-3 rounded-xl bg-blue-500/20">
              <Repeat size={20} className="text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="min-w-0">
              <p className="text-white/60 text-sm">Ticket Promedio</p>
              <p className="text-2xl font-bold text-white mt-1 break-words">{formatCurrency(averageTicket)}</p>
              <p className="text-white/40 text-xs mt-1">{ingresos.length} transacciones</p>
            </div>
            <div className="shrink-0 p-3 rounded-xl bg-purple-500/20">
              <DollarSign size={20} className="text-purple-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Pie chart + tipo summary */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-3 text-sm">Distribución de Ingresos</h3>
          <div className="w-full h-[280px]">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={pieChartData} cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90} paddingAngle={2}
                    dataKey="value" animationBegin={0} animationDuration={800}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [formatCurrency(value), 'Monto']}
                    labelStyle={labelStyle}
                  />
                  <Legend
                    formatter={(value) => <span className="text-white/70 text-xs">{value}</span>}
                    wrapperStyle={{ paddingTop: '20px' }}
                    verticalAlign="bottom"
                    height={36}
                  />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-white/40 text-center text-sm">No hay datos de ingresos</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-3 text-sm">Categorías destacadas</h3>
          {tipoSummary.length > 0 ? (
            <div className="space-y-3">
              {tipoSummary.map((t, index) => (
                <motion.div
                  key={t.tipo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 rounded-lg p-2.5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between flex-wrap gap-x-2 gap-y-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-lg bg-gradient-to-r ${t.color} bg-opacity-20`}>
                        {t.icon}
                      </div>
                      <span className="text-white text-xs font-medium">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 text-xs">{t.percentage.toFixed(1)}%</span>
                      <span className="text-white text-xs font-semibold">{formatCurrency(t.amount)}</span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${t.color} rounded-full`}
                    />
                  </div>
                  <p className="text-white/30 text-[10px] mt-1">{t.count} transacciones</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-center py-6 text-sm">No hay datos de ingresos</p>
          )}
        </div>
      </motion.div>

      {/* Search + list */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
        <div className="flex items-center px-4 pt-4 pb-3 border-b border-white/10">
          <ViewModeToggle viewMode={viewMode} onToggle={setViewMode} />
        </div>
        <SearchFilterBar
          searchTerm={searchTerm} onSearch={setSearchTerm}
          selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod}
          showFilters={showFilters} onToggleFilters={() => setShowFilters(!showFilters)}
          hasActiveFilters={hasActiveFilters} onClearFilters={clearAllFilters}
          placeholder="Buscar por descripción, fuente o cliente ID..."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-white/60 text-xs mb-1 block">Tipo</label>
              <select value={selectedTipo} onChange={e => setSelectedTipo(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                style={selectStyle}>
                <option value="todos"   style={optStyle}>Todos los tipos</option>
                <option value="ESTABLE" style={optStyle}>Estable</option>
                <option value="VOLATIL" style={optStyle}>Volátil</option>
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">Estado</label>
              <select value={selectedActivo} onChange={e => setSelectedActivo(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                style={selectStyle}>
                <option value="todos"    style={optStyle}>Todos los estados</option>
                <option value="activo"   style={optStyle}>Activo</option>
                <option value="inactivo" style={optStyle}>Inactivo</option>
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">Método de recepción</label>
              <select value={selectedMetodo} onChange={e => setSelectedMetodo(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                style={selectStyle}>
                <option value="todos"         style={optStyle}>Todos los métodos</option>
                <option value="EFECTIVO"      style={optStyle}>Efectivo</option>
                <option value="TRANSFERENCIA" style={optStyle}>Transferencia</option>
                <option value="CHEQUE"        style={optStyle}>Cheque</option>
                <option value="OTRO"          style={optStyle}>Otro</option>
              </select>
            </div>
          </div>
        </SearchFilterBar>

        <SortBar
          sortBy={sortBy} sortOrder={sortOrder}
          onSort={(field) => {
            setSortBy(field);
            setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
          }}
          fields={[
            { key: 'date',     label: 'Fecha',  icon: <Calendar size={14} /> },
            { key: 'amount',   label: 'Monto',  icon: <DollarSign size={14} /> },
            { key: 'category', label: 'Tipo',   icon: <Tag size={14} /> },
          ]}
          totalResults={filteredIncomes.length}
        />

        <div className="overflow-x-auto overflow-y-auto max-h-[520px] custom-scrollbar">
          <AnimatePresence mode="wait">
            {viewMode === 'table' ? (
              <motion.div key="table"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">ID</th>
                      <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Descripción</th>
                      <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Tipo</th>
                      <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Cliente</th>
                      <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Fecha</th>
                      <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Método</th>
                      <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Estado</th>
                      <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Monto</th>
                      <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedIncomes.map((ingreso, index) => (
                      <motion.tr
                        key={ingreso.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <td className="py-3 px-4">
                          <span className="text-white/40 text-xs font-mono">{ingreso.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white font-medium">{ingreso.descripcion ?? '—'}</p>
                            {ingreso.fuente && (
                              <p className="text-white/40 text-xs mt-0.5">{ingreso.fuente}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ingreso.tipo === 'ESTABLE' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                              {ingreso.tipo}
                            </span>
                            {ingreso.esRecurrente && ingreso.frecuencia && (
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                                {FRECUENCIA_LABEL[ingreso.frecuencia]}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-white/60 text-sm">{clienteNombre(ingreso.clienteId)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-white/40" />
                            <span className="text-white text-sm">{formatDate(ingreso.fecha)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-white text-sm">{ingreso.metodoRecepcion ? METODO_LABEL[ingreso.metodoRecepcion] : '—'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${ingreso.activo ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {ingreso.activo ? <CheckCircle size={10} /> : <XCircle size={10} />}
                            {ingreso.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-white font-bold">{formatCurrency(ingreso.monto)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditOpen(ingreso)}
                              className="p-1.5 rounded-lg hover:bg-blue-500/20 transition-all text-blue-400" title="Editar Ingreso">
                              <Edit size={16} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(ingreso)}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 transition-all text-red-400" title="Eliminar Ingreso">
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div key="grid"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {paginatedIncomes.map((ingreso, index) => (
                  <motion.div
                    key={ingreso.id}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#F05984]/50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white/40 text-xs font-mono">{ingreso.id}</p>
                        <h3 className="text-white font-medium mt-1">{ingreso.descripcion ?? '—'}</h3>
                        {ingreso.fuente && (
                          <p className="text-white/40 text-xs mt-0.5">{ingreso.fuente}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${ingreso.tipo === 'ESTABLE' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {ingreso.tipo}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Cliente:</span>
                        <span className="text-white">{clienteNombre(ingreso.clienteId)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Fecha:</span>
                        <span className="text-white">{formatDate(ingreso.fecha)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Método:</span>
                        <span className="text-white">{ingreso.metodoRecepcion ? METODO_LABEL[ingreso.metodoRecepcion] : '—'}</span>
                      </div>
                      {ingreso.esRecurrente && ingreso.frecuencia && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/60">Frecuencia:</span>
                          <span className="text-blue-400 text-xs">{FRECUENCIA_LABEL[ingreso.frecuencia]}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-lg font-bold text-white">{formatCurrency(ingreso.monto)}</span>
                      <div className="flex items-center gap-1">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditOpen(ingreso)}
                          className="p-1.5 rounded-lg hover:bg-blue-500/20 transition-all text-blue-400" title="Editar Ingreso">
                          <Edit size={16} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(ingreso)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-all text-red-400" title="Eliminar Ingreso">
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Pagination
          currentPage={currentPage} totalPages={totalPages}
          totalItems={filteredIncomes.length} itemsPerPage={itemsPerPage}
          label="ingresos" onPageChange={setCurrentPage}
        />
      </motion.div>

      {/* Modal: crear ingreso */}
      <AnimatePresence>
        <ModalOverlay isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}
          title="Nuevo Ingreso" subtitle="Completa los campos para registrar un nuevo ingreso"
          icon={<FileText size={20} className="text-white" />}>
          <form onSubmit={e => { e.preventDefault(); handleCreate(); }} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Cliente *</label>
                {isClientRole ? (
                  <div className={inputCls}>{clientesList.find(c => c.id === Number(ownClienteId))?.nombre || localStorage.getItem('userName') || 'Tu cuenta'}</div>
                ) : (
                  <select value={createForm.clienteId}
                    onChange={e => setCreateForm({...createForm, clienteId: e.target.value})}
                    className={inputCls} style={selectStyle} required>
                    <option value="" style={optStyle}>Seleccionar cliente</option>
                    {clientesActivos.map(c => (
                      <option key={c.id} value={c.id} style={optStyle}>{c.nombre}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Monto *</label>
                <input type="number" step="0.01" min="0.01" value={createForm.monto}
                  onChange={e => setCreateForm({...createForm, monto: e.target.value})}
                  className={inputCls} placeholder="0.00" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Fecha *</label>
                <input type="date" value={createForm.fecha}
                  onChange={e => setCreateForm({...createForm, fecha: e.target.value})}
                  className={inputCls} required />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Tipo *</label>
                <select value={createForm.tipo}
                  onChange={e => setCreateForm({...createForm, tipo: e.target.value})}
                  className={inputCls} style={selectStyle}>
                  <option value="ESTABLE" style={optStyle}>Estable</option>
                  <option value="VOLATIL" style={optStyle}>Volátil</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Fuente</label>
                <input type="text" value={createForm.fuente}
                  onChange={e => setCreateForm({...createForm, fuente: e.target.value})}
                  className={inputCls} placeholder="Ej: Salario empresa X" />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Descripción</label>
                <input type="text" value={createForm.descripcion}
                  onChange={e => setCreateForm({...createForm, descripcion: e.target.value})}
                  className={inputCls} placeholder="Descripción libre" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Método de recepción</label>
                <select value={createForm.metodoRecepcion}
                  onChange={e => setCreateForm({...createForm, metodoRecepcion: e.target.value})}
                  className={inputCls} style={selectStyle}>
                  <option value="TRANSFERENCIA" style={optStyle}>Transferencia</option>
                  <option value="EFECTIVO"      style={optStyle}>Efectivo</option>
                  <option value="CHEQUE"        style={optStyle}>Cheque</option>
                  <option value="OTRO"          style={optStyle}>Otro</option>
                </select>
              </div>
              <div className="flex items-end pb-1">
                <Toggle value={createForm.esRecurrente}
                  onChange={v => setCreateForm({...createForm, esRecurrente: v})}
                  label="Recurrente" />
              </div>
            </div>
            <AnimatePresence>
              {createForm.esRecurrente && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <FrecuenciaSelect value={createForm.frecuencia}
                    onChange={v => setCreateForm({...createForm, frecuencia: v})} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button"
                onClick={() => { setShowCreateModal(false); setCreateForm(emptyCreate(isClientRole ? ownClienteId : '')); }}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium">
                <Save size={18} /><span>Guardar Ingreso</span>
              </motion.button>
            </div>
          </form>
        </ModalOverlay>
      </AnimatePresence>

      {/* Modal: editar ingreso */}
      <AnimatePresence>
        <ModalOverlay isOpen={showEditModal && !!selectedIngreso} onClose={() => setShowEditModal(false)}
          title="Editar Ingreso" subtitle={`Ingreso #${selectedIngreso?.id}`}
          icon={<Edit size={20} className="text-white" />}>
          <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Monto</label>
                <input type="number" step="0.01" min="0.01" value={editForm.monto}
                  onChange={e => setEditForm({...editForm, monto: e.target.value})} className={inputCls} />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Fecha</label>
                <input type="date" value={editForm.fecha}
                  onChange={e => setEditForm({...editForm, fecha: e.target.value})} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Tipo</label>
                <select value={editForm.tipo}
                  onChange={e => setEditForm({...editForm, tipo: e.target.value})}
                  className={inputCls} style={selectStyle}>
                  <option value="ESTABLE" style={optStyle}>Estable</option>
                  <option value="VOLATIL" style={optStyle}>Volátil</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Método de recepción</label>
                <select value={editForm.metodoRecepcion}
                  onChange={e => setEditForm({...editForm, metodoRecepcion: e.target.value})}
                  className={inputCls} style={selectStyle}>
                  <option value="TRANSFERENCIA" style={optStyle}>Transferencia</option>
                  <option value="EFECTIVO"      style={optStyle}>Efectivo</option>
                  <option value="CHEQUE"        style={optStyle}>Cheque</option>
                  <option value="OTRO"          style={optStyle}>Otro</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Fuente</label>
                <input type="text" value={editForm.fuente}
                  onChange={e => setEditForm({...editForm, fuente: e.target.value})} className={inputCls} />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Descripción</label>
                <input type="text" value={editForm.descripcion}
                  onChange={e => setEditForm({...editForm, descripcion: e.target.value})} className={inputCls} />
              </div>
            </div>
            <div className="flex items-center gap-6 pt-1">
              <Toggle value={editForm.esRecurrente}
                onChange={v => setEditForm({...editForm, esRecurrente: v})} label="Recurrente" />
              <Toggle value={editForm.activo}
                onChange={v => setEditForm({...editForm, activo: v})} label="Activo" activeColor="bg-green-500" />
            </div>
            <AnimatePresence>
              {editForm.esRecurrente && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <FrecuenciaSelect value={editForm.frecuencia}
                    onChange={v => setEditForm({...editForm, frecuencia: v})} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button"
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium">
                <Save size={18} /><span>Guardar Cambios</span>
              </motion.button>
            </div>
          </form>
        </ModalOverlay>
      </AnimatePresence>
      {ConfirmDialogElement}
    </motion.div>
  );
};
