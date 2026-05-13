import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CategoriaService } from '../../core/services/categoria.service';
import { Categoria } from '../../shared/models/categoria';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  colunas = ['nome', 'status', 'acoes'];
  mostrarForm = false;
  editando = false;

  form: Categoria = { nome: '', is_active: true };

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.categoriaService.listar().subscribe(res => this.categorias = res);
  }

  abrirForm() {
    this.form = { nome: '', is_active: true };
    this.editando = false;
    this.mostrarForm = true;
  }

  editar(categoria: Categoria) {
    this.form = { ...categoria };
    this.editando = true;
    this.mostrarForm = true;
  }

  salvar() {
    if (this.editando && this.form.id) {
      this.categoriaService.editar(this.form.id, this.form as Categoria).subscribe(() => {
        this.carregar();
        this.mostrarForm = false;
      });
    } else {
      this.categoriaService.criar(this.form as Categoria).subscribe(() => {
        this.carregar();
        this.mostrarForm = false;
      });
    }
  }

  deletar(id: number) {
    if (confirm('Deseja deletar esta categoria?')) {
      this.categoriaService.deletar(id).subscribe(() => this.carregar());
    }
  }

  cancelar() {
    this.mostrarForm = false;
  }
}
