import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {ProdutoService} from '../../core/services/produto.service';
import {CategoriaService} from '../../core/services/categoria.service';
import {Produto} from '../../shared/models/produto';
import {Categoria} from '../../shared/models/categoria';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule
  ],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  categorias: Categoria[] = [];
  colunas = ['nome', 'preco', 'categoria', 'status', 'acoes'];
  mostrarForm = false;
  editando = false;

  form: Produto = {nome: '', preco: 0, categoria: 0, is_active: true};

  constructor(
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService
  ) {
  }

  ngOnInit() {
    this.carregar();
    this.categoriaService.listar().subscribe(res => this.categorias = res);
  }

  carregar() {
    this.produtoService.listar().subscribe(res => this.produtos = res);
  }

  abrirForm() {
    this.form = {nome: '', preco: 0, categoria: 0, is_active: true};
    this.editando = false;
    this.mostrarForm = true;
  }

  editar(produto: Produto) {
    this.form = {...produto};
    this.editando = true;
    this.mostrarForm = true;
  }

  salvar() {
    if (this.editando && this.form.id) {
      this.produtoService.editar(this.form.id, this.form).subscribe(() => {
        this.carregar();
        this.mostrarForm = false;
      });
    } else {
      this.produtoService.criar(this.form).subscribe(() => {
        this.carregar();
        this.mostrarForm = false;
      });
    }
  }

  deletar(id: number) {
    if (confirm('Deseja deletar este produto?')) {
      this.produtoService.deletar(id).subscribe(() => this.carregar());
    }
  }

  cancelar() {
    this.mostrarForm = false;
  }

  getNomeCategoria(id: number): string {
    return this.categorias.find(c => c.id === id)?.nome ?? '-';
  }
}
