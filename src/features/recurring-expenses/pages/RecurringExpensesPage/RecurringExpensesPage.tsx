import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Repeat, Plus, Edit, Trash2, Calendar, DollarSign,
  Clock, CheckCircle, XCircle, Activity, Tag, PieChart, User,
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';
import { formatCurrency, formatDate, containerVariants, itemVariants } from '../../../../shared/utils';
import { getViewPreferences } from '../../../../shared/hooks/useViewPreferences';
import { PageSkeleton } from '../../../../shared/components/ui/PageSkeleton';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { SortBar } from '../../../../shared/components/ui/SortBar';
import { ModalOverlay } from '../../../../shared/components/ui/ModalOverlay';
import { SearchFilterBar } from '../../../../shared/components/ui/SearchFilterBar';
import { useConfirm } from '../../../../shared/hooks/useConfirm';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';
import { ViewModeToggle } from '../../../../shared/components/ui/ViewModeToggle';
import { tooltipStyle } from '../../../../shared/components/ui/chartConfig';
import { gastosRecurrentesService, type ApiGastoRecurrente, type Frecuencia } from '../../services';
import { clientesService, type ApiCliente } from '../../../clients/services';
import { categoriasService, isCategoriaGasto, type ApiCategoria } from '../../../categories/services';
import { getCurrentClientSession } from '../../../../shared/hooks/useCurrentClient';

const CHART_COLORS = ['#F05984', '#BC455F', '#6E4068', '#2DD4BF', '#F59E0B', '#10B981', '#6366F1', '#EF4444'];
const FREQ_LABEL: Record<Frecuencia, string> = { DIARIO: 'Diario', SEMANAL: 'Semanal', MENSUAL: 'Mensual', ANUAL: 'Anual' };
const FREQ_ORDER: Record<Frecuencia, number> = { DIARIO: 1, SEMANAL: 2, MENSUAL: 3, ANUAL: 4 };
const DIA_SEMANA_LABEL: Record<number, string> = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo' };

const monthlyEquivalent = (e: ApiGastoRecurrente) => {
  const monto = e.monto ?? 0;
  if (e.frecuencia === 'DIARIO') return monto * 30;
  if (e.frecuencia === 'SEMANAL') return monto * (52 / 12); // ~4.33 semanas/mes, no 4
  if (e.frecuencia === 'ANUAL') return monto / 12;
  return monto; // MENSUAL
};

const emptyForm = (clienteId = '') => ({
  clienteId,
  categoriaId: '',
  monto: '',
  descripcion: '',
  frecuencia: 'MENSUAL' as Frecuencia,
  fechaInicio: new Date().toISOString().split('T')[0],
  fechaFin: '',
  diaMes: '',
  diaSemana: '',
  activo: true,
});

type Estado = 'todos' | 'activo' | 'inactivo';

