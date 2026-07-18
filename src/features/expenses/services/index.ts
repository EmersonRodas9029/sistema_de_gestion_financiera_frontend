import { apiJson } from '../../../lib/api';

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

const BASE = '/gastos';

export const gastosService = {
  getAll: (): Promise<ApiGasto[]> => apiJson(BASE),
  getById: (id: number): Promise<ApiGasto> => apiJson(`${BASE}/${id}`),
  create: (data: {
    clienteId: number; categoriaId: number; monto: number; fecha: string;
    descripcion?: string; metodoPago: string; esRecurrente?: boolean;
    frecuencia?: string | null; adjunto?: string | null; activo?: boolean;
  }): Promise<ApiGasto> =>
    apiJson(BASE, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<{
    categoriaId: number; monto: number; fecha: string; descripcion: string;
    metodoPago: string; esRecurrente: boolean; frecuencia: string | null;
    adjunto: string | null; activo: boolean;
  }>): Promise<ApiGasto> =>
    apiJson(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number): Promise<void> =>
    apiJson(`${BASE}/${id}`, { method: 'DELETE' }),
};
