import { apiJson } from '../../../lib/api';

export type Frecuencia = 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'ANUAL';

export interface GastoRecurrenteList {
  id?: number;
  clienteId?: number;
  categoriaId?: number;
  monto?: number;
  descripcion?: string;
  frecuencia?: Frecuencia;
  fechaInicio?: string;
  fechaFin?: string | null;
  diaMes?: number | null;
  diaSemana?: number | null;
  activo?: boolean;
  ultimoProcesamiento?: string | null;
}

export type ApiGastoRecurrente = GastoRecurrenteList;

const BASE = '/gastos-recurrentes';

export const gastosRecurrentesService = {
  getById: (id: number): Promise<ApiGastoRecurrente> => apiJson(`${BASE}/${id}`),
  getByCliente: (clienteId: number): Promise<GastoRecurrenteList[]> => apiJson(`${BASE}/cliente/${clienteId}`),
  create: (data: {
    clienteId: number; categoriaId?: number; monto: number; descripcion?: string;
    frecuencia: Frecuencia; fechaInicio: string; fechaFin?: string | null;
    diaMes?: number | null; diaSemana?: number | null;
  }): Promise<ApiGastoRecurrente> =>
    apiJson(BASE, { method: 'POST', body: JSON.stringify(data) }),
  // PUT pisa la fila completa (no es un patch real): hay que reenviar todos los campos,
  // incluyendo clienteId/categoriaId/fechaInicio o el backend los borra silenciosamente.
  update: (id: number, data: {
    clienteId: number; categoriaId?: number; monto: number; descripcion?: string;
    frecuencia: Frecuencia; fechaInicio: string; fechaFin?: string | null;
    diaMes?: number | null; diaSemana?: number | null; activo: boolean;
  }): Promise<ApiGastoRecurrente> =>
    apiJson(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number): Promise<void> =>
    apiJson(`${BASE}/${id}`, { method: 'DELETE' }),
};
