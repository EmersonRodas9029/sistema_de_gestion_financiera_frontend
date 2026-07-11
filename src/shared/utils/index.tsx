import { CheckCircle, Clock, Calendar, XCircle, AlertCircle } from 'lucide-react';

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);

export const formatDate = (date: string): string => {
  // ponytail: "YYYY-MM-DD" parses as UTC midnight, shifting a day back in behind-UTC timezones — force local time.
  const d = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00`) : new Date(date);
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const generateUniqueId = (prefix = 'ID'): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

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
