import { config } from '../../../lib/config';

export interface ApiPresupuestoList {
  id?: number;
  montoPresupuestado?: number;
  mes?: number;
  anio?: number;
  activo?: boolean;
}

export interface ApiPresupuesto extends ApiPresupuestoList {
  clienteId?: number;
  categoriaId?: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

const json = (r: Response) => { if (!r.ok) throw new Error(r.statusText); return r.json(); };
const BASE = `${config.apiUrl}/presupuestos`;
const h = { 'Content-Type': 'application/json' };

export const presupuestosService = {
  getAll: (): Promise<ApiPresupuestoList[]> => fetch(BASE).then(json),
  getById: (id: number): Promise<ApiPresupuesto> => fetch(`${BASE}/${id}`).then(json),
  create: (data: {
    clienteId: number; categoriaId?: number; montoPresupuestado: number;
    mes: number; anio: number; activo?: boolean;
  }): Promise<ApiPresupuesto> =>
    fetch(BASE, { method: 'POST', headers: h, body: JSON.stringify(data) }).then(json),
  update: (id: number, data: Partial<{
    categoriaId: number; montoPresupuestado: number; mes: number; anio: number; activo: boolean;
  }>): Promise<ApiPresupuesto> =>
    fetch(`${BASE}/${id}`, { method: 'PUT', headers: h, body: JSON.stringify(data) }).then(json),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(r => { if (!r.ok) throw new Error(r.statusText); }),
};
