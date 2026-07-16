import { getManagedClient } from './useManagedClient';

// Determina si la sesión actual debe quedar acotada a un único cliente y, si es así,
// expone ese clienteId para bloquear el selector de cliente en los modales de creación
// y filtrar los datos mostrados. Esto ocurre en dos casos:
// 1. El usuario autenticado es un cliente (no contador/admin).
// 2. El usuario es un contador que está "gestionando" un cliente específico (ver useManagedClient).
export const getCurrentClientSession = (): { isClientRole: boolean; ownClienteId: string } => {
  const userRole = localStorage.getItem('userRole') === 'admin' ? 'admin' : 'client';
  if (userRole === 'client') {
    return { isClientRole: true, ownClienteId: localStorage.getItem('clienteId') ?? '' };
  }
  const managed = getManagedClient();
  return managed ? { isClientRole: true, ownClienteId: managed.id } : { isClientRole: false, ownClienteId: '' };
};
