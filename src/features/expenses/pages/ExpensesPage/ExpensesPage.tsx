import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { gastosService, type ApiGasto } from '../../services';
import { clientesService as clientesSvc } from '../../../clients/services';
import { categoriasService, isCategoriaGasto, type ApiCategoria } from '../../../categories/services';
import { gastosRecurrentesService, type ApiGastoRecurrente } from '../../../recurring-expenses/services';
import { presupuestosService, type ApiPresupuestoList } from '../../../budgets/services';
import { getCurrentClientSession } from '../../../../shared/hooks/useCurrentClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingDown,
  Calendar,
  Plus,
  DollarSign,
  CreditCard,
  Wallet,
  Tag,
  Home as HomeIcon,
  Utensils,
  Zap,
  Car,
  Heart,
  ShoppingBag,
  Shield,
  Trash2,
  Edit,
  Save,
  Target,
  AlertTriangle,
  TrendingUp,
  PieChart,
  Film,
  FileText
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency, formatDate, containerVariants, itemVariants, getStatusColor, getStatusIcon, getPaymentMethodLabel, filterByPeriod, isSameMonth, notifyConnectionError, notifyActionError } from '../../../../shared/utils';
import { getViewPreferences } from '../../../../shared/hooks/useViewPreferences';
import { PageSkeleton } from '../../../../shared/components/ui/PageSkeleton';
import { ViewModeToggle } from '../../../../shared/components/ui/ViewModeToggle';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { SearchFilterBar } from '../../../../shared/components/ui/SearchFilterBar';
import { SortBar } from '../../../../shared/components/ui/SortBar';
import { ModalOverlay } from '../../../../shared/components/ui/ModalOverlay';
import { Toggle } from '../../../../shared/components/ui/Toggle';
import { Select } from '../../../../shared/components/ui/Select';
import { DatePicker } from '../../../../shared/components/ui/DatePicker';
import { useConfirm } from '../../../../shared/hooks/useConfirm';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';
import { tooltipStyle } from '../../../../shared/components/ui/chartConfig';

interface Expense {
  id: string;
  clienteId: number;
  description: string;
  amount: number;
  category: string;
  categoryId: string;
  date: string;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia' | 'cheque' | 'otro';
  status: 'completado' | 'cancelado';
  recurring: boolean;
  recurringFrequency?: 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'anual';
}

// Mapeo método de pago frontend ↔ API
const PM_TO_API: Record<string, string> = {
  efectivo: 'EFECTIVO', tarjeta: 'TARJETA_DEBITO',
  transferencia: 'TRANSFERENCIA', cheque: 'CHEQUE', otro: 'OTRO',
};
const PM_FROM_API: Record<string, Expense['paymentMethod']> = {
  EFECTIVO: 'efectivo', TARJETA_DEBITO: 'tarjeta', TARJETA_CREDITO: 'tarjeta',
  TRANSFERENCIA: 'transferencia', CHEQUE: 'cheque', OTRO: 'otro',
};

const toExpense = (api: ApiGasto, categoryName?: string): Expense => ({
  id: String(api.id),
  clienteId: api.clienteId ?? 0,
  description: api.descripcion ?? '',
  amount: api.monto ?? 0,
  category: categoryName ?? String(api.categoriaId ?? ''),
  categoryId: String(api.categoriaId ?? ''),
  date: api.fecha ?? '',
  paymentMethod: PM_FROM_API[api.metodoPago ?? ''] ?? 'otro',
  status: api.activo ? 'completado' : 'cancelado',
  recurring: api.esRecurrente ?? false,
  recurringFrequency: api.frecuencia?.toLowerCase() as Expense['recurringFrequency'],
});

// Colores para el gráfico de pastel
const CHART_COLORS = ['#F59E0B', '#3B82F6', '#06B6D4', '#10B981', '#8B5CF6', '#EF4444', '#EC4899', '#6366F1'];

