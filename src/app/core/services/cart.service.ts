import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);

  readonly items = signal<CartItem[]>([]);
  readonly discountRate = signal(0);
  readonly discountCode = signal('');

  readonly itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly shipping = computed(() => (this.subtotal() >= 200 ? 0 : 45));

  readonly discount = computed(() =>
    Math.round(this.subtotal() * this.discountRate())
  );

  readonly total = computed(() =>
    this.subtotal() - this.discount() + this.shipping()
  );

  addItem(product: Product): void {
    const existing = this.items().find(i => i.product.id === product.id);
    if (existing) {
      this.updateQty(product.id, existing.quantity + 1);
    } else {
      this.items.update(items => [...items, { product, quantity: 1 }]);
    }
  }

  removeItem(productId: number): void {
    this.items.update(items => items.filter(i => i.product.id !== productId));
  }

  updateQty(productId: number, qty: number): void {
    if (qty < 1) return;
    this.items.update(items =>
      items.map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
    );
  }

  applyDiscount(code: string): Observable<'success' | 'invalid' | 'already'> {
    const upper = code.toUpperCase();
    if (this.discountCode() === upper) return of('already');
    
    return this.http.get<number>(`http://localhost:8080/api/descuentos/validar?codigo=${upper}`).pipe(
      map(rate => {
        if (rate > 0) {
          this.discountRate.set(rate);
          this.discountCode.set(upper);
          return 'success' as const;
        }
        return 'invalid' as const;
      }),
      catchError(() => of('invalid' as const))
    );
  }

  clearCart(): void {
    this.items.set([]);
    this.discountRate.set(0);
    this.discountCode.set('');
  }
}
