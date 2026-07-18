import { apiJson } from '../../../lib/api';

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

const BASE = '/categorias';

// ponytail: tipo no existe en la API, se codifica como "expense:icono" / "income:icono" (ver CategoriesPage)
export const isCategoriaGasto = (c: ApiCategoria) => !c.icono?.includes(':') || c.icono.startsWith('expense:');

export const categoriasService = {
  getByCliente: (clienteId: number): Promise<ApiCategoria[]> =>
    apiJson(`${BASE}/cliente/${clienteId}`),
  getById: (id: number): Promise<ApiCategoria> =>
    apiJson(`${BASE}/${id}`),
  create: (data: {
    clienteId: number; nombre: string;
    descripcion?: string; color?: string; icono?: string; presupuestoMensual?: number;
  }): Promise<ApiCategoria> =>
    apiJson(BASE, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<{
    nombre: string; descripcion: string; color: string; icono: string;
    presupuestoMensual: number; activa: boolean;
  }>): Promise<ApiCategoria> =>
    apiJson(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number): Promise<void> =>
    apiJson(`${BASE}/${id}`, { method: 'DELETE' }),
};
