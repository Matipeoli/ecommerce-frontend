import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../core/models/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, InputTextModule, ProductCardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
  private readonly productService = inject(ProductService);

  // Signal reactivo: se actualiza cuando el backend responde
  readonly allProducts = this.productService.productos;
  readonly categories = this.productService.getCategories();

  selectedCategory = signal<Category>('Todos');
  searchQuery = signal('');

  readonly filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase();
    return this.allProducts().filter(p => {
      const matchCat = cat === 'Todos' || p.category === cat;
      const matchSearch = !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  });

  selectCategory(cat: Category): void {
    this.selectedCategory.set(cat);
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }
}

