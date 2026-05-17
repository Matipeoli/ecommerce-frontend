export type Category = 'Todos' | 'Burger' | 'Pizza' | 'Tacos' | 'Pasta' | 'Ensalada' | 'Bebida';
export type ProductCategory = Exclude<Category, 'Todos'>;

export interface Product {
  id: number;
  name: string;
  price: number;
  category: ProductCategory;
  description: string;
  emoji: string;
  badge?: 'Popular' | 'Nuevo';
}

// ─── Tipos del backend ────────────────────────────────────────────────────────

/** Forma del wrapper ApiRespuesta<T> que devuelve el backend */
export interface ApiRespuesta<T> {
  datos: T;
  mensaje: string | null;
  estado: number;
}

/** DTO tal como llega del backend (campos en español) */
export interface ProductoBackend {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: ProductCategory;
  emoji: string;
  badge?: 'Popular' | 'Nuevo';
}

