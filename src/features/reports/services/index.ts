import { config } from '../../../lib/config';

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

const json = (r: Response) => { if (!r.ok) throw new Error(r.statusText); return r.json(); };
const BASE = `${config.apiUrl}/reportes`;
const h = { 'Content-Type': 'application/json' };

export const reportesService = {
  getAll: (): Promise<ReporteList[]> => fetch(BASE).then(json),
  getById: (id: number): Promise<ApiReporte> => fetch(`${BASE}/${id}`).then(json),
  getByCliente: (clienteId: number): Promise<ReporteList[]> => fetch(`${BASE}/cliente/${clienteId}`).then(json),
  create: (data: {
    clienteId: number; contadorId?: number; nombre: string; tipoReporte: TipoReporte;
    periodoInicio: string; periodoFin: string; contenido?: string; rutaArchivo?: string | null;
  }): Promise<ApiReporte> =>
    fetch(BASE, { method: 'POST', headers: h, body: JSON.stringify(data) }).then(json),
  // PUT pisa la fila completa, incluyendo clienteId (a diferencia de Metas/GastoRecurrente)
  update: (id: number, data: {
    clienteId: number; contadorId?: number; nombre: string; tipoReporte: TipoReporte;
    periodoInicio: string; periodoFin: string; contenido?: string; rutaArchivo?: string | null;
  }): Promise<ApiReporte> =>
    fetch(`${BASE}/${id}`, { method: 'PUT', headers: h, body: JSON.stringify(data) }).then(json),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(r => { if (!r.ok) throw new Error(r.statusText); }),
  downloadPdf: (id: number): Promise<Blob> =>
    fetch(`${BASE}/${id}/pdf`).then(r => { if (!r.ok) throw new Error(r.statusText); return r.blob(); }),
};
