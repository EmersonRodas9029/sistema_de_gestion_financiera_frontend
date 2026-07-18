import { apiJson } from '../../../lib/api';

export interface ApiConfiguracion {
  id?: number;
  clienteId: number;
  clave: string;
  valor: string;
  tipo?: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  descripcion?: string;
}

const BASE = '/configuraciones';

export const configuracionesService = {
  getAll: (): Promise<ApiConfiguracion[]> => apiJson(BASE),
  getById: (id: number): Promise<ApiConfiguracion> => apiJson(`${BASE}/${id}`),
  create: (data: Omit<ApiConfiguracion, 'id'>): Promise<ApiConfiguracion> =>
    apiJson(BASE, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { clave: string; valor: string; tipo?: string; descripcion?: string }): Promise<ApiConfiguracion> =>
    apiJson(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number): Promise<void> =>
    apiJson(`${BASE}/${id}`, { method: 'DELETE' }),
};
