import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

/*la informacion del usuario logueado y el booleano que indica si hay un usuario logueado
se obtiene de authService: */
export class Home {
  authService = inject(AuthService); //ver implementacion en home.html
}
