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
export class Header implements OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogged = false;
  showProfileMenu = false;
  private sub: Subscription;

  constructor() {
    this.sub = this.authService.estaLogueado.subscribe(v => this.isLogged = v);
  }

  isLoggedIn(): boolean {
    return this.isLogged;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.cerrarSesion();
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  comingSoon(): void {
    this.router.navigate(['/coming-soon']);
  }
}
