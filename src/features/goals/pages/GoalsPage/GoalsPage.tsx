import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Plus, Search, Filter, Edit, Trash2, Calendar, TrendingUp,
  PieChart as PieChartIcon, DollarSign, Activity, XCircle, CheckCircle,
  User,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';
import { formatCurrency, formatDate, containerVariants, itemVariants } from '../../../../shared/utils';
import { getViewPreferences } from '../../../../shared/hooks/useViewPreferences';
import { PageSkeleton } from '../../../../shared/components/ui/PageSkeleton';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { SortBar } from '../../../../shared/components/ui/SortBar';
import { ModalOverlay } from '../../../../shared/components/ui/ModalOverlay';
import { ViewModeToggle } from '../../../../shared/components/ui/ViewModeToggle';
import { tooltipStyle } from '../../../../shared/components/ui/chartConfig';
import { metasService, type ApiMeta, type Prioridad } from '../../services';
import { clientesService, type ApiCliente } from '../../../clients/services';
import { getCurrentClientSession } from '../../../../shared/hooks/useCurrentClient';

const PRIORIDAD_COLOR: Record<Prioridad, string> = { BAJA: '#10B981', MEDIA: '#F59E0B', ALTA: '#EF4444' };
const PRIORIDAD_LABEL: Record<Prioridad, string> = { BAJA: 'Baja', MEDIA: 'Media', ALTA: 'Alta' };

const emptyForm = (clienteId = '') => ({
  clienteId,
  nombre: '',
  descripcion: '',
  montoObjetivo: '',
  montoActual: '0',
  fechaLimite: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
  prioridad: 'MEDIA' as Prioridad,
  activa: true,
  completada: false,
});

type Estado = 'todas' | 'activa' | 'completada' | 'inactiva';

