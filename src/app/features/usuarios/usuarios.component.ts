import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../shared/models/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  colunas = ['nome', 'email', 'status', 'acoes'];
  mostrarForm = false;
  editando = false;

  form: Usuario = { nome: '', email: '', senha: '', is_active: true };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.usuarioService.listar().subscribe(res => this.usuarios = res);
  }

  abrirForm() {
    this.form = { nome: '', email: '', senha: '', is_active: true };
    this.editando = false;
    this.mostrarForm = true;
  }

  editar(usuario: Usuario) {
    this.form = { ...usuario, senha: '' };
    this.editando = true;
    this.mostrarForm = true;
  }

  salvar() {
    if (this.editando && this.form.id) {
      this.usuarioService.editar(this.form.id, this.form as Usuario).subscribe(() => {
        this.carregar();
        this.mostrarForm = false;
      });
    } else {
      this.usuarioService.criar(this.form as Usuario).subscribe(() => {
        this.carregar();
        this.mostrarForm = false;
      });
    }
  }

  deletar(id: number) {
    if (confirm('Deseja deletar este usuário?')) {
      this.usuarioService.deletar(id).subscribe(() => this.carregar());
    }
  }

  cancelar() {
    this.mostrarForm = false;
  }
}
