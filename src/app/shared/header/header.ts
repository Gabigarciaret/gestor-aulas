import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/service/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);

  showProfileMenu = false;

  constructor() {
    
  }

  isLoggedIn(): boolean {
    return this.authService.usuarioLogueado();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  viewProfile(): void {
    this.router.navigate(['/menu']);
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu(): void {
    this.showProfileMenu = false;
  }

  comingSoon(): void {
    this.router.navigate(['/coming-soon']);
  }
}
