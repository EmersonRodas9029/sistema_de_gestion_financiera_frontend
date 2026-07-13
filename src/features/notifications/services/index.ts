import { config } from '../../../lib/config';

export type TipoNotificacion =
  | 'PRESUPUESTO_EXCEDIDO'
  | 'GASTO_RECURRENTE'
  | 'META_PROGRESO'
  | 'RECORDATORIO'
  | 'SISTEMA';

export interface NotificacionResponse {
  id: number;
  clienteId: number;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  leida: boolean;
  fechaProgramada: string | null;
  fechaEnviada: string | null;
  activa: boolean;
  fechaCreacion: string;
}

const json = (r: Response) => { if (!r.ok) throw new Error(r.statusText); return r.json(); };
const BASE = `${config.apiUrl}/notificaciones`;
const h = { 'Content-Type': 'application/json' };

export const notificacionesService = {
  getAll: (): Promise<NotificacionResponse[]> => fetch(BASE).then(json),
  getById: (id: number): Promise<NotificacionResponse> => fetch(`${BASE}/${id}`).then(json),
  create: (data: {
    clienteId: number; tipo: TipoNotificacion; titulo: string; mensaje: string;
    leida?: boolean; fechaProgramada?: string | null; fechaEnviada?: string | null; activa?: boolean;
  }): Promise<NotificacionResponse> =>
    fetch(BASE, { method: 'POST', headers: h, body: JSON.stringify(data) }).then(json),
  update: (id: number, data: Partial<{
    tipo: TipoNotificacion; titulo: string; mensaje: string; leida: boolean;
    fechaProgramada: string | null; fechaEnviada: string | null; activa: boolean;
  }>): Promise<NotificacionResponse> =>
    fetch(`${BASE}/${id}`, { method: 'PUT', headers: h, body: JSON.stringify(data) }).then(json),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(r => { if (!r.ok) throw new Error(r.statusText); }),
};
