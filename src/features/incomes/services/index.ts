import { config } from '../../../lib/config';

export interface ApiIngreso {
  id?: number;
  clienteId?: number;
  monto?: number;
  fecha?: string;
  tipo?: string;
  fuente?: string;
  descripcion?: string;
  metodoRecepcion?: string;
  esRecurrente?: boolean;
  frecuencia?: string;
  activo?: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

const json = (r: Response) => { if (!r.ok) throw new Error(r.statusText); return r.json(); };
const BASE = `${config.apiUrl}/ingresos`;
const h = { 'Content-Type': 'application/json' };

export const ingresosService = {
  getAll: (): Promise<ApiIngreso[]> => fetch(BASE).then(json),
  getById: (id: string | number): Promise<ApiIngreso> => fetch(`${BASE}/${id}`).then(json),
  create: (data: {
    clienteId: number; monto: number; fecha: string; tipo: string;
    fuente?: string; descripcion?: string; metodoRecepcion?: string;
    esRecurrente?: boolean; frecuencia?: string;
  }): Promise<ApiIngreso> =>
    fetch(BASE, { method: 'POST', headers: h, body: JSON.stringify(data) }).then(json),
  update: (id: string | number, data: Partial<{
    monto: number; fecha: string; tipo: string; fuente: string;
    descripcion: string; metodoRecepcion: string;
    esRecurrente: boolean; frecuencia: string; activo: boolean;
  }>): Promise<ApiIngreso> =>
    fetch(`${BASE}/${id}`, { method: 'PUT', headers: h, body: JSON.stringify(data) }).then(json),
  remove: (id: string | number): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(r => { if (!r.ok) throw new Error(r.statusText); }),
};
