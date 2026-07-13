import { useCallback, useEffect, useState } from 'react';
import { notificacionesService } from '../../features/notifications/services';

// Fuente única para "cuántas notificaciones sin leer tiene el cliente activo",
// usada por el LeftBar y cualquier otro lugar que necesite el contador sin
// duplicar el fetch + filtro por clienteId.
export const useUnreadNotificationsCount = (refreshKey?: unknown) => {
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    const clienteId = Number(localStorage.getItem('clienteId'));
    if (!clienteId) return;
    notificacionesService.getAll()
      .then(list => setCount(list.filter(n => n.clienteId === clienteId && n.activa && !n.leida).length))
      .catch(() => {});
  }, []);

  useEffect(() => { refresh(); }, [refresh, refreshKey]);

  return { count, refresh };
};
