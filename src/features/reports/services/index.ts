import { apiFetch, apiJson } from '../../../lib/api';

export type TipoReporte = 'GASTOS_MENSUAL' | 'GASTOS_ANUAL' | 'INGRESOS_MENSUAL' | 'INGRESOS_ANUAL' | 'PRESUPUESTO' | 'PERSONALIZADO';

export interface ReporteList {
  id?: number;
  nombre?: string;
  tipoReporte?: TipoReporte;
  periodoInicio?: string;
  periodoFin?: string;
}

export interface ApiReporte extends ReporteList {
  clienteId?: number;
  contadorId?: number;
  contenido?: string;
  rutaArchivo?: string | null;
  fechaGeneracion?: string;
}

const BASE = '/reportes';

export const reportesService = {
  getAll: (): Promise<ReporteList[]> => apiJson(BASE),
  getById: (id: number): Promise<ApiReporte> => apiJson(`${BASE}/${id}`),
  getByCliente: (clienteId: number): Promise<ReporteList[]> => apiJson(`${BASE}/cliente/${clienteId}`),
  create: (data: {
    clienteId: number; contadorId?: number; nombre: string; tipoReporte: TipoReporte;
    periodoInicio: string; periodoFin: string; contenido?: string; rutaArchivo?: string | null;
  }): Promise<ApiReporte> =>
    apiJson(BASE, { method: 'POST', body: JSON.stringify(data) }),
  // PUT pisa la fila completa, incluyendo clienteId (a diferencia de Metas/GastoRecurrente)
  update: (id: number, data: {
    clienteId: number; contadorId?: number; nombre: string; tipoReporte: TipoReporte;
    periodoInicio: string; periodoFin: string; contenido?: string; rutaArchivo?: string | null;
  }): Promise<ApiReporte> =>
    apiJson(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number): Promise<void> =>
    apiJson(`${BASE}/${id}`, { method: 'DELETE' }),
  downloadPdf: (id: number): Promise<Blob> =>
    apiFetch(`${BASE}/${id}/pdf`).then(r => { if (!r.ok) throw new Error(r.statusText); return r.blob(); }),
};
