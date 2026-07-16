import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  DollarSign,
  Activity,
  XCircle,
  Calendar,
  User,
  Tag,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';
import { formatCurrency, containerVariants, itemVariants } from '../../../../shared/utils';
import { getViewPreferences } from '../../../../shared/hooks/useViewPreferences';
import { PageSkeleton } from '../../../../shared/components/ui/PageSkeleton';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { SortBar } from '../../../../shared/components/ui/SortBar';
import { ModalOverlay } from '../../../../shared/components/ui/ModalOverlay';
import { ViewModeToggle } from '../../../../shared/components/ui/ViewModeToggle';
import { tooltipStyle } from '../../../../shared/components/ui/chartConfig';
import { presupuestosService, type ApiPresupuesto } from '../../services';
import { clientesService, type ApiCliente } from '../../../clients/services';
import { categoriasService, isCategoriaGasto, type ApiCategoria } from '../../../categories/services';
import { gastosService, type ApiGasto } from '../../../expenses/services';
import { getCurrentClientSession } from '../../../../shared/hooks/useCurrentClient';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const CHART_COLORS = ['#F05984', '#BC455F', '#6E4068', '#2DD4BF', '#F59E0B', '#10B981', '#6366F1', '#EF4444'];

const emptyForm = (clienteId = '') => ({
  clienteId,
  categoriaId: '',
  montoPresupuestado: '',
  mes: String(new Date().getMonth() + 1),
  anio: String(new Date().getFullYear()),
  activo: true,
});

