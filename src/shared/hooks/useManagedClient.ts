import { useEffect, useState } from 'react';

// Permite a un contador "gestionar" un único cliente a la vez: mientras está activo,
// las páginas que usan getCurrentClientSession() se comportan como si el contador
// fuera ese cliente (datos y selectores de formulario quedan bloqueados a ese único cliente).
const EVENT = 'managed-client-changed';

export interface ManagedClient {
  id: string;
  nombre: string;
}

export const getManagedClient = (): ManagedClient | null => {
  const id = localStorage.getItem('managedClienteId');
  if (!id) return null;
  return { id, nombre: localStorage.getItem('managedClienteNombre') ?? '' };
};

export const setManagedClient = (id: string, nombre: string) => {
  localStorage.setItem('managedClienteId', id);
  localStorage.setItem('managedClienteNombre', nombre);
  window.dispatchEvent(new Event(EVENT));
};

export const clearManagedClient = () => {
  localStorage.removeItem('managedClienteId');
  localStorage.removeItem('managedClienteNombre');
  window.dispatchEvent(new Event(EVENT));
};

export const useManagedClient = () => {
  const [managed, setManaged] = useState(getManagedClient);
  useEffect(() => {
    const handler = () => setManaged(getManagedClient());
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);
  return managed;
};