export const RecurringExpensesPage = () => {
  const { isClientRole, ownClienteId } = getCurrentClientSession();
  const { confirm, ConfirmDialogElement } = useConfirm();
  const [expenses, setExpenses] = useState<ApiGastoRecurrente[]>([]);
  const [clientes, setClientes] = useState<ApiCliente[]>([]);
  const [categoriasByClient, setCategoriasByClient] = useState<Record<number, ApiCategoria[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm);
  const [selectedCliente, setSelectedCliente] = useState<string>('todos');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas');
  const [selectedFrecuencia, setSelectedFrecuencia] = useState<'todos' | Frecuencia>('todos');
  const [selectedEstado, setSelectedEstado] = useState<Estado>('todos');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(() => getViewPreferences().defaultView === 'list' ? 'table' : 'grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'monto' | 'frecuencia' | 'fechaInicio'>('fechaInicio');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ApiGastoRecurrente | null>(null);
  const [formData, setFormData] = useState(emptyForm(isClientRole ? ownClienteId : ''));
  const [formCategorias, setFormCategorias] = useState<ApiCategoria[]>([]);

  const itemsPerPage = getViewPreferences().itemsPerPage;

  const clienteNombre = (id?: number) => clientes.find(c => Number(c.id) === id)?.nombreCompleto ?? `Cliente #${id}`;
  const clientesActivos = clientes.filter(c => c.activo !== false);
  const allCategorias = Object.values(categoriasByClient).flat();
  const categoriaOf = (id?: number) => id == null ? undefined : allCategorias.find(c => c.id === id);
  const categoriaNombre = (id?: number) => id == null ? 'Sin categoría' : (categoriaOf(id)?.nombre ?? `Categoría #${id}`);

  // No existe GET /gastos-recurrentes global: se agrega por cliente
  const fetchExpenses = useCallback(async (clientesList: ApiCliente[]) => {
    setIsLoading(true);
    try {
      const perClient = await Promise.all(
        clientesList.map(c => gastosRecurrentesService.getByCliente(Number(c.id)).catch(() => []))
      );
      const full = perClient.flat();
      setExpenses(full);

      const clienteIds = [...new Set(full.map(e => e.clienteId).filter((id): id is number => id != null))];
      const entries = await Promise.all(
        clienteIds.map(async id => [id, await categoriasService.getByCliente(id).catch(() => [])] as const)
      );
      setCategoriasByClient(Object.fromEntries(entries));
    } catch (e) {
      toast.error(`Error al cargar gastos recurrentes: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    clientesService.getAll()
      .then(list => {
        setClientes(list);
        // Un usuario con rol cliente solo debe ver/agregar sus propios gastos recurrentes.
        const scoped = isClientRole ? list.filter(c => Number(c.id) === Number(ownClienteId)) : list;
        return fetchExpenses(scoped);
      })
      .catch(() => setIsLoading(false));
  }, [fetchExpenses, isClientRole, ownClienteId]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCliente, selectedCategoria, selectedFrecuencia, selectedEstado]);

  // Categorías de gasto del cliente seleccionado en el formulario (crear)
  useEffect(() => {
    if (!formData.clienteId) { setFormCategorias([]); return; }
    const clienteId = Number(formData.clienteId);
    if (categoriasByClient[clienteId]) { setFormCategorias(categoriasByClient[clienteId].filter(isCategoriaGasto)); return; }
    categoriasService.getByCliente(clienteId).then(cats => {
      setFormCategorias(cats.filter(isCategoriaGasto));
      setCategoriasByClient(prev => ({ ...prev, [clienteId]: cats }));
    }).catch(() => setFormCategorias([]));
  }, [formData.clienteId, categoriasByClient]);

  const validatePayload = (monto: number, frecuencia: Frecuencia, fechaInicio: string, fechaFin: string | null, diaMes: number | null, diaSemana: number | null) => {
    if (!(monto > 0)) { toast.error('El monto debe ser mayor a 0'); return false; }
    if (fechaFin && new Date(fechaFin) <= new Date(fechaInicio)) { toast.error('La fecha fin debe ser mayor a la fecha de inicio'); return false; }
    if (diaMes != null && (diaMes < 1 || diaMes > 31)) { toast.error('El día del mes debe estar entre 1 y 31'); return false; }
    if (diaSemana != null && (diaSemana < 1 || diaSemana > 7)) { toast.error('El día de la semana debe estar entre 1 y 7'); return false; }
    if (frecuencia === 'MENSUAL' && diaMes == null) { toast.error('Selecciona el día del mes para frecuencia mensual'); return false; }
    if (frecuencia === 'SEMANAL' && diaSemana == null) { toast.error('Selecciona el día de la semana para frecuencia semanal'); return false; }
    return true;
  };

  const handleCreateExpense = async () => {
    const monto = parseFloat(formData.monto);
    const diaMes = formData.frecuencia === 'MENSUAL' && formData.diaMes ? Number(formData.diaMes) : null;
    const diaSemana = formData.frecuencia === 'SEMANAL' && formData.diaSemana ? Number(formData.diaSemana) : null;
    const fechaFin = formData.fechaFin || null;
    if (!validatePayload(monto, formData.frecuencia, formData.fechaInicio, fechaFin, diaMes, diaSemana)) return;
    try {
      await gastosRecurrentesService.create({
        clienteId: Number(formData.clienteId),
        categoriaId: formData.categoriaId ? Number(formData.categoriaId) : undefined,
        monto,
        descripcion: formData.descripcion || undefined,
        frecuencia: formData.frecuencia,
        fechaInicio: formData.fechaInicio,
        fechaFin,
        diaMes,
        diaSemana,
      });
      toast.success('Gasto recurrente creado');
      setShowCreateModal(false);
      setFormData(emptyForm(isClientRole ? ownClienteId : ''));
      fetchExpenses(clientes);
    } catch (e) {
      toast.error(`Error al crear: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
  };

  const openEditModal = (expense: ApiGastoRecurrente) => {
    setSelectedExpense(expense);
    setFormData({
      clienteId: String(expense.clienteId ?? ''),
      categoriaId: expense.categoriaId ? String(expense.categoriaId) : '',
      monto: String(expense.monto ?? ''),
      descripcion: expense.descripcion ?? '',
      frecuencia: expense.frecuencia ?? 'MENSUAL',
      fechaInicio: expense.fechaInicio ?? '',
      fechaFin: expense.fechaFin ?? '',
      diaMes: expense.diaMes != null ? String(expense.diaMes) : '',
      diaSemana: expense.diaSemana != null ? String(expense.diaSemana) : '',
      activo: expense.activo ?? true,
    });
    setShowEditModal(true);
  };

  const handleUpdateExpense = async () => {
    if (!selectedExpense?.id) return;
    const monto = parseFloat(formData.monto);
    const diaMes = formData.frecuencia === 'MENSUAL' && formData.diaMes ? Number(formData.diaMes) : null;
    const diaSemana = formData.frecuencia === 'SEMANAL' && formData.diaSemana ? Number(formData.diaSemana) : null;
    const fechaFin = formData.fechaFin || null;
    const fechaInicio = selectedExpense.fechaInicio ?? formData.fechaInicio;
    if (!validatePayload(monto, formData.frecuencia, fechaInicio, fechaFin, diaMes, diaSemana)) return;
    try {
      await gastosRecurrentesService.update(selectedExpense.id, {
        clienteId: selectedExpense.clienteId!,
        categoriaId: selectedExpense.categoriaId,
        monto,
        descripcion: formData.descripcion || undefined,
        frecuencia: formData.frecuencia,
        fechaInicio,
        fechaFin,
        diaMes,
        diaSemana,
        activo: formData.activo,
      });
      toast.success('Gasto recurrente actualizado');
      setShowEditModal(false);
      setSelectedExpense(null);
      fetchExpenses(clientes);
    } catch (e) {
      toast.error(`Error al actualizar: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
  };

  const handleDeleteExpense = async (id?: number) => {
    if (!id) return;
    if (!(await confirm('¿Estás seguro de que deseas eliminar este gasto recurrente?'))) return;
    try {
      await gastosRecurrentesService.remove(id);
      toast.success('Gasto recurrente eliminado');
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      toast.error(`Error al eliminar: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
  };

  const filteredExpenses = expenses.filter(e => {
    const texto = `${e.descripcion ?? ''} ${clienteNombre(e.clienteId)}`.toLowerCase();
    const matchesSearch = texto.includes(debouncedSearchTerm.toLowerCase());
    const matchesCliente = selectedCliente === 'todos' || String(e.clienteId) === selectedCliente;
    const matchesCategoria = selectedCategoria === 'todas' || String(e.categoriaId) === selectedCategoria;
    const matchesFrecuencia = selectedFrecuencia === 'todos' || e.frecuencia === selectedFrecuencia;
    const matchesEstado = selectedEstado === 'todos' || (selectedEstado === 'activo' ? !!e.activo : !e.activo);
    return matchesSearch && matchesCliente && matchesCategoria && matchesFrecuencia && matchesEstado;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const dir = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'monto') return dir * ((a.monto ?? 0) - (b.monto ?? 0));
    if (sortBy === 'frecuencia') return dir * (FREQ_ORDER[a.frecuencia ?? 'MENSUAL'] - FREQ_ORDER[b.frecuencia ?? 'MENSUAL']);
    return dir * (new Date(a.fechaInicio ?? 0).getTime() - new Date(b.fechaInicio ?? 0).getTime());
  });

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);
  const paginatedExpenses = sortedExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeExpenses = expenses.filter(e => e.activo);
  const totalMonthly = activeExpenses.reduce((sum, e) => sum + monthlyEquivalent(e), 0);
  const totalAnnual = totalMonthly * 12;
  const averagePerDay = totalMonthly / 30;

  const categoryMap = new Map<number, { amount: number; count: number }>();
  activeExpenses.forEach(e => {
    if (e.categoriaId == null) return;
    const entry = categoryMap.get(e.categoriaId) ?? { amount: 0, count: 0 };
    entry.amount += monthlyEquivalent(e);
    entry.count += 1;
    categoryMap.set(e.categoriaId, entry);
  });
  const totalCategoryAmount = [...categoryMap.values()].reduce((sum, c) => sum + c.amount, 0);
  const pieChartData = [...categoryMap.entries()].map(([id, data], idx) => ({
    name: categoriaNombre(id), value: data.amount, count: data.count,
    color: categoriaOf(id)?.color || CHART_COLORS[idx % CHART_COLORS.length],
  }));
  const topCategories = [...pieChartData].sort((a, b) => b.value - a.value).slice(0, 3).map(c => ({
    ...c, percentage: totalCategoryAmount > 0 ? (c.value / totalCategoryAmount) * 100 : 0,
  }));

  const clearAllFilters = () => {
    setSearchTerm(''); setSelectedCliente('todos'); setSelectedCategoria('todas');
    setSelectedFrecuencia('todos'); setSelectedEstado('todos'); setCurrentPage(1);
  };
  const hasActiveFilters = searchTerm !== '' || selectedCliente !== 'todos' || selectedCategoria !== 'todas'
    || selectedFrecuencia !== 'todos' || selectedEstado !== 'todos';

  const getEstadoBadge = (activo?: boolean) => activo
    ? <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit"><CheckCircle size={12} /> Activo</span>
    : <span className="bg-white/10 text-white/50 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit"><XCircle size={12} /> Inactivo</span>;

  const periodicidadDe = (e: ApiGastoRecurrente) => {
    if (e.frecuencia === 'MENSUAL' && e.diaMes) return `Día ${e.diaMes} de cada mes`;
    if (e.frecuencia === 'SEMANAL' && e.diaSemana) return `Cada ${DIA_SEMANA_LABEL[e.diaSemana]}`;
    return FREQ_LABEL[e.frecuencia ?? 'MENSUAL'];
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
              <Repeat size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Gastos Recurrentes</h1>
              <p className="text-white/50 text-sm mt-1">Gestiona tus suscripciones y pagos periódicos</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setFormData(emptyForm(isClientRole ? ownClienteId : '')); setShowCreateModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300"
          >
            <Plus size={20} />
            <span className="hidden sm:inline font-medium">Nuevo Gasto</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Total Mensual</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{formatCurrency(totalMonthly)}</p>
              <p className="text-white/30 text-xs mt-1">Gastos fijos mensuales</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10"><DollarSign size={24} className="text-[#F05984]" /></div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Total Anual</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{formatCurrency(totalAnnual)}</p>
              <p className="text-white/30 text-xs mt-1">{activeExpenses.length} gastos activos</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10"><Calendar size={24} className="text-[#F05984]" /></div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gradient-to-br from-[#1e1b2e] to-[#2d2a3d] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Inactivos</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1 tracking-tight">{expenses.length - activeExpenses.length}</p>
              <p className="text-white/30 text-xs mt-1">de {expenses.length} en total</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/20"><Clock size={24} className="text-yellow-400" /></div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gradient-to-br from-[#1a2e2a] to-[#2d403a] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Promedio diario</p>
              <p className="text-2xl font-bold text-green-400 mt-1 tracking-tight">{formatCurrency(averagePerDay)}</p>
              <p className="text-white/30 text-xs mt-1">Gasto diario promedio</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20"><Activity size={24} className="text-green-400" /></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Distribución por Categoría */}
      {pieChartData.length > 0 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <PieChart size={20} className="text-[#F05984]" />
              <h3 className="text-white font-semibold">Distribución por Categoría</h3>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" animationBegin={0} animationDuration={800}>
                    {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                  </Pie>
                  <ReTooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'Monto mensual']} labelStyle={{ color: 'white' }} />
                  <Legend formatter={(value) => <span className="text-white/70 text-xs">{value}</span>} wrapperStyle={{ paddingTop: '20px' }} verticalAlign="bottom" height={36} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Tag size={18} className="text-[#F05984]" />
              Top 3 Categorías
            </h3>
            <div className="space-y-4">
              {topCategories.map((cat, index) => (
                <motion.div key={cat.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-white text-sm font-medium">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/50 text-xs">{cat.percentage.toFixed(1)}%</span>
                      <span className="text-white text-sm font-semibold">{formatCurrency(cat.value)}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${cat.percentage}%` }} transition={{ duration: 0.8, delay: index * 0.1 }} className="h-full rounded-full" style={{ backgroundColor: cat.color }} />
                  </div>
                  <p className="text-white/30 text-[10px] mt-1">{cat.count} gasto(s)</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters and list */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
        <div className="flex items-center px-4 pt-4">
          <ViewModeToggle viewMode={viewMode} onToggle={setViewMode} />
        </div>
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
          placeholder="Buscar gastos recurrentes..."
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-white/60 text-xs mb-1 block">Cliente</label>
              <select value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos los clientes</option>
                {clientes.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14', color: 'white' }}>{c.nombreCompleto}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">Categoría</label>
              <select value={selectedCategoria} onChange={(e) => setSelectedCategoria(e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                <option value="todas" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todas las categorías</option>
                {[...new Map(allCategorias.map(c => [c.id, c])).values()].map(c => (
                  <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14', color: 'white' }}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">Frecuencia</label>
              <select value={selectedFrecuencia} onChange={(e) => setSelectedFrecuencia(e.target.value as 'todos' | Frecuencia)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todas las frecuencias</option>
                <option value="DIARIO" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Diario</option>
                <option value="SEMANAL" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Semanal</option>
                <option value="MENSUAL" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Mensual</option>
                <option value="ANUAL" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Anual</option>
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1 block">Estado</label>
              <select value={selectedEstado} onChange={(e) => setSelectedEstado(e.target.value as Estado)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos los estados</option>
                <option value="activo" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Activos</option>
                <option value="inactivo" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Inactivos</option>
              </select>
            </div>
          </div>
        </SearchFilterBar>

        <SortBar
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(field) => { setSortBy(field as typeof sortBy); setSortOrder(prev => (sortBy === field && prev === 'desc') ? 'asc' : 'desc'); }}
          fields={[
            { key: 'monto', label: 'Monto', icon: <DollarSign size={14} /> },
            { key: 'frecuencia', label: 'Frecuencia', icon: <Repeat size={14} /> },
            { key: 'fechaInicio', label: 'Fecha inicio', icon: <Calendar size={14} /> },
          ]}
          totalResults={filteredExpenses.length}
        />

        {filteredExpenses.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-4 bg-white/10 rounded-full mb-4"><Repeat size={48} className="text-white/30" /></div>
            <h3 className="text-white font-semibold text-lg mb-2">No hay gastos recurrentes</h3>
            <p className="text-white/40 text-sm text-center max-w-md">No se encontraron gastos recurrentes con los filtros actuales. Prueba a ajustar los filtros o crea un nuevo gasto recurrente.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setFormData(emptyForm(isClientRole ? ownClienteId : '')); setShowCreateModal(true); }} className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">
              <Plus size={18} />
              <span>Crear nuevo gasto</span>
            </motion.button>
          </motion.div>
        )}

        {/* Table View */}
        {filteredExpenses.length > 0 && viewMode === 'table' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Descripción</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Categoría</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Periodicidad</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Fecha inicio</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Estado</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Monto</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedExpenses.map((expense, index) => (
                    <motion.tr key={expense.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.03 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Repeat size={14} className="text-[#F05984]" />
                          <span className="text-white font-medium">{expense.descripcion || `Gasto #${expense.id}`}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/70 text-sm">{clienteNombre(expense.clienteId)}</td>
                      <td className="py-3 px-4 text-white/70 text-sm">{categoriaNombre(expense.categoriaId)}</td>
                      <td className="py-3 px-4 text-white/70 text-sm">{periodicidadDe(expense)}</td>
                      <td className="py-3 px-4 text-white/70 text-sm">{formatDate(expense.fechaInicio ?? '')}</td>
                      <td className="py-3 px-4">{getEstadoBadge(expense.activo)}</td>
                      <td className="py-3 px-4 text-right text-white font-semibold">{formatCurrency(expense.monto ?? 0)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEditModal(expense)} className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400" title="Editar Gasto Recurrente">
                            <Edit size={14} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteExpense(expense.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400" title="Eliminar Gasto Recurrente">
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
        {filteredExpenses.length > 0 && viewMode === 'grid' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {paginatedExpenses.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border transition-all duration-300 hover:shadow-xl ${expense.activo ? 'border-white/10 hover:border-[#F05984]/50' : 'border-white/5 opacity-70'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-[#F05984]/20 to-[#BC455F]/20">
                        <Repeat size={16} className="text-[#F05984]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{expense.descripcion || `Gasto #${expense.id}`}</h3>
                        <p className="text-white/40 text-xs flex items-center gap-1"><User size={12} /> {clienteNombre(expense.clienteId)}</p>
                      </div>
                    </div>
                    {getEstadoBadge(expense.activo)}
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Monto:</span>
                      <span className="text-white font-bold text-lg">{formatCurrency(expense.monto ?? 0)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Periodicidad:</span>
                      <span className="text-white">{periodicidadDe(expense)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Categoría:</span>
                      <span className="text-white">{categoriaNombre(expense.categoriaId)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Inicio:</span>
                      <span className="text-white">{formatDate(expense.fechaInicio ?? '')}</span>
                    </div>
                    {expense.fechaFin && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Fin:</span>
                        <span className="text-white">{formatDate(expense.fechaFin)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/10">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEditModal(expense)} className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400" title="Editar Gasto Recurrente">
                      <Edit size={14} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteExpense(expense.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400" title="Eliminar Gasto Recurrente">
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredExpenses.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredExpenses.length} itemsPerPage={itemsPerPage} label="gastos recurrentes" onPageChange={setCurrentPage} />
        )}
      </motion.div>

      {/* Modal crear */}
      <AnimatePresence>
        <ModalOverlay isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nuevo Gasto Recurrente" subtitle="Completa los campos para registrar un nuevo gasto recurrente" icon={<Repeat size={20} className="text-white" />} maxWidth="max-w-2xl">
          <form onSubmit={(e) => { e.preventDefault(); handleCreateExpense(); }} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Cliente *</label>
                {isClientRole ? (
                  <div className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/70">
                    {clientes.find(c => Number(c.id) === Number(ownClienteId))?.nombreCompleto || localStorage.getItem('userName') || 'Tu cuenta'}
                  </div>
                ) : (
                  <select value={formData.clienteId} onChange={(e) => setFormData({ ...formData, clienteId: e.target.value, categoriaId: '' })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }} required>
                    <option value="" style={{ backgroundColor: '#1a0f14' }}>Seleccionar cliente</option>
                    {clientesActivos.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14' }}>{c.nombreCompleto}</option>)}
                  </select>
                )}
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Categoría</label>
                <select value={formData.categoriaId} onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })} disabled={!formData.clienteId} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all disabled:opacity-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  <option value="" style={{ backgroundColor: '#1a0f14' }}>Sin categoría</option>
                  {formCategorias.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14' }}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Descripción</label>
                <input type="text" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Ej: Netflix" />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Monto *</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="number" step="0.01" min="0.01" value={formData.monto} onChange={(e) => setFormData({ ...formData, monto: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="0.00" required />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Frecuencia *</label>
                <select value={formData.frecuencia} onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value as Frecuencia, diaMes: '', diaSemana: '' })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  <option value="DIARIO">Diario</option>
                  <option value="SEMANAL">Semanal</option>
                  <option value="MENSUAL">Mensual</option>
                  <option value="ANUAL">Anual</option>
                </select>
              </div>
              {formData.frecuencia === 'MENSUAL' && (
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Día del mes *</label>
                  <input type="number" min="1" max="31" value={formData.diaMes} onChange={(e) => setFormData({ ...formData, diaMes: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="1-31" required />
                </div>
              )}
              {formData.frecuencia === 'SEMANAL' && (
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Día de la semana *</label>
                  <select value={formData.diaSemana} onChange={(e) => setFormData({ ...formData, diaSemana: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }} required>
                    <option value="" style={{ backgroundColor: '#1a0f14' }}>Seleccionar día</option>
                    {Object.entries(DIA_SEMANA_LABEL).map(([num, label]) => <option key={num} value={num} style={{ backgroundColor: '#1a0f14' }}>{label}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Fecha de inicio *</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="date" value={formData.fechaInicio} onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                </div>
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Fecha de fin (opcional)</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input type="date" value={formData.fechaFin} onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg">
                Guardar Gasto
              </motion.button>
            </div>
          </form>
        </ModalOverlay>
      </AnimatePresence>

      {/* Modal editar */}
      <AnimatePresence>
        <ModalOverlay isOpen={showEditModal && !!selectedExpense} onClose={() => setShowEditModal(false)} title="Editar Gasto Recurrente" subtitle="Modifica los datos del gasto recurrente" icon={<Edit size={20} className="text-white" />} maxWidth="max-w-2xl">
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateExpense(); }} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Cliente</label>
                <input type="text" disabled value={clienteNombre(selectedExpense?.clienteId)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60" />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Categoría</label>
                <input type="text" disabled value={categoriaNombre(selectedExpense?.categoriaId)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60" />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Descripción</label>
              <input type="text" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Monto *</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="number" step="0.01" min="0.01" value={formData.monto} onChange={(e) => setFormData({ ...formData, monto: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Fecha de inicio</label>
                <input type="text" disabled value={formatDate(selectedExpense?.fechaInicio ?? '')} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Frecuencia *</label>
                <select value={formData.frecuencia} onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value as Frecuencia, diaMes: '', diaSemana: '' })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  <option value="DIARIO">Diario</option>
                  <option value="SEMANAL">Semanal</option>
                  <option value="MENSUAL">Mensual</option>
                  <option value="ANUAL">Anual</option>
                </select>
              </div>
              {formData.frecuencia === 'MENSUAL' && (
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Día del mes *</label>
                  <input type="number" min="1" max="31" value={formData.diaMes} onChange={(e) => setFormData({ ...formData, diaMes: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="1-31" required />
                </div>
              )}
              {formData.frecuencia === 'SEMANAL' && (
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Día de la semana *</label>
                  <select value={formData.diaSemana} onChange={(e) => setFormData({ ...formData, diaSemana: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }} required>
                    <option value="" style={{ backgroundColor: '#1a0f14' }}>Seleccionar día</option>
                    {Object.entries(DIA_SEMANA_LABEL).map(([num, label]) => <option key={num} value={num} style={{ backgroundColor: '#1a0f14' }}>{label}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Fecha de fin</label>
                <input type="date" value={formData.fechaFin} onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
              <span className="text-white text-sm">Activo</span>
            </label>
            {selectedExpense?.ultimoProcesamiento && (
              <p className="text-white/40 text-xs">Último procesamiento: {formatDate(selectedExpense.ultimoProcesamiento)}</p>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all shadow-lg">
                Guardar Cambios
              </motion.button>
            </div>
          </form>
        </ModalOverlay>
      </AnimatePresence>
      {ConfirmDialogElement}
    </motion.div>
  );
};
