import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, RadioButtonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly cart = inject(CartService);
  private readonly orderService = inject(OrderService);

  submitted = false;
  selectedPayment = 'efectivo';
  isProcessingPayment = false;

  readonly paymentMethods = [
    { id: 'efectivo', label: 'Efectivo', sub: 'Pago al recibir el pedido', icon: '💵' },
    { id: 'tarjeta',  label: 'Tarjeta',  sub: 'Pago seguro en línea', icon: '💳' },
    { id: 'codi',    label: 'Transferencia / CoDi', sub: 'Pago seguro en línea', icon: '📱' }
  ];

  readonly form = this.fb.group({
    nombre:     ['', Validators.required],
    telefono:   ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    direccion:  ['', Validators.required],
    colonia:    ['', Validators.required],
    referencias: ['']
  });

  get f() { return this.form.controls; }

  showError(field: keyof typeof this.form.controls): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && (ctrl.touched || this.submitted));
  }

  confirm(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const payload = {
      nombre: this.form.value.nombre!,
      telefono: this.form.value.telefono!,
      direccion: this.form.value.direccion!,
      colonia: this.form.value.colonia!,
      referencias: this.form.value.referencias || undefined,
      metodoPago: this.selectedPayment,
      codigoDescuento: this.cart.discountCode(),
      items: this.cart.items().map(item => ({
        productoId: item.product.id,
        cantidad: item.quantity
      }))
    };

    if (this.selectedPayment === 'tarjeta' || this.selectedPayment === 'codi') {
      this.isProcessingPayment = true;
      setTimeout(() => {
        this.submitOrder(payload);
      }, 2000); // Retraso simulado de 2 segundos
    } else {
      this.submitOrder(payload);
    }
  }

  private submitOrder(payload: any): void {
    this.orderService.createOrder(payload).subscribe({
      next: (orderId) => {
        this.isProcessingPayment = false;
        this.cart.clearCart();
        this.router.navigate(['/confirmation', orderId]);
      },
      error: (err) => {
        this.isProcessingPayment = false;
        console.error('Error al crear el pedido', err);
        // Aquí se podría mostrar un mensaje de error al usuario
      }
    });
  }
}
