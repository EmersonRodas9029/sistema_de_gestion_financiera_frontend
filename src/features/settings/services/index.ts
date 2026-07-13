import { config } from '../../../lib/config';

export interface ApiConfiguracion {
  id?: number;
  clienteId: number;
  clave: string;
  valor: string;
  tipo?: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  descripcion?: string;
}

const BASE = `${config.apiUrl}/configuraciones`;

// ponytail: endpoint es permitAll, pero mandamos el token igual por si el backend empieza a exigirlo
const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handle = async <T,>(r: Response): Promise<T> => {
  if (!r.ok) {
    const body = await r.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message || r.statusText);
  }
  return r.status === 204 ? (undefined as T) : r.json();
};

export const configuracionesService = {
  getAll: (): Promise<ApiConfiguracion[]> =>
    fetch(BASE, { headers: authHeaders() }).then(r => handle(r)),
  getById: (id: number): Promise<ApiConfiguracion> =>
    fetch(`${BASE}/${id}`, { headers: authHeaders() }).then(r => handle(r)),
  create: (data: Omit<ApiConfiguracion, 'id'>): Promise<ApiConfiguracion> =>
    fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    }).then(r => handle(r)),
  update: (id: number, data: { clave: string; valor: string; tipo?: string; descripcion?: string }): Promise<ApiConfiguracion> =>
    fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    }).then(r => handle(r)),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() }).then(r => handle(r)),
};
