// Determina si la sesión actual es de un cliente (no contador/admin) y, si lo es,
// expone su propio clienteId para bloquear el selector de cliente en los modales de creación.
export const getCurrentClientSession = (): { isClientRole: boolean; ownClienteId: string } => {
  const userRole = localStorage.getItem('userRole') === 'admin' ? 'admin' : 'client';
  return {
    isClientRole: userRole === 'client',
    ownClienteId: localStorage.getItem('clienteId') ?? '',
  };
};
