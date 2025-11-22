import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Footer } from './shared/footer/footer';
import { Header } from './shared/header/header';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    Header,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestor-aulas');
  private auth = inject(AuthService);

  get isLoggedIn() {
    return this.auth.estaLogueado(); //se agrega para pruebas Gabi
  }
}
