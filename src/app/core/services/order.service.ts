import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiRespuesta } from '../models/product.model';

const API_URL = 'http://localhost:8080/api/pedidos';

export interface OrderRequest {
  nombre: string;
  telefono: string;
  direccion: string;
  colonia: string;
  referencias?: string;
  metodoPago: string;
  codigoDescuento?: string | null;
  items: { productoId: number; cantidad: number }[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  createOrder(orderData: OrderRequest): Observable<string> {
    return this.http.post<ApiRespuesta<string>>(API_URL, orderData).pipe(
      map(res => res.datos)
    );
  }
}
