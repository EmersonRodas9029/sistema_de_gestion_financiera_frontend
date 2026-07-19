import { apiJson } from '../../../lib/api';

export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA';

export interface MetaFinancieraList {
  id?: number;
  clienteId?: number;
  nombre?: string;
  descripcion?: string;
  montoObjetivo?: number;
  montoActual?: number;
  fechaLimite?: string;
  prioridad?: Prioridad;
  activa?: boolean;
  completada?: boolean;
  fechaCompletada?: string | null;
}

export interface ApiMeta extends MetaFinancieraList {
  fechaCreacion?: string;
  fechaModificacion?: string;
}

const BASE = '/metas';

export const metasService = {
  getAll: (): Promise<MetaFinancieraList[]> => apiJson(BASE),
  getById: (id: number): Promise<ApiMeta> => apiJson(`${BASE}/${id}`),
  getByCliente: (clienteId: number): Promise<MetaFinancieraList[]> => apiJson(`${BASE}/cliente/${clienteId}`),
  create: (data: {
    clienteId: number; nombre: string; descripcion?: string; montoObjetivo: number;
    montoActual?: number; fechaLimite?: string | null; prioridad?: Prioridad;
    activa?: boolean; completada?: boolean; fechaCompletada?: string | null;
  }): Promise<ApiMeta> =>
    apiJson(BASE, { method: 'POST', body: JSON.stringify(data) }),
  // PUT pisa la fila completa (no es un patch real): hay que reenviar todos los campos
  update: (id: number, data: {
    nombre: string; descripcion?: string; montoObjetivo: number; montoActual: number;
    fechaLimite?: string | null; prioridad: Prioridad; activa: boolean;
    completada: boolean; fechaCompletada: string | null;
  }): Promise<ApiMeta> =>
    apiJson(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number): Promise<void> =>
    apiJson(`${BASE}/${id}`, { method: 'DELETE' }),
};
