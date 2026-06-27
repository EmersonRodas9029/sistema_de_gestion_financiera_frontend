import { config } from '../../../lib/config';

export interface ApiGasto {
  id?: number;
  clienteId?: number;
  categoriaId?: number;
  monto?: number;
  fecha?: string;
  descripcion?: string;
  metodoPago?: string;
  esRecurrente?: boolean;
  frecuencia?: string | null;
  adjunto?: string | null;
  activo?: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

const json = (r: Response) => { if (!r.ok) throw new Error(r.statusText); return r.json(); };
const BASE = `${config.apiUrl}/gastos`;
const h = { 'Content-Type': 'application/json' };

export const gastosService = {
  getAll: (): Promise<ApiGasto[]> => fetch(BASE).then(json),
  getById: (id: number): Promise<ApiGasto> => fetch(`${BASE}/${id}`).then(json),
  create: (data: {
    clienteId: number; categoriaId: number; monto: number; fecha: string;
    descripcion?: string; metodoPago: string; esRecurrente?: boolean;
    frecuencia?: string | null; adjunto?: string | null; activo?: boolean;
  }): Promise<ApiGasto> =>
    fetch(BASE, { method: 'POST', headers: h, body: JSON.stringify(data) }).then(json),
  update: (id: number, data: Partial<{
    categoriaId: number; monto: number; fecha: string; descripcion: string;
    metodoPago: string; esRecurrente: boolean; frecuencia: string | null;
    adjunto: string | null; activo: boolean;
  }>): Promise<ApiGasto> =>
    fetch(`${BASE}/${id}`, { method: 'PUT', headers: h, body: JSON.stringify(data) }).then(json),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(r => { if (!r.ok) throw new Error(r.statusText); }),
};
