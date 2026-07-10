import { config } from '../../../lib/config';

export type Frecuencia = 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'ANUAL';

export interface GastoRecurrenteList {
  id?: number;
  monto?: number;
  frecuencia?: Frecuencia;
  fechaInicio?: string;
  activo?: boolean;
}

export interface ApiGastoRecurrente extends GastoRecurrenteList {
  clienteId?: number;
  categoriaId?: number;
  descripcion?: string;
  fechaFin?: string | null;
  diaMes?: number | null;
  diaSemana?: number | null;
  ultimoProcesamiento?: string | null;
}

const json = (r: Response) => { if (!r.ok) throw new Error(r.statusText); return r.json(); };
const BASE = `${config.apiUrl}/gastos-recurrentes`;
const h = { 'Content-Type': 'application/json' };

export const gastosRecurrentesService = {
  getById: (id: number): Promise<ApiGastoRecurrente> => fetch(`${BASE}/${id}`).then(json),
  getByCliente: (clienteId: number): Promise<GastoRecurrenteList[]> => fetch(`${BASE}/cliente/${clienteId}`).then(json),
  create: (data: {
    clienteId: number; categoriaId?: number; monto: number; descripcion?: string;
    frecuencia: Frecuencia; fechaInicio: string; fechaFin?: string | null;
    diaMes?: number | null; diaSemana?: number | null;
  }): Promise<ApiGastoRecurrente> =>
    fetch(BASE, { method: 'POST', headers: h, body: JSON.stringify(data) }).then(json),
  // PUT pisa la fila completa (no es un patch real): hay que reenviar todos los campos
  update: (id: number, data: {
    monto: number; descripcion?: string; frecuencia: Frecuencia; fechaFin?: string | null;
    diaMes?: number | null; diaSemana?: number | null; activo: boolean;
  }): Promise<ApiGastoRecurrente> =>
    fetch(`${BASE}/${id}`, { method: 'PUT', headers: h, body: JSON.stringify(data) }).then(json),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(r => { if (!r.ok) throw new Error(r.statusText); }),
};
