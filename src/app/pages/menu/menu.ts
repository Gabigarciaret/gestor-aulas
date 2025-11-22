import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth-service';
import { Usuario } from '../../models/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit{
  private authService = inject(AuthService);
  private router = inject(Router);

  estaLogueado:boolean = false;
  datosUsuario?:Usuario; 

  ngOnInit(): void {
    this.authService.usuarioLogueado.subscribe(
      {
        next:(login) => {
          this.estaLogueado = login;
        }
      }
    )

    if(!this.estaLogueado) {
      this.router.navigateByUrl('/home');
      return;
    }

    this.authService.infoUsuario.subscribe(
      {
        next:(data) => {
          this.datosUsuario = data;
        }
      }
    )
  }

}