export const GoalsPage = () => {
  const { isClientRole, ownClienteId } = getCurrentClientSession();
  const [goals, setGoals] = useState<ApiMeta[]>([]);
  const [clientes, setClientes] = useState<ApiCliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<Estado>('todas');
  const [selectedPrioridad, setSelectedPrioridad] = useState<'todas' | Prioridad>('todas');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(() => getViewPreferences().defaultView === 'list' ? 'table' : 'grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'nombre' | 'progreso' | 'monto' | 'fecha'>('progreso');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<ApiMeta | null>(null);
  const [formData, setFormData] = useState(emptyForm(isClientRole ? ownClienteId : ''));

  const itemsPerPage = getViewPreferences().itemsPerPage;

  const clienteNombre = (id?: number) => clientes.find(c => Number(c.id) === id)?.nombreCompleto ?? `Cliente #${id}`;

  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    try {
      // Un usuario con rol cliente solo debe ver sus propias metas: se usa el endpoint
      // ya scopeado por cliente en vez de traer y filtrar todas.
      const list = isClientRole
        ? await metasService.getByCliente(Number(ownClienteId))
        : await metasService.getAll();
      const full = await Promise.all(list.map(item => metasService.getById(item.id!)));
      setGoals(full);
    } catch (e) {
      toast.error(`Error al cargar metas: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  }, [isClientRole, ownClienteId]);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);
  useEffect(() => { clientesService.getAll().then(setClientes).catch(() => {}); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedEstado, selectedPrioridad]);

  const progressOf = (g: ApiMeta) => {
    const objetivo = g.montoObjetivo ?? 0;
    return objetivo > 0 ? Math.min(((g.montoActual ?? 0) / objetivo) * 100, 100) : 0;
  };

  const estadoOf = (g: ApiMeta): Exclude<Estado, 'todas'> => g.completada ? 'completada' : g.activa ? 'activa' : 'inactiva';

  const daysRemaining = (fechaLimite?: string) => {
    if (!fechaLimite) return null;
    return Math.ceil((new Date(fechaLimite).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const validatePayload = (montoObjetivo: number, montoActual: number) => {
    if (!(montoObjetivo > 0)) { toast.error('El monto objetivo debe ser mayor a 0'); return false; }
    if (montoActual < 0) { toast.error('El monto actual no puede ser negativo'); return false; }
    if (montoActual > montoObjetivo) { toast.error('El monto actual no puede superar al monto objetivo'); return false; }
    return true;
  };

  const handleCreateGoal = async () => {
    const montoObjetivo = parseFloat(formData.montoObjetivo);
    const montoActual = parseFloat(formData.montoActual) || 0;
    if (!validatePayload(montoObjetivo, montoActual)) return;
    try {
      await metasService.create({
        clienteId: Number(formData.clienteId),
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        montoObjetivo,
        montoActual,
        fechaLimite: formData.fechaLimite || undefined,
        prioridad: formData.prioridad,
        activa: formData.activa,
        completada: formData.completada,
      });
      toast.success('Meta creada');
      setShowCreateModal(false);
      setFormData(emptyForm(isClientRole ? ownClienteId : ''));
      fetchGoals();
    } catch (e) {
      toast.error(`Error al crear: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
  };

  const openEditModal = (goal: ApiMeta) => {
    setSelectedGoal(goal);
    setFormData({
      clienteId: String(goal.clienteId ?? ''),
      nombre: goal.nombre ?? '',
      descripcion: goal.descripcion ?? '',
      montoObjetivo: String(goal.montoObjetivo ?? ''),
      montoActual: String(goal.montoActual ?? '0'),
      fechaLimite: goal.fechaLimite ?? '',
      prioridad: goal.prioridad ?? 'MEDIA',
      activa: goal.activa ?? true,
      completada: goal.completada ?? false,
    });
    setShowEditModal(true);
  };

  const handleUpdateGoal = async () => {
    if (!selectedGoal?.id) return;
    const montoObjetivo = parseFloat(formData.montoObjetivo);
    const montoActual = parseFloat(formData.montoActual) || 0;
    if (!validatePayload(montoObjetivo, montoActual)) return;
    try {
      await metasService.update(selectedGoal.id, {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        montoObjetivo,
        montoActual,
        fechaLimite: formData.fechaLimite || undefined,
        prioridad: formData.prioridad,
        activa: formData.activa,
        completada: formData.completada,
        fechaCompletada: formData.completada
          ? (selectedGoal.fechaCompletada ?? new Date().toISOString().split('T')[0])
          : null,
      });
      toast.success('Meta actualizada');
      setShowEditModal(false);
      setSelectedGoal(null);
      fetchGoals();
    } catch (e) {
      toast.error(`Error al actualizar: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
  };

  const handleDeleteGoal = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta meta?')) return;
    try {
      await metasService.remove(id);
      toast.success('Meta eliminada');
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (e) {
      toast.error(`Error al eliminar: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
  };

  const filteredGoals = goals.filter(g => {
    const texto = `${g.nombre ?? ''} ${g.descripcion ?? ''}`.toLowerCase();
    const matchesSearch = texto.includes(searchTerm.toLowerCase());
    const matchesEstado = selectedEstado === 'todas' || estadoOf(g) === selectedEstado;
    const matchesPrioridad = selectedPrioridad === 'todas' || g.prioridad === selectedPrioridad;
    return matchesSearch && matchesEstado && matchesPrioridad;
  });

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    const dir = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'nombre') return dir * (a.nombre ?? '').localeCompare(b.nombre ?? '');
    if (sortBy === 'progreso') return dir * (progressOf(a) - progressOf(b));
    if (sortBy === 'monto') return dir * ((a.montoObjetivo ?? 0) - (b.montoObjetivo ?? 0));
    return dir * (new Date(a.fechaLimite ?? 0).getTime() - new Date(b.fechaLimite ?? 0).getTime());
  });

  const totalPages = Math.ceil(sortedGoals.length / itemsPerPage);
  const paginatedGoals = sortedGoals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalObjetivo = goals.reduce((sum, g) => sum + (g.montoObjetivo ?? 0), 0);
  const totalActual = goals.reduce((sum, g) => sum + (g.montoActual ?? 0), 0);
  const overallProgress = totalObjetivo > 0 ? (totalActual / totalObjetivo) * 100 : 0;
  const activeCount = goals.filter(g => g.activa && !g.completada).length;
  const completedCount = goals.filter(g => g.completada).length;

  // Distribución por prioridad (único agrupador real disponible en la API)
  const prioridadTotals = new Map<Prioridad, { total: number; count: number }>();
  goals.forEach(g => {
    const p = g.prioridad ?? 'MEDIA';
    const entry = prioridadTotals.get(p) ?? { total: 0, count: 0 };
    entry.total += g.montoObjetivo ?? 0;
    entry.count += 1;
    prioridadTotals.set(p, entry);
  });
  const pieChartData = [...prioridadTotals.entries()].map(([p, data]) => ({
    name: PRIORIDAD_LABEL[p], value: data.total, color: PRIORIDAD_COLOR[p], count: data.count,
  }));

  const topGoals = [...goals].sort((a, b) => progressOf(b) - progressOf(a)).slice(0, 5);

  const clearAllFilters = () => { setSearchTerm(''); setSelectedEstado('todas'); setSelectedPrioridad('todas'); setCurrentPage(1); };
  const hasActiveFilters = searchTerm !== '' || selectedEstado !== 'todas' || selectedPrioridad !== 'todas';

  const getEstadoBadge = (g: ApiMeta) => {
    const estado = estadoOf(g);
    if (estado === 'completada') return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit"><CheckCircle size={12} /> Completada</span>;
    if (estado === 'activa') return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit"><Activity size={12} /> Activa</span>;
    return <span className="bg-white/10 text-white/50 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit"><XCircle size={12} /> Inactiva</span>;
  };

  const getPriorityBadge = (p?: Prioridad) => {
    const prioridad = p ?? 'MEDIA';
    const styles: Record<Prioridad, string> = {
      BAJA: 'bg-green-500/20 text-green-400', MEDIA: 'bg-yellow-500/20 text-yellow-400', ALTA: 'bg-red-500/20 text-red-400',
    };
    return <span className={`px-2 py-1 rounded-full text-xs ${styles[prioridad]}`}>{PRIORIDAD_LABEL[prioridad]}</span>;
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-r from-[#321D28] via-[#4a2d40] to-[#321D28] rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05984]/10 rounded-full blur-3xl" />
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setFormData(emptyForm(isClientRole ? ownClienteId : '')); setShowCreateModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300"
          >
            <Plus size={20} />
            <span className="hidden sm:inline font-medium">Nueva Meta</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Progreso General</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{overallProgress.toFixed(0)}%</p>
              <p className="text-white/30 text-xs mt-1">{formatCurrency(totalActual)} ahorrados</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10"><Target size={24} className="text-[#F05984]" /></div>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${overallProgress}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full" />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Total Ahorrado</p>
              <p className="text-2xl font-bold text-green-400 mt-1 tracking-tight">{formatCurrency(totalActual)}</p>
              <p className="text-white/30 text-xs mt-1">de {formatCurrency(totalObjetivo)}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20"><DollarSign size={24} className="text-green-400" /></div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gradient-to-br from-[#1e1b2e] to-[#2d2a3d] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Metas Activas</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1 tracking-tight">{activeCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/20"><Activity size={24} className="text-yellow-400" /></div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gradient-to-br from-[#1a2e2a] to-[#2d403a] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Completadas</p>
              <p className="text-2xl font-bold text-blue-400 mt-1 tracking-tight">{completedCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20"><CheckCircle size={24} className="text-blue-400" /></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Distribución por Prioridad y Top Metas */}
      {pieChartData.length > 0 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon size={20} className="text-[#F05984]" />
              <h3 className="text-white font-semibold">Distribución por Prioridad</h3>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" animationBegin={0} animationDuration={800}>
                    {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                  </Pie>
                  <ReTooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'Objetivo']} labelStyle={{ color: 'white' }} />
                  <Legend formatter={(value) => <span className="text-white/70 text-xs">{value}</span>} wrapperStyle={{ paddingTop: '20px' }} verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#F05984]" />
              Top Metas por Progreso
            </h3>
            <div className="space-y-4">
              {topGoals.map((goal) => (
                <motion.div key={goal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium truncate">{goal.nombre}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-white/50 text-xs">{progressOf(goal).toFixed(0)}%</span>
                      <span className="text-white text-sm font-semibold">{formatCurrency(goal.montoObjetivo ?? 0)}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressOf(goal)}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-[#F05984] to-[#BC455F]" />
                  </div>
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
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>
                <Filter size={20} />
              </motion.button>
              {hasActiveFilters && (
                <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={clearAllFilters} className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 text-sm">
                  <XCircle size={16} />
                  <span>Limpiar filtros</span>
                </motion.button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-white/10 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Estado</label>
                    <select value={selectedEstado} onChange={(e) => setSelectedEstado(e.target.value as Estado)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="todas" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos los estados</option>
                      <option value="activa" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Activas</option>
                      <option value="completada" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Completadas</option>
                      <option value="inactiva" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Inactivas</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Prioridad</label>
                    <select value={selectedPrioridad} onChange={(e) => setSelectedPrioridad(e.target.value as 'todas' | Prioridad)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="todas" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todas las prioridades</option>
                      <option value="ALTA" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Alta</option>
                      <option value="MEDIA" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Media</option>
                      <option value="BAJA" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Baja</option>
                    </select>
                  </div>
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
            { key: 'nombre', label: 'Nombre', icon: <Target size={14} /> },
            { key: 'progreso', label: 'Progreso', icon: <Activity size={14} /> },
            { key: 'monto', label: 'Monto', icon: <DollarSign size={14} /> },
            { key: 'fecha', label: 'Fecha', icon: <Calendar size={14} /> },
          ]}
          totalResults={filteredGoals.length}
        />

        {filteredGoals.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-4 bg-white/10 rounded-full mb-4"><Target size={48} className="text-white/30" /></div>
            <h3 className="text-white font-semibold text-lg mb-2">No hay metas financieras</h3>
            <p className="text-white/40 text-sm text-center max-w-md">No se encontraron metas con los filtros actuales. Prueba a ajustar los filtros o crea una nueva meta.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setFormData(emptyForm(isClientRole ? ownClienteId : '')); setShowCreateModal(true); }} className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">
              <Plus size={18} />
              <span>Crear nueva meta</span>
            </motion.button>
          </motion.div>
        )}

        {/* Table View */}
        {filteredGoals.length > 0 && viewMode === 'table' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Meta</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Prioridad</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Progreso</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Fecha límite</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Estado</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Monto</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedGoals.map((goal, index) => (
                    <motion.tr key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.03 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Target size={14} className="text-[#F05984]" />
                          <span className="text-white font-medium">{goal.nombre}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/70 text-sm">{clienteNombre(goal.clienteId)}</td>
                      <td className="py-3 px-4">{getPriorityBadge(goal.prioridad)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 w-32">
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#F05984] to-[#BC455F]" style={{ width: `${progressOf(goal)}%` }} />
                          </div>
                          <span className="text-white/60 text-xs shrink-0">{progressOf(goal).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/70 text-sm">{goal.fechaLimite ? formatDate(goal.fechaLimite) : '—'}</td>
                      <td className="py-3 px-4">{getEstadoBadge(goal)}</td>
                      <td className="py-3 px-4 text-right text-white font-semibold">{formatCurrency(goal.montoActual ?? 0)} <span className="text-white/40 font-normal">/ {formatCurrency(goal.montoObjetivo ?? 0)}</span></td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEditModal(goal)} className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400" title="Editar Meta">
                            <Edit size={14} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteGoal(goal.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400" title="Eliminar Meta">
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
        {filteredGoals.length > 0 && viewMode === 'grid' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {paginatedGoals.map((goal, index) => {
                const remaining = daysRemaining(goal.fechaLimite);
                const progress = progressOf(goal);
                const estado = estadoOf(goal);
                const isAtRisk = estado === 'activa' && remaining !== null && remaining < 30 && progress < 50;
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border transition-all duration-300 ${isAtRisk ? 'border-red-500/50' : estado === 'completada' ? 'border-blue-500/50' : 'border-white/10 hover:border-[#F05984]/50'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-[#F05984]/20 to-[#BC455F]/20">
                          <Target size={16} className="text-[#F05984]" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{goal.nombre}</h3>
                          <p className="text-white/40 text-xs flex items-center gap-1"><User size={12} /> {clienteNombre(goal.clienteId)}</p>
                        </div>
                      </div>
                      {getEstadoBadge(goal)}
                    </div>
                    {goal.descripcion && <p className="text-white/60 text-sm mb-3 line-clamp-2">{goal.descripcion}</p>}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Progreso:</span>
                        <span className={`font-bold ${progress === 100 ? 'text-green-400' : isAtRisk ? 'text-red-400' : 'text-white'}`}>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : isAtRisk ? 'bg-red-500' : 'bg-gradient-to-r from-[#F05984] to-[#BC455F]'}`} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Actual:</span>
                        <span className="text-white font-medium">{formatCurrency(goal.montoActual ?? 0)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Meta:</span>
                        <span className="text-white">{formatCurrency(goal.montoObjetivo ?? 0)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1 text-white/40">
                        <Calendar size={12} />
                        <span>{goal.fechaLimite ? formatDate(goal.fechaLimite) : 'Sin fecha límite'}</span>
                      </div>
                      {remaining !== null && (
                        remaining >= 0
                          ? <span className={isAtRisk ? 'text-red-400 font-medium' : 'text-white/40'}>{remaining === 0 ? 'Vence hoy' : `${remaining} días`}</span>
                          : <span className="text-red-400 font-medium">Vencida</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">{getPriorityBadge(goal.prioridad)}</div>
                    <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/10">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEditModal(goal)} className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400" title="Editar Meta">
                        <Edit size={14} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteGoal(goal.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400" title="Eliminar Meta">
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredGoals.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredGoals.length} itemsPerPage={itemsPerPage} label="metas" onPageChange={setCurrentPage} />
        )}
      </motion.div>

      {/* Modal crear */}
      <AnimatePresence>
        <ModalOverlay isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nueva Meta Financiera" subtitle="Define un nuevo objetivo financiero" icon={<Target size={20} className="text-white" />} maxWidth="max-w-2xl">
          <form onSubmit={(e) => { e.preventDefault(); handleCreateGoal(); }} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Cliente *</label>
                {isClientRole ? (
                  <div className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/70">
                    {clientes.find(c => Number(c.id) === Number(ownClienteId))?.nombreCompleto || localStorage.getItem('userName') || 'Tu cuenta'}
                  </div>
                ) : (
                  <select value={formData.clienteId} onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }} required>
                    <option value="" style={{ backgroundColor: '#1a0f14' }}>Seleccionar cliente</option>
                    {clientes.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14' }}>{c.nombreCompleto}</option>)}
                  </select>
                )}
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Nombre de la meta *</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Ej: Fondo de emergencia" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Monto objetivo *</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="number" step="0.01" min="0.01" value={formData.montoObjetivo} onChange={(e) => setFormData({ ...formData, montoObjetivo: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="0.00" required />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Monto actual</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="number" step="0.01" min="0" value={formData.montoActual} onChange={(e) => setFormData({ ...formData, montoActual: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="0.00" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Fecha límite</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="date" value={formData.fechaLimite} onChange={(e) => setFormData({ ...formData, fechaLimite: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Prioridad</label>
                <select value={formData.prioridad} onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as Prioridad })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Descripción</label>
              <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} rows={2} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Descripción opcional..." />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.activa} onChange={(e) => setFormData({ ...formData, activa: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
              <span className="text-white text-sm">Activa</span>
            </label>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg">
                Guardar Meta
              </motion.button>
            </div>
          </form>
        </ModalOverlay>
      </AnimatePresence>

      {/* Modal editar */}
      <AnimatePresence>
        <ModalOverlay isOpen={showEditModal && !!selectedGoal} onClose={() => setShowEditModal(false)} title="Editar Meta" subtitle="Modifica los datos de la meta" icon={<Edit size={20} className="text-white" />} maxWidth="max-w-2xl">
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateGoal(); }} className="space-y-5">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Cliente</label>
              <input type="text" disabled value={clienteNombre(selectedGoal?.clienteId)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Nombre</label>
              <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Monto objetivo</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="number" step="0.01" min="0.01" value={formData.montoObjetivo} onChange={(e) => setFormData({ ...formData, montoObjetivo: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Monto actual</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="number" step="0.01" min="0" value={formData.montoActual} onChange={(e) => setFormData({ ...formData, montoActual: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Fecha límite</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input type="date" value={formData.fechaLimite} onChange={(e) => setFormData({ ...formData, fechaLimite: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Prioridad</label>
                <select value={formData.prioridad} onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as Prioridad })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Descripción</label>
              <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} rows={2} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.activa} onChange={(e) => setFormData({ ...formData, activa: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                <span className="text-white text-sm">Activa</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.completada} onChange={(e) => setFormData({ ...formData, completada: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                <span className="text-white text-sm">Completada</span>
              </label>
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
    </motion.div>
  );
};
