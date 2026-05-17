import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ApiRespuesta, Category, Product, ProductoBackend } from '../models/product.model';

const API_URL = 'http://localhost:8080/api/productos';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly http = inject(HttpClient);

  // Signal que carga los productos desde el backend al iniciar el servicio
  readonly productos = toSignal(
    this.http.get<ApiRespuesta<ProductoBackend[]>>(API_URL).pipe(
      map(respuesta => respuesta.datos.map(this.mapearProducto))
    ),
    { initialValue: [] as Product[] }
  );

  getProducts(): Product[] {
    return this.productos();
  }

  getCategories(): Category[] {
    return ['Todos', 'Burger', 'Pizza', 'Tacos', 'Pasta', 'Ensalada', 'Bebida'];
  }

  // ─── Mapper: DTO backend (español) → modelo frontend (inglés) ─────────────
  private mapearProducto(p: ProductoBackend): Product {
    return {
      id:          p.id,
      name:        p.nombre,
      description: p.descripcion,
      price:       p.precio,
      category:    p.categoria,
      emoji:       p.emoji,
      badge:       p.badge
    };
  }
}

