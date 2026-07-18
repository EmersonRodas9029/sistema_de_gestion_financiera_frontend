import { apiJson } from '../../../lib/api';

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

const BASE = '/ingresos';

export const ingresosService = {
  getAll: (): Promise<ApiIngreso[]> => apiJson(BASE),
  getById: (id: string | number): Promise<ApiIngreso> => apiJson(`${BASE}/${id}`),
  create: (data: {
    clienteId: number; monto: number; fecha: string; tipo: string;
    fuente?: string; descripcion?: string; metodoRecepcion?: string;
    esRecurrente?: boolean; frecuencia?: string;
  }): Promise<ApiIngreso> =>
    apiJson(BASE, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string | number, data: Partial<{
    monto: number; fecha: string; tipo: string; fuente: string;
    descripcion: string; metodoRecepcion: string;
    esRecurrente: boolean; frecuencia: string; activo: boolean;
  }>): Promise<ApiIngreso> =>
    apiJson(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string | number): Promise<void> =>
    apiJson(`${BASE}/${id}`, { method: 'DELETE' }),
};
