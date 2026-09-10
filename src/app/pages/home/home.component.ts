import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/service/user.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private userService = inject(UserService);
  username$ = this.userService.username$;
}
