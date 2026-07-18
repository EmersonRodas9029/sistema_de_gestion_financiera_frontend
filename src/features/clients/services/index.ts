import { apiJson } from '../../../lib/api';

export interface ApiCliente {
  id?: number | string;
  nombreCompleto: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  documentoIdentidad?: string;
  tipoDocumento?: string;
  activo?: boolean;
  fechaNacimiento?: string;
}

export interface ApiUsuario {
  id?: number | string;
  username: string;
  password?: string;
  email?: string;
  rol: 'CLIENTE' | 'CONTADOR';
  activo?: boolean;
  cliente?: ApiCliente;
}

export const clientesService = {
  getAll: (): Promise<ApiCliente[]> => apiJson('/clientes'),
  update: (id: string | number, data: Partial<ApiCliente>): Promise<ApiCliente> =>
    apiJson(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string | number): Promise<void> =>
    apiJson(`/clientes/${id}`, { method: 'DELETE' }),
};

export const usuariosService = {
  getAll: (): Promise<ApiUsuario[]> => apiJson('/usuarios'),
  create: (data: {
    username: string; password: string; email?: string; rol: string;
    nombreCompleto?: string; telefono?: string; fechaNacimiento?: string;
    direccion?: string; documentoIdentidad?: string; tipoDocumento?: string;
  }): Promise<ApiUsuario> =>
    apiJson('/usuarios', { method: 'POST', body: JSON.stringify(data) }),
  remove: (id: string | number): Promise<void> =>
    apiJson(`/usuarios/${id}`, { method: 'DELETE' }),
  activar: (id: string | number): Promise<void> =>
    apiJson(`/usuarios/${id}/activar`, { method: 'PUT' }),
  removePermanente: (id: string | number): Promise<void> =>
    apiJson(`/usuarios/${id}/permanente`, { method: 'DELETE' }),
  changePassword: (id: string | number, data: { passwordActual: string; passwordNueva: string }): Promise<void> =>
    apiJson(`/usuarios/${id}/password`, { method: 'PUT', body: JSON.stringify(data) }),
};