export const BudgetsPage = () => {
  const { isClientRole, ownClienteId } = getCurrentClientSession();
  const [budgets, setBudgets] = useState<ApiPresupuesto[]>([]);
  const [clientes, setClientes] = useState<ApiCliente[]>([]);
  const [categoriasByClient, setCategoriasByClient] = useState<Record<number, ApiCategoria[]>>({});
  const [gastos, setGastos] = useState<ApiGasto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(() => getViewPreferences().defaultView === 'list' ? 'table' : 'grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'monto' | 'mes' | 'anio'>('anio');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<ApiPresupuesto | null>(null);
  const [formData, setFormData] = useState(emptyForm(isClientRole ? ownClienteId : ''));
  const [formCategorias, setFormCategorias] = useState<ApiCategoria[]>([]);

  const itemsPerPage = getViewPreferences().itemsPerPage;

  const clienteNombre = (id?: number) => clientes.find(c => Number(c.id) === id)?.nombreCompleto ?? `Cliente #${id}`;
  const clientesActivos = clientes.filter(c => c.activo !== false);
  const categoriaNombre = (clienteId?: number, categoriaId?: number) => {
    if (!categoriaId) return 'Sin categoría';
    const lista = categoriasByClient[clienteId ?? -1] ?? [];
    return lista.find(c => c.id === categoriaId)?.nombre ?? `Categoría #${categoriaId}`;
  };

  // GET /categorias/cliente/{id} viene "liviano" (sin icono/color/descripcion), hace falta el detalle por id
  const fetchCategoriasCompletas = async (clienteId: number): Promise<ApiCategoria[]> => {
    const list = await categoriasService.getByCliente(clienteId);
    return Promise.all(list.map(c => categoriasService.getById(c.id!).catch(() => c)));
  };

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await presupuestosService.getAll();
      const full = await Promise.all(list.map(item => presupuestosService.getById(item.id!)));
      // El endpoint /presupuestos no filtra por cliente en el backend: un usuario con rol cliente
      // solo debe ver sus propios presupuestos, así que se filtra en el cliente.
      const scoped = isClientRole ? full.filter(b => b.clienteId === Number(ownClienteId)) : full;
      setBudgets(scoped);

      const clienteIds = [...new Set(scoped.map(b => b.clienteId).filter((id): id is number => id != null))];
      const entries = await Promise.all(
        clienteIds.map(async id => [id, await fetchCategoriasCompletas(id).catch(() => [])] as const)
      );
      setCategoriasByClient(Object.fromEntries(entries));
    } catch (e) {
      toast.error(`Error al cargar presupuestos: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  }, [isClientRole, ownClienteId]);

  useEffect(() => { fetchBudgets(); }, [fetchBudgets]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedEstado]);
  useEffect(() => {
    clientesService.getAll().then(setClientes)
      .catch(() => toast.error('No se pudieron cargar los clientes.'));
  }, []);
  useEffect(() => {
    gastosService.getAll()
      .then(list => Promise.all(list.map(g => gastosService.getById(g.id!).catch(() => g))))
      .then(setGastos)
      .catch(() => toast.error('No se pudieron cargar los gastos para calcular el presupuesto usado.'));
  }, []);

  // Gastado real por presupuesto: gastos del mismo cliente/mes/año, filtrando por categoría si el presupuesto la tiene
  const getSpent = (budget: ApiPresupuesto) => gastos.reduce((sum, g) => {
    if (g.clienteId !== budget.clienteId) return sum;
    if (budget.categoriaId != null && g.categoriaId !== budget.categoriaId) return sum;
    if (!g.fecha) return sum;
    const [anio, mes] = g.fecha.split('-').map(Number);
    if (anio !== budget.anio || mes !== budget.mes) return sum;
    return sum + (g.monto ?? 0);
  }, 0);

  // Categorías de gasto del cliente seleccionado en el formulario (crear/editar)
  useEffect(() => {
    if (!formData.clienteId) { setFormCategorias([]); return; }
    const clienteId = Number(formData.clienteId);
    if (categoriasByClient[clienteId]) { setFormCategorias(categoriasByClient[clienteId].filter(isCategoriaGasto)); return; }
    fetchCategoriasCompletas(clienteId).then(cats => {
      setFormCategorias(cats.filter(isCategoriaGasto));
      setCategoriasByClient(prev => ({ ...prev, [clienteId]: cats }));
    }).catch(() => setFormCategorias([]));
  }, [formData.clienteId, categoriasByClient]);

  const handleCreateBudget = async () => {
    try {
      await presupuestosService.create({
        clienteId: Number(formData.clienteId),
        categoriaId: formData.categoriaId ? Number(formData.categoriaId) : undefined,
        montoPresupuestado: parseFloat(formData.montoPresupuestado),
        mes: Number(formData.mes),
        anio: Number(formData.anio),
        activo: formData.activo,
      });
      toast.success('Presupuesto creado');
      setShowCreateModal(false);
      setFormData(emptyForm(isClientRole ? ownClienteId : ''));
      fetchBudgets();
    } catch (e) {
      toast.error(`Error al crear: ${e instanceof Error ? e.message : 'Ya existe un presupuesto para ese cliente/categoría/mes/año'}`);
    }
  };

  const openEditModal = (budget: ApiPresupuesto) => {
    setSelectedBudget(budget);
    setFormData({
      clienteId: String(budget.clienteId ?? ''),
      categoriaId: budget.categoriaId ? String(budget.categoriaId) : '',
      montoPresupuestado: String(budget.montoPresupuestado ?? ''),
      mes: String(budget.mes ?? ''),
      anio: String(budget.anio ?? ''),
      activo: budget.activo ?? true,
    });
    setShowEditModal(true);
  };

  const handleUpdateBudget = async () => {
    if (!selectedBudget?.id) return;
    try {
      await presupuestosService.update(selectedBudget.id, {
        categoriaId: formData.categoriaId ? Number(formData.categoriaId) : undefined,
        montoPresupuestado: parseFloat(formData.montoPresupuestado),
        mes: Number(formData.mes),
        anio: Number(formData.anio),
        activo: formData.activo,
      });
      toast.success('Presupuesto actualizado');
      setShowEditModal(false);
      setSelectedBudget(null);
      fetchBudgets();
    } catch (e) {
      toast.error(`Error al actualizar: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
  };

  const handleDeleteBudget = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar este presupuesto?')) return;
    try {
      await presupuestosService.remove(id);
      toast.success('Presupuesto eliminado');
      setBudgets(prev => prev.filter(b => b.id !== id));
    } catch (e) {
      toast.error(`Error al eliminar: ${e instanceof Error ? e.message : 'Error desconocido'}`);
    }
  };

  const filteredBudgets = budgets.filter(b => {
    const nombre = `${clienteNombre(b.clienteId)} ${categoriaNombre(b.clienteId, b.categoriaId)}`.toLowerCase();
    const matchesSearch = nombre.includes(searchTerm.toLowerCase());
    const matchesEstado = selectedEstado === 'todos' || (selectedEstado === 'activo' ? b.activo : !b.activo);
    return matchesSearch && matchesEstado;
  });

  const sortedBudgets = [...filteredBudgets].sort((a, b) => {
    const dir = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'monto') return dir * ((a.montoPresupuestado ?? 0) - (b.montoPresupuestado ?? 0));
    if (sortBy === 'mes') return dir * ((a.mes ?? 0) - (b.mes ?? 0));
    return dir * ((a.anio ?? 0) - (b.anio ?? 0));
  });

  const totalPages = Math.ceil(sortedBudgets.length / itemsPerPage);
  const paginatedBudgets = sortedBudgets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalBudget = budgets.reduce((sum, b) => sum + (b.montoPresupuestado ?? 0), 0);
  const activeCount = budgets.filter(b => b.activo).length;
  const inactiveCount = budgets.filter(b => !b.activo).length;

  // Distribución por categoría (agrupando los presupuestos por categoriaId)
  const categoryTotals = new Map<string, { nombre: string; total: number; count: number }>();
  budgets.forEach(b => {
    const key = b.categoriaId != null ? String(b.categoriaId) : 'sin-categoria';
    const nombre = categoriaNombre(b.clienteId, b.categoriaId);
    const entry = categoryTotals.get(key) ?? { nombre, total: 0, count: 0 };
    entry.total += b.montoPresupuestado ?? 0;
    entry.count += 1;
    categoryTotals.set(key, entry);
  });
  const categoryEntries = [...categoryTotals.values()].sort((a, b) => b.total - a.total);
  const pieChartData = categoryEntries.map((c, idx) => ({ name: c.nombre, value: c.total, color: CHART_COLORS[idx % CHART_COLORS.length] }));
  const topThreeCategories = categoryEntries.slice(0, 3).map((c, idx) => ({
    ...c,
    percentage: totalBudget > 0 ? (c.total / totalBudget) * 100 : 0,
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));

  const clearAllFilters = () => { setSearchTerm(''); setSelectedEstado('todos'); setCurrentPage(1); };
  const hasActiveFilters = searchTerm !== '' || selectedEstado !== 'todos';

  if (isLoading) return <PageSkeleton />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 min-h-screen p-6"
      style={{ backgroundColor: '#1a0f14' }}
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-[#321D28] via-[#4a2d40] to-[#321D28] rounded-2xl p-6 border border-white/10 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05984]/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#F05984] to-[#BC455F] rounded-xl shadow-lg">
              <Wallet size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Presupuestos</h1>
              <p className="text-white/50 text-sm mt-1">Límite de gasto por cliente y categoría</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setFormData(emptyForm(isClientRole ? ownClienteId : '')); setShowCreateModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300"
            >
              <Plus size={20} />
              <span className="hidden sm:inline font-medium">Nuevo Presupuesto</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Presupuesto Total</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10"><Wallet size={24} className="text-[#F05984]" /></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Activos</p>
              <p className="text-2xl font-bold text-green-400 mt-1 tracking-tight">{activeCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20"><Activity size={24} className="text-green-400" /></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#1e1b2e] to-[#2d2a3d] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Inactivos</p>
              <p className="text-2xl font-bold text-white/60 mt-1 tracking-tight">{inactiveCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10"><XCircle size={24} className="text-white/50" /></div>
          </div>
        </div>
      </motion.div>

      {/* Distribución por Categoría - Gráfico de Dona y Top 3 */}
      {categoryEntries.length > 0 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <PieChart size={20} className="text-[#F05984]" />
              <h3 className="text-white font-semibold">Distribución por Categoría</h3>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [formatCurrency(value), 'Presupuesto']}
                    labelStyle={{ color: 'white' }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-white/70 text-xs">{value}</span>}
                    wrapperStyle={{ paddingTop: '20px' }}
                    verticalAlign="bottom"
                    height={36}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#F05984]" />
              Top 3 Categorías
            </h3>
            <div className="space-y-4">
              {topThreeCategories.map((cat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${cat.color}33` }}>
                        <Tag size={14} style={{ color: cat.color }} />
                      </div>
                      <span className="text-white text-sm font-medium">{cat.nombre}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">
                        {cat.count} {cat.count === 1 ? 'presupuesto' : 'presupuestos'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/50 text-xs">{cat.percentage.toFixed(1)}%</span>
                      <span className="text-white text-sm font-semibold">{formatCurrency(cat.total)}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
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
                placeholder="Buscar por cliente o categoría..."
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
                className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}
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

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
              >
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Estado</label>
                  <select
                    value={selectedEstado}
                    onChange={(e) => setSelectedEstado(e.target.value as typeof selectedEstado)}
                    className="w-full md:w-64 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                  >
                    <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos</option>
                    <option value="activo" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Activos</option>
                    <option value="inactivo" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Inactivos</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <SortBar
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(field) => { setSortBy(field as typeof sortBy); setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc'); }}
          fields={[
            { key: 'anio', label: 'Año', icon: <Calendar size={14} /> },
            { key: 'mes', label: 'Mes', icon: <Calendar size={14} /> },
            { key: 'monto', label: 'Monto', icon: <DollarSign size={14} /> },
          ]}
          totalResults={filteredBudgets.length}
        />

        {filteredBudgets.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-4 bg-white/10 rounded-full mb-4"><Wallet size={48} className="text-white/30" /></div>
            <h3 className="text-white font-semibold text-lg mb-2">No hay presupuestos</h3>
            <p className="text-white/40 text-sm text-center max-w-md">Ajusta los filtros o crea un nuevo presupuesto.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setFormData(emptyForm(isClientRole ? ownClienteId : '')); setShowCreateModal(true); }}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} /><span>Crear nuevo presupuesto</span>
            </motion.button>
          </motion.div>
        )}

        {filteredBudgets.length > 0 && viewMode === 'table' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Categoría</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Periodo</th>
                  <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Estado</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Monto</th>
                  <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedBudgets.map((budget, index) => (
                    <motion.tr
                      key={budget.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-[#F05984]" />
                          <span className="text-white font-medium">{categoriaNombre(budget.clienteId, budget.categoriaId)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/70 text-sm">{clienteNombre(budget.clienteId)}</td>
                      <td className="py-3 px-4 text-white/70 text-sm">{MESES[(budget.mes ?? 1) - 1]} {budget.anio}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${budget.activo ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}>
                          {budget.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-white font-semibold">{formatCurrency(budget.montoPresupuestado ?? 0)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEditModal(budget)} className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400" title="Editar Presupuesto">
                            <Edit size={14} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteBudget(budget.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400" title="Eliminar Presupuesto">
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

        {filteredBudgets.length > 0 && viewMode === 'grid' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {paginatedBudgets.map((budget) => {
                const budgeted = budget.montoPresupuestado ?? 0;
                const spent = getSpent(budget);
                const remaining = budgeted - spent;
                const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
                const isExceeded = remaining < 0;
                return (
                  <motion.div
                    key={budget.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border transition-all duration-300 ${isExceeded ? 'border-red-500/50' : 'border-white/10 hover:border-[#F05984]/50'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-[#F05984]/20 to-[#BC455F]/20">
                          <Tag size={16} className="text-[#F05984]" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{categoriaNombre(budget.clienteId, budget.categoriaId)}</h3>
                          <p className="text-white/40 text-xs flex items-center gap-1"><User size={12} /> {clienteNombre(budget.clienteId)}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${budget.activo ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}>
                        {budget.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Presupuesto:</span>
                        <span className="text-white font-bold text-lg">{formatCurrency(budgeted)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Gastado:</span>
                        <span className={isExceeded ? 'text-red-400 font-medium' : 'text-white'}>{formatCurrency(spent)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Restante:</span>
                        <span className={isExceeded ? 'text-red-400 font-medium' : 'text-green-400 font-medium'}>{formatCurrency(remaining)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Periodo:</span>
                        <span className="text-white">{MESES[(budget.mes ?? 1) - 1]} {budget.anio}</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${isExceeded ? 'bg-red-500' : 'bg-gradient-to-r from-[#F05984] to-[#BC455F]'}`}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/10">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEditModal(budget)} className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400" title="Editar Presupuesto">
                        <Edit size={14} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteBudget(budget.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400" title="Eliminar Presupuesto">
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredBudgets.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredBudgets.length} itemsPerPage={itemsPerPage} label="presupuestos" onPageChange={setCurrentPage} />
        )}
      </motion.div>

      {/* Modal crear */}
      <AnimatePresence>
        <ModalOverlay
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nuevo Presupuesto"
          subtitle="Define un límite de gasto para un cliente"
          icon={<Wallet size={20} className="text-white" />}
          maxWidth="max-w-lg"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleCreateBudget(); }} className="space-y-5">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Cliente *</label>
              {isClientRole ? (
                <div className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/70">
                  {clientes.find(c => Number(c.id) === Number(ownClienteId))?.nombreCompleto || localStorage.getItem('userName') || 'Tu cuenta'}
                </div>
              ) : (
                <select
                  value={formData.clienteId}
                  onChange={(e) => setFormData({ ...formData, clienteId: e.target.value, categoriaId: '' })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                  required
                >
                  <option value="" style={{ backgroundColor: '#1a0f14' }}>Seleccionar cliente</option>
                  {clientesActivos.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14' }}>{c.nombreCompleto}</option>)}
                </select>
              )}
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Categoría</label>
              <select
                value={formData.categoriaId}
                onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                disabled={!formData.clienteId}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all disabled:opacity-50"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
              >
                <option value="" style={{ backgroundColor: '#1a0f14' }}>Sin categoría</option>
                {formCategorias.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14' }}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Mes *</label>
                <select
                  value={formData.mes}
                  onChange={(e) => setFormData({ ...formData, mes: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                  required
                >
                  {MESES.map((m, i) => <option key={m} value={i + 1} style={{ backgroundColor: '#1a0f14' }}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Año *</label>
                <input type="number" value={formData.anio} onChange={(e) => setFormData({ ...formData, anio: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Monto presupuestado *</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input type="number" step="0.01" min="0" value={formData.montoPresupuestado} onChange={(e) => setFormData({ ...formData, montoPresupuestado: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="0.00" required />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
              <span className="text-white text-sm">Activo</span>
            </label>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg">
                Guardar Presupuesto
              </motion.button>
            </div>
          </form>
        </ModalOverlay>
      </AnimatePresence>

      {/* Modal editar */}
      <AnimatePresence>
        <ModalOverlay
          isOpen={showEditModal && !!selectedBudget}
          onClose={() => setShowEditModal(false)}
          title="Editar Presupuesto"
          subtitle="Modifica los datos del presupuesto"
          icon={<Edit size={20} className="text-white" />}
          maxWidth="max-w-lg"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateBudget(); }} className="space-y-5">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Cliente</label>
              <input type="text" disabled value={clienteNombre(selectedBudget?.clienteId)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Categoría</label>
              <select
                value={formData.categoriaId}
                onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
              >
                <option value="" style={{ backgroundColor: '#1a0f14' }}>Sin categoría</option>
                {formCategorias.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#1a0f14' }}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Mes *</label>
                <select
                  value={formData.mes}
                  onChange={(e) => setFormData({ ...formData, mes: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                  required
                >
                  {MESES.map((m, i) => <option key={m} value={i + 1} style={{ backgroundColor: '#1a0f14' }}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Año *</label>
                <input type="number" value={formData.anio} onChange={(e) => setFormData({ ...formData, anio: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Monto presupuestado *</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input type="number" step="0.01" min="0" value={formData.montoPresupuestado} onChange={(e) => setFormData({ ...formData, montoPresupuestado: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
              <span className="text-white text-sm">Activo</span>
            </label>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg">
                Guardar Cambios
              </motion.button>
            </div>
          </form>
        </ModalOverlay>
      </AnimatePresence>
    </motion.div>
  );
};
