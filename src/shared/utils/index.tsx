import { CheckCircle, Clock, Calendar, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// ponytail: un único texto para "no hay conexión con el back" en toda la app, en vez de que cada
// página redacte el suyo. El `id` fijo hace que react-hot-toast reemplace el toast existente en
// lugar de apilar uno nuevo (evita duplicados por StrictMode o reintentos rápidos).
export const CONNECTION_ERROR_MESSAGE = 'No se pudo conectar con el servidor.';
export const notifyConnectionError = (): void => {
  toast.error(CONNECTION_ERROR_MESSAGE, { id: 'connection-error' });
};

// Un único formato para "Error al <acción>: <detalle>" en toda la app.
export const notifyActionError = (action: string, e: unknown, fallback = 'Error desconocido'): void => {
  toast.error(`Error al ${action}: ${e instanceof Error ? e.message : fallback}`, { id: `action-error-${action}` });
};

// Intl.NumberFormat separa el monto del código de moneda con un espacio no separable (U+00A0),
// lo que impide partir la línea en tarjetas angostas y hace que el texto se desborde sobre
// elementos vecinos (íconos) en mobile. Se cambia por un espacio normal para permitir el wrap.
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount).replace('\u00A0', ' ');

export const formatDate = (date: string): string => {
  // ponytail: "YYYY-MM-DD" parses as UTC midnight, shifting a day back in behind-UTC timezones — force local time.
  const d = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00`) : new Date(date);
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const generateUniqueId = (prefix = 'ID'): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const SESSION_KEYS = [
  'isAuthenticated', 'userRole', 'userName', 'authToken',
  'clienteId', 'userId', 'userEmail', 'managedClienteId', 'managedClienteNombre',
];

export const logout = (): void => {
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
};

// ponytail: mínimo aceptable, no un validador de fuerza completo
export const PASSWORD_REQUIREMENT_MESSAGE = 'La contraseña debe tener al menos 8 caracteres, con letras y números';
export const isStrongPassword = (password: string): boolean =>
  password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    cheque: 'Cheque',
    otro: 'Otro',
  };
  return labels[method] ?? method;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completado': return 'bg-green-500/20 text-green-400';
    case 'pendiente':  return 'bg-yellow-500/20 text-yellow-400';
    case 'programado': return 'bg-blue-500/20 text-blue-400';
    case 'cancelado':  return 'bg-red-500/20 text-red-400';
    default:           return 'bg-gray-500/20 text-gray-400';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completado': return <CheckCircle size={14} />;
    case 'pendiente':  return <Clock size={14} />;
    case 'programado': return <Calendar size={14} />;
    case 'cancelado':  return <XCircle size={14} />;
    default:           return <AlertCircle size={14} />;
  }
};

export const filterByPeriod = (date: string, period: string): boolean => {
  if (period === 'todos') return true;
  const d = new Date(date);
  const today = new Date();
  const yr = today.getFullYear();
  const mo = today.getMonth();
  switch (period) {
    case 'este-mes':    return d.getMonth() === mo && d.getFullYear() === yr;
    case 'este-semana': {
      const start = new Date(today); start.setDate(today.getDate() - today.getDay());
      const end   = new Date(today); end.setDate(today.getDate() + (6 - today.getDay()));
      return d >= start && d <= end;
    }
    case 'este-ano': return d.getFullYear() === yr;
    default:         return true;
  }
};
