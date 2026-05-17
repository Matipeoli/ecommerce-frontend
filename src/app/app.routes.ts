import { Routes } from '@angular/router';
import { cartGuard } from './core/guards/cart.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./pages/catalog/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    canActivate: [cartGuard],
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'confirmation/:id',
    loadComponent: () =>
      import('./pages/confirmation/confirmation.component').then(m => m.ConfirmationComponent)
  },
  { path: '**', redirectTo: 'catalog' }
];
