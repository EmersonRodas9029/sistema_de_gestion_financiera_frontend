import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell,
  CheckCheck,
  Trash2,
  Settings,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  TrendingUp,
  Target,
  CreditCard,
  Gift,
  Archive,
  ArchiveRestore,
  MoreVertical,
  BellOff,
  X
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'goal' | 'transaction' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todas');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const itemsPerPage = 10;

  // Datos de ejemplo - Notificaciones
  const notifications: Notification[] = [
    {
      id: 'NOT-001',
      type: 'goal',
      title: '¡Meta de ahorro alcanzada!',
      message: 'Has alcanzado el 50% de tu meta "Fondo de Emergencia". ¡Sigue así!',
      timestamp: '2024-02-24T09:30:00',
      read: false,
      actionable: true,
      actionUrl: '/savings/SAV-001',
      actionLabel: 'Ver meta'
    },
    {
      id: 'NOT-002',
      type: 'transaction',
      title: 'Pago recibido',
      message: 'Has recibido un pago de $2,500.00 de María González',
      timestamp: '2024-02-24T08:15:00',
      read: false,
      actionable: true,
      actionUrl: '/incomes',
      actionLabel: 'Ver transacción'
    },
    {
      id: 'NOT-003',
      type: 'reminder',
      title: 'Recordatorio de pago',
      message: 'Mañana vence el pago de tu tarjeta de crédito.',
      timestamp: '2024-02-24T07:00:00',
      read: true,
      actionable: true,
      actionUrl: '/expenses',
      actionLabel: 'Ver detalles'
    },
    {
      id: 'NOT-004',
      type: 'warning',
      title: 'Gasto inusual detectado',
      message: 'Se ha detectado un gasto inusual de $1,200.00.',
      timestamp: '2024-02-23T22:45:00',
      read: false,
      actionable: true,
      actionUrl: '/expenses',
      actionLabel: 'Revisar'
    },
    {
      id: 'NOT-005',
      type: 'info',
      title: 'Actualización del sistema',
      message: 'Hemos actualizado nuestra plataforma con nuevas características.',
      timestamp: '2024-02-23T18:30:00',
      read: true,
      actionable: true,
      actionUrl: '/changelog',
      actionLabel: 'Ver novedades'
    },
    {
      id: 'NOT-006',
      type: 'goal',
      title: 'Meta próxima a vencer',
      message: 'Tu meta "Vacaciones Europa" vence en 30 días.',
      timestamp: '2024-02-23T12:00:00',
      read: true,
      actionable: true,
      actionUrl: '/savings/SAV-002',
      actionLabel: 'Ver progreso'
    },
    {
      id: 'NOT-007',
      type: 'transaction',
      title: 'Transferencia programada',
      message: 'Se ha programado una transferencia de $500.00 para mañana.',
      timestamp: '2024-02-23T10:15:00',
      read: false,
      actionable: true,
      actionUrl: '/wallet',
      actionLabel: 'Ver programación'
    },
    {
      id: 'NOT-008',
      type: 'warning',
      title: 'Límite de gasto alcanzado',
      message: 'Has alcanzado el 80% de tu límite en "Alimentación".',
      timestamp: '2024-02-22T20:30:00',
      read: true,
      actionable: false
    },
    {
      id: 'NOT-009',
      type: 'success',
      title: '¡Meta completada!',
      message: '¡Felicidades! Has completado tu meta "Boda".',
      timestamp: '2024-02-21T14:45:00',
      read: true,
      actionable: true,
      actionUrl: '/savings/SAV-007',
      actionLabel: 'Ver detalles'
    },
    {
      id: 'NOT-010',
      type: 'reminder',
      title: 'Revisión mensual',
      message: 'Es momento de revisar tus finanzas del mes.',
      timestamp: '2024-02-21T11:20:00',
      read: false,
      actionable: true,
      actionUrl: '/analytics',
      actionLabel: 'Revisar'
    },
    {
      id: 'NOT-011',
      type: 'info',
      title: 'Nuevo artículo disponible',
      message: '5 consejos para ahorrar más este año',
      timestamp: '2024-02-20T16:30:00',
      read: true,
      actionable: true,
      actionUrl: '/blog/5-tips',
      actionLabel: 'Leer artículo'
    },
    {
      id: 'NOT-012',
      type: 'transaction',
      title: 'Pago realizado',
      message: 'Se ha realizado el pago de $156.75 en "Supermercado".',
      timestamp: '2024-02-20T13:10:00',
      read: true,
      actionable: true,
      actionUrl: '/expenses',
      actionLabel: 'Ver detalle'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todas' || notification.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Ordenar notificaciones (no leídas primero, luego por fecha)
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Paginación
  const totalPages = Math.ceil(sortedNotifications.length / itemsPerPage);
  const paginatedNotifications = sortedNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleMarkAllAsRead = () => {
    console.log('Marcar todas como leídas');
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
    console.log('Marcar como leída:', id);
  };

  const handleArchive = (id: string) => {
    console.log('Archivar:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Eliminar:', id);
  };

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
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'goal':
        return <Target size={18} className="text-green-400" />;
      case 'transaction':
        return <CreditCard size={18} className="text-blue-400" />;
      case 'reminder':
        return <Clock size={18} className="text-yellow-400" />;
      case 'warning':
        return <AlertCircle size={18} className="text-red-400" />;
      case 'success':
        return <CheckCircle size={18} className="text-green-400" />;
      case 'info':
      default:
        return <Info size={18} className="text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Notificaciones</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">
              {unreadCount} no leídas
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Mantente al día con tus actividades y alertas
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
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{notifications.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">No leídas</p>
          <p className="text-2xl font-bold text-yellow-400">{unreadCount}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Leídas</p>
          <p className="text-2xl font-bold text-white">{notifications.length - unreadCount}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar notificaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
              >
                <option value="todas">Todas</option>
                <option value="goal">Metas</option>
                <option value="transaction">Transacciones</option>
                <option value="reminder">Recordatorios</option>
                <option value="warning">Alertas</option>
                <option value="info">Información</option>
                <option value="success">Éxitos</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedNotifications.length === paginatedNotifications.length && paginatedNotifications.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
              />
              <span className="text-white/60 text-sm">Seleccionar todo</span>
            </label>
            {selectedNotifications.length > 0 && (
              <span className="text-white/40 text-sm">
                {selectedNotifications.length} seleccionados
              </span>
            )}
          </div>
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm transition-colors"
          >
            <CheckCheck size={16} />
            <span>Marcar todas como leídas</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-white/10">
          {paginatedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-white/5 transition-colors ${
                !notification.read ? 'bg-white/5' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => handleSelectNotification(notification.id)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
                />

                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`text-white ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 w-2 h-2 bg-[#F05984] rounded-full inline-block" />
                        )}
                      </h3>
                      <p className="text-white/60 text-sm mt-1">{notification.message}</p>
                      
                      {/* Metadata */}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-white/40 text-xs flex items-center gap-1">
                          <Clock size={12} />
                          {formatDateTime(notification.timestamp)}
                        </span>
                      </div>

                      {/* Action Button */}
                      {notification.actionable && notification.actionUrl && (
                        <button
                          onClick={() => navigate(notification.actionUrl)}
                          className="mt-2 text-[#F05984] hover:text-[#d14d75] text-sm transition-colors"
                        >
                          {notification.actionLabel || 'Ver detalles'} →
                        </button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="Marcar como leída"
                        >
                          <CheckCheck size={16} className="text-white/40 hover:text-white" />
                        </button>
                      )}
                      <button
                        onClick={() => handleArchive(notification.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Archivar"
                      >
                        <Archive size={16} className="text-white/40 hover:text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} className="text-white/40 hover:text-red-400" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <MoreVertical size={16} className="text-white/40" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {paginatedNotifications.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex p-3 bg-white/5 rounded-full mb-4">
                <BellOff size={32} className="text-white/20" />
              </div>
              <h3 className="text-white font-medium mb-1">No hay notificaciones</h3>
              <p className="text-white/40 text-sm">No tienes notificaciones para mostrar</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} de {filteredNotifications.length} notificaciones
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Configuración</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Notificaciones</h3>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between">
                      <span className="text-white">Notificaciones push</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-white">Sonido</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-white">Email</span>
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]" />
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-white font-medium mb-2">Conservación</h3>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]">
                    <option>30 días</option>
                    <option>60 días</option>
                    <option>90 días</option>
                    <option>Siempre</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
                    Cancelar
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">
                    Guardar
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
