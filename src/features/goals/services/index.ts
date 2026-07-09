import { config } from '../../../lib/config';

export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA';

export interface MetaFinancieraList {
  id?: number;
  nombre?: string;
  montoObjetivo?: number;
  montoActual?: number;
  fechaLimite?: string;
  prioridad?: Prioridad;
  completada?: boolean;
}

export interface ApiMeta extends MetaFinancieraList {
  clienteId?: number;
  descripcion?: string;
  activa?: boolean;
  fechaCompletada?: string | null;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

const json = (r: Response) => { if (!r.ok) throw new Error(r.statusText); return r.json(); };
const BASE = `${config.apiUrl}/metas`;
const h = { 'Content-Type': 'application/json' };

export const metasService = {
  getAll: (): Promise<MetaFinancieraList[]> => fetch(BASE).then(json),
  getById: (id: number): Promise<ApiMeta> => fetch(`${BASE}/${id}`).then(json),
  getByCliente: (clienteId: number): Promise<MetaFinancieraList[]> => fetch(`${BASE}/cliente/${clienteId}`).then(json),
  create: (data: {
    clienteId: number; nombre: string; descripcion?: string; montoObjetivo: number;
    montoActual?: number; fechaLimite?: string | null; prioridad?: Prioridad;
    activa?: boolean; completada?: boolean; fechaCompletada?: string | null;
  }): Promise<ApiMeta> =>
    fetch(BASE, { method: 'POST', headers: h, body: JSON.stringify(data) }).then(json),
  // PUT pisa la fila completa (no es un patch real): hay que reenviar todos los campos
  update: (id: number, data: {
    nombre: string; descripcion?: string; montoObjetivo: number; montoActual: number;
    fechaLimite?: string | null; prioridad: Prioridad; activa: boolean;
    completada: boolean; fechaCompletada: string | null;
  }): Promise<ApiMeta> =>
    fetch(`${BASE}/${id}`, { method: 'PUT', headers: h, body: JSON.stringify(data) }).then(json),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(r => { if (!r.ok) throw new Error(r.statusText); }),
};
