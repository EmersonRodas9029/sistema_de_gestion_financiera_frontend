import { config } from '../../../lib/config';

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

const json = (r: Response) => { if (!r.ok) throw new Error(r.statusText); return r.json(); };

export const clientesService = {
  update: (id: string | number, data: Partial<ApiCliente>): Promise<ApiCliente> =>
    fetch(`${config.apiUrl}/clientes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(json),
  remove: (id: string | number): Promise<void> =>
    fetch(`${config.apiUrl}/clientes/${id}`, { method: 'DELETE' }).then(r => { if (!r.ok) throw new Error(r.statusText); }),
};

export const usuariosService = {
  getAll: (): Promise<ApiUsuario[]> => fetch(`${config.apiUrl}/usuarios`).then(json),
  create: (data: {
    username: string; password: string; email?: string; rol: string;
    nombreCompleto?: string; telefono?: string; fechaNacimiento?: string;
    direccion?: string; documentoIdentidad?: string; tipoDocumento?: string;
  }): Promise<ApiUsuario> =>
    fetch(`${config.apiUrl}/usuarios`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(json),
  remove: (id: string | number): Promise<void> =>
    fetch(`${config.apiUrl}/usuarios/${id}`, { method: 'DELETE' }).then(r => { if (!r.ok) throw new Error(r.statusText); }),
};
