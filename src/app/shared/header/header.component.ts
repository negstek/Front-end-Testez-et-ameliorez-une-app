import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../material.module';
import { UserService } from '../../core/service/user.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, MaterialModule],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  // exposed as an observable (rather than a one-off read) so the header updates live on login/logout,
  // even though it lives outside the router-outlet and is never re-instantiated on navigation
  username$ = this.userService.username$;

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
