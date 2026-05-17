import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CartItem } from '../../../core/models/cart-item.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();

  get subtotal(): number {
    return this.item.product.price * this.item.quantity;
  }
}
