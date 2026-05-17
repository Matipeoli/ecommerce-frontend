import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, FormsModule, InputTextModule, ButtonModule, CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  readonly cart = inject(CartService);

  promoInput = signal('');
  promoStatus = signal<'idle' | 'loading' | 'success' | 'invalid' | 'already'>('idle');

  applyPromo(): void {
    if (!this.promoInput()) return;
    this.promoStatus.set('loading');
    this.cart.applyDiscount(this.promoInput()).subscribe(result => {
      this.promoStatus.set(result);
    });
  }

  onPromoInput(value: string): void {
    this.promoInput.set(value);
    this.promoStatus.set('idle');
  }
}