export const ExpensesPage = () => {
  const { isClientRole, ownClienteId } = getCurrentClientSession();
  const { confirm, ConfirmDialogElement } = useConfirm();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('todos');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('todos');
  const [trendView, setTrendView] = useState<'mensual' | 'semanal'>('mensual');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(() => getViewPreferences().defaultView === 'list' ? 'table' : 'grid');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editStatus, setEditStatus] = useState<'completado' | 'cancelado'>('completado');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [formData, setFormData] = useState({
    clienteId: isClientRole ? ownClienteId : '',
    categoriaId: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'transferencia',
    recurringId: '',
  });

  const itemsPerPage = getViewPreferences().itemsPerPage;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [clientesList, setClientesList] = useState<{ id: number; nombre: string }[]>([]);
  const [categoriasList, setCategoriasList] = useState<ApiCategoria[]>([]);
  const [recurringList, setRecurringList] = useState<ApiGastoRecurrente[]>([]);
  const [budgets, setBudgets] = useState<ApiPresupuestoList[]>([]);

  useEffect(() => {
    presupuestosService.getAll().then(setBudgets).catch(() => {});
  }, []);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await gastosService.getAll();
      // El endpoint /gastos no filtra por cliente en el backend: un usuario con rol cliente
      // solo debe ver sus propios gastos, así que se filtra en el cliente.
      const scoped = isClientRole ? list.filter(g => g.clienteId === Number(ownClienteId)) : list;
      const categoriaIds = [...new Set(scoped.map(g => g.categoriaId).filter((id): id is number => id != null))];
      const categoriaEntries = await Promise.all(
        categoriaIds.map(id => categoriasService.getById(id).then(c => [id, c.nombre] as const).catch(() => [id, undefined] as const))
      );
      const categoriaNombres = new Map(categoriaEntries);
      setExpenses(scoped.map(g => toExpense(g, categoriaNombres.get(g.categoriaId ?? -1))));
    } catch (e) {
      console.error('Error cargando gastos:', e);
      notifyConnectionError();
    } finally {
      setIsLoading(false);
    }
  }, [isClientRole, ownClienteId]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory, selectedStatus, selectedPaymentMethod, selectedPeriod]);

  useEffect(() => {
    if (!showCreateModal && !showEditModal) return;
    clientesSvc.getAll().then(clientes => {
      setClientesList(clientes.filter(c => c.id != null && c.activo !== false).map(c => ({ id: Number(c.id), nombre: c.nombreCompleto })));
    }).catch(() => {});
  }, [showCreateModal, showEditModal]);

  const clienteNombre = (id: number) => clientesList.find(c => c.id === id)?.nombre ?? `Cliente #${id}`;

  useEffect(() => {
    if (!formData.clienteId) { setCategoriasList([]); return; }
    categoriasService.getByCliente(Number(formData.clienteId)).then(list => {
      setCategoriasList(list.filter(isCategoriaGasto));
    }).catch(() => {});
  }, [formData.clienteId]);

  useEffect(() => {
    if (!showCreateModal || !formData.clienteId) { setRecurringList([]); return; }
    gastosRecurrentesService.getByCliente(Number(formData.clienteId)).then(list => {
      setRecurringList(list.filter(r => r.activo !== false));
    }).catch(() => setRecurringList([]));
  }, [showCreateModal, formData.clienteId]);

  const handleSelectRecurring = (id: string) => {
    const r = recurringList.find(x => String(x.id) === id);
    setFormData(prev => ({
      ...prev,
      recurringId: id,
      categoriaId: r?.categoriaId != null ? String(r.categoriaId) : prev.categoriaId,
      description: r?.descripcion || prev.description,
      amount: r?.monto != null ? String(r.monto) : prev.amount,
    }));
  };

  const monthlyTrends = Object.entries(
    expenses.reduce((acc, e) => { const m = e.date.slice(0, 7); acc[m] = (acc[m] ?? 0) + e.amount; return acc; }, {} as Record<string, number>)
  ).sort().slice(-6).map(([m, amount]) => ({ month: m.slice(5), amount }));

  const weeklyTrends = (() => {
    const weeks: Record<string, number> = {};
    expenses.forEach(e => {
      // "YYYY-MM-DD"+T00:00:00 fuerza hora local: `new Date(e.date)` a secas se interpreta como UTC
      // y se corre un día atrás en zonas horarias detrás de UTC (ver ponytail en formatDate/isSameMonth).
      const d = new Date(`${e.date}T00:00:00`); const ws = new Date(d); ws.setDate(d.getDate() - d.getDay());
      const key = ws.toISOString().slice(0, 10);
      weeks[key] = (weeks[key] ?? 0) + e.amount;
    });
    return Object.entries(weeks).sort().slice(-4).map(([, amount], i) => ({ week: `Sem ${i + 1}`, amount }));
  })();

  // Obtener la fecha actual
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Calcular estadísticas en tiempo real. Se compara por string ("YYYY-MM-DD"), no con `new Date(...)`:
  // ese parseo cae en UTC y corre un gasto del día 1 al mes anterior en zonas horarias detrás de UTC
  // (misma familia de bug que formatDate/isSameMonth) — desalineaba "Este mes" aquí con Inicio/Análisis.
  const yearlyExpenses = expenses.filter(exp => exp.status === 'completado' && exp.date.slice(0, 4) === String(currentYear));
  const totalYearlyExpense = yearlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyExpenses = expenses.filter(exp => exp.status === 'completado' && isSameMonth(exp.date, currentYear, currentMonth + 1));
  const totalMonthlyExpense = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Presupuesto vs gasto real del mes en curso, por categoría (solo categorías con presupuesto asignado)
  const categoryBudgets = Object.entries(
    monthlyExpenses.reduce((acc, e) => {
      if (!acc[e.categoryId]) acc[e.categoryId] = { name: e.category, actual: 0 };
      acc[e.categoryId].actual += e.amount;
      return acc;
    }, {} as Record<string, { name: string; actual: number }>)
  )
    .map(([categoriaId, { name, actual }], idx) => {
      const budget = budgets
        .filter(b => String(b.categoriaId) === categoriaId && b.mes === currentMonth + 1 && b.anio === currentYear
          && b.activo !== false && (!isClientRole || b.clienteId === Number(ownClienteId)))
        .reduce((sum, b) => sum + (b.montoPresupuestado ?? 0), 0);
      return { name, budget, actual, percentage: budget > 0 ? (actual / budget) * 100 : 0, color: CHART_COLORS[idx % CHART_COLORS.length] };
    })
    .filter(cat => cat.budget > 0);

  // Calcular mes anterior
  const prevMonth1 = currentMonth === 0 ? 12 : currentMonth; // 1-indexado: currentMonth ya es (mes actual - 1)
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const previousMonthExpenses = expenses.filter(exp => exp.status === 'completado' && isSameMonth(exp.date, prevYear, prevMonth1));
  const totalPreviousMonth = previousMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyChange = totalPreviousMonth > 0 
    ? ((totalMonthlyExpense - totalPreviousMonth) / totalPreviousMonth) * 100 
    : 0;

  const completedExpenses = expenses.filter(exp => exp.status === 'completado');
  const totalCompletedAmount = completedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageTicket = completedExpenses.length > 0 ? totalCompletedAmount / completedExpenses.length : 0;

  // Calcular categorías en tiempo real
  const categoryMap = new Map<string, { amount: number; count: number }>();

  completedExpenses.forEach(exp => {
    const existing = categoryMap.get(exp.category);
    if (existing) {
      existing.amount += exp.amount;
      existing.count += 1;
    } else {
      categoryMap.set(exp.category, { amount: exp.amount, count: 1 });
    }
  });

  const pieChartData = Array.from(categoryMap.entries()).map(([name, data], idx) => ({
    name,
    value: data.amount,
    color: CHART_COLORS[idx % CHART_COLORS.length],
    count: data.count,
  }));

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Alimentación': 'from-amber-500 to-amber-600',
      'Vivienda': 'from-blue-500 to-blue-600',
      'Servicios': 'from-cyan-500 to-cyan-600',
      'Transporte': 'from-emerald-500 to-emerald-600',
      'Ocio': 'from-violet-500 to-violet-600',
      'Salud': 'from-rose-500 to-rose-600',
      'Compras': 'from-pink-500 to-pink-600',
      'Seguros': 'from-indigo-500 to-indigo-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Alimentación': <Utensils size={16} />,
      'Vivienda': <HomeIcon size={16} />,
      'Servicios': <Zap size={16} />,
      'Transporte': <Car size={16} />,
      'Ocio': <Film size={16} />,
      'Salud': <Heart size={16} />,
      'Compras': <ShoppingBag size={16} />,
      'Seguros': <Shield size={16} />
    };
    return icons[category] || <Tag size={16} />;
  };

  const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    amount: data.amount,
    percentage: totalCompletedAmount > 0 ? (data.amount / totalCompletedAmount) * 100 : 0,
    color: getCategoryColor(name),
    icon: getCategoryIcon(name),
    count: data.count,
  })).sort((a, b) => b.amount - a.amount);

  // Top 5 categorías
  const top5Categories = categories.slice(0, 5);

  // Función para filtrar por período

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('todas');
    setSelectedStatus('todos');
    setSelectedPaymentMethod('todos');
    setSelectedPeriod('todos');
    setCurrentPage(1);
  };

  const handleCreateExpense = async () => {
    try {
      await gastosService.create({
        clienteId: Number(formData.clienteId),
        categoriaId: Number(formData.categoriaId),
        monto: parseFloat(formData.amount),
        fecha: formData.date,
        descripcion: formData.description || undefined,
        metodoPago: PM_TO_API[formData.paymentMethod] ?? 'EFECTIVO',
        esRecurrente: false,
        frecuencia: null,
        activo: true,
      });
      await fetchExpenses();
      setShowCreateModal(false);
      setFormData({
        clienteId: isClientRole ? ownClienteId : '', categoriaId: '', description: '', amount: '',
        date: new Date().toISOString().split('T')[0], paymentMethod: 'transferencia', recurringId: '',
      });
      toast.success('Gasto creado');
    } catch (e) {
      notifyActionError('crear', e);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!(await confirm('¿Estás seguro de que deseas eliminar este gasto?'))) return;
    try {
      await gastosService.remove(Number(id));
      await fetchExpenses();
      toast.success('Gasto eliminado');
    } catch (e) {
      notifyActionError('eliminar', e);
    }
  };

  const openEditModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setFormData({
      clienteId: String(expense.clienteId),
      categoriaId: expense.categoryId,
      description: expense.description,
      amount: String(expense.amount),
      date: expense.date,
      recurringId: '',
      paymentMethod: expense.paymentMethod,
    });
    setEditStatus(expense.status);
    setShowEditModal(true);
  };

  const handleUpdateExpense = async () => {
    if (!selectedExpense) return;
    try {
      // PUT /gastos/{id} pisa la fila completa (no es un patch real): hay que reenviar todos los campos
      await gastosService.update(Number(selectedExpense.id), {
        categoriaId: Number(formData.categoriaId),
        monto: parseFloat(formData.amount),
        fecha: formData.date,
        descripcion: formData.description || undefined,
        metodoPago: PM_TO_API[formData.paymentMethod] ?? 'EFECTIVO',
        esRecurrente: selectedExpense.recurring,
        frecuencia: selectedExpense.recurringFrequency ?? null,
        activo: editStatus === 'completado',
      });
      await fetchExpenses();
      setShowEditModal(false);
      setSelectedExpense(null);
      toast.success('Gasto actualizado');
    } catch (e) {
      notifyActionError('actualizar', e);
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todas' || expense.category === selectedCategory;
    const matchesStatus = selectedStatus === 'todos' || expense.status === selectedStatus;
    const matchesPaymentMethod = selectedPaymentMethod === 'todos' || expense.paymentMethod === selectedPaymentMethod;
    const matchesPeriod = filterByPeriod(expense.date, selectedPeriod);

    return matchesSearch && matchesCategory && matchesStatus && matchesPaymentMethod && matchesPeriod;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' 
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'amount') {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    } else {
      return sortOrder === 'desc'
        ? b.category.localeCompare(a.category)
        : a.category.localeCompare(b.category);
    }
  });

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);
  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPaymentMethodIcon = (method: string) => {
    switch(method) {
      case 'efectivo':
        return <DollarSign size={14} />;
      case 'tarjeta':
        return <CreditCard size={14} />;
      case 'transferencia':
        return <Wallet size={14} />;
      case 'cheque':
        return <FileText size={14} />;
      default:
        return <CreditCard size={14} />;
    }
  };

  // Verificar si un gasto es "alto" (más de $300)
  const isHighExpense = (amount: number) => amount >= 300;

  // Verificar gastos recurrentes próximos
  const getRecurringAlert = (expense: Expense) => {
    if (!expense.recurring) return null;
    const expDate = new Date(expense.date);
    const today = new Date();
    if (expDate.getDate() === today.getDate() || expDate.getDate() === today.getDate() + 1) {
      return { type: 'upcoming', message: 'Próximo pago recurrente' };
    }
    return null;
  };

  const hasActiveFilters = searchTerm !== '' ||
    selectedCategory !== 'todas' ||
    selectedStatus !== 'todos' ||
    selectedPaymentMethod !== 'todos' ||
    selectedPeriod !== 'todos';

  if (isLoading) return <PageSkeleton />;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 min-h-screen p-6"
      style={{ backgroundColor: '#08080B' }}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-[#101015] border border-white/[0.07] rounded-[20px] p-6">
        <div className="absolute -top-16 -right-10 w-56 h-56 bg-[#F26D5B]/10 rounded-full blur-[60px]" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#8A5CF6] to-[#F26D5B] rounded-xl shadow-lg">
              <TrendingDown size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">Gastos</h1>
                <span className="bg-[#8A5CF6]/20 text-[#8A5CF6] text-xs px-2 py-1 rounded-full">
                  {expenses.length} registros
                </span>
              </div>
              <p className="text-white/50 text-sm mt-1">Controla y gestiona todos tus gastos</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFormData({
                  clienteId: isClientRole ? ownClienteId : '',
                  categoriaId: '', description: '', amount: '',
                  date: new Date().toISOString().split('T')[0], paymentMethod: 'transferencia', recurringId: '',
                });
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8A5CF6] to-[#F26D5B] text-white rounded-xl hover:shadow-lg hover:shadow-[#8A5CF6]/25 transition-all duration-300"
            >
              <Plus size={20} />
              <span className="hidden sm:inline font-medium">Nuevo Gasto</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-[#101015] rounded-[20px] p-5 border border-white/[0.07] shadow-lg"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="min-w-0">
              <p className="text-white/60 text-sm">Gastos del Año</p>
              <p className="text-2xl font-bold text-white mt-1 break-words">{formatCurrency(totalYearlyExpense)}</p>
              <p className="text-white/40 text-xs mt-1">{currentYear}</p>
            </div>
            <div className="shrink-0 p-3 rounded-xl bg-white/10">
              <Calendar size={20} className="text-[#8A5CF6]" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-[#101015] rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="min-w-0">
              <p className="text-white/60 text-sm">Este mes</p>
              <p className="text-2xl font-bold text-white mt-1 break-words">{formatCurrency(totalMonthlyExpense)}</p>
              <div className={`flex items-center gap-1 mt-1 ${monthlyChange >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                {monthlyChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span className="text-xs">{Math.abs(monthlyChange).toFixed(1)}% vs mes anterior</span>
              </div>
            </div>
            <div className="shrink-0 p-3 rounded-xl bg-red-500/20">
              <TrendingDown size={20} className="text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-[#101015] rounded-xl p-5 border border-white/10 shadow-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="min-w-0">
              <p className="text-white/60 text-sm">Ticket Promedio</p>
              <p className="text-2xl font-bold text-white mt-1 break-words">{formatCurrency(averageTicket)}</p>
              <p className="text-white/40 text-xs mt-1">{completedExpenses.length} transacciones</p>
            </div>
            <div className="shrink-0 p-3 rounded-xl bg-blue-500/20">
              <Target size={20} className="text-blue-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Dashboard de Presupuesto y Tendencia */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Presupuesto vs Gasto Real */}
        <div className="bg-[#101015] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Target size={18} className="text-[#8A5CF6]" />
              Presupuesto vs Gasto Real
            </h3>
            <span className="text-white/40 text-xs">Este mes</span>
          </div>
          <div className="space-y-4">
            {categoryBudgets.length === 0 && (
              <p className="text-white/40 text-sm">No hay presupuestos asignados para este mes.</p>
            )}
            {categoryBudgets.map((cat, idx) => {
              const isOverBudget = cat.percentage > 100;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-white/70">{cat.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-xs">Presupuesto: {formatCurrency(cat.budget)}</span>
                      <span className={`font-medium ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                        {formatCurrency(cat.actual)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-gradient-to-r from-[#8A5CF6] to-[#F26D5B]'}`}
                    />
                  </div>
                  {isOverBudget && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle size={10} className="text-red-400" />
                      <span className="text-red-400 text-[10px]">Excede presupuesto en {formatCurrency(cat.actual - cat.budget)}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tendencia de Gastos */}
        <div className="bg-[#101015] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#8A5CF6]" />
              <h3 className="text-white font-semibold">Tendencia de Gastos</h3>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTrendView('semanal')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  trendView === 'semanal' 
                    ? 'bg-[#8A5CF6] text-white' 
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                Por semana
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTrendView('mensual')}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  trendView === 'mensual' 
                    ? 'bg-[#8A5CF6] text-white' 
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                Por mes
              </motion.button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            {trendView === 'mensual' ? (
              <LineChart 
                data={monthlyTrends}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="month"
                  stroke="#ffffff60" 
                  tick={{ fill: '#ffffff60', fontSize: 11 }}
                  axisLine={{ stroke: '#ffffff20' }}
                  tickLine={{ stroke: '#ffffff20' }}
                />
                <YAxis 
                  stroke="#ffffff60" 
                  tick={{ fill: '#ffffff60', fontSize: 11 }}
                  axisLine={{ stroke: '#ffffff20' }}
                  tickLine={{ stroke: '#ffffff20' }}
                  domain={[0, 'auto']}
                  tickFormatter={(value) => {
                    if (value >= 1000) {
                      return `$${(value / 1000).toFixed(0)}k`;
                    }
                    return `$${value}`;
                  }}
                  width={50}
                  allowDecimals={false}
                />
                <ReTooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [formatCurrency(value), 'Gastos']}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8A5CF6" 
                  strokeWidth={2} 
                  dot={{ fill: '#8A5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#F26D5B' }}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            ) : (
              <LineChart 
                data={weeklyTrends}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="week"
                  stroke="#ffffff60" 
                  tick={{ fill: '#ffffff60', fontSize: 11 }}
                  axisLine={{ stroke: '#ffffff20' }}
                  tickLine={{ stroke: '#ffffff20' }}
                />
                <YAxis 
                  stroke="#ffffff60" 
                  tick={{ fill: '#ffffff60', fontSize: 11 }}
                  axisLine={{ stroke: '#ffffff20' }}
                  tickLine={{ stroke: '#ffffff20' }}
                  domain={[0, 'auto']}
                  tickFormatter={(value) => {
                    if (value >= 1000) {
                      return `$${(value / 1000).toFixed(0)}k`;
                    }
                    return `$${value}`;
                  }}
                  width={50}
                  allowDecimals={false}
                />
                <ReTooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [formatCurrency(value), 'Gastos']}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8A5CF6" 
                  strokeWidth={2} 
                  dot={{ fill: '#8A5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#F26D5B' }}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Gráfico de Dona de Categorías y Top 5 */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Dona Interactivo */}
        <div className="bg-[#101015] rounded-xl p-5 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-[#8A5CF6]" />
            Distribución por Categoría
          </h3>
          <div className="h-[260px]">
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
                  formatter={(value: number) => [formatCurrency(value), 'Monto']}
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

        {/* Top 5 Categorías con Barras Horizontales */}
        <div className="bg-[#101015] rounded-xl p-5 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#8A5CF6]" />
            Top 5 Categorías
          </h3>
          <div className="space-y-4">
            {top5Categories.map((cat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="flex items-center justify-between flex-wrap gap-x-2 gap-y-1 mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-lg bg-gradient-to-r ${cat.color} bg-opacity-20`}>
                      {cat.icon}
                    </div>
                    <span className="text-white text-sm">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/50 text-xs">{cat.percentage.toFixed(1)}%</span>
                    <span className="text-white text-sm font-medium">{formatCurrency(cat.amount)}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>


      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="bg-[#101015] rounded-xl border border-white/10 shadow-lg">
        <div className="flex items-center px-4 pt-4 pb-3 border-b border-white/10">
          <ViewModeToggle viewMode={viewMode} onToggle={setViewMode} />
        </div>
        <div>
          <SearchFilterBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearAllFilters}
            placeholder="Buscar por descripción, proveedor o ID..."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white/60 text-xs mb-1 block">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#8A5CF6] text-sm"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                >
                  <option value="todas" style={{ backgroundColor: '#08080B', color: 'white' }}>Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name} style={{ backgroundColor: '#08080B', color: 'white' }}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1 block">Estado</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#8A5CF6] text-sm"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                >
                  <option value="todos" style={{ backgroundColor: '#08080B', color: 'white' }}>Todos los estados</option>
                  <option value="completado" style={{ backgroundColor: '#08080B', color: 'white' }}>Completado</option>
                  <option value="cancelado" style={{ backgroundColor: '#08080B', color: 'white' }}>Cancelado</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-xs mb-1 block">Método de pago</label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#8A5CF6] text-sm"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                >
                  <option value="todos" style={{ backgroundColor: '#08080B', color: 'white' }}>Todos los métodos</option>
                  <option value="efectivo" style={{ backgroundColor: '#08080B', color: 'white' }}>Efectivo</option>
                  <option value="tarjeta" style={{ backgroundColor: '#08080B', color: 'white' }}>Tarjeta</option>
                  <option value="transferencia" style={{ backgroundColor: '#08080B', color: 'white' }}>Transferencia</option>
                  <option value="cheque" style={{ backgroundColor: '#08080B', color: 'white' }}>Cheque</option>
                </select>
              </div>
            </div>
          </SearchFilterBar>
        </div>

        <SortBar
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(field) => {
            setSortBy(field as typeof sortBy);
            setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
          }}
          fields={[
            { key: 'date', label: 'Fecha', icon: <Calendar size={14} /> },
            { key: 'amount', label: 'Monto', icon: <DollarSign size={14} /> },
            { key: 'category', label: 'Categoría', icon: <Tag size={14} /> },
          ]}
          totalResults={filteredExpenses.length}
        />

        {/* Table View */}
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="overflow-x-auto custom-scrollbar"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">ID</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Descripción</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Categoría</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Fecha</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Método</th>
                    <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Estado</th>
                    <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Monto</th>
                    <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExpenses.map((expense, index) => {
                    const highExpense = isHighExpense(expense.amount);
                    const recurringAlert = getRecurringAlert(expense);

                    return (
                      <motion.tr
                        key={expense.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <td className="py-3 px-4">
                          <span className="text-white/40 text-xs font-mono">{expense.id.slice(-8)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{expense.description}</p>
                            {highExpense && (
                              <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                <AlertTriangle size={10} />
                                Alto gasto
                              </span>
                            )}
                            {recurringAlert && (
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                                {recurringAlert.message}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm">{expense.category}</span>
                            {expense.recurring && (
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                                recurrente
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-white/40" />
                            <span className="text-white text-sm">{formatDate(expense.date)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {getPaymentMethodIcon(expense.paymentMethod)}
                            <span className="text-white text-sm capitalize">{getPaymentMethodLabel(expense.paymentMethod)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                            {getStatusIcon(expense.status)}
                            {expense.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-bold ${highExpense ? 'text-red-400' : 'text-white'}`}>
                            {formatCurrency(expense.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEditModal(expense)}
                              className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                              title="Editar Gasto"
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                              title="Eliminar Gasto"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {paginatedExpenses.map((expense, index) => {
                const highExpense = isHighExpense(expense.amount);

                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#8A5CF6]/50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white/40 text-xs font-mono">{expense.id.slice(-8)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <h3 className="text-white font-medium">{expense.description}</h3>
                          {highExpense && (
                            <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <AlertTriangle size={10} />
                              Alto
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(expense.status)}`}>
                        {getStatusIcon(expense.status)}
                        {expense.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Categoría:</span>
                        <span className="text-white">{expense.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Fecha:</span>
                        <span className="text-white">{formatDate(expense.date)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Método:</span>
                        <span className="text-white capitalize">{getPaymentMethodLabel(expense.paymentMethod)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className={`text-lg font-bold ${highExpense ? 'text-red-400' : 'text-white'}`}>
                        {formatCurrency(expense.amount)}
                      </span>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEditModal(expense)}
                          className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                          title="Editar Gasto"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                          title="Eliminar Gasto"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredExpenses.length}
          itemsPerPage={itemsPerPage}
          label="gastos"
          onPageChange={setCurrentPage}
        />
      </motion.div>

      {/* Modal para crear nuevo gasto */}
      <AnimatePresence>
        <ModalOverlay
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nuevo Gasto"
          subtitle="Completa los campos para registrar un nuevo gasto"
          icon={<TrendingDown size={20} className="text-white" />}
        >
          <div>
                <form onSubmit={(e) => { e.preventDefault(); handleCreateExpense(); }} className="space-y-5">
                  {recurringList.length > 0 && (
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Gasto recurrente</label>
                      <Select
                        value={formData.recurringId}
                        onChange={handleSelectRecurring}
                        placeholder="Ninguno, registrar gasto nuevo"
                        options={recurringList.map(r => ({
                          value: String(r.id),
                          label: `${r.descripcion || 'Sin descripción'} · ${formatCurrency(r.monto ?? 0)} · ${r.frecuencia}`,
                        }))}
                      />
                      <p className="text-white/40 text-xs mt-1">Selecciona uno para autocompletar y registrar ese pago.</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Cliente *</label>
                      {isClientRole ? (
                        <div className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/70">
                          {clientesList.find(c => c.id === Number(ownClienteId))?.nombre || localStorage.getItem('userName') || 'Tu cuenta'}
                        </div>
                      ) : (
                        <Select
                          value={formData.clienteId}
                          onChange={(v) => setFormData({...formData, clienteId: v, categoriaId: ''})}
                          placeholder="Seleccionar cliente"
                          options={clientesList.map(c => ({ value: String(c.id), label: c.nombre }))}
                        />
                      )}
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Categoría *</label>
                      <Select
                        value={formData.categoriaId}
                        onChange={(v) => setFormData({...formData, categoriaId: v})}
                        placeholder={formData.clienteId ? 'Seleccionar categoría' : 'Primero selecciona un cliente'}
                        disabled={!formData.clienteId}
                        options={categoriasList.map(cat => ({ value: String(cat.id), label: cat.nombre }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Descripción *</label>
                      <div className="relative">
                        <FileText size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#8A5CF6] transition-colors"
                          placeholder="Ej: Supermercado"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Monto *</label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#8A5CF6] transition-colors"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Fecha *</label>
                      <DatePicker
                        value={formData.date}
                        onChange={(v) => setFormData({...formData, date: v})}
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Método de pago</label>
                      <Select
                        value={formData.paymentMethod}
                        onChange={(v) => setFormData({...formData, paymentMethod: v})}
                        options={[
                          { value: 'efectivo', label: 'Efectivo' },
                          { value: 'tarjeta', label: 'Tarjeta' },
                          { value: 'transferencia', label: 'Transferencia' },
                          { value: 'cheque', label: 'Cheque' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8A5CF6] to-[#F26D5B] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      <Save size={18} />
                      <span>Guardar Gasto</span>
                    </motion.button>
                  </div>
                </form>
          </div>
        </ModalOverlay>
      </AnimatePresence>

      {/* Modal para editar gasto */}
      <AnimatePresence>
        <ModalOverlay
          isOpen={showEditModal && !!selectedExpense}
          onClose={() => setShowEditModal(false)}
          title="Editar Gasto"
          subtitle="Modifica los datos del gasto"
          icon={<Edit size={20} className="text-white" />}
        >
          <div>
                <form onSubmit={(e) => { e.preventDefault(); handleUpdateExpense(); }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Cliente</label>
                      <div className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60">
                        {clienteNombre(Number(formData.clienteId))}
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Categoría *</label>
                      <Select
                        value={formData.categoriaId}
                        onChange={(v) => setFormData({...formData, categoriaId: v})}
                        placeholder="Seleccionar categoría"
                        options={categoriasList.map(cat => ({ value: String(cat.id), label: cat.nombre }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Descripción *</label>
                      <div className="relative">
                        <FileText size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#8A5CF6] transition-colors"
                          placeholder="Ej: Supermercado"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Monto *</label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#8A5CF6] transition-colors"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Fecha *</label>
                      <DatePicker
                        value={formData.date}
                        onChange={(v) => setFormData({...formData, date: v})}
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Método de pago</label>
                      <Select
                        value={formData.paymentMethod}
                        onChange={(v) => setFormData({...formData, paymentMethod: v})}
                        options={[
                          { value: 'efectivo', label: 'Efectivo' },
                          { value: 'tarjeta', label: 'Tarjeta' },
                          { value: 'transferencia', label: 'Transferencia' },
                          { value: 'cheque', label: 'Cheque' },
                        ]}
                      />
                    </div>
                  </div>

                  <Toggle
                    value={editStatus === 'completado'}
                    onChange={(v) => setEditStatus(v ? 'completado' : 'cancelado')}
                    label={editStatus === 'completado' ? 'Completado' : 'Cancelado'}
                    activeColor="bg-green-500"
                  />

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8A5CF6] to-[#F26D5B] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      <Save size={18} />
                      <span>Guardar Cambios</span>
                    </motion.button>
                  </div>
                </form>
          </div>
        </ModalOverlay>
      </AnimatePresence>
      {ConfirmDialogElement}
    </motion.div>
  );
};