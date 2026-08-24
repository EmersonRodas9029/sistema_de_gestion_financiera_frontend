import { useState, useEffect, useCallback, type ReactElement } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { containerVariants, itemVariants, notifyConnectionError, notifyActionError } from '../../../../shared/utils';
import { PageSkeleton } from '../../../../shared/components/ui/PageSkeleton';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { getCurrentClientSession } from '../../../../shared/hooks/useCurrentClient';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';
import {
  Bell, CheckCheck, Trash2,
  Clock, AlertCircle, Target, CreditCard, Archive, BellOff, XCircle
} from 'lucide-react';
import { notificacionesService, type NotificacionResponse, type TipoNotificacion } from '../../services';

const typeOptions: { value: 'todas' | TipoNotificacion; label: string; icon: typeof Bell }[] = [
  { value: 'todas', label: 'Todas', icon: Bell },
  { value: 'PRESUPUESTO_EXCEDIDO', label: 'Presupuesto', icon: AlertCircle },
  { value: 'GASTO_RECURRENTE', label: 'Gasto recurrente', icon: CreditCard },
  { value: 'META_PROGRESO', label: 'Metas', icon: Target },
  { value: 'RECORDATORIO', label: 'Recordatorios', icon: Clock },
  { value: 'SISTEMA', label: 'Sistema', icon: Bell },
];

const TYPE_ICON: Record<TipoNotificacion, ReactElement> = {
  PRESUPUESTO_EXCEDIDO: <AlertCircle size={18} className="text-red-400" />,
  GASTO_RECURRENTE: <CreditCard size={18} className="text-blue-400" />,
  META_PROGRESO: <Target size={18} className="text-emerald-400" />,
  RECORDATORIO: <Clock size={18} className="text-amber-400" />,
  SISTEMA: <Bell size={18} className="text-sky-400" />,
};

const TYPE_COLOR: Record<TipoNotificacion, string> = {
  PRESUPUESTO_EXCEDIDO: 'from-red-500/20 to-red-600/10 border-red-500/30',
  GASTO_RECURRENTE: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  META_PROGRESO: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
  RECORDATORIO: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
  SISTEMA: 'from-sky-500/20 to-sky-600/10 border-sky-500/30',
};

const REFRESCO_MS = 60 * 1000;

