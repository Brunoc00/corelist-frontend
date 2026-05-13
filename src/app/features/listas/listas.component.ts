import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ListaService } from '../../core/services/lista.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Lista } from '../../shared/models/lista';
import { Usuario } from '../../shared/models/usuario';

@Component({
  selector: 'app-listas',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatSelectModule
  ],
  templateUrl: './listas.component.html',
  styleUrl: './listas.component.scss'
})
export class ListasComponent implements OnInit {
  listas: Lista[] = [];
  usuarios: Usuario[] = [];
  colunas = ['nome', 'usuario', 'total', 'status', 'acoes'];
  mostrarForm = false;
  editando = false;

  form: Lista= { nome: '', usuario: 0, total: 0, is_active: true };

  constructor(
    private listaService: ListaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.carregar();
    this.usuarioService.listar().subscribe(res => this.usuarios = res);
  }

  carregar() {
    this.listaService.listar().subscribe(res => this.listas = res);
  }

  abrirForm() {
    this.form = { nome: '', usuario: 0, total: 0, is_active: true };
    this.editando = false;
    this.mostrarForm = true;
  }

  editar(lista: Lista) {
    this.form = { ...lista };
    this.editando = true;
    this.mostrarForm = true;
  }

  salvar() {
    if (this.editando && this.form.id) {
      this.listaService.editar(this.form.id, this.form as Lista).subscribe(() => {
        this.carregar();
        this.mostrarForm = false;
      });
    } else {
      this.listaService.criar(this.form as Lista).subscribe(() => {
        this.carregar();
        this.mostrarForm = false;
      });
    }
  }

  deletar(id: number) {
    if (confirm('Deseja deletar esta lista?')) {
      this.listaService.deletar(id).subscribe(() => this.carregar());
    }
  }

  cancelar() {
    this.mostrarForm = false;
  }

  getNomeUsuario(id: number): string {
    return this.usuarios.find(u => u.id === id)?.nome ?? '-';
  }
}
