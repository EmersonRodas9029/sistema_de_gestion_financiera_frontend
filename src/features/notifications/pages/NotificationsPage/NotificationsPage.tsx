import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, CheckCheck, Trash2, Settings, RefreshCw,
  ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle,
  Info, Target, CreditCard, Archive, BellOff, X, XCircle
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'goal' | 'transaction' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
  actionable?: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  emailEnabled: boolean;
  retentionDays: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const generateUniqueId = () => `NOT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

const getDefaultNotifications = (): Notification[] => [
  { id: generateUniqueId(), type: 'goal', title: '¡Meta de ahorro alcanzada!', message: 'Has alcanzado el 50% de tu meta "Fondo de Emergencia".', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false, archived: false, actionable: true, actionUrl: '/savings', actionLabel: 'Ver meta' },
  { id: generateUniqueId(), type: 'transaction', title: 'Pago recibido', message: 'Has recibido un pago de $2,500.00 de María González', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), read: false, archived: false, actionable: true, actionUrl: '/incomes', actionLabel: 'Ver transacción' },
  { id: generateUniqueId(), type: 'reminder', title: 'Recordatorio de pago', message: 'Mañana vence el pago de tu tarjeta de crédito.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), read: true, archived: false, actionable: true, actionUrl: '/expenses', actionLabel: 'Ver detalles' },
  { id: generateUniqueId(), type: 'warning', title: 'Gasto inusual detectado', message: 'Se ha detectado un gasto inusual de $1,200.00.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: false, archived: false, actionable: true, actionUrl: '/expenses', actionLabel: 'Revisar' },
  { id: generateUniqueId(), type: 'info', title: 'Actualización del sistema', message: 'Hemos actualizado nuestra plataforma con nuevas características.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: true, archived: false, actionable: true, actionUrl: '/changelog', actionLabel: 'Ver novedades' },
  { id: generateUniqueId(), type: 'goal', title: 'Meta próxima a vencer', message: 'Tu meta "Vacaciones Europa" vence en 30 días.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), read: true, archived: false, actionable: true, actionUrl: '/savings', actionLabel: 'Ver progreso' },
  { id: generateUniqueId(), type: 'transaction', title: 'Transferencia programada', message: 'Se ha programado una transferencia de $500.00 para mañana.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), read: false, archived: false, actionable: true, actionUrl: '/wallet', actionLabel: 'Ver programación' },
  { id: generateUniqueId(), type: 'warning', title: 'Límite de gasto alcanzado', message: 'Has alcanzado el 80% de tu límite en "Alimentación".', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), read: true, archived: false, actionable: false },
  { id: generateUniqueId(), type: 'success', title: '¡Meta completada!', message: '¡Felicidades! Has completado tu meta "Boda".', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), read: true, archived: false, actionable: true, actionUrl: '/savings', actionLabel: 'Ver detalles' },
  { id: generateUniqueId(), type: 'reminder', title: 'Revisión mensual', message: 'Es momento de revisar tus finanzas del mes.', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), read: false, archived: false, actionable: true, actionUrl: '/analytics', actionLabel: 'Revisar' },
  { id: generateUniqueId(), type: 'info', title: 'Nuevo artículo disponible', message: '5 consejos para ahorrar más este año', timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), read: true, archived: false, actionable: true, actionUrl: '/blog/5-tips', actionLabel: 'Leer artículo' },
  { id: generateUniqueId(), type: 'transaction', title: 'Pago realizado', message: 'Se ha realizado el pago de $156.75 en "Supermercado".', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), read: true, archived: false, actionable: true, actionUrl: '/expenses', actionLabel: 'Ver detalle' }
];

const getDefaultSettings = (): NotificationSettings => ({ pushEnabled: true, soundEnabled: true, emailEnabled: false, retentionDays: 30 });

const typeOptions = [
  { value: 'todas', label: 'Todas', icon: Bell },
  { value: 'goal', label: 'Metas', icon: Target },
  { value: 'transaction', label: 'Transacciones', icon: CreditCard },
  { value: 'reminder', label: 'Recordatorios', icon: Clock },
  { value: 'warning', label: 'Alertas', icon: AlertCircle },
  { value: 'info', label: 'Información', icon: Info },
  { value: 'success', label: 'Éxitos', icon: CheckCircle }
];

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todas');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notification_settings');
    return saved ? JSON.parse(saved) : getDefaultSettings();
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const itemsPerPage = 6;

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return getDefaultNotifications();
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('notification_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;
  const archivedCount = notifications.filter(n => n.archived).length;
  const readCount = notifications.length - unreadCount - archivedCount;

  const filteredNotifications = notifications.filter(notification => {
    if (!showArchived && notification.archived) return false;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todas' || notification.type === selectedType;
    return matchesSearch && matchesType;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const totalPages = Math.ceil(sortedNotifications.length / itemsPerPage);
  const paginatedNotifications = sortedNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showSuccessMessage('Notificaciones actualizadas');
    }, 1000);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showSuccessMessage('Todas las notificaciones marcadas como leídas');
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === paginatedNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(paginatedNotifications.map(n => n.id));
    }
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    showSuccessMessage('Notificación marcada como leída');
  };

  const handleArchive = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: true, read: true } : n));
    setSelectedNotifications(prev => prev.filter(n => n !== id));
    showSuccessMessage('Notificación archivada');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar esta notificación?')) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      showSuccessMessage('Notificación eliminada');
    }
  };

  const handleBulkArchive = () => {
    if (selectedNotifications.length === 0) return;
    setNotifications(prev => prev.map(n => selectedNotifications.includes(n.id) ? { ...n, archived: true, read: true } : n));
    setSelectedNotifications([]);
    showSuccessMessage(`${selectedNotifications.length} notificaciones archivadas`);
  };

  const handleBulkDelete = () => {
    if (selectedNotifications.length === 0) return;
    if (window.confirm(`¿Eliminar ${selectedNotifications.length} notificaciones?`)) {
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
      setSelectedNotifications([]);
      showSuccessMessage(`${selectedNotifications.length} notificaciones eliminadas`);
    }
  };

  const resetData = () => {
    if (window.confirm('¿Restaurar datos por defecto?')) {
      localStorage.removeItem('notifications');
      setNotifications(getDefaultNotifications());
      showSuccessMessage('Datos restaurados a valores por defecto');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('todas');
    setShowArchived(false);
    setCurrentPage(1);
    showSuccessMessage('Filtros limpiados');
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

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'goal': return <Target size={18} className="text-emerald-400" />;
      case 'transaction': return <CreditCard size={18} className="text-blue-400" />;
      case 'reminder': return <Clock size={18} className="text-amber-400" />;
      case 'warning': return <AlertCircle size={18} className="text-red-400" />;
      case 'success': return <CheckCircle size={18} className="text-emerald-400" />;
      default: return <Info size={18} className="text-sky-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'goal': return 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30';
      case 'transaction': return 'from-blue-500/20 to-blue-600/10 border-blue-500/30';
      case 'reminder': return 'from-amber-500/20 to-amber-600/10 border-amber-500/30';
      case 'warning': return 'from-red-500/20 to-red-600/10 border-red-500/30';
      case 'success': return 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30';
      default: return 'from-sky-500/20 to-sky-600/10 border-sky-500/30';
    }
  };

  const hasActiveFilters = searchTerm !== '' || selectedType !== 'todas' || showArchived;

  // Skeleton Loader
  if (isLoading) {
    return (
      <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between">
            <div className="h-10 w-48 bg-white/10 rounded-lg" />
            <div className="h-10 w-32 bg-white/10 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white/10 rounded-xl" />
            ))}
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
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-[#321D28] via-[#4a2d40] to-[#321D28] rounded-2xl p-6 border border-white/10 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05984]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#BC455F]/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#F05984] to-[#BC455F] rounded-xl shadow-lg">
              <Bell size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">Notificaciones</h1>
                {unreadCount > 0 && (
                  <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full font-medium">
                    {unreadCount} no leídas
                  </span>
                )}
              </div>
              <p className="text-white/50 text-sm mt-1">Mantente al día con tus actividades y alertas</p>
            </div>
          </div>
          <div className="flex gap-2">
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-xl text-green-400 text-sm font-medium"
                >
                  <CheckCheck size={16} />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 text-white/70 hover:text-white"
            >
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 text-white/70 hover:text-white"
            >
              <Settings size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetData}
              className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-xl transition-all duration-300 text-yellow-400 hover:text-yellow-300"
              title="Restaurar datos"
            >
              <RefreshCw size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{notifications.length}</p>
            </div>
            <div className="p-2 rounded-xl bg-white/10">
              <Bell size={20} className="text-[#F05984]" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#1e1b2e] to-[#2d2a3d] rounded-xl p-4 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">No leídas</p>
              <p className="text-2xl font-bold text-amber-400 mt-1 tracking-tight">{unreadCount}</p>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/20">
              <Bell size={20} className="text-amber-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl p-4 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Leídas</p>
              <p className="text-2xl font-bold text-blue-400 mt-1 tracking-tight">{readCount}</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/20">
              <CheckCheck size={20} className="text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#1a2e2a] to-[#2d403a] rounded-xl p-4 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Archivadas</p>
              <p className="text-2xl font-bold text-gray-400 mt-1 tracking-tight">{archivedCount}</p>
            </div>
            <div className="p-2 rounded-xl bg-gray-500/20">
              <Archive size={20} className="text-gray-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        variants={itemVariants}
        className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-xl"
      >
        {/* Filters Bar */}
        <div className="p-4 border-b border-white/10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Buscar notificaciones..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-all duration-300"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Type Chips */}
              <div className="flex flex-wrap gap-1">
                {typeOptions.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                      selectedType === type.value
                        ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg'
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
                    ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg'
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
        <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedNotifications.length === paginatedNotifications.length && paginatedNotifications.length > 0} 
                onChange={handleSelectAll} 
                className="w-4 h-4 rounded border-white/30 text-[#F05984] focus:ring-[#F05984] bg-white/5 cursor-pointer"
              />
              <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">Seleccionar todo</span>
            </label>
            {selectedNotifications.length > 0 && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[#F05984] text-sm font-medium"
              >
                {selectedNotifications.length} seleccionados
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm transition-all duration-300"
            >
              <CheckCheck size={16} />
              <span>Marcar todas</span>
            </motion.button>
            {selectedNotifications.length > 0 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBulkArchive}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm transition-all duration-300"
                >
                  <Archive size={16} />
                  <span>Archivar</span>
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300 text-sm transition-all duration-300"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-white/10 max-h-[500px] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {paginatedNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.03 }}
                className={`p-4 hover:bg-white/5 transition-all duration-300 group ${
                  !notification.read ? 'bg-white/5' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <input 
                    type="checkbox" 
                    checked={selectedNotifications.includes(notification.id)} 
                    onChange={() => handleSelectNotification(notification.id)} 
                    className="mt-1 w-4 h-4 rounded border-white/30 text-[#F05984] focus:ring-[#F05984] bg-white/5 cursor-pointer"
                  />
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${getTypeColor(notification.type)} flex items-center justify-center border`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-white ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-[#F05984] rounded-full animate-pulse" />
                          )}
                        </div>
                        <p className="text-white/60 text-sm mt-1">{notification.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-white/40 text-xs flex items-center gap-1">
                            <Clock size={12} />
                            {formatDateTime(notification.timestamp)}
                          </span>
                        </div>
                        {notification.actionable && notification.actionUrl && (
                          <motion.button
                            whileHover={{ x: 4 }}
                            onClick={() => navigate(notification.actionUrl!)}
                            className="mt-2 text-[#F05984] hover:text-[#d14d75] text-sm transition-colors font-medium"
                          >
                            {notification.actionLabel || 'Ver detalles'} →
                          </motion.button>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {!notification.read && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            title="Marcar como leída"
                          >
                            <CheckCheck size={16} className="text-white/40 hover:text-white" />
                          </motion.button>
                        )}
                        {!notification.archived && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleArchive(notification.id)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            title="Archivar"
                          >
                            <Archive size={16} className="text-white/40 hover:text-white" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(notification.id)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} className="text-white/40 hover:text-red-400" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {paginatedNotifications.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center"
            >
              <div className="inline-flex p-4 bg-white/5 rounded-full mb-4">
                <BellOff size={40} className="text-white/20" />
              </div>
              <h3 className="text-white font-medium mb-1">No hay notificaciones</h3>
              <p className="text-white/40 text-sm">No tienes notificaciones para mostrar</p>
              {hasActiveFilters && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm transition-colors"
                >
                  Limpiar filtros
                </motion.button>
              )}
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-white/40 text-sm">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} de {filteredNotifications.length} notificaciones
            </p>
            <div className="flex gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </motion.button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = totalPages <= 5 
                  ? i + 1 
                  : currentPage <= 3 
                    ? i + 1 
                    : currentPage >= totalPages - 2 
                      ? totalPages - 4 + i 
                      : currentPage - 2 + i;
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      currentPage === pageNum 
                        ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg' 
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
                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Settings Drawer */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1a0f14] border-l border-white/10 shadow-2xl z-50 overflow-y-auto custom-scrollbar"
            >
              <div className="sticky top-0 bg-[#1a0f14]/95 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#F05984] to-[#BC455F] rounded-lg">
                    <Settings size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Configuración</h2>
                    <p className="text-white/40 text-xs">Personaliza tus notificaciones</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Bell size={16} className="text-[#F05984]" />
                    Canales de notificación
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                      <div>
                        <span className="text-white font-medium">Push</span>
                        <p className="text-white/40 text-xs">Notificaciones en tiempo real</p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={settings.pushEnabled} 
                          onChange={(e) => setSettings({...settings, pushEnabled: e.target.checked})} 
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-white/20 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-[#F05984] peer-checked:to-[#BC455F] transition-all duration-300">
                          <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings.pushEnabled ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                      <div>
                        <span className="text-white font-medium">Sonido</span>
                        <p className="text-white/40 text-xs">Reproducir sonidos</p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={settings.soundEnabled} 
                          onChange={(e) => setSettings({...settings, soundEnabled: e.target.checked})} 
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-white/20 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-[#F05984] peer-checked:to-[#BC455F] transition-all duration-300">
                          <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings.soundEnabled ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                      <div>
                        <span className="text-white font-medium">Email</span>
                        <p className="text-white/40 text-xs">Recibir correos electrónicos</p>
                      </div>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={settings.emailEnabled} 
                          onChange={(e) => setSettings({...settings, emailEnabled: e.target.checked})} 
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-white/20 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-[#F05984] peer-checked:to-[#BC455F] transition-all duration-300">
                          <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings.emailEnabled ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Archive size={16} className="text-[#F05984]" />
                    Conservación
                  </h3>
                  <div className="bg-white/5 rounded-xl p-3">
                    <select 
                      value={settings.retentionDays} 
                      onChange={(e) => setSettings({...settings, retentionDays: parseInt(e.target.value)})} 
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="30" style={{ backgroundColor: '#1a0f14', color: 'white' }}>30 días</option>
                      <option value="60" style={{ backgroundColor: '#1a0f14', color: 'white' }}>60 días</option>
                      <option value="90" style={{ backgroundColor: '#1a0f14', color: 'white' }}>90 días</option>
                      <option value="365" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Siempre</option>
                    </select>
                    <p className="text-white/40 text-xs mt-2">Las notificaciones más antiguas que este período se eliminarán automáticamente</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowSettings(false);
                      showSuccessMessage('Configuración guardada');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300"
                  >
                    Guardar cambios
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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