const TYPE_ACTION: Record<TipoNotificacion, string | null> = {
  PRESUPUESTO_EXCEDIDO: '/budgets',
  GASTO_RECURRENTE: '/recurring-expenses',
  META_PROGRESO: '/goals',
  RECORDATORIO: '/expenses',
  SISTEMA: null,
};

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificacionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm);
  const [selectedType, setSelectedType] = useState<'todas' | TipoNotificacion>('todas');
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmDeleteIds, setConfirmDeleteIds] = useState<number[] | null>(null);

  const itemsPerPage = 6;

  const fetchNotifications = useCallback(async () => {
    try {
      const clienteId = Number(getCurrentClientSession().ownClienteId || 0);
      const list = await notificacionesService.getAll();
      setNotifications(clienteId ? list.filter(n => n.clienteId === clienteId) : list);
    } catch {
      notifyConnectionError();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, REFRESCO_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') fetchNotifications(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.leida && n.activa).length;
  const archivedCount = notifications.filter(n => !n.activa).length;
  const readCount = notifications.length - unreadCount - archivedCount;

  const filteredNotifications = notifications.filter(n => {
    if (!showArchived && !n.activa) return false;
    const matchesSearch = n.titulo.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      n.mensaje.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesType = selectedType === 'todas' || n.tipo === selectedType;
    return matchesSearch && matchesType;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (a.leida !== b.leida) return a.leida ? 1 : -1;
    return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
  });

  const totalPages = Math.ceil(sortedNotifications.length / itemsPerPage);
  const paginatedNotifications = sortedNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // El backend hace un UPDATE de todas las columnas (no un merge parcial),
  // así que hay que reenviar el registro completo o pone NULL en columnas NOT NULL.
  const fullUpdatePayload = (n: NotificacionResponse, overrides: Partial<NotificacionResponse>) => ({
    tipo: n.tipo, titulo: n.titulo, mensaje: n.mensaje, leida: n.leida,
    fechaProgramada: n.fechaProgramada, fechaEnviada: n.fechaEnviada, activa: n.activa,
    ...overrides,
  });

  const updateOne = async (n: NotificacionResponse, overrides: Partial<NotificacionResponse>) => {
    const updated = await notificacionesService.update(n.id, fullUpdatePayload(n, overrides));
    setNotifications(prev => prev.map(item => item.id === n.id ? updated : item));
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(n => !n.leida);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map(n => notificacionesService.update(n.id, fullUpdatePayload(n, { leida: true }))));
      await fetchNotifications();
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (e) {
      notifyActionError('actualizar', e);
    }
  };

  const handleSelectAll = () => {
    setSelectedIds(prev =>
      prev.length === sortedNotifications.length ? [] : sortedNotifications.map(n => n.id)
    );
  };

  const handleSelectNotification = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);
  };

  const handleMarkAsRead = (n: NotificacionResponse) =>
    updateOne(n, { leida: true }).then(() => toast.success('Notificación marcada como leída'));

  const handleArchive = (n: NotificacionResponse) => {
    updateOne(n, { activa: false, leida: true }).then(() => {
      setSelectedIds(prev => prev.filter(id => id !== n.id));
      toast.success('Notificación archivada');
    });
  };

  const deleteMany = async (ids: number[]) => {
    try {
      await Promise.all(ids.map(id => notificacionesService.remove(id)));
      setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
      setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
      toast.success(ids.length > 1 ? `${ids.length} notificaciones eliminadas` : 'Notificación eliminada');
    } catch (e) {
      notifyActionError('eliminar', e);
    }
  };

  const handleDelete = (id: number) => setConfirmDeleteIds([id]);

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;
    const targets = notifications.filter(n => selectedIds.includes(n.id));
    await Promise.all(targets.map(n => notificacionesService.update(n.id, fullUpdatePayload(n, { activa: false, leida: true }))));
    await fetchNotifications();
    toast.success(`${selectedIds.length} notificaciones archivadas`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setConfirmDeleteIds(selectedIds);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('todas');
    setShowArchived(false);
    setCurrentPage(1);
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const hasActiveFilters = searchTerm !== '' || selectedType !== 'todas' || showArchived;

  const getDateBucket = (timestamp: string) => {
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const diffDays = Math.floor((startOfDay(new Date()) - startOfDay(new Date(timestamp))) / 86400000);
    if (diffDays <= 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return 'Esta semana';
    return 'Anterior';
  };

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
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-[#101015] border border-white/[0.07] rounded-[20px] p-6"
      >
        <div className="absolute -top-16 -right-10 w-56 h-56 bg-[#F26D5B]/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F26D5B]/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#8A5CF6] to-[#F26D5B] rounded-xl shadow-lg">
              <Bell size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">Notificaciones</h1>
                {unreadCount > 0 && (
                  <span className="bg-[#8A5CF6]/20 text-[#8A5CF6] text-xs px-2 py-1 rounded-full font-medium">
                    {unreadCount} no leídas
                  </span>
                )}
              </div>
              <p className="text-white/50 text-sm mt-1">Mantente al día con tus actividades y alertas</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#101015] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight break-words">{notifications.length}</p>
            </div>
            <div className="p-2 rounded-xl bg-white/10"><Bell size={20} className="text-[#8A5CF6]" /></div>
          </div>
        </div>
        <div className="bg-[#101015] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">No leídas</p>
              <p className="text-2xl font-bold text-amber-400 mt-1 tracking-tight break-words">{unreadCount}</p>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/20"><Bell size={20} className="text-amber-400" /></div>
          </div>
        </div>
        <div className="bg-[#101015] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Leídas</p>
              <p className="text-2xl font-bold text-blue-400 mt-1 tracking-tight break-words">{readCount}</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/20"><CheckCheck size={20} className="text-blue-400" /></div>
          </div>
        </div>
        <div className="bg-[#101015] rounded-[20px] p-4 border border-white/[0.07] shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Archivadas</p>
              <p className="text-2xl font-bold text-gray-400 mt-1 tracking-tight break-words">{archivedCount}</p>
            </div>
            <div className="p-2 rounded-xl bg-gray-500/20"><Archive size={20} className="text-gray-400" /></div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants} className="bg-[#101015] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        {/* Filters Bar */}
        <div className="p-4 border-b border-white/10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar notificaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#8A5CF6] transition-all duration-300"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-1">
                {typeOptions.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                      selectedType === type.value
                        ? 'bg-gradient-to-r from-[#8A5CF6] to-[#F26D5B] text-white shadow-lg'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <type.icon size={14} />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                  showArchived
                    ? 'bg-gradient-to-r from-[#8A5CF6] to-[#F26D5B] text-white shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Archive size={14} />
                <span>Archivadas</span>
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 text-sm transition-all duration-300"
                >
                  <XCircle size={14} />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedIds.length === sortedNotifications.length && sortedNotifications.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-white/30 text-[#8A5CF6] focus:ring-[#8A5CF6] bg-white/5 cursor-pointer"
              />
              <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                Seleccionar todo{totalPages > 1 ? ` (${sortedNotifications.length})` : ''}
              </span>
            </label>
            {selectedIds.length > 0 && (
              <span className="text-[#8A5CF6] text-sm font-medium">{selectedIds.length} seleccionados</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm whitespace-nowrap transition-all duration-300"
            >
              <CheckCheck size={16} />
              <span>Marcar todas</span>
            </button>
            {selectedIds.length > 0 && (
              <>
                <button
                  onClick={handleBulkArchive}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm whitespace-nowrap transition-all duration-300"
                >
                  <Archive size={16} />
                  <span>Archivar</span>
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300 text-sm whitespace-nowrap transition-all duration-300"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-white/10 max-h-[500px] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {paginatedNotifications.map((n, index) => {
              const actionUrl = TYPE_ACTION[n.tipo];
              const bucket = getDateBucket(n.fechaCreacion);
              const showBucketHeader = index === 0 || bucket !== getDateBucket(paginatedNotifications[index - 1].fechaCreacion);
              return (
                <div key={n.id}>
                  {showBucketHeader && (
                    <div className="px-4 pt-3 pb-1 text-xs font-semibold text-white/40 uppercase tracking-wider">{bucket}</div>
                  )}
                  <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.03 }}
                  className={`p-4 hover:bg-white/5 transition-all duration-300 group ${!n.leida ? 'bg-white/5' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(n.id)}
                      onChange={() => handleSelectNotification(n.id)}
                      className="mt-1 w-4 h-4 rounded border-white/30 text-[#8A5CF6] focus:ring-[#8A5CF6] bg-white/5 cursor-pointer"
                    />
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${TYPE_COLOR[n.tipo]} flex items-center justify-center border`}>
                      {TYPE_ICON[n.tipo]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-white ${!n.leida ? 'font-semibold' : 'font-medium'}`}>{n.titulo}</h3>
                            {!n.leida && <span className="w-2 h-2 bg-[#8A5CF6] rounded-full animate-pulse" />}
                          </div>
                          <p className="text-white/60 text-sm mt-1">{n.mensaje}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-white/40 text-xs flex items-center gap-1">
                              <Clock size={12} />
                              {formatDateTime(n.fechaCreacion)}
                            </span>
                          </div>
                          {actionUrl && (
                            <motion.button
                              whileHover={{ x: 4 }}
                              onClick={() => navigate(actionUrl)}
                              className="mt-2 text-[#8A5CF6] hover:text-[#d14d75] text-sm transition-colors font-medium"
                            >
                              Ver detalles →
                            </motion.button>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {!n.leida && (
                            <button
                              onClick={() => handleMarkAsRead(n)}
                              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                              title="Marcar como leída"
                            >
                              <CheckCheck size={16} className="text-white/40 hover:text-white" />
                            </button>
                          )}
                          {n.activa && (
                            <button
                              onClick={() => handleArchive(n)}
                              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                              title="Archivar"
                            >
                              <Archive size={16} className="text-white/40 hover:text-white" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(n.id)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} className="text-white/40 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </motion.div>
                </div>
              );
            })}
          </AnimatePresence>

          {paginatedNotifications.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
              <div className="inline-flex p-4 bg-white/5 rounded-full mb-4">
                <BellOff size={40} className="text-white/20" />
              </div>
              <h3 className="text-white font-medium mb-1">No hay notificaciones</h3>
              <p className="text-white/40 text-sm">No tienes notificaciones para mostrar</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </motion.div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredNotifications.length}
            itemsPerPage={itemsPerPage}
            label="notificaciones"
            onPageChange={setCurrentPage}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {confirmDeleteIds && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setConfirmDeleteIds(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#101015] border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-white font-semibold text-lg">
                {confirmDeleteIds.length > 1 ? `¿Eliminar ${confirmDeleteIds.length} notificaciones?` : '¿Eliminar esta notificación?'}
              </h3>
              <p className="text-white/50 text-sm mt-2">Esta acción no se puede deshacer.</p>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setConfirmDeleteIds(null)}
                  className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => { deleteMany(confirmDeleteIds); setConfirmDeleteIds(null); }}
                  className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-sm transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
