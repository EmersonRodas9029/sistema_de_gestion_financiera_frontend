import { config } from '../../../lib/config';

export interface ApiCategoria {
  id?: number;
  clienteId?: number;
  nombre?: string;
  descripcion?: string;
  color?: string;
  icono?: string;
  presupuestoMensual?: number;
  activa?: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

const json = (r: Response) => { if (!r.ok) throw new Error(r.statusText); return r.json(); };
const BASE = `${config.apiUrl}/categorias`;
const h = { 'Content-Type': 'application/json' };

// ponytail: tipo no existe en la API, se codifica como "expense:icono" / "income:icono" (ver CategoriesPage)
export const isCategoriaGasto = (c: ApiCategoria) => !c.icono?.includes(':') || c.icono.startsWith('expense:');

export const categoriasService = {
  getByCliente: (clienteId: number): Promise<ApiCategoria[]> =>
    fetch(`${BASE}/cliente/${clienteId}`).then(json),
  getById: (id: number): Promise<ApiCategoria> =>
    fetch(`${BASE}/${id}`).then(json),
  create: (data: {
    clienteId: number; nombre: string;
    descripcion?: string; color?: string; icono?: string; presupuestoMensual?: number;
  }): Promise<ApiCategoria> =>
    fetch(BASE, { method: 'POST', headers: h, body: JSON.stringify(data) }).then(json),
  update: (id: number, data: Partial<{
    nombre: string; descripcion: string; color: string; icono: string;
    presupuestoMensual: number; activa: boolean;
  }>): Promise<ApiCategoria> =>
    fetch(`${BASE}/${id}`, { method: 'PUT', headers: h, body: JSON.stringify(data) }).then(json),
  remove: (id: number): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(r => { if (!r.ok) throw new Error(r.statusText); }),
};
