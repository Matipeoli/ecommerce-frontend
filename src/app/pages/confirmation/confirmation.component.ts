import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {
  readonly orderId = inject(ActivatedRoute).snapshot.paramMap.get('id');
}
