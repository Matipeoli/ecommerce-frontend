import { Component, Input, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private readonly cartService = inject(CartService);
  added = signal(false);

  readonly categoryColors: Record<string, string> = {
    Burger: '#FAEEDA',
    Pizza: '#FAECE7',
    Tacos: '#E1F5EE',
    Pasta: '#FAEEDA',
    Ensalada: '#EAF3DE',
    Bebida: '#E6F1FB'
  };

  get emojiBg(): string {
    return this.categoryColors[this.product.category] ?? '#F3F4F6';
  }

  addToCart(): void {
    if (this.added()) return;
    this.cartService.addItem(this.product);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 1200);
  }
}
