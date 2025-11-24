import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario-service/usuario-service';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-administrar-usuario',
  imports: [RouterLink, FormsModule],
  templateUrl: './administrar-usuario.html',
  styleUrl: './administrar-usuario.css',
})
export class AdministrarUsuario implements OnInit {
  usuarioService = inject(UsuarioService);
  paginaActual = signal(1);
  limite = 8;
  totalPaginas = signal(0);
  filtroRol = signal('');
  filtroBusqueda = signal('');
  filtroActivo = signal<string | boolean>('');
  usuarioSeleccionado = signal<Usuario | null>(null);

  listaUsuarios = signal<Usuario[]>([]);

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    const activo = this.filtroActivo() === '' ? undefined : this.filtroActivo() as boolean;
    
    this.usuarioService
      .obtenerUsuariosPaginados(
        this.paginaActual(),
        this.limite,
        this.filtroBusqueda(),
        this.filtroRol(),
        activo
      )
      .subscribe({
        next: (data) => {
          this.listaUsuarios.set(data.usuarios);
          this.totalPaginas.set(Math.ceil(data.total / this.limite));
        },
      });
  }

  aplicarFiltros() {
    this.paginaActual.set(1);
    this.cargarUsuarios();
  }

  siguientePagina() {
    if (this.paginaActual() < this.totalPaginas()) {
      this.paginaActual.set(this.paginaActual() + 1);
      this.cargarUsuarios();
    }
  }

  anteriorPagina() {
    if (this.paginaActual() > 1) {
      this.paginaActual.set(this.paginaActual() - 1);
      this.cargarUsuarios();
    }
  }

  abrirModal(usuario: Usuario) {
    this.usuarioSeleccionado.set(usuario);
  }

  cerrarModal() {
    this.usuarioSeleccionado.set(null);
  }

  eliminar(){
    this.usuarioService.eliminarById(this.usuarioSeleccionado()!.id).subscribe({
      next: () => {
        this.usuarioSeleccionado.set(null);
        this.cargarUsuarios();
      }
    })
  }

  reactivar() {
    this.usuarioService.reactivarById(this.usuarioSeleccionado()!.id).subscribe({
      next: () => {
        this.usuarioSeleccionado.set(null);
        this.cargarUsuarios();
      }
    })
  }
}
