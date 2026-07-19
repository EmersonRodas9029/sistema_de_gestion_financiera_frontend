import { apiJson } from '../../../lib/api';

export interface ApiPresupuestoList {
  id?: number;
  clienteId?: number;
  categoriaId?: number;
  montoPresupuestado?: number;
  mes?: number;
  anio?: number;
  activo?: boolean;
}

export interface ApiPresupuesto extends ApiPresupuestoList {
  fechaCreacion?: string;
  fechaModificacion?: string;
}

const BASE = '/presupuestos';

export const presupuestosService = {
  getAll: (): Promise<ApiPresupuestoList[]> => apiJson(BASE),
  getById: (id: number): Promise<ApiPresupuesto> => apiJson(`${BASE}/${id}`),
  create: (data: {
    clienteId: number; categoriaId?: number; montoPresupuestado: number;
    mes: number; anio: number; activo?: boolean;
  }): Promise<ApiPresupuesto> =>
    apiJson(BASE, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<{
    categoriaId: number; montoPresupuestado: number; mes: number; anio: number; activo: boolean;
  }>): Promise<ApiPresupuesto> =>
    apiJson(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number): Promise<void> =>
    apiJson(`${BASE}/${id}`, { method: 'DELETE' }),
};
