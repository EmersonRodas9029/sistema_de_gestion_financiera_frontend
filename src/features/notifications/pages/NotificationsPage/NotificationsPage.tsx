import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, CheckCheck, Trash2, Settings, RefreshCw, Filter,
  ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle,
  Info, Target, CreditCard, Archive, MoreVertical, BellOff, X, XCircle
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

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todas');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notification_settings');
    return saved ? JSON.parse(saved) : getDefaultSettings();
  });

  const itemsPerPage = 6;

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return getDefaultNotifications();
  });

  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('notification_settings', JSON.stringify(settings)); }, [settings]);

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;
  const archivedCount = notifications.filter(n => n.archived).length;

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

  const handleRefresh = () => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 1000); };
  const handleMarkAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const handleSelectAll = () => {
    if (selectedNotifications.length === paginatedNotifications.length) setSelectedNotifications([]);
    else setSelectedNotifications(paginatedNotifications.map(n => n.id));
  };
  const handleSelectNotification = (id: string) => setSelectedNotifications(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);
  const handleMarkAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const handleArchive = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: true, read: true } : n));
    setSelectedNotifications(prev => prev.filter(n => n !== id));
  };
  const handleDelete = (id: string) => { if (window.confirm('¿Eliminar esta notificación?')) setNotifications(prev => prev.filter(n => n.id !== id)); };
  const handleBulkArchive = () => {
    if (selectedNotifications.length === 0) return;
    setNotifications(prev => prev.map(n => selectedNotifications.includes(n.id) ? { ...n, archived: true, read: true } : n));
    setSelectedNotifications([]);
  };
  const handleBulkDelete = () => {
    if (selectedNotifications.length === 0) return;
    if (window.confirm(`¿Eliminar ${selectedNotifications.length} notificaciones?`)) {
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
      setSelectedNotifications([]);
    }
  };
  const resetData = () => { if (window.confirm('¿Restaurar datos por defecto?')) { localStorage.removeItem('notifications'); setNotifications(getDefaultNotifications()); } };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'goal': return <Target size={18} className="text-green-400" />;
      case 'transaction': return <CreditCard size={18} className="text-blue-400" />;
      case 'reminder': return <Clock size={18} className="text-yellow-400" />;
      case 'warning': return <AlertCircle size={18} className="text-red-400" />;
      case 'success': return <CheckCircle size={18} className="text-green-400" />;
      default: return <Info size={18} className="text-blue-400" />;
    }
  };

  const hasActiveFilters = searchTerm !== '' || selectedType !== 'todas' || showArchived;

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div><div className="flex items-center gap-2"><h1 className="text-2xl font-bold text-white">Notificaciones</h1><span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">{unreadCount} no leídas</span></div><p className="text-white/60 text-sm mt-1">Mantente al día con tus actividades y alertas</p></div>
        <div className="flex gap-2">
          <button onClick={handleRefresh} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"><RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} /></button>
          <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}><Settings size={20} /></button>
          <button onClick={resetData} className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors text-yellow-400 hover:text-yellow-300" title="Restaurar datos"><RefreshCw size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10"><p className="text-white/60 text-sm">Total</p><p className="text-2xl font-bold text-white">{notifications.length}</p></div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"><p className="text-white/60 text-sm">No leídas</p><p className="text-2xl font-bold text-yellow-400">{unreadCount}</p></div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"><p className="text-white/60 text-sm">Leídas</p><p className="text-2xl font-bold text-white">{notifications.length - unreadCount - archivedCount}</p></div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"><p className="text-white/60 text-sm">Archivadas</p><p className="text-2xl font-bold text-gray-400">{archivedCount}</p></div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative"><input type="text" placeholder="Buscar notificaciones..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors" /></div>
            <div className="flex flex-wrap gap-2">
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                <option value="todas" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todas</option>
                <option value="goal" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Metas</option>
                <option value="transaction" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Transacciones</option>
                <option value="reminder" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Recordatorios</option>
                <option value="warning" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Alertas</option>
                <option value="info" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Información</option>
                <option value="success" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Éxitos</option>
              </select>
              <button onClick={() => setShowArchived(!showArchived)} className={`px-3 py-2 rounded-lg transition-colors text-sm ${showArchived ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>Archivadas</button>
              <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}><Filter size={20} /></button>
              {hasActiveFilters && (<button onClick={() => { setSearchTerm(''); setSelectedType('todas'); setShowArchived(false); setCurrentPage(1); }} className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 text-sm"><XCircle size={16} /><span>Limpiar filtros</span></button>)}
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={selectedNotifications.length === paginatedNotifications.length && paginatedNotifications.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" /><span className="text-white/60 text-sm">Seleccionar todo</span></label>{selectedNotifications.length > 0 && (<span className="text-white/40 text-sm">{selectedNotifications.length} seleccionados</span>)}</div>
          <div className="flex items-center gap-2">
            <button onClick={handleMarkAllAsRead} className="flex items-center gap-1 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm transition-colors"><CheckCheck size={16} /><span>Marcar todas</span></button>
            {selectedNotifications.length > 0 && (<><button onClick={handleBulkArchive} className="flex items-center gap-1 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm transition-colors"><Archive size={16} /><span>Archivar</span></button><button onClick={handleBulkDelete} className="flex items-center gap-1 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300 text-sm transition-colors"><Trash2 size={16} /><span>Eliminar</span></button></>)}
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {paginatedNotifications.map((notification) => (
            <div key={notification.id} className={`p-4 hover:bg-white/5 transition-colors ${!notification.read ? 'bg-white/5' : ''}`}>
              <div className="flex items-start gap-4">
                <input type="checkbox" checked={selectedNotifications.includes(notification.id)} onChange={() => handleSelectNotification(notification.id)} className="mt-1 w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`text-white ${!notification.read ? 'font-semibold' : ''}`}>{notification.title}{!notification.read && <span className="ml-2 w-2 h-2 bg-[#F05984] rounded-full inline-block" />}</h3>
                      <p className="text-white/60 text-sm mt-1">{notification.message}</p>
                      <div className="flex items-center gap-3 mt-2"><span className="text-white/40 text-xs flex items-center gap-1"><Clock size={12} />{formatDateTime(notification.timestamp)}</span></div>
                      {notification.actionable && notification.actionUrl && (<button onClick={() => navigate(notification.actionUrl!)} className="mt-2 text-[#F05984] hover:text-[#d14d75] text-sm transition-colors">{notification.actionLabel || 'Ver detalles'} →</button>)}
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (<button onClick={() => handleMarkAsRead(notification.id)} className="p-1 hover:bg-white/10 rounded transition-colors" title="Marcar como leída"><CheckCheck size={16} className="text-white/40 hover:text-white" /></button>)}
                      {!notification.archived && (<button onClick={() => handleArchive(notification.id)} className="p-1 hover:bg-white/10 rounded transition-colors" title="Archivar"><Archive size={16} className="text-white/40 hover:text-white" /></button>)}
                      <button onClick={() => handleDelete(notification.id)} className="p-1 hover:bg-white/10 rounded transition-colors" title="Eliminar"><Trash2 size={16} className="text-white/40 hover:text-red-400" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {paginatedNotifications.length === 0 && (<div className="p-12 text-center"><div className="inline-flex p-3 bg-white/5 rounded-full mb-4"><BellOff size={32} className="text-white/20" /></div><h3 className="text-white font-medium mb-1">No hay notificaciones</h3><p className="text-white/40 text-sm">No tienes notificaciones para mostrar</p></div>)}
        </div>

        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} de {filteredNotifications.length} notificaciones</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50"><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = totalPages <= 5 ? i + 1 : (currentPage <= 3 ? i + 1 : (currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i));
              return <button key={i} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${currentPage === pageNum ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}`}>{pageNum}</button>;
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-white">Configuración</h2><button onClick={() => setShowSettings(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><X size={20} className="text-white/60" /></button></div>
              <div className="space-y-4">
                <div><h3 className="text-white font-medium mb-2">Notificaciones</h3>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between"><span className="text-white">Notificaciones push</span><input type="checkbox" checked={settings.pushEnabled} onChange={(e) => setSettings({...settings, pushEnabled: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]" /></label>
                    <label className="flex items-center justify-between"><span className="text-white">Sonido</span><input type="checkbox" checked={settings.soundEnabled} onChange={(e) => setSettings({...settings, soundEnabled: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]" /></label>
                    <label className="flex items-center justify-between"><span className="text-white">Email</span><input type="checkbox" checked={settings.emailEnabled} onChange={(e) => setSettings({...settings, emailEnabled: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]" /></label>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10"><h3 className="text-white font-medium mb-2">Conservación</h3>
                  <select value={settings.retentionDays} onChange={(e) => setSettings({...settings, retentionDays: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                    <option value="30">30 días</option><option value="60">60 días</option><option value="90">90 días</option><option value="365">Siempre</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4"><button onClick={() => setShowSettings(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">Cancelar</button><button onClick={() => setShowSettings(false)} className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">Guardar</button></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
