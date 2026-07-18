import { apiJson } from '../../../lib/api';

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

const BASE = '/notificaciones';

export const notificacionesService = {
  getAll: (): Promise<NotificacionResponse[]> => apiJson(BASE),
  getById: (id: number): Promise<NotificacionResponse> => apiJson(`${BASE}/${id}`),
  create: (data: {
    clienteId: number; tipo: TipoNotificacion; titulo: string; mensaje: string;
    leida?: boolean; fechaProgramada?: string | null; fechaEnviada?: string | null; activa?: boolean;
  }): Promise<NotificacionResponse> =>
    apiJson(BASE, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<{
    tipo: TipoNotificacion; titulo: string; mensaje: string; leida: boolean;
    fechaProgramada: string | null; fechaEnviada: string | null; activa: boolean;
  }>): Promise<NotificacionResponse> =>
    apiJson(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number): Promise<void> =>
    apiJson(`${BASE}/${id}`, { method: 'DELETE' }),
};
